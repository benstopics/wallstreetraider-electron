const { app, BrowserWindow, dialog, ipcMain, powerMonitor } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn, execFileSync } = require('child_process');
const { createKillOnCloseJob, assignProcessToJob } = require('./win32-job');

// Get the save path - matches wsr.bas SavePath$
function getSavePath() {
    const localAppData = process.env.LOCALAPPDATA;
    return path.join(localAppData, 'Wall Street Raider', 'Saves');
}

// Bridge handshake: wsr.exe (via ui.dll) binds REST + WebSocket on OS-assigned
// ephemeral ports and writes this file atomically. We poll it, validate, then
// broadcast the ports to the renderer. See GameServer.h::write_runtime_handshake.
const RUNTIME_JSON_PATH = path.join(
    process.env.LOCALAPPDATA || '',
    'Wall Street Raider',
    'runtime.json'
);

// Absolute paths to system binaries. Using absolute paths instead of relying
// on PATH avoids hijack scenarios and makes the spawn AV-friendlier.
const SYSTEM32 = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32');
const CURL_EXE = path.join(SYSTEM32, 'curl.exe');
const TASKLIST_EXE = path.join(SYSTEM32, 'tasklist.exe');
const TASKKILL_EXE = path.join(SYSTEM32, 'taskkill.exe');

// Read version from version.txt (single source of truth)
let APP_VERSION = '10.0.16.3';
try {
    APP_VERSION = fs.readFileSync(path.join(__dirname, 'version.txt'), 'utf8').trim();
} catch (e) { /* fallback */ }

let wsrProcess;
let mainWindow;
let isQuitting = false; // Flag to prevent WSR restart when Electron is quitting
let bridgePorts = null; // { restPort, wsPort } once handshake arrives
let bridgePortsDispatched = false;
let pendingBackendFailure = null; // { reason, runtimePath } queued for renderer
let bridgePortsRequestResolvers = []; // invoke('get-bridge-ports') callers awaiting
// Win32 Job Object handle. Every wsr.exe we spawn is assigned to it. When
// Electron exits (clean OR crash), the kernel reaps every member of the Job —
// no orphans possible, no manual taskkill needed. See win32-job.js.
let killOnCloseJob = null;

function deleteStaleRuntimeFile() {
    try {
        fs.unlinkSync(RUNTIME_JSON_PATH);
    } catch (e) {
        if (e.code !== 'ENOENT') {
            console.warn('[handshake] could not delete stale runtime.json:', e.message);
        }
    }
}

function readStaleRuntime() {
    try {
        return JSON.parse(fs.readFileSync(RUNTIME_JSON_PATH, 'utf8'));
    } catch (_) {
        return null;
    }
}

// Used by the startup-only Tier C orphan-reap (see killWSR). Job Objects
// make orphans impossible going forward; this is for users upgrading from
// older builds whose wsr.exe wasn't kernel-bound to Electron's lifetime.
function anyWsrAlive() {
    try {
        const out = execFileSync(TASKLIST_EXE, [
            '/FI', 'IMAGENAME eq wsr.exe',
            '/FO', 'CSV', '/NH',
        ], {
            stdio: ['ignore', 'pipe', 'ignore'],
            timeout: 5000,
            windowsHide: true,
        }).toString();
        return /^"wsr\.exe"/im.test(out);
    } catch (_) {
        return false;
    }
}

// Poll RUNTIME_JSON_PATH for up to timeoutMs, validating pid + freshness.
// Resolves with { restPort, wsPort }; rejects with a distinct message
// depending on whether the file never appeared or failed validation.
function waitForHandshake(childPid, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
        const pollIntervalMs = 50;
        const deadline = Date.now() + timeoutMs;
        let sawFile = false;
        let lastError = null;

        const tick = () => {
            let raw;
            try {
                raw = fs.readFileSync(RUNTIME_JSON_PATH, 'utf8');
            } catch (e) {
                if (e.code !== 'ENOENT') {
                    lastError = `read error: ${e.message}`;
                }
                return scheduleNext();
            }
            sawFile = true;

            let hs;
            try {
                hs = JSON.parse(raw);
            } catch (e) {
                lastError = `invalid JSON: ${e.message}`;
                return scheduleNext();
            }

            if (typeof hs.pid !== 'number' || hs.pid !== childPid) {
                lastError = `pid mismatch (expected ${childPid}, got ${hs.pid})`;
                return scheduleNext();
            }
            const nowSec = Math.floor(Date.now() / 1000);
            if (typeof hs.started_at !== 'number' || (nowSec - hs.started_at) > 10) {
                lastError = `stale handshake (age ${nowSec - hs.started_at}s)`;
                return scheduleNext();
            }
            if (!Number.isInteger(hs.rest_port) || hs.rest_port <= 0 ||
                !Number.isInteger(hs.ws_port) || hs.ws_port <= 0) {
                lastError = `invalid ports (rest=${hs.rest_port}, ws=${hs.ws_port})`;
                return scheduleNext();
            }

            resolve({ restPort: hs.rest_port, wsPort: hs.ws_port });
        };

        const scheduleNext = () => {
            if (Date.now() >= deadline) {
                const msg = sawFile
                    ? `handshake validation failed: ${lastError || 'unknown'}`
                    : `handshake file never appeared`;
                return reject(new Error(msg));
            }
            setTimeout(tick, pollIntervalMs);
        };

        tick();
    });
}

function dispatchBridgePorts() {
    if (!bridgePorts) return;
    // Resolve any invoke('get-bridge-ports') callers — this is the
    // RACE-FREE path, because invoke() is a request/response round-trip
    // the renderer initiates itself.
    if (bridgePortsRequestResolvers.length) {
        const copy = bridgePortsRequestResolvers;
        bridgePortsRequestResolvers = [];
        copy.forEach(r => { try { r(bridgePorts); } catch (e) {} });
    }
    // Also fire the send() event for restart scenarios where the renderer
    // is already alive and has a listener registered.
    if (bridgePortsDispatched) return;
    if (!mainWindow || mainWindow.isDestroyed()) return;
    if (mainWindow.webContents.isLoading()) return;
    mainWindow.webContents.send('bridge-ports', bridgePorts);
    bridgePortsDispatched = true;
}

function handleBackendStartFailed(err) {
    const reason = err && err.message ? err.message : String(err);
    const runtimePath = RUNTIME_JSON_PATH;
    const payload = { reason, runtimePath };
    console.error('[handshake] backend start failed:', reason);

    const rendererReady = mainWindow && !mainWindow.isDestroyed() &&
        !mainWindow.webContents.isLoading();

    if (rendererReady) {
        mainWindow.webContents.send('backend-start-failed', payload);
    } else {
        // Renderer not loaded yet — the in-app modal can't reach the user.
        // Pop a native dialog so they don't stare at a blank window.
        // Also queue the modal payload so renderer sees it once it loads.
        pendingBackendFailure = payload;
        dialog.showErrorBox(
            'Wall Street Raider — Backend failed to start',
            `The game's backend process did not start correctly.\n\n` +
            `Reason: ${reason}\n` +
            `Expected: ${runtimePath}\n\n` +
            `Please report this with the above details.`
        );
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        frame: true,
        show: false,
        autoHideMenuBar: true,
        minWidth: 1024,
        minHeight: 600,
        icon: path.join(__dirname, 'assets', 'icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            backgroundThrottling: false,
        }
    });

    mainWindow.maximize();

    mainWindow.loadFile('index.html');
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.setTitle(`JENKINS TERMINAL ${APP_VERSION} -- Wall $treet Raider on Steam (EARLY ACCESS)`);
        // Deliver any bridge-ports / backend-start-failed events that were
        // queued while the renderer was still loading.
        dispatchBridgePorts();
        if (pendingBackendFailure) {
            mainWindow.webContents.send('backend-start-failed', pendingBackendFailure);
            pendingBackendFailure = null;
        }
    });
    return mainWindow;
}

app.whenReady().then(() => {
    const exePath = app.isPackaged
        ? path.join(__dirname, 'wsr.exe')
        : path.join(__dirname, '..', 'src', 'main', 'wsr', 'wsr.exe');

    // Create the kernel-enforced lifetime binding BEFORE spawning anything.
    // Every wsr.exe we spawn is assigned to this Job; when Electron exits
    // (clean OR crash), Windows tears down the Job and reaps every member.
    // If koffi/Win32 fails (returns null), we degrade to the manual reap
    // in killWSR — same behavior as before this refactor.
    killOnCloseJob = createKillOnCloseJob();
    if (killOnCloseJob) {
        console.log('[lifecycle] kill-on-close Job Object active');
    } else {
        console.warn('[lifecycle] Job Object unavailable — relying on killWSR fallback');
    }

    killWSR();

    function runWSRProcess() {
        // Clear any leftover handshake from a prior run so we don't accept it.
        deleteStaleRuntimeFile();
        bridgePorts = null;
        bridgePortsDispatched = false;
        // On restart, any pending invoke() requests from the previous
        // render cycle are stale; reject them so the renderer re-invokes
        // with the fresh process.
        if (bridgePortsRequestResolvers.length) {
            const copy = bridgePortsRequestResolvers;
            bridgePortsRequestResolvers = [];
            // Give each a placeholder that causes api.js to retry.
            copy.forEach(r => { try { r(null); } catch (e) {} });
        }

        wsrProcess = spawn(exePath, [], {
            detached: true,
            stdio: 'ignore',
            env: { ...process.env, ENVIRONMENT: app.isPackaged ? 'production' : '09a7sd0(&)(Fd70s(*S&DF)987df0ds987f09&)F97)F&(*D7f9s7d0(S*D&f09d8s7f0s97F)(7d))' },
        });

        wsrProcess.unref();
        // Bind the child to Electron's lifetime via the Win32 Job Object.
        // Once assigned, the kernel guarantees the child cannot outlive
        // Electron — even if Electron crashes. assignProcessToJob is a
        // no-op if the job wasn't created (koffi load failure).
        if (killOnCloseJob) {
            assignProcessToJob(killOnCloseJob, wsrProcess.pid);
        }

        const myWsr = wsrProcess;

        wsrProcess.on('exit', () => {
            // Restart WSR unless Electron is quitting
            if (isQuitting) {
                console.log('WSR.EXE exited, Electron is quitting...');
                return;
            }
            console.log('WSR.EXE exited, restarting...');
            bridgePorts = null;
            bridgePortsDispatched = false;
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('wsr-restarting');
            }
            runWSRProcess();
        });

        // Spec requires: spawn → handshake → connect, strictly sequential.
        // Don't send wsr-restarted until wsr.exe is actually listening.
        waitForHandshake(myWsr.pid).then(ports => {
            if (wsrProcess !== myWsr) {
                // A newer child has taken over (restart race); discard.
                return;
            }
            console.log(`[handshake] backend ready: rest=${ports.restPort} ws=${ports.wsPort} pid=${myWsr.pid}`);
            bridgePorts = ports;
            bridgePortsDispatched = false;
            dispatchBridgePorts();
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('wsr-restarted');
                if (!mainWindow.isVisible()) mainWindow.show();
            }
        }).catch(err => {
            if (wsrProcess !== myWsr) return;
            handleBackendStartFailed(err);
            if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isVisible()) {
                mainWindow.show();
            }
        });
    }

    // Create the hidden window first so we have a surface for errors; then
    // spawn wsr.exe. The window stays hidden until the handshake resolves
    // (success → show with game UI; failure → show with error modal/dialog).
    const win = createWindow();
    runWSRProcess();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    // Renderer pulls bridge ports via invoke — race-free vs the send()-based
    // dispatchBridgePorts path, which can miss messages if the renderer hasn't
    // yet registered its 'bridge-ports' listener when send() fires.
    ipcMain.handle('get-bridge-ports', async () => {
        if (bridgePorts) return bridgePorts;
        return new Promise(resolve => {
            bridgePortsRequestResolvers.push(resolve);
        });
    });

    // Bootstrap UI locale by parsing CFIG.WSR before the renderer mounts.
    // localeManager calls this synchronously at module load so the first
    // render is in the user's persisted language — without this, every
    // launch would briefly flash English while we wait for gameState to
    // arrive over the WebSocket. PB owns the file; we only read field 31.
    ipcMain.on('prefs:get-locale', (event) => {
        try {
            const dir = process.env.WSR_SAVE_DIR ||
                path.join(process.env.LOCALAPPDATA || '', 'Wall Street Raider');
            const cfigPath = path.join(dir, 'cfig.wsr');
            const line = fs.readFileSync(cfigPath, 'utf8').split(/\r?\n/)[0] || '';
            const fields = line.split('|');
            // Field 31 (1-indexed) is the locale; index 30 in zero-indexed split.
            const locale = (fields[30] || '').trim();
            event.returnValue = locale || 'en-US';
        } catch (e) {
            event.returnValue = 'en-US';
        }
    });

    ipcMain.on('zoom-in', () => {
        const currentZoom = mainWindow.webContents.getZoomLevel();
        mainWindow.webContents.setZoomLevel(currentZoom + 1);
    });

    // Handle zoom out
    ipcMain.on('zoom-out', () => {
        const currentZoom = mainWindow.webContents.getZoomLevel();
        mainWindow.webContents.setZoomLevel(currentZoom - 1);
    });

    // Handle zoom reset
    ipcMain.on('zoom-reset', () => {
        mainWindow.webContents.setZoomLevel(0);
    });

    // Function to get current zoom level
    ipcMain.handle('get-zoom-level', () => {
        return mainWindow.webContents.getZoomLevel();
    });

    // Set specific zoom level
    ipcMain.on('set-zoom-level', (event, level) => {
        mainWindow.webContents.setZoomLevel(level);
    });

    ipcMain.on('exit-to-desktop', () => {
        isQuitting = true;
        killWSR();
        app.quit();
    });

    // Restart wsr.exe without closing Electron (for "Exit Game" / return to main menu)
    ipcMain.on('restart-wsr', () => {
        console.log('Restarting wsr.exe...');
        killWSR(); // Kill the process to trigger the 'exit' handler which will restart it
    });

    // Notify renderer when system resumes from sleep to recover network connections
    powerMonitor.on('resume', () => {
        console.log('System resumed from sleep');
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('system-resumed');
        }
    });

    // List available save files
    ipcMain.handle('list-saves', async () => {
        const savePath = getSavePath();
        try {
            if (!fs.existsSync(savePath)) {
                return [];
            }
            const files = fs.readdirSync(savePath);
            const saves = [];
            for (const file of files) {
                if (file.toUpperCase().endsWith('.DAT') &&
                    file.toUpperCase() !== 'LASTGAME.DAT' &&
                    file.toUpperCase() !== 'GTIME.DAT') {
                    const filePath = path.join(savePath, file);
                    const stats = fs.statSync(filePath);
                    // Check if it's a real save file (not @DUMMY)
                    try {
                        const content = fs.readFileSync(filePath, 'utf8');
                        const firstLine = content.split('\n')[0] || '';
                        if (!firstLine.includes('@DUMMY')) {
                            saves.push({
                                filename: file,
                                size: stats.size,
                                modifiedDate: stats.mtime.toLocaleString()
                            });
                        }
                    } catch (e) {
                        // If we can't read the file, skip it
                    }
                }
            }
            return saves;
        } catch (err) {
            console.error('Error listing saves:', err);
            return [];
        }
    });

    // Delete a save file
    ipcMain.handle('delete-save', async (event, filename) => {
        const savePath = getSavePath();
        const filePath = path.join(savePath, filename);
        try {
            // Security check - ensure filename doesn't contain path traversal
            if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
                return { success: false, error: 'Invalid filename' };
            }
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return { success: true };
            }
            return { success: false, error: 'File not found' };
        } catch (err) {
            console.error('Error deleting save:', err);
            return { success: false, error: err.message };
        }
    });
});

function killWSR() {
    // Architecture (read before changing — these constraints are load-bearing):
    //
    //   ui.cpp's SteamInit single-instances the AppID, so an orphan wsr.exe
    //   (one Electron didn't reap on its way out — crash, BSOD, taskkilled
    //   Electron) blocks the next launch: Steam returns failure, the new
    //   wsr.exe exit(-1)s, the on('exit') handler respawns, infinite loop.
    //   That's the spinner from commit d134a94.
    //
    //   Historical workarounds (all rejected):
    //     - cmd.exe → taskkill /F /IM <sibling> : the chain Norton SONAR
    //       flags as self-defense malware. Quarantined cmd.exe on the user.
    //     - hidden powershell.exe Stop-Process : same SONAR family.
    //
    //   Current strategy:
    //     1. Win32 Job Object (createKillOnCloseJob) created at app startup,
    //        every spawned wsr.exe is assigned to it. When Electron exits
    //        for ANY reason, the kernel terminates every member of the Job.
    //        No orphans possible. No syscall by Electron, no AV signal.
    //     2. killWSR() handles only the cases the Job Object can't:
    //          A. Live handle: wsrProcess.kill() — libuv TerminateProcess,
    //             needed for restart-wsr (Exit-to-Main-Menu) which kills
    //             wsr.exe but keeps Electron running.
    //          C. Startup-only fallback for users upgrading from an older
    //             build whose wsr.exe wasn't kernel-bound: taskkill.exe
    //             direct (NO cmd.exe). Gated on `!wsrProcess` so it only
    //             fires at startup-cleanup, never on close.
    //
    // Graceful shutdown ping. Only when we have a live handshake — at
    // startup-cleanup any orphan is being force-killed regardless, no
    // save-in-progress to preserve. execFileSync (not execSync) bypasses
    // %ComSpec%; curl.exe ships in System32 on Win10 1803+.
    if (bridgePorts && bridgePorts.restPort) {
        try {
            execFileSync(CURL_EXE, [
                '-s', '-m', '2',
                '-X', 'POST',
                '-H', 'Content-Type: application/json',
                '-d', '{}',
                `http://127.0.0.1:${bridgePorts.restPort}/exit_game`,
            ], { stdio: 'ignore', timeout: 3000, windowsHide: true });
        } catch (e) { /* ignore - REST may not be running */ }
    }

    // Tier A: live handle. Common case during restart-wsr; also fires on
    // window-all-closed but the Job Object would handle that on its own.
    if (wsrProcess && !wsrProcess.killed && wsrProcess.exitCode === null) {
        try {
            wsrProcess.kill();
        } catch (e) {
            console.warn('[killWSR] live-handle kill failed:', e.message);
        }
    }

    // Tier C: startup-only orphan reap. Only fires when there's no live
    // handle (i.e. the killWSR call from app.whenReady before runWSRProcess)
    // AND something named wsr.exe is alive. taskkill.exe is invoked
    // directly via execFileSync — no cmd.exe in the process tree.
    // taskkill.exe alone is a Microsoft-signed admin utility used by every
    // legitimate uninstaller; the loud SONAR signal is the cmd→taskkill
    // chain, not taskkill itself.
    if (!wsrProcess && anyWsrAlive()) {
        try {
            execFileSync(TASKKILL_EXE, ['/F', '/IM', 'wsr.exe'], {
                stdio: 'ignore', timeout: 5000, windowsHide: true,
            });
        } catch (e) {
            if (e.status !== 128) {
                console.warn('[killWSR] startup orphan reap failed:', e.message);
            }
        }
    }

    bridgePorts = null;
    bridgePortsDispatched = false;
}

// Kill first, then quit.
app.on('window-all-closed', () => { isQuitting = true; killWSR(); if (process.platform !== 'darwin') app.quit(); });
app.on('before-quit', killWSR);
app.on('quit', killWSR);

// Also handle process exits (Ctrl+C, etc.)
['exit', 'SIGINT', 'SIGTERM', 'SIGHUP', 'uncaughtException'].forEach(ev =>
    process.on(ev, () => { killWSR(); process.exit(); })
);
const { app, BrowserWindow, dialog, ipcMain, powerMonitor } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn, execSync } = require('child_process');

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

// Read version from version.txt (single source of truth)
let APP_VERSION = '10.0.15';
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

function deleteStaleRuntimeFile() {
    try {
        fs.unlinkSync(RUNTIME_JSON_PATH);
    } catch (e) {
        if (e.code !== 'ENOENT') {
            console.warn('[handshake] could not delete stale runtime.json:', e.message);
        }
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
    // Graceful shutdown only when we know the current REST port from the
    // handshake. At startup-cleanup time (no live handshake), we skip the
    // curl — any leftover wsr.exe is orphaned and we're force-killing it
    // regardless, so there's no save-in-progress to preserve.
    if (bridgePorts && bridgePorts.restPort) {
        try {
            execSync(
                `curl -s -m 2 -X POST -H "Content-Type: application/json" -d "{}" ` +
                `http://127.0.0.1:${bridgePorts.restPort}/exit_game`,
                { stdio: 'ignore', timeout: 3000 }
            );
        } catch (e) { /* ignore - REST may not be running */ }
    }
    // Force kill as fallback
    try {
        execSync('taskkill /IM wsr.exe /F', { stdio: 'ignore' });
    } catch (error) {
        console.error('Failed to kill existing wsr.exe processes:', error.message);
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
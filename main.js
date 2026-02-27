const { app, BrowserWindow, ipcMain, powerMonitor } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn, execSync } = require('child_process');

// Get the save path - matches wsr.bas SavePath$
function getSavePath() {
    const localAppData = process.env.LOCALAPPDATA;
    return path.join(localAppData, 'Wall Street Raider', 'Saves');
}

// Read version from version.txt (single source of truth)
let APP_VERSION = '10.0.15';
try {
    APP_VERSION = fs.readFileSync(path.join(__dirname, 'version.txt'), 'utf8').trim();
} catch (e) { /* fallback */ }

let wsrProcess;
let mainWindow;
let isQuitting = false; // Flag to prevent WSR restart when Electron is quitting

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
    });
    return mainWindow;
}

app.whenReady().then(() => {
    const exePath = app.isPackaged
        ? path.join(__dirname, 'wsr.exe')
        : path.join(__dirname, '..', 'src', 'main', 'wsr', 'wsr.exe');

    killWSR();

    function runWSRProcess() {
        wsrProcess = spawn(exePath, [], {
            detached: true,
            stdio: 'ignore',
            env: { ...process.env, ENVIRONMENT: app.isPackaged ? 'production' : '09a7sd0(&)(Fd70s(*S&DF)987df0ds987f09&)F97)F&(*D7f9s7d0(S*D&f09d8s7f0s97F)(7d))' },
        });

        wsrProcess.unref();

        wsrProcess.on('exit', () => {
            // Restart WSR unless Electron is quitting
            if (isQuitting) {
                console.log('WSR.EXE exited, Electron is quitting...');
                return;
            }
            console.log('WSR.EXE exited, restarting...');
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('wsr-restarting');
            }
            runWSRProcess();
        });

        // Notify renderer that wsr.exe has restarted
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('wsr-restarted');
        }
    }

    runWSRProcess()

    // Sleep a bit to ensure wsr.exe has started
    setTimeout(() => {
        win.show();
    }, 1500);

    const win = createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
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
    // Try graceful shutdown first via REST API (gives wsr.exe time to finish any in-progress save)
    try {
        execSync('curl -s -m 2 -X POST -H "Content-Type: application/json" -d "{}" http://127.0.0.1:9631/exit_game', { stdio: 'ignore', timeout: 3000 });
    } catch (e) { /* ignore - REST may not be running */ }
    // Force kill as fallback
    try {
        execSync('taskkill /IM wsr.exe /F', { stdio: 'ignore' });
    } catch (error) {
        console.error('Failed to kill existing wsr.exe processes:', error.message);
    }
}

// Kill first, then quit.
app.on('window-all-closed', () => { isQuitting = true; killWSR(); if (process.platform !== 'darwin') app.quit(); });
app.on('before-quit', killWSR);
app.on('quit', killWSR);

// Also handle process exits (Ctrl+C, etc.)
['exit', 'SIGINT', 'SIGTERM', 'SIGHUP', 'uncaughtException'].forEach(ev =>
    process.on(ev, () => { killWSR(); process.exit(); })
);
const { app, BrowserWindow, ipcMain, powerMonitor } = require('electron');
const path = require('path');
const { spawn, execSync } = require('child_process');

let wsrProcess;
let mainWindow;
let isRestarting = false; // Flag to prevent app.quit() during intentional restart

function createWindow() {
    mainWindow = new BrowserWindow({
        frame: false,
        show: false,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets', 'icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            backgroundThrottling: false,
        }
    });

    mainWindow.maximize();

    mainWindow.loadFile('index.html');
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
            if (!isRestarting) {
                app.quit();
            } else {
                // Notify renderer that wsr.exe is restarting (show loading)
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.send('wsr-restarting');
                }
                runWSRProcess();
                isRestarting = false;
            }
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
        killWSR();
        app.quit();
    });

    // Restart wsr.exe without closing Electron (for "Exit Game" / return to main menu)
    ipcMain.on('restart-wsr', () => {
        console.log('Restarting wsr.exe...');
        isRestarting = true;
    });

    // Notify renderer when system resumes from sleep to recover network connections
    powerMonitor.on('resume', () => {
        console.log('System resumed from sleep');
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('system-resumed');
        }
    });
});

function killWSR() {
    try {
        execSync('taskkill /IM wsr.exe /F', { stdio: 'ignore' });
    } catch (error) {
        console.error('Failed to kill existing wsr.exe processes:', error.message);
    }
}

// Kill first, then quit.
app.on('window-all-closed', () => { killWSR(); if (process.platform !== 'darwin') app.quit(); });
app.on('before-quit', killWSR);
app.on('quit', killWSR);

// Also handle process exits (Ctrl+C, etc.)
['exit', 'SIGINT', 'SIGTERM', 'SIGHUP', 'uncaughtException'].forEach(ev =>
    process.on(ev, () => { killWSR(); process.exit(); })
);
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn, execSync } = require('child_process');

let wsrProcess;
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: true,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets', 'icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.maximize();

    mainWindow.loadFile('index.html');
    return mainWindow;
}

app.whenReady().then(() => {
    const win = createWindow();
    if (app.isPackaged) {
        const hwnd = win.getNativeWindowHandle().readUInt32LE(0).toString();

        const exePath = path.join(__dirname, 'wsr.exe');
        try {
            execSync('taskkill /IM wsr.exe /F', { stdio: 'ignore' });
        } catch (error) {
            console.error('Failed to kill existing wsr.exe processes:', error.message);
        }

        wsrProcess = spawn(exePath, [], {
            detached: true,
            stdio: 'ignore',
            env: { ...process.env, ELECTRON_HWND: hwnd }
        });
        wsrProcess.unref();

        wsrProcess.on('exit', () => {
            app.quit();
        });
    }

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
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
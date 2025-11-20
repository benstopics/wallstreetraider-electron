const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn, execSync } = require('child_process');

let wsrProcess;
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        frame: false,
        transparent: true,
        show: false,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets', 'icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            backgroundThrottling: false
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

    wsrProcess = spawn(exePath, [], {
        detached: true,
        stdio: 'ignore',
        env: { ...process.env, ENVIRONMENT: app.isPackaged ? 'production' : '09a7sd0(&)(Fd70s(*S&DF)987df0ds987f09&)F97)F&(*D7f9s7d0(S*D&f09d8s7f0s97F)(7d))' },
    });

    wsrProcess.unref();

    wsrProcess.on('exit', () => {
        app.quit();
    });

    // Sleep a bit to ensure wsr.exe has started
    setTimeout(() => {
        win.show();
    }, 1500);

    const win = createWindow();

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

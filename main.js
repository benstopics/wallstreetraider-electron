const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn, execSync } = require('child_process');

let wsrProcess;
let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
  return mainWindow;
}

app.whenReady().then(() => {
  const win = createWindow();
//   const hwnd = win.getNativeWindowHandle().readUInt32LE(0).toString();

//   const exePath = path.join(__dirname, '..', 'src', 'main', 'wsr', 'wsr.exe');
//   try {
//     execSync('taskkill /IM wsr.exe /F', { stdio: 'ignore' });
//   } catch (error) {
//     console.error('Failed to kill existing wsr.exe processes:', error.message);
//   }

//   wsrProcess = spawn(exePath, [], {
//     detached: true,
//     stdio: 'ignore',
//     env: { ...process.env, ELECTRON_HWND: hwnd }
//   });
//   wsrProcess.unref();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('quit', () => {
  if (wsrProcess && !wsrProcess.killed) {
    wsrProcess.kill();
  }
});

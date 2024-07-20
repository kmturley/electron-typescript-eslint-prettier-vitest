import { app, BrowserWindow } from 'electron';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';

console.log('isDev', isDev);

function createWindow() {
  const win = new BrowserWindow({
    width: isDev ? 1024 + 445 : 1024,
    height: 768,
    webPreferences: {
      preload: join(dirname(fileURLToPath(import.meta.url)), 'preload.js'),
    },
  });

  win.loadFile('./build/index.html');

  // If developing locally, open developer tools
  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

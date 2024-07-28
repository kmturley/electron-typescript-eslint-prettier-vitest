import { app, BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import {
  createServer as createServerHttp,
  IncomingMessage,
  ServerResponse,
} from 'http';
import { dirname, join } from 'path';
import { fileURLToPath, parse } from 'url';
import isDev from 'electron-is-dev';
import createServer from 'next/dist/server/next.js';

// @ts-expect-error incorrect types returned
const nextApp = createServer({
  dev: isDev,
  dir: app.getAppPath() + '/renderer',
});
const handle = nextApp.getRequestHandler();

console.log('isDev', isDev);

async function createWindow() {
  await nextApp.prepare();

  createServerHttp((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url ? req.url : '', true);
    handle(req, res, parsedUrl);
  }).listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });

  const win = new BrowserWindow({
    width: isDev ? 1024 + 445 : 1024,
    height: 768,
    webPreferences: {
      // This file is intentionally .mjs to ensure Electron treats it as an ES module.
      // Sandbox mode false is required to run ES modules.
      // https://www.electronjs.org/docs/latest/tutorial/esm
      sandbox: false,
      preload: join(dirname(fileURLToPath(import.meta.url)), 'preload.mjs'),
    },
  });

  win.loadURL('http://localhost:3000');

  // If developing locally, open developer tools
  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: string) => {
  console.log(message);
  setTimeout(() => event.sender.send('message', 'hi from electron'), 500);
});

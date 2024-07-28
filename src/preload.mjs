// This file is intentionally .mjs to ensure Electron treats it as an ES module.
// https://www.electronjs.org/docs/latest/tutorial/esm
import { contextBridge, ipcRenderer } from 'electron';

function message(val) {
  return ipcRenderer.send('message', val);
}

function onMessage(callback) {
  return ipcRenderer.on('message', (_event, value) => callback(value));
}

contextBridge.exposeInMainWorld('electronAPI', { message, onMessage });

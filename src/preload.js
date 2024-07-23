// This file is intentionally .js to prevent it being compiled as an ES module
const { contextBridge, ipcRenderer } = require('electron/renderer');

function message(val) {
  return ipcRenderer.send('message', val);
}

function onMessage(callback) {
  return ipcRenderer.on('message', (_event, value) => callback(value));
}

contextBridge.exposeInMainWorld('electronAPI', { message, onMessage });

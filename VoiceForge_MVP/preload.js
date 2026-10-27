const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('voiceForge', {
  saveWav: (bytes) => ipcRenderer.invoke('save-wav', bytes)
});
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 850,
    minHeight: 650,
    backgroundColor: '#101218',
    title: 'VoiceForge',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile('index.html');
}
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle('save-wav', async (_event, bytes) => {
  const result = await dialog.showSaveDialog({
    title: 'Exportar audio WAV',
    defaultPath: 'voz-transformada.wav',
    filters: [{ name: 'Audio WAV', extensions: ['wav'] }]
  });
  if (result.canceled || !result.filePath) return { canceled: true };
  const fs = require('fs');
  fs.writeFileSync(result.filePath, Buffer.from(bytes));
  return { canceled: false, filePath: result.filePath };
});
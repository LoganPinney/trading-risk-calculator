const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Listen for menu events
  onNewCalculation: (callback) => ipcRenderer.on('new-calculation', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // App info
  getAppVersion: () => process.env.npm_package_version || '1.0.0',
  getPlatform: () => process.platform,
  
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
});
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  
  // App information
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  
  // File operations
  saveCalculations: (data) => ipcRenderer.invoke('save-calculations', data),
  loadCalculations: () => ipcRenderer.invoke('load-calculations'),
  exportResults: (data, format) => ipcRenderer.invoke('export-results', data, format),
  
  // Settings management
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  resetSettings: () => ipcRenderer.invoke('reset-settings'),
  
  // Trading data operations
  savePortfolio: (portfolio) => ipcRenderer.invoke('save-portfolio', portfolio),
  loadPortfolio: () => ipcRenderer.invoke('load-portfolio'),
  
  // External API calls (if needed for market data)
  fetchMarketData: (symbol) => ipcRenderer.invoke('fetch-market-data', symbol),
  
  // Utility functions
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  
  // Event listeners for renderer to main communication
  onAppUpdate: (callback) => ipcRenderer.on('app-update', callback),
  onSettingsChanged: (callback) => ipcRenderer.on('settings-changed', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // Development helpers
  openDevTools: () => ipcRenderer.invoke('open-dev-tools'),
  reloadApp: () => ipcRenderer.invoke('reload-app')
});

// Expose a limited set of Node.js APIs for file operations
contextBridge.exposeInMainWorld('nodeAPI', {
  // Path operations
  path: {
    join: (...args) => require('path').join(...args),
    dirname: (path) => require('path').dirname(path),
    basename: (path) => require('path').basename(path),
    extname: (path) => require('path').extname(path)
  },
  
  // OS information
  os: {
    platform: () => require('os').platform(),
    homedir: () => require('os').homedir(),
    tmpdir: () => require('os').tmpdir()
  }
});

// Security: Remove node integration and enable context isolation
// This preload script runs in an isolated context and provides
// a secure bridge between the main and renderer processes

// Log that preload script has loaded (for debugging)
console.log('Preload script loaded successfully');

// Optional: Add error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception in preload:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection in preload:', error);
});
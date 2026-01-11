const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dbAPI', {
  onStatusUpdate: (callback) => ipcRenderer.on('status-message', (event, value) => callback(value)),
  onDatabaseStatusUpdate: (callback) => ipcRenderer.on('database-status-message', (event, value) => callback(value)),
  onUpdateAvailable: (callback) => ipcRenderer.on('update_available', () => callback()),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update_downloaded', () => callback()),
  
  restartApp: () => ipcRenderer.send('restart_app'),  

  addUser: (dto) => ipcRenderer.invoke('add-user', dto),
  getUser: () => ipcRenderer.invoke('get-user'),
  authenticate: (dto) => ipcRenderer.invoke('authenticate', dto),

  addContact: (dto) => ipcRenderer.invoke('add-contact', dto),
  listContacts: () => ipcRenderer.invoke('get-contacts'),
  deleteContact: (id) => ipcRenderer.invoke('delete-contact', id),

  addLink: (dto) => ipcRenderer.invoke('add-bookmark', dto),
  listLinks: () => ipcRenderer.invoke('get-bookmarks'),
  deleteLink: (id) => ipcRenderer.invoke('delete-bookmark', id),

  addNote: (dto) => ipcRenderer.invoke('add-note', dto),
  listNotes: () => ipcRenderer.invoke('get-notes'),
  deleteNote: (id) => ipcRenderer.invoke('delete-note', id),

  addPassword: (dto) => ipcRenderer.invoke('add-password', dto),
  listPasswords: () => ipcRenderer.invoke('get-passwords'),
  deletePassword: (id) => ipcRenderer.invoke('delete-password', id)
});

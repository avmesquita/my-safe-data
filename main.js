const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');

let win;

function sendStatus(message) {  
  if (win && win.webContents) {
    win.webContents.send('status-message', message);
  }
}

function sendDatabaseStatus(status) {  
  if (win && win.webContents) {
    win.webContents.send('database-status-message', status);
  }
}

function createWindow() {
    
    const appPath = app.getPath('userData');
    const dbPath = path.join(appPath, 'safe-data.db');
    const db = new Database(dbPath, { fileMustExist: false });

    try {        
        db.prepare('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, data TEXT, instant DATETIME DEFAULT CURRENT_TIMESTAMP)').run();    
        db.prepare('CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY, name TEXT, data TEXT, instant DATETIME DEFAULT CURRENT_TIMESTAMP)').run();
        db.prepare('CREATE TABLE IF NOT EXISTS passwords (id INTEGER PRIMARY KEY, name TEXT, data TEXT, instant DATETIME DEFAULT CURRENT_TIMESTAMP)').run();
        db.prepare('CREATE TABLE IF NOT EXISTS links (id INTEGER PRIMARY KEY, name TEXT, data TEXT, instant DATETIME DEFAULT CURRENT_TIMESTAMP)').run();
        db.prepare('CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, name TEXT, data TEXT, instant DATETIME DEFAULT CURRENT_TIMESTAMP)').run();
        sendDatabaseStatus(true);
    } catch (error) {
        enviarStatus(error.message ?? error);
        sendDatabaseStatus(false);
    }

    /* 
        USER
    */

    ipcMain.handle('add-user', (event, dto) => {
        try {
            const info = db.prepare('INSERT INTO users (name, data) VALUES (?, ?)').run(dto.name, dto.data);
            sendStatus('User saved');
            sendDatabaseStatus(true);
            return info.lastInsertRowid;        
        } catch (error) {
            sendStatus('Ops: ' + error.message);            
            sendDatabaseStatus(false);
        }
    });
    
    ipcMain.handle('get-user', () => {
        try {
            const data = db.prepare('SELECT * FROM users limit 1').all();
            //sendStatus('User loaded.');
            sendDatabaseStatus(true);
            return data;
        } catch (error) {
            sendDatabaseStatus(false);
            sendStatus('Ops: ' + error.message);
        }  
    });

    /* 
        CONTACTS 
    */

    ipcMain.handle('add-contact', (event, dto) => {
        try {
            const info = db.prepare('INSERT INTO contacts (name, data) VALUES (?, ?)').run(dto.name, dto.data);
            sendStatus('Contact saved');
            sendDatabaseStatus(true);
            return info.lastInsertRowid;        
        } catch (error) {
            sendStatus('Ops: ' + error.message);
            sendDatabaseStatus(false);
        }
    });
    
    ipcMain.handle('get-contacts', () => {
        try {
            const data = db.prepare('SELECT * FROM contacts').all();
            //sendStatus('Contacts loaded.');
            sendDatabaseStatus(true);
            return data;
        } catch (error) {
            sendStatus('Ops: ' + error.message);
            sendDatabaseStatus(false);
        }  
    });

    ipcMain.handle('delete-contact', (event, id) => {
        try {
            db.prepare('DELETE FROM contacts WHERE id = ?').run(id);
            sendStatus('Contact deleted.');
            sendDatabaseStatus(true);
            return true;
        } catch (error) {
            sendStatus('Ops: ' + error.message);
            sendDatabaseStatus(false);
            return false;
        }
    });

    /* 
        LINKS 
    */

    ipcMain.handle('add-bookmark', (event, dto) => {
        try {
            const info = db.prepare('INSERT INTO links (name, data) VALUES (?, ?)').run(dto.name, dto.data);
            sendStatus('Link saved');
            sendDatabaseStatus(true);
            return info.lastInsertRowid;        
        } catch (error) {
            sendStatus('Ops: ' + error.message);
            sendDatabaseStatus(false);
        }
    });
    
    ipcMain.handle('get-bookmarks', () => {
        try {
            const data = db.prepare('SELECT * FROM links').all();
            //sendStatus('Bookmarks loaded.');
            sendDatabaseStatus(true);
            return data;
        } catch (error) {
            sendStatus('Ops: ' + error.message);
            sendDatabaseStatus(false);
        }  
    });

    ipcMain.handle('delete-bookmark', (event, id) => {
        try {
            db.prepare('DELETE FROM links WHERE id = ?').run(id);
            sendStatus('Link deleted.');
            sendDatabaseStatus(true);
            return true;
        } catch (error) {
            sendStatus('Ops: ' + error.message);
            sendDatabaseStatus(false);
            return false;
        }
    });

    /* 
        NOTES 
    */

    ipcMain.handle('add-note', (event, dto) => {
        try {
            const info = db.prepare('INSERT INTO notes (name, data) VALUES (?, ?)').run(dto.name, dto.data);
            sendStatus('Note saved');
            sendDatabaseStatus(true);
            return info.lastInsertRowid;        
        } catch (error) {
            sendStatus('Ops: ' + error.message);
            sendDatabaseStatus(false);
        }
    });
    
    ipcMain.handle('get-notes', () => {
        try {
            const data = db.prepare('SELECT * FROM notes').all();
            //sendStatus('Notes loaded.');
            sendDatabaseStatus(false);
            return data;
        } catch (error) {
            sendStatus('Ops: ' + error.message);
        }  
    });

    ipcMain.handle('delete-note', (event, id) => {
        try {
            db.prepare('DELETE FROM notes WHERE id = ?').run(id);
            sendStatus('Note deleted.');
            sendDatabaseStatus(true);
            return true;
        } catch (error) {
            sendStatus('Ops: ' + error.message);
            sendDatabaseStatus(false);
            return false;
        }
    });

    /* 
        PASSWORDS 
    */

    ipcMain.handle('add-password', (event, dto) => {
        try {
            const info = db.prepare('INSERT INTO passwords (name, data) VALUES (?, ?)').run(dto.name, dto.data);
            sendStatus('Password saved');
            sendDatabaseStatus(true);
            return info.lastInsertRowid;        
        } catch (error) {
            sendStatus('Ops: ' + error.message);
            sendDatabaseStatus(false);
        }
    });
    
    ipcMain.handle('get-passwords', () => {
        try {
            const data = db.prepare('SELECT * FROM passwords').all();
            //sendStatus('Passwords loaded.');
            sendDatabaseStatus(true);
            return data;
        } catch (error) {
            sendStatus('Ops: ' + error.message);
            sendDatabaseStatus(false);
        }  
    });

    ipcMain.handle('delete-password', (event, id) => {
        try {
            db.prepare('DELETE FROM passwords WHERE id = ?').run(id);
            sendStatus('Password deleted.');
            sendDatabaseStatus(true);
            return true;
        } catch (error) {
            sendStatus('Ops: ' + error.message);
            sendDatabaseStatus(false);
            return false;
        }
    });

    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    //win.webContents.openDevTools();
    
    win.loadFile(path.join(__dirname, `dist/safe-data/browser/index.html`));

    win.on('closed', () => {
        win = null;
    });

    const template = [
        {
            label: 'My Safe Data',
            submenu: [
                { label: 'Sair', role: 'quit' }
            ]
        }
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
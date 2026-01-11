const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const { autoUpdater } = require('electron-updater');

let win;

const isDebugging = false;
const saltRounds = 10;

if (isDebugging) {
    // Log updates to a file for debugging
    autoUpdater.logger = require("electron-log");
    autoUpdater.logger.transports.file.level = "info";
}

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
    
    app.setAppUserModelId('My Safe Data');

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
        AUTHENTICATE    
    */

    ipcMain.handle('authenticate', (event, dto) => {
        try {
            //const data = db.prepare("SELECT * FROM users where name = ? and data = ?").all(dto.name, dto.data);
            const user = db.prepare("SELECT * FROM users WHERE name = ?").get(dto.name);
            if (!user) {
                sendStatus('User not found!');
                return [];
            }

            const isMatch = bcrypt.compareSync(dto.data, user.data);

            if (isMatch) {
                sendStatus('Authenticated.');
                sendDatabaseStatus(true);
                delete(user.data);
                return user; 
            } else {
                sendStatus('Password mismatch.');                
                return [];
            }
        } catch (error) {
            sendDatabaseStatus(false);
            sendStatus('Ops: ' + error.message);
        }  
    });

    /* 
        USER
    */

    ipcMain.handle('add-user', (event, dto) => {
        try {
            const hashedPassword = bcrypt.hashSync(dto.data, saltRounds);
            const info = db.prepare('INSERT INTO users (name, data) VALUES (?, ?)').run(dto.name, hashedPassword);
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
            if (data?.length > 0) {
                sendStatus('There is a registered user.');
            } else {
                sendStatus('You need register first.');
            }
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
            sendStatus('Bookmark saved');
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
            sendStatus('Bookmark deleted.');
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
        icon: path.join(__dirname, 'src/favicon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // 1. Check for updates after the window is shown
    win.once('ready-to-show', () => {
        if (app.isPackaged && !isDebugging) {
            autoUpdater.checkForUpdatesAndNotify();
        } else {
            console.log("Dev mode: auto-update skipped.");
        }
    });

    // 2. Notify the Angular frontend about the update progress
    autoUpdater.on('update-available', () => {
        win.webContents.send('update_available');
    });

    autoUpdater.on('update-downloaded', () => {
        win.webContents.send('update_downloaded');
    });    

    if (process.platform === 'linux') {
        win.setIcon(path.join(__dirname, 'src/favicon.png'));
    }

    ipcMain.on('restart_app', () => {
        autoUpdater.quitAndInstall();
    });

    /*
    TO DEBUG
    */

    if (isDebugging) {
        win.webContents.openDevTools();
    }
    
    win.loadFile(path.join(__dirname, `dist/safe-data/browser/index.html`));

    win.on('closed', () => {
        win = null;
    });

    const template = [
        {
            label: 'Options',
            submenu: [
                { label: 'Quit', role: 'quit' }
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

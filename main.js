// Modules to control application life and create native browser window
        const {
            app,
            BrowserWindow,
            electron,
            ipcMain,
            globalShortcut,
            Tray
        } = require('electron');

let BlocklyWindow = null;
let SerialWindow = null;
let FactoryWindow = null;
let devtools = null;
let tray = null;

function createBlocklyWindow() {
    BlocklyWindow = new BrowserWindow({
        width: 1510,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        },
        icon: __dirname + '/src/icon.ico'
    });
    if (process.platform == 'win32' && process.argv.length >= 2) {
        BlocklyWindow.loadFile('./www/index.html?url=' + process.argv[1]);
    } else {
        BlocklyWindow.loadFile('./www/index.html');
    }
    ;
    BlocklyWindow.loadFile('./www/index.html');
    BlocklyWindow.setMenu(null);
    BlocklyWindow.on('closed', function () {
        BlocklyWindow = null;
    });
}
;

function createSerialWindow() {
    SerialWindow = new BrowserWindow({
        width: 640,
        height: 530,
        'parent': BlocklyWindow,
        resizable: false,
        movable: true,
        frame: true,
        modal: false,
        icon: __dirname + './src/icon.ico'
    });
    SerialWindow.loadFile('./www/blocklyduino/serialMonitor.html');
    SerialWindow.setMenu(null);
    SerialWindow.on('closed', function () {
        SerialWindow = null;
    });
    devtools = new BrowserWindow();
    SerialWindow.webContents.setDevToolsWebContents(devtools.webContents);
    SerialWindow.webContents.openDevTools({
        mode: 'detach'
    });
}
;

function createFactoryWindow() {
    FactoryWindow = new BrowserWindow({
        width: 1066,
        height: 640,
        'parent': BlocklyWindow,
        resizable: true,
        movable: true,
        frame: false,
        modal: false
    });
    FactoryWindow.loadFile('./www/blocksfactory/blocksfactory.html');
    FactoryWindow.setMenu(null);
    FactoryWindow.on('closed', function () {
        FactoryWindow = null;
    });
}
;

function openDevTools(BlocklyWindow = BrowserWindow.getFocusedWindow()) {
    if (BlocklyWindow) {
        BlocklyWindow.webContents.toggleDevTools();
    }
    ;
}
;

function refresh(BlocklyWindow = BrowserWindow.getFocusedWindow()) {
    BlocklyWindow.webContents.reloadIgnoringCache();
}
;

app.on('ready', () => {
    createBlocklyWindow();
    globalShortcut.register('F12', openDevTools);
    globalShortcut.register('F5', refresh);
    // devtools = new BrowserWindow();
    // BlocklyWindow.webContents.setDevToolsWebContents(devtools.webContents);
    // BlocklyWindow.webContents.openDevTools({
        // mode: 'detach'
    // });
    tray = new Tray('./www/blocklyduino/media/logo_only.png');
    tray.setToolTip('BlocklyDuino');
});

app.on('activate', function () {
    if (BlocklyWindow === null)
        createBlocklyWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        app.quit();
});

ipcMain.on("serialConnect", function () {
    createSerialWindow();
});
ipcMain.on("factory", function () {
    createFactoryWindow();
});

module.exports.openDevTools = openDevTools;
module.exports.refresh = refresh;

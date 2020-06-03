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
    // var url = '/www/index.html';
    var url = '../../../www/index.html';
    if (process.platform === 'win32' && process.argv.length >= 2) {    
        url = url + process.argv[1];
    }
    BlocklyWindow.loadURL(`file://${__dirname}` + url);
    BlocklyWindow.setMenu(null);
    BlocklyWindow.on('closed', function () {
        BlocklyWindow = null;
    });
};

function createSerialWindow(argLangChoice) {
    SerialWindow = new BrowserWindow({
        width: 640,
        height: 530,
        'parent': BlocklyWindow,
        webPreferences: {
            nodeIntegration: true
        },
        resizable: false,
        icon: __dirname + '/src/icon.ico'
    });
    // var url = '/www/electron/serialMonitor.html';
    var url = '../../../www/electron/serialMonitor.html';
    if (argLangChoice !== "" || argLangChoice !== "undefined")
        url = url + '?lang=' + argLangChoice;
    SerialWindow.loadURL(`file://${__dirname}` + url);
    SerialWindow.setMenu(null);
    SerialWindow.on('closed', function () {
        SerialWindow = null;
    });
    // devtools = new BrowserWindow();
    // SerialWindow.webContents.setDevToolsWebContents(devtools.webContents);
    // SerialWindow.webContents.openDevTools({
        // mode: 'detach'
    // });
    console.log(url);
};

function createFactoryWindow(argLangChoice) {
    FactoryWindow = new BrowserWindow({
        width: 1066,
        height: 640,
        'parent': BlocklyWindow,
        webPreferences: {
            nodeIntegration: true
        },
        resizable: true,
        movable: true,
        frame: false,
        modal: false
    });
    // var url = '/www/blocksfactory/blocksfactory.html';
    var url = '../../../www/blocksfactory/blocksfactory.html';
    if (argLangChoice !== "" || argLangChoice !== "undefined")
        url = url + '?lang=' + argLangChoice;
    SerialWindow.loadURL(`file://${__dirname}` + url);
    FactoryWindow.setMenu(null);
    FactoryWindow.on('closed', function () {
        FactoryWindow = null;
    });
};

function openDevTools(BlocklyWindow = BrowserWindow.getFocusedWindow()) {
    if (BlocklyWindow) {
        BlocklyWindow.webContents.toggleDevTools();
    }
};

function refresh(BlocklyWindow = BrowserWindow.getFocusedWindow()) {
    BlocklyWindow.webContents.reloadIgnoringCache();
};

app.on('ready', () => {
    createBlocklyWindow();
    globalShortcut.register('F12', openDevTools);
    globalShortcut.register('F5', refresh);
    // devtools = new BrowserWindow();
    // BlocklyWindow.webContents.setDevToolsWebContents(devtools.webContents);
    // BlocklyWindow.webContents.openDevTools({
        // mode: 'detach'
    // });
    tray = new Tray('../../www/blocklyduino/media/logo_only.png');
    // tray = new Tray('./www/blocklyduino/media/logo_only.png');
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

ipcMain.on("serialConnect", (event, argLangChoice) => {
    createSerialWindow(argLangChoice);
});
ipcMain.on("factory", function () {
    createFactoryWindow();
});

module.exports.openDevTools = openDevTools;
module.exports.refresh = refresh;

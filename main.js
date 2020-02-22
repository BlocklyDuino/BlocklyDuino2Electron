/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const electron = require('electron')
const { ipcMain, app, globalShortcut } = require('electron')
const BrowserWindow = electron.BrowserWindow
var path = require('path')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
	  name: 'BlocklyDuino',
	  icon: './src/app.png',
	  width: 1400,
	  height: 768})
  mainWindow.setMenu(null);
  mainWindow.loadURL(path.join(__dirname, './www/index.html'));
  // mainWindow.webContents.openDevTools({detach:true});
  mainWindow.on('closed', function () {
    mainWindow = null;
  })
}
function createTerm() {
	termWindow = new BrowserWindow({width: 640, height: 560, 'parent': mainWindow, resizable: false, movable: true, modal: true}) 
	termWindow.loadURL(path.join(__dirname, './www/term.html'));
	termWindow.setMenu(null)
	termWindow.on('closed', function () { 
		termWindow = null 
	})
}
function open_console(mainWindow = BrowserWindow.getFocusedWindow()) {
	if (mainWindow) mainWindow.webContents.toggleDevTools()
}
function refresh(mainWindow = BrowserWindow.getFocusedWindow()) {
	mainWindow.webContents.reloadIgnoringCache()
}

app.on('ready',  function () {
	createWindow()
	globalShortcut.register('F8', open_console)
	globalShortcut.register('F5', refresh)
})

app.on('window-all-closed', function () {
	globalShortcut.unregisterAll()
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on("prompt", function () {
	createTerm()  
})
module.exports.open_console = open_console
module.exports.refresh = refresh
// const Tray = electron.Tray;

// function createWindow () {

    // const tray = new Tray('file://${__dirname}/www/images/iconApp.png');
    // tray.setToolTip('Studio4Education');
// }
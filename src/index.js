const {app, BrowserWindow, Menu, BrowserView} = require('electron')
const {createPlayer} = require('./player.js')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit()
}

let mainWindow
let webContents

function createWindow() {
    // Main Window
    mainWindow = new BrowserWindow({title: 'Yandex Music Player'})
    mainWindow.on('closed', () => {
        mainWindow = null
    })

    // Player View
    const view = new BrowserView({
        webPreferences: {
            preload: `${__dirname}/preload.js`
        }
    })
    mainWindow.setBrowserView(view)
    view.setBounds({x: 0, y: 0, width: 800, height: 600})
    view.setAutoResize({width: true, height: true})
    webContents = view.webContents
    webContents.loadURL('https://music.yandex.ru')
    webContents.openDevTools()
    webContents.on('did-finish-load', () => {
        createPlayer(webContents, mainWindow)
    })
}

function createMenu() {
    const template = [{
        label: 'File',
        submenu : [{
            label: 'Player',
            click: () => webContents.loadURL('https://music.yandex.ru')
        }, {
            label: 'Log in',
            click: () => webContents.loadURL('https://passport.yandex.ru')
        }, {
            type: 'separator'
        }, {
            role: 'reload'
        }, {
            label: 'Open Dev Tools',
            click: () => webContents.openDevTools()
        }, {
            type: 'separator'
        }, {
            role: 'quit'
        }]
    }]
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

createMenu()

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

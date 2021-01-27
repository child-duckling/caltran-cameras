// A BrowserView can be used to embed additional web content into a BrowserWindow.
// It is like a child window, except that it is positioned relative to its owning
// window. It is meant to be an alternative to the webview tag.
//
// For more info, see:
// https://electronjs.org/docs/api/browser-view

// In the main process.
const { BrowserView, BrowserWindow, app, MenuItem, Menu, dialog } = require('electron')
const Store = require('electron-store');
const prompt = require('electron-prompt');

const favorites = new Store();
var indexPage = 'https://cwwp2.dot.ca.gov/vm/streamlist.htm'
var textColor = '255,255,255' //RGB
var transparentCameraWindow = true



app.whenReady().then(() => {
    let win = new BrowserWindow({ width: 1100, height: 500, webPreferences: { webSecurity: false } })

    win.on('closed', () => {
        win = null
    })

    const view = new BrowserView({
        webPreferences: {
            nodeIntegration: true

        }
    })

    win.setBrowserView(view)
    win.loadURL(indexPage)
    win.on('page-title-updated', () => {
        globalThis.win2 = new BrowserWindow({ width: 310, height: 425, transparent: transparentCameraWindow, webPreferences: { webSecurity: false } })
        if (win.webContents.getURL() != indexPage || win.webContents.getURL() != 'about:blank') {
            win2.loadURL(win.webContents.getURL())
            win.loadURL(indexPage)
        }

        win2.on('page-title-updated', () => {
            if (win2.webContents.getURL() == indexPage) {
                win2.close()
            } else {
                win2.webContents.insertCSS('#wx{position:absolute;top:270px;width:320px;color:rgb(' + textColor + ');}')
            }
        })
    })
})

function setFavorites() {
    favorites.set(prompt({ title: 'What Do You Want To Name It?', label: 'Name:', value: win2.webContents.getURL(), inputAttrs: { type: 'text' }, type: 'input' }), win2.webContents.getURL())
        .catch(dialog.showErrorBox("You haven't clicked on a camera yet"))
}











//Menu
const isMac = process.platform === 'darwin'

const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
        label: app.name,
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    }] : []),
    // { role: 'fileMenu' }
    {
        label: 'File',
        submenu: [
            isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    // { role: 'editMenu' }
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            ...(isMac ? [
                { role: 'pasteAndMatchStyle' },
                { role: 'delete' },
                { role: 'selectAll' },
                { type: 'separator' },
                {
                    label: 'Speech',
                    submenu: [
                        { role: 'startspeaking' },
                        { role: 'stopspeaking' }
                    ]
                }
            ] : [
                { role: 'delete' },
                { type: 'separator' },
                { role: 'selectAll' }
            ])
        ]
    },
    // { role: 'viewMenu' }
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            //{ role: 'togglefullscreen' }
        ]
    },
    // { role: 'windowMenu' }
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(isMac ? [
                { type: 'separator' },
                { role: 'front' },
                { type: 'separator' },
                { role: 'window' }
            ] : [
                { role: 'close' }
            ])
        ]
    },
    {
        role: 'Favorites',
        submenu: [{
            label: 'Add to Favorites',
            click: async() => {
                const { shell } = require('electron')
                setFavorites()
            }
        }]
    },
    {
        role: 'help',
        submenu: [{
            label: 'Learn More',
            click: async() => {
                const { shell } = require('electron')
                await shell.openExternal('https://electronjs.org')
            }
        }]
    }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
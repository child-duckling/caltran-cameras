// A BrowserView can be used to embed additional web content into a BrowserWindow.
// It is like a child window, except that it is positioned relative to its owning
// window. It is meant to be an alternative to the webview tag.
//
// For more info, see:
// https://electronjs.org/docs/api/browser-view

// In the main process.
const { BrowserView, BrowserWindow, app, dialog } = require('electron')
const Menu = require("electron-create-menu")
const Store = require('electron-store');
const prompt = require('electron-prompt');
const settings = require('electron-settings')
const storage = require('electron-json-storage')

storage.setDataPath(app.getPath('appData'))
var fullyLoaded = false

var currentCameraURL
var currentCameraTitle
const favorites = new Store();
var favoritesName = []
var indexPage = 'https://cwwp2.dot.ca.gov/vm/streamlist.htm'
    //RGB for text - Will default to black when transparentCameraWindow is false
var textColor = '255,255,255'
var transparentCameraWindow = true
var resetStoreAfterOpen = true





if (transparentCameraWindow === false) {
    textColor = '0,0,0'
} else if (resetStoreAfterOpen === true) {
    favorites.clear()
}

app.whenReady().then(() => {
    setupMenu()
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
    fullyLoaded = true
    win.on('page-title-updated', () => {
        globalThis.win2 = new BrowserWindow({ width: 310, height: 425, transparent: transparentCameraWindow, webPreferences: { webSecurity: false } })
        if (win.webContents.getURL() != indexPage || win.webContents.getURL() != 'about:blank') {
            win2.loadURL(win.webContents.getURL())
            win2.webContents.insertCSS('#wx{position:absolute;top:270px;width:320px;color:rgb(' + textColor + ');}')
            currentCameraTitle = win2.getTitle()
            win.loadURL(indexPage)
        }

        win2.on('page-title-updated', () => {
            win2.webContents.insertCSS('#wx{position:absolute;top:270px;width:320px;color:rgb(' + textColor + ');}')
            if (win2.webContents.getURL() == indexPage) {
                win2.close()
            } else {
                updateFavorites()
                currentCameraURL = win2.webContents.getURL()
                console.log("\n Camera name: " + currentCameraTitle + "\n Camera URL: " + currentCameraURL)
                win2.webContents.insertCSS('#wx{position:absolute;top:270px;width:320px;color:rgb(' + textColor + ');}')
            }
        })
    })
})

function setFavorites() {

    //var fav = Object.create()
    //storage.set(String(favorites.size), { 'name': prompt({ title: 'What Do You Want To Name It?', label: 'Name:', value: currentCameraTitle, inputAttrs: { type: 'text' }, type: 'input', alwaysOnTop: true }), 'url': currentCameraURL })
    //.catch(dialog.showErrorBox("You haven't clicked on a camera yet or something's wrong"))
    //console.log("Saved new favorite \n Current List of Favorites:")
    //storage.keys(function(error, keys) {
    //   if (error) throw error;

    //   for (var key of keys) {
    //        console.log(key);
    //   }
    //});



}

function updateFavorites() {
    console.log(storage.getAll())
}

function setupMenu() {
    Menu()
    Menu((defaultMenu, separator) => {
        defaultMenu.push({
            label: "Favorites",
            submenu: [{
                    label: "Add to Favorites",
                    click: setFavorites()
                },
                separator(),
                { label: "my second item" }
            ]
        })

        return defaultMenu
    })
}
// A BrowserView can be used to embed additional web content into a BrowserWindow.
// It is like a child window, except that it is positioned relative to its owning
// window. It is meant to be an alternative to the webview tag.
//
// For more info, see:
// https://electronjs.org/docs/api/browser-view

// In the main process.
const { BrowserView, BrowserWindow, app, dialog, protocol, ipcMain, webContents, shell, MenuItem } = require('electron')
const path = require('path')
const Menu = require("electron-create-menu")
const Store = require('electron-store');
const prompt = require('electron-prompt');
const settings = require('electron-settings')
const storage = require('electron-json-storage');
const { file } = require('electron-settings');
const fs = require('fs')
storage.setDataPath(app.getPath('appData'))
var fullyLoaded = false
const dl = require('electron-dl');
var discord = require('discord-rpc');
const { fstat } = require('fs');


var clientId = '809941733604720651'
const scopes = ['rpc', 'rpc.api', 'messages.read'];
var appAuth = 'https://discord.com/api/oauth2/authorize?client_id=809941733604720651&redirect_uri=https%3A%2F%2Fduckling.pw%2Fcal-cams%2Fweb%2FdiscordAuth.html&response_type=code&scope=identify%20email%20rpc%20rpc.notifications.read'
discord.register(clientId)
const rpc = new discord.Client({ transport: 'ipc' })
const startTimestamp = new Date()


var currentCameraURL
var currentCameraTitle
const favorites = new Store();
var favoritesName = []

//------------File Paths--------------
var dDir = app.getAppPath() + '/html'
var page = app.getAppPath() + '/html/index.htm'
var indexPage = 'file://' + app.getAppPath() + '/html/index.htm'
var favoritesPage = 'file://' + app.getAppPath() + '/html/favorites.html'
console.log(app.getAppPath())

var textColor = "orange"
    //var randomColor = "rgb( " + Math.random() * 100 + "," + Math.random() * 100 + "," + Math.random() * 100 + ")"

var transparentCameraWindow = true
var resetStoreAfterOpen = true
var win2
var camCount = 0

//Table clsss for css is tableCSS

var winOnlyNotTransFrame
    // Parameter fix
if (resetStoreAfterOpen === true) {
    favorites.clear()
}
if (process.platform === 'win32') {
    winOnlyNotTransFrame = !transparentCameraWindow
} else {
    winOnlyNotTransFrame = true
}


class Camera {
    constructor(url) {
        this.url = url
        this.window = new BrowserWindow({ width: 310, height: 425, transparent: transparentCameraWindow, frame: winOnlyNotTransFrame, webPreferences: { webSecurity: false, contextIsolation: true }, alwaysOnTop: true, resizable: false })
        this.jsWin = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=310,height=425,left=100,top=100`
        return this.url, this.window, this.jsWin

    }
    load() {
        camCount++ //counter
        this.window.loadURL(this.url)
        this.window.on('close', () => {
            console.log('\n' + this.window.getTitle() + " Closed")
            camCount--
            //discordRP()

        })
        console.log(this.url)
            //this.window.reload()
            //this.window.webContents.
        this.window.webContents.on('did-finish-load', () => {
            //discordRP(this.window.getTitle()) //Update Discord RP
            this.window.webContents.insertCSS("#wx{position:absolute;top:270px;width:320px;color: " + randomColor() + "}") //Set Text Color
        })

    }
    getInfo() {
        return this.url, this.window.getTitle()
    }

}

/*class favPage {
    constructor() {
        this.window = new BrowserWindow({ title: 'favorites : Give me sugestions', width: 1100, height: 500, webPreferences: { webSecurity: false, contextIsolation: true }, type: 'textured' })
    }
    open() {
        this.window.loadFile(favoritesPage)
    }
    add(title, url) {
        var splitString = String(title).split(" : ", 3)
        var splitFile = String(fs.readFile(favoritesPage)).split('</table>', 1)
        splitFile[2] = splitFile[1]
        splitFile[1] = '<tr><th id="header101" style="width:90px">' + splitString[0] + '</td><td headers="header102">' + splitString[1] + '</td><td headers="header103">' + splitString[2] + '</td><td headers="header103"><a href="' + url + '">' + title
        var completedFav = splitFile[0] + splitFile[1] + splitFile[2]
        fs.writeFile(favoritesPage, completedFav)
    }
}*/




app.whenReady().then(() => {
    setupMenu()
    let win = new BrowserWindow({ title: 'a list : Give me sugestions', width: 1100, height: 500, webPreferences: { webSecurity: false }, type: 'textured', backgroundColor: '#000000' })
        //win.loadURL(indexPage)
    win.loadURL('https://duckling.pw/cal-cams/web/app-link.htm')
        //win.webContents.insertCSS(".tableCSS th{font-family:sans-serif;font-size:1.4em;text-align:left;padding-top:100px;padding-bottom:4px;#background-color:#9F9F9F;background-color:#767676;color:#fff;}")
    win.setIcon('icon.png')
    fullyLoaded = true
        //var fav = new favPage()
        //var camera = new Camera()
        /* win.on('page-title-updated', (title) => {
             if (title == "a list : Give me sugestions") {} else {
                 win.webContents.executeJavaScript("window.alert('Hello')")
                     //camera = new Camera(win.webContents.getURL())
                     //camera.load()
                 win.loadURL(indexPage)
             }

         })*/
    win.webContents.on('will-navigate', function(e, url) {
        camera = new Camera(url)
        camera.load()
        win.loadURL(indexPage)

    })
    win.on('focus', () => {
            //discordRP(win.getTitle())
        })
        //console.log(file())
    win.on('close', () => {
            //rpc.clearActivity()
        })
        /* win.minimize()
            var info = camera.getInfo()
            fav.add(info[0], info[1])
            app.relaunch()
        */
})
app.setAsDefaultProtocolClient('cal-cam')
app.on('open-url', function(event, url) {
    event.preventDefault()
    deeplinkingUrl = url
    console.log(deeplinkingUrl)
    var link = String(deeplinkingUrl).split('cal-cam://')
    console.log()
    console.log(link[1])
    var cam = new Camera(link[1])
    cam.load()
        /*if (deeplinkingUrl == 'cal-cam://completed') {
        console.log('Successful Discord Auth')
        authCompleted = new BrowserWindow({ width: 170, height: 60 })
        authCompleted.loadFile(app.getAppPath() + '/discordAuth.html')
        var a = new MenuItem({ label: rpc.application.name })
        console.log(rpc.application.icon)
    } else {
            //var cam = new Camera(link[1])
            //cam.load()
    }
*/
})






function setFavorites() {
    /*
        //var fav = Object.create()
        storage.set(String(favorites.size), { 'name': prompt({ title: 'What Do You Want To Name It?', label: 'Name:', value: currentCameraTitle, inputAttrs: { type: 'text' }, type: 'input', alwaysOnTop: true }), 'url': currentCameraURL })
        //.catch(dialog.showErrorBox("You haven't clicked on a camera yet or something's wrong"))
        console.log("Saved new favorite \n Current List of Favorites:")
        storage.keys(function(error, keys) {
           if (error) throw error;

           for (var key of keys) {
                console.log(key);
           }
        });
    */

}

function updateFavorites() {
    console.log(storage.getAll())
}

function setupMenu() {
    Menu()
    Menu((defaultMenu, separator) => {
        defaultMenu.push({
            role: 'help',
            submenu: [{
                label: 'Learn More',
                click: async() => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://github.com/child-duckling/cal-cams')
                }
            }]
        }, {
            label: "Favorites",
            submenu: [{
                    label: "Add to Favorites",
                    click: setFavorites()
                },
                separator(),
                { label: "~~~under construction~~~~" },
                { label: 'FAVORITES', id: 'favs' },
                { label: 'Update List', click: updateList() }
            ]
        }, {
            label: 'Discord',
            submenu: [{
                label: 'Discord Auth',
                click: async() => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://discord.com/api/oauth2/authorize?client_id=809941733604720651&redirect_uri=cal-cam%3A%2F%2Fcompleted&response_type=code&scope=identify%20rpc%20rpc.notifications.read%20rpc.voice.read%20rpc.voice.write%20rpc.activities.write%20email%20activities.read%20activities.write')
                },
                //label: 'Hello ' + rpc.application.name + '!',

            }, ]
        })

        return defaultMenu
    })
}
ipcMain.on('online-status-changed', (event, status) => {
    console.log(status)
})




//-------------------------------Discord RP-------------------------------//
function discordRP(cam) {
    console.log(cam)
    if (cam == null) {
        app.setBadgeCount(camCount)

    } else {

        var splitString = String(cam).split(" : ", 3)
        var small = splitString[1]
        app.setBadgeCount(camCount)

        rpc.setActivity({
            details: `Looking at ` + splitString[0],
            state: camCount + ' cameras open',
            startTimestamp,
            largeImageKey: 'app-icon', // https://discord.com/developers/applications/<application_id>/rich-presence/assets
            largeImageText: 'Traffic is Nice',
            smallImageKey: 'red-car', // https://discord.com/developers/applications/<application_id>/rich-presence/assets
            smallImageText: small,
            instance: true,

        })
    }

}
rpc.login({ clientId, scopes }).catch(console.error)
var dUser = rpc.user
    //var camParty = rpc.createLobby("PUBLIC", 4)
    //console.log(camParty)

function randomColor() {
    var a = "rgb( " + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")"
    console.log(a)
    return a
}

function updateList() {
    if (fullyLoaded == true) {
        console.log('updating...')
        loader = new BrowserWindow({ title: 'ignore me', width: 100, height: 100 })
        dl.download(loader, 'https://cwwp2.dot.ca.gov/vm/streamlist.htm', { filename: 'index.htm', directory: dDir })
        var file = fs.readFileSync(page, 'utf-8')
        file.replace('<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Links to Caltrans Live Traffic Cameras"><title>Caltrans Streaming Video Locations</title><link rel="stylesheet" href="https://cwwp2.dot.ca.gov/documentation/cwwp2.css"></head><body><h1>Caltrans :: Live Traffic Cameras - Individual Links</h1><h2>Description</h2><p>The table below contains the links to the Caltrans Live Traffic Cameras. Routes that run in the south to north direction are listed in order starting from the southern-most camera location, and those that run in the west to east direction are listed in order starting from the western-most camera location.</p><h2>Conditions of Use</h2><p>Please read the <a href="https://dot.ca.gov/conditions-of-use">Conditions Of Use</a> before using these links.</p><p>Caltrans traffic camera video footage and still images are neither retained nor archived.<br></p>', '<!DOCTYPE HTML><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Links to Caltrans Live Traffic Cameras"><title>a list : Give me sugestions</title><link rel="stylesheet" href="index.css"></head><body></body>')
            //Bottom Script removal
        file.replace("<script>var _gaq=_gaq||[];_gaq.push(['_setAccount','UA-12419100-3']);_gaq.push(['_trackPageview']);(function(){var ga=document.createElement('script');ga.type='text/javascript';ga.async=true;ga.src=('https:'==document.location.protocol?'https://ssl':'http://www')+'.google-analytics.com/ga.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(ga,s);})();</script>", '')
            //var unformattedFile = fs.readFile(indexPage)
        fs.writeFileSync(page, file)
            //Top + CSS


        console.log('done updating!')
        loader.close()
    }





}
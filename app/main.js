//  Electron stuff I might need
const { BrowserView, BrowserWindow, app, dialog, protocol, ipcMain, webContents, shell, MenuItem, screen } = require('electron')
const path = require('path')
const Menu = require("electron-create-menu")
const settings = require('electron-settings')
const storage = require('electron-json-storage')
const fs = require('fs')
storage.setDataPath(app.getPath('appData'))
var fullyLoaded = false
const { fstat } = require('fs')
const { electron } = require('process')
var source = 'https://github.com/child-duckling/caltran-cameras'
var transparentCameraWindow = false

// Windows needs the frame to be transparent too
var winOnlyNotTransFrame
if (process.platform === 'win32') {
    winOnlyNotTransFrame = false
} else {
    winOnlyNotTransFrame = true
}

//==Widget Window==
class Camera {
    constructor(url) {
        this.url = url
        this.window = new BrowserWindow({ width: 310, height: 425, transparent: transparentCameraWindow, frame: winOnlyNotTransFrame, webPreferences: { webSecurity: false, contextIsolation: true }, alwaysOnTop: true, resizable: false, fullscreenable: false })
        this.jsWin = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=310,height=425,left=100,top=100`
        return this.url, this.window, this.jsWin

    }
    load() {
        this.window.loadURL(this.url)
        var m = screen.getCursorScreenPoint()
        console.log(m)
        this.window.setPosition(m.x + 175, m.y / 3, true)
        this.window.on('close', () => {
            console.log('\n' + this.window.getTitle() + " Closed")
            camCount--

        })
        console.log(this.url)
            //this.window.reload()
            //this.window.webContents.
        this.window.webContents.on('did-finish-load', () => {
            this.window.webContents.insertCSS("#wx{position:absolute;top:270px;width:320px;color: " + randomColor() + "}") //Set Text Color
        })

    }
    getInfo() {
        return this.url, this.window.getTitle()
    }

}




app.whenReady().then(() => {
    //Check and install before things go wrong
    checkInstall(app)
    setupMenu()
    app.setActivationPolicy('accessory')
    let wrapper = new BrowserWindow({ title: 'CalCams' })
        //==Dissapear==
    wrapper.loadURL('about:blank')
    wrapper.blur()
    wrapper.hide()
    wrapper.setIcon('icon.png')
        //==Open List==
    shell.openExternal('https://duckling.pw/cal-cams/web/app-link.htm')
    fullyLoaded = true
})

app.setAsDefaultProtocolClient('cal-cam')
app.on('open-url', function(event, url) {
    event.preventDefault()
    deeplinkingUrl = url
    console.log(deeplinkingUrl)
    var link = String(deeplinkingUrl).split('cal-cam://')
    if (app.isReady() == true) {
        if (deeplinkingUrl == 'cal-cam://completed') {
            console.log('Successful Discord Auth')
            authCompleted = new BrowserWindow({ width: 170, height: 60 })
            authCompleted.loadFile(app.getAppPath() + '/discordAuth.html')
            var a = new MenuItem({ label: rpc.application.name })
            console.log(rpc.application.icon)
        } else if (deeplinkingUrl == 'cal-cam://list') {
            app.relaunch()
            app.quit()
        } else {
            console.log()
            console.log(link[1])
            var cam = new Camera(link[1])
            cam.load()
        }
    } else {
        //app.relaunch()
    }



})

function checkInstall(app) {
    if (app.isPackaged == true && app.isInApplicationsFolder() == false && process.platform == 'darwin') {
        app.moveToApplicationsFolder()
        try {
            shell.openExternal('https://github.com/child-duckling/cal-cams/wiki/Incorrect-Installation-(macOS)')
        } catch (err) {
            app.openExternal('https://github.com/child-duckling/cal-cams/wiki/Incorrect-Installation-(macOS)')
        }
    }


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
                    await shell.openExternal(source + '/wiki')
                }
            }]
        })

        return defaultMenu
    })
}
ipcMain.on('online-status-changed', (event, status) => {
    console.log(status)
})

function randomColor() {
    var a = "rgb( " + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")"
    console.log(a)
    return a
}
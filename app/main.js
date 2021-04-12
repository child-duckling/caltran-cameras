//  Electron stuff I might need
const { BrowserView, BrowserWindow, app, dialog, protocol, ipcMain, webContents, shell, MenuItem, screen } = require('electron')
const Menu = require("electron-create-menu")
const settings = require('electron-settings')
const { electron } = require('process')


/*
//-------------AUTH------------------
const { createAuthWindow } = require('./auth/auth-process');
const createAppWindow = require('./auth/app-process');
const authService = require('./auth/auth-service');

async function showWindow() {
    createAuthWindow();
    //try {
    //await authService.refreshTokens();
    //return createAppWindow();
    //} catch (err) {
    //createAuthWindow();
    //}
}
//-------------END AUTH--------------
*/

//URLs
var source = 'https://github.com/child-duckling/caltran-cameras'
var host = 'https://duckling.pw/caltran-cameras/app/'

//TODO: Convert into settings
var transparentCameraWindow = true
var openWindowReletiveToMousePos = false //L57
var customColor = 'rgb(255, 255, 255)' //L161
var activationPolicy = 'regular' //L88
var openListWhenAppStart = true //L97
var defaultMode = 2

// Windows needs the frame to be transparent too
var winOnlyNotTransFrame
if (process.platform === 'win32') {
    winOnlyNotTransFrame = false
} else {
    winOnlyNotTransFrame = true
}




//==Widget Window==
class Camera {
    constructor(url, updatetime) {
        this.url = url
        this.window = new BrowserWindow({
                width: 310,
                height: 425,
                transparent: transparentCameraWindow,
                frame: winOnlyNotTransFrame,
                webPreferences: {
                    webSecurity: false,
                    contextIsolation: true
                },
                alwaysOnTop: true,
                resizable: false,
                fullscreenable: false
            })
            //return this.url, this.window

        console.log(this.url)

        this.window.loadURL(this.url)

        /*
        Window party trick where the window opens reletive to the mouse position

        var m = screen.getCursorScreenPoint() 
        console.log(m)
        this.window.setPosition(m.x + 175, m.y / 3)
        */
        this.window.on('close', () => {
            console.log(this.window.getTitle() + " closed")

        })

        this.window.webContents.on('did-finish-load', () => {
            this.window.webContents.insertCSS("#wx{position:absolute;top:270px;width:320px;color: " + textColor() + "}") //Set text color on webpage
            if (updatetime != 0) {
                this.window.webContents.executeJavaScript("var head = document.getElementsByName('head')\;var a = document.createElement('meta'); a.httpEquiv = 'refresh'; a.content = '" + updatetime + "'; head.appendChild(a)\;")
            }

        })
    }
    getInfo() {
        return this.url, this.window.getTitle()
    }
}







app.whenReady().then(() => {
    //Check the install before things go wrong
    checkInstall(app)



    //Self-explanitory
    setupMenu()

    //Set the activationPolicy for macOS1
    app.setActivationPolicy(activationPolicy)

    //showWindow()



    //Make the wrapper
    let main = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: false,
        },
    });

    // Set the icon
    //main.setIcon('build/icon.png')
    main.loadURL(host + 'pages/live.html')
        //Hide the app even if activationPolicy is set to 'accessory' to be safe
        //Open the list
        //main.blur()
        //main.hide()
        //shell.openExternal(host + '/web/live.html')
})

app.setAsDefaultProtocolClient('cal-cam')

// On Windows, clicking the URI opens the list again without opening the window, this prevents that.
const lock = app.requestSingleInstanceLock()
if (!lock) {
    app.quit()
}

app.on('open-url', function(event, url) {

    //Stop the navigation to about:blank
    event.preventDefault()

    //Seperate the URI and the parameter
    var deeplink = String(url).split('cal-cam://')
    var deeplink = deeplink[1]
    console.log(deeplink)

    /* 
    If the app isn't open, the URI call will open it for them but the camera call will be lost, 
    they will have to click link again to call the camera.
    */
    if (app.isReady() == true) {
        console.log(deeplink)
        if (deeplink.length >= 10) {
            if (deeplink.includes('?')) {
                var updatetime = deeplink.split('?')
                console.log(updatetime)
                var camera = new Camera(deeplink, updatetime[1])
            } else {
                var camera = new Camera(deeplink, 0)
            }

        } else {
            reopen(app)
        }
    } else {
        reopen(app)
    }



})


/*
Some people are sooo exited to open the app that they forget to drag it into the Applications folder.
Electron does not behave properly without it being in the Applications folder, so if they ignore the arrow in the .dmg,
I just do it for them, but with the cost of them having to enter their password.
*/

function checkInstall(app) {
    if (app.isPackaged == true && app.isInApplicationsFolder() == false && process.platform == 'darwin') {
        app.moveToApplicationsFolder()
        shell.openExternal(source + '/wiki/Incorrect-Installation-(macOS)')
    }
}



function setupMenu() {
    Menu()
    Menu((defaultMenu, separator) => {
        defaultMenu.push({
            role: 'help',
            submenu: [{
                label: 'Wiki / Documentation',
                click: async() => {
                    const { shell } = require('electron')
                    await shell.openExternal(source + '/wiki')
                }
            }]
        })
        return defaultMenu
    })
}


function textColor() {
    var color

    color = "rgb( " + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")"

    console.log(color)
    return color
}

function reopen(app) {
    app.relaunch()
    app.exit()

}
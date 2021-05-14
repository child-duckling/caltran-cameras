//  Electron stuff I might need
const { BrowserView, BrowserWindow, app, dialog, protocol, ipcMain, webContents, shell, MenuItem, screen, Menu, globalShortcut, ipcRenderer } = require('electron')
    //const Menu = require("electron-create-menu")
const settings = require('electron-settings')
const { electron } = require('process')
const checkInternetConnected = require('check-internet-connected')
const firstRun = require('electron-first-run');
const isFirstRun = firstRun()
    //#region comments 




//#region auto update
/*
require('update-electron-app')({
    repo: 'child-duckling/caltran-cameras',
    updateInterval: '1 hour'
})

*/
//#endregion auto update

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
//#endregion comments
//URLs
var source = 'https://github.com/child-duckling/caltran-cameras'
var host = 'https://caltranscameras.app/'



// Windows needs the frame to be transparent too
var winOnlyNotTransFrame

//#region app
if (process.platform === 'win32') {
    winOnlyNotTransFrame = false
} else {
    winOnlyNotTransFrame = true
}
if (isFirstRun) {
    settings.set({
        transparentCameraWindow: true,
        openWindowReletiveToMousePos: false,
        customColor: '',
        randomColor: true,
        activationPolicy: 'regular',
        openListWhenAppStart: 'true',
        defaultPage: true
    })
}


//==Widget Window==
class Camera {
    constructor(url, updatetime) {
        updatetime = updatetime || null
        this.updatetime = updatetime
        this.url = url
        this.window = new BrowserWindow({
                width: 310,
                height: 425,
                transparent: settings.getSync('transparentCameraWindow'),
                frame: true,
                webPreferences: {
                    webSecurity: false,
                    contextIsolation: false
                },
                alwaysOnTop: true,
                resizable: false,
                fullscreenable: true
                    //titleBarStyle: 'customButtonsOnHover',
            })
            //return this.url, this.window☏

        this.window.loadURL(this.url)

        //Window party trick where the window opens reletive to the mouse position
        /*
                var m = screen.getCursorScreenPoint()
                console.log(m)
                this.window.setPosition(m.x + 175, m.y / 3)
        */
        this.window.on('close', () => {
            console.log(`\x1b[31m✖︎\x1b[0m Closed ${this.window.webContents.getURL()}`)
        })

        // https://docs.microsoft.com/en-us/visualstudio/liveshare/faq


        this.window.webContents.on('did-finish-load', () => {
            if (updatetime != null) {
                this.window.webContents.executeJavaScript("var a = document.getElementsByTagName('head')\;a[0].innerHTML = \'<meta http-equiv=\"refresh\" content=" + (this.updatetime * 60) + ">'")
            } else {
                if (settings.getSync('randomColor')) {
                    this.window.webContents.insertCSS("#wx{position:absolute;top:270px;width:320px;color: " + textColor() + "}") //Set text color on webpage
                }
                this.window.webContents.executeJavaScript("var a = document.getElementsByTagName('meta')\;a[1].outerHTML = ''")
            }

        })
        this.window.webContents.on('leave-html-full-screen', () => {

            let cam = new Camera(this.url)
            this.window.close()


        })
    }
    getInfo() {
        return this.url, this.window.getTitle()
    }
}

class Settings {
    constructor() {
        this.settingsPage = new BrowserWindow({
            height: 700,
            width: 410,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true,
                enableRemoteModule: true
            }
        });
        this.settingsPage.setTitle('Settings')
        this.settingsPage.loadFile(`settings.html`);
        this.settingsPage.hide()
        ipcMain.on('close', (event, settingsFromPage) => {
            console.log('_________Settings_________')
            settings.set(settingsFromPage).then(() => {
                //
                this.settingsPage.close()
            })



            //document.getElementById('transparentCameraWindow').checked, document.getElementById('openWindowReletiveToMousePos').checked, document.getElementById('randomColor').checked
        })

        this.settingsPage.webContents.on('did-finish-load', () => {
            this.settingsPage.webContents.executeJavaScript(`document.getElementById('transparentCameraWindow').checked = ${settings.getSync('transparentCameraWindow')}`)
            this.settingsPage.webContents.executeJavaScript(`document.getElementById('openWindowReletiveToMousePos').checked = ${settings.getSync('openWindowReletiveToMousePos')}`)
            this.settingsPage.webContents.executeJavaScript(`document.getElementById('randomColor').checked = ${settings.getSync('randomColor')}`)
            this.settingsPage.show()
                //this.settingsPage.webContents.openDevTools()
        })








    }






}

if (process.platform == 'darwin') {
    console.log(`\x1b[32m✔\x1b[0m Platform:  (${process.getSystemVersion()} | ${process.electron} `)
} else {
    console.log(`\x1b[32m✔\x1b[0m Platform: ${process.platform}`)
}

app.whenReady().then(() => {
    globalShortcut.register('CommandOrControl+,', () => {
        openSettings(app)
    })
}).then(() => {
    //Check the install before things go wrong
    checkInstall(app)
    checkInternet(app)
        //autoUpdater.checkForUpdatesAndNotify()


    //Self-explanitory
    setupMenu()

    //Set the activationPolicy for macOS1
    //app.setActivationPolicy(activationPolicy)

    //showWindow()



    //Make the wrapper
    let main = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    // Set the icon
    //main.setIcon('assets/icon.png')
    if (process.platform == 'win32') {
        if (settings.getSync('defaultPage')) {
            main.loadURL(`${host}pages/url/live.html`)
            console.log(`\x1b[32m✔\x1b[0m Loaded ${host}pages/url/live.html`)

        } else {
            main.loadURL(`${host}pages/url/snap.html`)
            console.log(`\x1b[32m✔\x1b[0m Loaded ${host}pages/url/snap.html`)

        }

    } else {

        if (settings.getSync('defaultPage')) {
            main.loadURL(`${host}pages/uri/live.html`)
            console.log(`\x1b[32m✔\x1b[0m Loaded ${host}pages/uri/live.html`)

        } else {
            main.loadURL(`${host}pages/uri/snap.html`)
            console.log(`\x1b[32m✔\x1b[0m Loaded ${host}pages/uri/snap.html`)

        }
    }



    main.webContents.on('did-fail-load', () => {

        if (app.isPackaged == false) {
            devMode(main)

        } else {
            console.log(`\x1b[31m✖︎\x1b[0m No Internet Connection`)
            online = false
            dialog.showErrorBox('Caltrans Cameras', 'No Internet Connection')
            app.quit()





        }


    });

    if (settings.get('recoveryLink').length >= 5) {
        shell.openExternal(String(settings.get('recoveryLink')))
        settings.set({ recoveryLink: null })
    }

    //Hide the app even if activationPolicy is set to 'accessory' to be safe
    //Open the list
    //main.blur()
    //main.hide()
    //shell.openExternal(host + '/web/live.html')
})
app.setAsDefaultProtocolClient('cal-cam')
app.on('open-url', function(event, url) {
        //Stop the navigation to about:blank
        event.preventDefault()
            //Seperate the URI and the parameter
        var deeplink = String(url).split('cal-cam://')
        var deeplink = deeplink[1]
        console.log(`\x1b[33m⎋\x1b[0m Popping out ${deeplink}`)

        checkInternet(app)
            /* 
            If the app isn't open, the URI call will open it for them but the camera call will be lost, 
            they will have to click link again to call the camera.
            */
        if (app.isReady() == true) {
            if (deeplink.length >= 10) {
                if (deeplink.includes('?')) {
                    var updatetime = deeplink.split('?')
                    console.log(updatetime)
                    var camera = new Camera(updatetime[0], updatetime[1])
                } else {
                    var camera = new Camera(deeplink)
                }

            } else {
                dialog.showErrorBox('Caltrans Cameras', `Invalid Link`)
            }
        } else {
            settings.set({ recoveryLink: `${deeplink}` })
            reopen(app)
        }
    })
    //#endregion app
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
        {
            role: 'help',
            submenu: [{
                label: 'Wiki / Documentation',
                accelerator: process.platform === 'darwin' ? 'Cmd+.' : 'Alt+.',
                click: async() => {
                    const { shell } = require('electron')
                    await shell.openExternal(source + '/wiki')
                }
            }, {
                label: 'Reopen App (if frozen / buggy)',
                accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Alt+R',
                click: async() => {
                    const { app } = require('electron')
                    reopen(app)
                },
            }, {
                label: 'Settings',
                accelerator: process.platform === 'darwin' ? 'Cmd+,' : 'Alt+,',
                click: async() => {
                    const { app } = require('electron')
                    openSettings(app)
                }
            }]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

function textColor() {
    var color
    color = "rgb( " + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")"
    console.log(`\x1b[1m\x1b[33m©\x1b[0m Setting Color to ${color}`)
    return color
}

function reopen(app) {
    app.relaunch()
    app.exit()
}

function checkInternet() {
    const config = {
        timeout: 5000, //timeout connecting to each try (default 5000)
        retries: 3, //number of retries to do before failing (default 5)
        domain: 'duckling.pw' //the domain to check DNS record of
    }
    let online
    checkInternetConnected(config)
        .then(() => {
            console.log(`\x1b[32m✔\x1b[0m Network Detected`);
            online = true
        }).catch((err) => {
            console.log(`\x1b[31m✖︎\x1b[0m No Network Detected`)
            online = false
                //app.quit()
                //dialog.showErrorBox('Caltrans Cameras', 'No Network Detected')
        });



}

function openSettings(app) {
    let a = new Settings()
}

function devMode(main) {
    console.log(`\x1b[1m\x1b[33m©\x1b[0m DDDDDDDDDDDDDDD        EEEEEEEEEEEEE        VV        VV`)
    console.log(`\x1b[1m\x1b[33m©\x1b[0m D             DD       E                     VV      VV `)
    console.log(`\x1b[1m\x1b[33m©\x1b[0m D              D       EEEEEEE                VV    VV  `)
    console.log(`\x1b[1m\x1b[33m©\x1b[0m D              D       E                       VV  VV   `)
    console.log(`\x1b[1m\x1b[33m©\x1b[0m DDDDDDDDDDDDDDD        EEEEEEEEEEEE              VV    `)

    if (process.platform == 'win32') {

        main.loadFile('../pages/url/live.html')
        console.log(`\x1b[32m✔\x1b[0m Loaded ..pages/url/live.html`)
    } else {
        main.loadURL("chrome://dino")
            //main.loadFile('../pages/uri/live.html')
            //console.log(`\x1b[32m✔\x1b[0m Loaded ../pages/uri/live.html`)
    }







}
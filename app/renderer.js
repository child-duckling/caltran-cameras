const { ipcRenderer, webContents, webFrame } = require('electron')
const { get } = require('electron-settings')
const updateOnlineStatus = () => { ipcRenderer.send('online-status-changed', navigator.onLine ? 'online' : 'offline') }

window.addEventListener('online', updateOnlineStatus)
window.addEventListener('offline', updateOnlineStatus)

updateOnlineStatus()

console.log(document.styleSheets())
    //window.getSelect
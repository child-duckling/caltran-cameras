const { ipcRenderer, webContents, webFrame } = require('electron')
const { get } = require('electron-settings')

const { remote } = require("electron");
const axios = require("axios");
const authService = remote.require("./auth/auth-service");
const authProcess = remote.require("./auth/auth-process");
const webContents = remote.getCurrentWebContents();

const updateOnlineStatus = () => { ipcRenderer.send('online-status-changed', navigator.onLine ? 'online' : 'offline') }

window.addEventListener('online', updateOnlineStatus)
window.addEventListener('offline', updateOnlineStatus)

updateOnlineStatus()

console.log(document.styleSheets())
    //window.getSelect



webContents.on("dom-ready", () => {
    const profile = authService.getProfile();
    document.getElementById("picture").src = profile.picture;
    document.getElementById("name").innerText = profile.name;
    document.getElementById("success").innerText =
        "You successfully used OpenID Connect and OAuth 2.0 to authenticate.";
});

document.getElementById("logout").onclick = () => {
    authProcess.createLogoutWindow();
    remote.getCurrentWindow().close();
};

document.getElementById("sign-in").onclick = () => {
    authProcess.createAuthWindow();
    remote.getCurrentWindow.reload();
}

document.getElementById("secured-request").onclick = () => {
    // axios
    //   .get("http://localhost:3000/private", {
    //     headers: {
    //       Authorization: `Bearer ${authService.getAccessToken()}`,
    //     },
    //   })
    //   .then((response) => {
    //     const messageJumbotron = document.getElementById("message");
    //     messageJumbotron.innerText = response.data;
    //     messageJumbotron.style.display = "block";
    //   })
    //   .catch((error) => {
    //     if (error) throw new Error(error);
    //   });
};
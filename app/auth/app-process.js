const { BrowserWindow } = require("electron");

function createAppWindow() {
    let win = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: true,
        },
    });

    win.loadFile('./pages/live.html')

    win.on("closed", () => {
        win = null;
    });
}

module.exports = createAppWindow;
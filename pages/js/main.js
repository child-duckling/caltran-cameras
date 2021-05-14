function isElectron() {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
        return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }

    return false;
}

function github() {
    if (isElectron()) {
        const shell = require('electron');
        shell.openExternal("https://github.com/child-duckling/caltran-cameras")
    } else {
        window.open("https://github.com/child-duckling/caltran-cameras", "_blank")
    }
}
const { ipcRenderer } = require('electron')

document.querySelector('#submit').addEventListener('click', function() {

    console.log(document.getElementById('transparentCameraWindow').checked)
    console.log(document.getElementById('openWindowReletiveToMousePos').checked)
    console.log(document.getElementById('randomColor').checked)
    console.log(document.getElementById('defaultPage').checked)
    let settings = {};

    ['transparentCameraWindow', 'openWindowReletiveToMousePos', 'randomColor', 'defaultPage'].forEach(setting => {
        settings[setting] = document.getElementById(setting).checked



    });

    ipcRenderer.send('close', settings)
});
/*
settings.set({
    transparentCameraWindow: true,
    openWindowReletiveToMousePos: false,
    customColor: '',
    randomColor: true,
    activationPolicy: 'regular',
    openListWhenAppStart: 'true',
    defaultPage: 1
})
*/
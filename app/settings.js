const { ipcRenderer } = require('electron')

document.querySelector('#submit').addEventListener('click', function() {

    console.log(document.getElementById('transparentCameraWindow').checked)
    console.log(document.getElementById('openWindowReletiveToMousePos').checked)
    console.log(document.getElementById('randomColor').checked)

    ipcRenderer.send('close', document.getElementById('transparentCameraWindow').checked, document.getElementById('openWindowReletiveToMousePos').checked, document.getElementById('randomColor').checked)
});
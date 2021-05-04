const { ipcRenderer } = require('electron')

document.querySelector('#submit').addEventListener('click', function() {
    ipcRenderer.send('close', document.getElementById('transparentCameraWindow').checked, document.getElementById('openWindowReletiveToMousePos').checked, document.getElementById('randomColor').checked)
});
var cameras = document.getElementsByClassName('camera')

for (let camera in cameras) {
    console.log(cameras[camera].lastChild)
    let camLink = cameras[camera].lastChild.href
    let camTitle = cameras[camera].lastChild.innerText
        //console.log(camLink)


    let win = "new WinBox( \'" + camTitle + "\', { url: '" + camLink + "', width: 310, height: 435});"


    //cameras[camera].lastChild.onclick = win
    //cameras[camera].lastChild.href = '#'
    cameras[camera].lastChild.outerHTML = "<a href=\"#\" onclick=\"" + win + "\"> " + camTitle + " </a>"
}
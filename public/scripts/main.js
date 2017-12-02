var filter = "image";

$(document).ready(function() {
    populateFolderList("C:/Users/Tiyash Basu/Pictures/Sony-a68");
    document.getElementById("noFileBox").style.display = "block";
});

$('body').on('contextmenu', 'canvas', (e) => {
    return false;
});

function getUri(uri, callback, async = true) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            callback(xhr.response);
        }
    }

    xhr.open("GET", uri, async);
    xhr.send();
}

function isFullscreenEnabled() {
    return document.fullscreenEnabled || 
        document.webkitFullscreenEnabled || 
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled;
}

function requestFullscreen(htmlItem) {
    if (htmlItem.requestFullscreen) {
        htmlItem.requestFullscreen();
    } else if (htmlItem.webkitRequestFullscreen) {
        htmlItem.webkitRequestFullscreen();
    } else if (htmlItem.mozRequestFullScreen) {
        htmlItem.mozRequestFullScreen();
    } else if (htmlItem.msRequestFullscreen) {
        htmlItem.msRequestFullscreen();
    }
}

function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

$("#theImage").click(() => {
    if (isFullscreenEnabled()) {
        requestFullscreen(document.getElementById("theImageContainer"));
    }
});

// function test(testString) {
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", "test/" + testString, true);
//     xhr.send();
// }
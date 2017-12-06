$(document).ready(function() {
    populateDirContents("C:/Users/Tiyash Basu/Pictures/Sony-a68");
    document.getElementById("noFileLoadedMsgBox").style.display = "block";
});

$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange msfullscreenchange', function(e)
{
    if (fullScreen) {
        fullScreen = false;
    } else {
        collapseFileExplorer();
        fullScreen = true;
    }
});

$('body').on('contextmenu', 'img', (e) => {
    return false;
});


// file explorer unit

$("#toggleFileExplorer").hover(() => {
    $("#toggleFileExplorer").css("opacity", "1");
});

$("#toggleFileExplorer").click(() => {
    var opacity;

    if ($("#fileExplorerContainer").css("width") == "0px") {
        expandFileExplorer();        
        opacity = "1";
    } else {
        collapseFileExplorer();
        opacity = "0";
    }
    
    $("#toggleFileExplorer").mouseout(() => {
        $("#toggleFileExplorer").css("opacity", opacity);
    });
});

$("#dirContentsList").click((e) => {
    if (e.target.tagName != 'LI') {
        return;
    }

    var clickedItemInnerHTML = e.target.innerHTML;

    if (clickedItemInnerHTML == ".." || clickedItemInnerHTML.indexOf('.') == -1) {
        newFolderViewed = true;

        updateDirName(clickedItemInnerHTML);
        populateDirContents(document.getElementById('dirName').innerHTML);
    } else {
        backupFileExplorerView();
        newFileViewed = true;

        currentFileListItem = e.target; // required, not by mistake
        showMedia(document.getElementById('dirName').innerHTML + "/" + clickedItemInnerHTML);
    }
});


// media displayer unit

var swiper = new Hammer(document.getElementById("mediaFile"));

swiper.on("swipeleft", () => {
    showNextMedia()
});

swiper.on("swiperight", () => {
    showPrevMedia();
});

$('#nextMediaBtn').click(() => {
    showNextMedia()
});

$('#prevMediaBtn').click(() => {
    showPrevMedia();
});

$("#mediaFile").click((e) => { // display properties
    if (!isTappedOnce) {
        isTappedOnce = true;
        tapTimeout = setTimeout(() => {
            if (isTappedOnce && $("#filePropertiesContainer").css("width") == "0px") {
                $("#filePropertiesContainer").css("width", "100%");
            } else {
                $("#filePropertiesContainer").css("width", "0%");
            }
            isTappedOnce = false;
        }, 300);
    } else {
        clearTimeout(tapTimeout);
        isTappedOnce = false;

        if (fullScreen) {
            exitFullScreen();
        } else if (isFullscreenEnabled()) {
            requestFullscreen(document.getElementById("mediaContainer"));
        }
    }

    e.preventDefault();
});


// $("#mediaFile").click(() => { // display properties
//     if ($("#filePropertiesContainer").css("width") == "0px") {
//         $("#filePropertiesContainer").css("width", "100%");
//     } else {
//         $("#filePropertiesContainer").css("width", "0%");
//     }
// });

// $("#mediaFile").dblclick(() => { // full screen
//     if (fullScreen) {
//         exitFullScreen();
//     } else if (isFullscreenEnabled()) {
//         requestFullscreen(document.getElementById("mediaContainer"));
//     }
// });
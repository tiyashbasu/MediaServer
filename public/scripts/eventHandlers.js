$(document).ready(function() {
    updateFileExplorerView("C:/Users/Tiyash Basu/Pictures/Sony-a68");
    document.getElementById("noFileLoadedMsgBox").style.display = "block";
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
        newDirViewed = true;

        updateCurrentDir(clickedItemInnerHTML);
        updateFileExplorerView(currentDirName);
    } else {
        newFileViewed = true;

        currentFileListItem = e.target; // required, not by mistake
        showMedia(currentDirName + "/" + clickedItemInnerHTML);
    }
});

$("#autoChangeFolder").change(() => {
    autoChangeFolder = document.getElementById("autoChangeFolder").checked;
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
    showNextMedia();
});

$('#prevMediaBtn').click(() => {
    showPrevMedia();
});

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        showPrevMedia();
    }
    else if(event.keyCode == 39) {
        showNextMedia();
    }
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
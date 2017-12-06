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

    if (document.getElementById("dirContents").style.display == 'block') {
        collapseFileExplorer();
        opacity = "0";
    } else {
        expandFileExplorer();        
        opacity = "1";
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

$("#mediaFile").click(() => {
    if (isFullscreenEnabled()) {
        requestFullscreen(document.getElementById("mediaContainer"));
    }
});

$("#fileProperties").click(() => {
    toggleFileProperties();
});

$("#toggleFileProperties").click(() => {
    toggleFileProperties();
});

$("#toggleFileProperties").hover(() => {
    $("#toggleFileProperties").css("opacity", "0.7");
});
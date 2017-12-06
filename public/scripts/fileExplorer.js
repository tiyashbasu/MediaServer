function expandFileExplorer() {
    document.getElementById("dirName").style.display = 'block';
    document.getElementById("dirContents").style.display = 'block';

    $("#fileExplorerContainer").css("width", "20%");

    $("#mediaContainer").css("width", "80%");
    $("#mediaContainer").css("left", "20%");

    newFolderViewed = false;
}

function collapseFileExplorer() {
    document.getElementById("dirName").style.display = 'none';
    document.getElementById("dirContents").style.display = 'none';

    $("#fileExplorerContainer").css("width", "0px");

    $("#mediaContainer").css("width", "100%");
    $("#mediaContainer").css("left", "0%");

    if (newFolderViewed && newFileViewed) {
        restoreFileExplorerView();
    }
}

function backupFileExplorerView() {
    currentFolderName = document.getElementById('dirName').innerHTML;    
    var items = document.getElementById('dirContentsList').childNodes;

    currentFileExplorerListItems = [];
    
    for (var i = 0; i < items.length; i++) {
        currentFileExplorerListItems.push(items[i]);
    }

    // the following would be great, but doesn't work on PS4 browser
    // document.getElementById('dirContentsList').childNodes.forEach((item) => {
    //     currentFileExplorerListItems.push(item);
    // });
}

function restoreFileExplorerView() {
    document.getElementById('dirName').innerHTML = currentFolderName;

    $("#dirContentsList").empty();

    var contentsList = document.getElementById('dirContentsList');

    currentFileExplorerListItems.forEach((item) => {
        contentsList.appendChild(item);
    });
}

function updateDirName(subFolderName) {
    var folderName = document.getElementById('dirName').innerHTML;

    if (subFolderName == "..") {
        folderName = folderName.substring(0, folderName.lastIndexOf('/'));
    } else {
        folderName += '/' + subFolderName;
    }

    document.getElementById('dirName').innerHTML = folderName;
}

function populateDirContents(folderName) {
    document.getElementById("noFileLoadedMsgBox").style.display = 'none';

    var uri = dirPrefix + folderName + "&filter=" + filter.image;

    getUri(uri, (response) => {
        document.getElementById("dirName").innerHTML = folderName;
        $("#dirContents").css("height", "calc(100% - " + showHideBtnHeight + " - " + $("#dirName").css("height") + ")");

        var incomingContents = JSON.parse(response).contents;

        var contentsList = document.getElementById('dirContentsList');

        $("#dirContentsList").empty();

        var listItem = document.createElement('li');
        listItem.innerHTML = "..";
        listItem.className = "folderItemStyle";
        contentsList.appendChild(listItem);

        incomingContents.forEach((item) => {
            var listItem = document.createElement('li');
            listItem.innerHTML = item;
            listItem.className = "folderItemStyle";
            contentsList.appendChild(listItem);
        });
    });
}
function expandFileExplorer() {
    $("#dirName").css("padding", "5 5 5 5");
    $("#autoChangeFolderLabel").css("padding", "5 5 5 5");
    $("#fileExplorerContainer").css("width", "20%");

    $("#mediaContainer").css("width", "80%");
    $("#mediaContainer").css("left", "20%");

    newDirViewed = false;
}

function collapseFileExplorer() {
    $("#fileExplorerContainer").css("width", "0px");
    $("#dirName").css("padding", "0 0 0 0");
    $("#autoChangeFolderLabel").css("padding", "0 0 0 0");

    $("#mediaContainer").css("width", "100%");
    $("#mediaContainer").css("left", "0%");

    if (newDirViewed && newFileViewed) {
        restoreFileExplorerView();
    }
}

function backupFileExplorerView() {
    dirNameBackup = currentDirName;    
    
    var items = document.getElementById('dirContentsList').childNodes;

    dirContentsBackup = [];
    
    for (var i = 0; i < items.length; i++) {
        dirContentsBackup.push(items[i]);
    }

    // the following would be great, but doesn't work on PS4 browser
    // document.getElementById('dirContentsList').childNodes.forEach((item) => {
    //     dirContentsBackup.push(item);
    // });
}

function restoreFileExplorerView() {
    currentDirName = dirNameBackup;
    document.getElementById('dirName').innerHTML = currentDirName.substring(currentDirName.lastIndexOf('/') + 1);

    $("#dirContentsList").empty();

    var contentsList = document.getElementById('dirContentsList');

    dirContentsBackup.forEach((item) => {
        contentsList.appendChild(item);
    });
}

function updateCurrentDir(subFolderName) {
    var newFolderName = currentDirName;

    if (subFolderName == "..") {
        newFolderName = newFolderName.substring(0, newFolderName.lastIndexOf('/'));
    } else {
        newFolderName += '/' + subFolderName;
    }

    currentDirName = newFolderName;
}

function updateFileExplorerView(folderName, showFirst = false) {
    document.getElementById("noFileLoadedMsgBox").style.display = 'none';

    var uri = dirPrefix + folderName + "&filter=" + filter.image;

    getUri(uri, (response) => {
        document.getElementById("dirName").innerHTML = folderName.substring(folderName.lastIndexOf('/') + 1);
        currentDirName = folderName;

        var incomingContents = JSON.parse(response).contents;

        var contentsList = document.getElementById('dirContentsList');

        $("#dirContentsList").empty();

        var listItem = document.createElement('li');
        listItem.innerHTML = "..";
        listItem.className = "dirContentsListItemStyle";
        contentsList.appendChild(listItem);

        incomingContents.forEach((item) => {
            var listItem = document.createElement('li');
            listItem.innerHTML = item;
            listItem.className = "dirContentsListItemStyle";
            contentsList.appendChild(listItem);
        });

        if (showFirst) {
            currentFileListItem = document.getElementById('dirContentsList').firstChild;
            showNextMedia();
        }
    });
}
var dirPrefix = "dirContents?path=";
var filePropertiesPrefix = "fileProperties?path="

var newFileViewed = false;
var newFolderViewed = false;

var currentItem;
var currentFolderName;
var currentFolderItems = [];

var showHideBtnHeight = $("#showHideFS").css("height");
var fsPaneExpandedHeight = "60%";

var filePropertiesMap = new Map();

function getFileProperties(fileName, callback) {
    if (filePropertiesMap.get(fileName)) {
        callback(filePropertiesMap.get(fileName));
    } else {
        getUri(filePropertiesPrefix + fileName, (response) => {
            filePropertiesMap.set(fileName, JSON.parse(response))
            callback(filePropertiesMap.get(fileName));
        });
    }
}

$("#showHideFS").click(() => {
    if (document.getElementById("folderListPane").style.display == 'block') {
        collapseFSPane();
    } else {
        expandFSPane();
    }
});

function expandFSPane() {
    document.getElementById("parentFolderName").style.display = 'block';
    document.getElementById("folderListPane").style.display = 'block';
    $("#theFileSystemContainer").css("height", fsPaneExpandedHeight);
    document.getElementById("showHideFS").innerHTML = '⇈';

    newFolderViewed = false;
}

function collapseFSPane() {
    document.getElementById("parentFolderName").style.display = 'none';
    document.getElementById("folderListPane").style.display = 'none';
    $("#theFileSystemContainer").css("height", showHideBtnHeight);
    document.getElementById("showHideFS").innerHTML = '⇊';

    if (newFolderViewed && newFileViewed) {
        restoreFolderAndItems();
    }
}

function backupFolderAndItems() {
    currentFolderName = document.getElementById('parentFolderName').innerHTML;
    
    currentFolderItems = [];
    var items = document.getElementById('folderList').childNodes;
    for (var i = 0; i < items.length; i++) {
        currentFolderItems.push(items[i]);
    }

    // the following would be great, but doesn't work on PS4 browser
    // document.getElementById('folderList').childNodes.forEach((item) => {
    //     currentFolderItems.push(item);
    // });
}

function restoreFolderAndItems() {
    document.getElementById('parentFolderName').innerHTML = currentFolderName;

    $("#folderList").empty();

    var itemList = document.getElementById('folderList');
    currentFolderItems.forEach((item) => {
        itemList.appendChild(item);
    });
}

function updateParentFolderName(subFolderName) {
    var folderName = document.getElementById('parentFolderName').innerHTML;

    if (subFolderName == "..") {
        folderName = folderName.substring(0, folderName.lastIndexOf('/'));
    } else {
        folderName += '/' + subFolderName;
    }

    document.getElementById('parentFolderName').innerHTML = folderName;
}

function populateFolderList(folderName) {
    document.getElementById("noFileBox").style.display = 'none';

    var uri = dirPrefix + folderName + "&filter=" + filter;

    getUri(uri, (response) => {
        document.getElementById("parentFolderName").innerHTML = folderName;
        $("#folderListPane").css("height", "calc(100% - " + showHideBtnHeight + " - " + $("#parentFolderName").css("height") + ")");

        var incomingItemList = JSON.parse(response).items;

        var itemList = document.getElementById('folderList');

        $("#folderList").empty();

        var listItem = document.createElement('li');
        listItem.innerHTML = "..";
        listItem.className = "folderItemStyle";
        itemList.appendChild(listItem);

        incomingItemList.forEach((item) => {
            var listItem = document.createElement('li');
            listItem.innerHTML = item;
            listItem.className = "folderItemStyle";
            itemList.appendChild(listItem);
        });
    });
}

$("#folderList").click((e) => {
    if (e.target.tagName != 'LI') {
        return;
    }

    var clickedItemInnerHTML = e.target.innerHTML;

    if (clickedItemInnerHTML == ".." || clickedItemInnerHTML.indexOf('.') == -1) {
        newFolderViewed = true;

        updateParentFolderName(clickedItemInnerHTML);
        populateFolderList(document.getElementById('parentFolderName').innerHTML);
    } else {
        backupFolderAndItems();
        newFileViewed = true;

        currentItem = e.target; // required, not by mistake
        showImage(document.getElementById('parentFolderName').innerHTML + "/" + clickedItemInnerHTML);
    }
});
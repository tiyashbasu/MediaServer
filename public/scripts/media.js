function clearCurrentMedia() {
    document.getElementById("loadingMsgBox").style.display = "block";
    $("#mediaFile").css("opacity", "0.3");
}

function getMediaEXIFProperties(fileName, callback) {
    var fileCacheMapItem = fileCache.get(fileName)

    if (fileCacheMapItem) {
        callback(fileCacheMapItem.exifProperties);
    } else {
        getUri(filePropertiesPrefix + fileName, (response) => {
            callback(JSON.parse(response));
        });
    }
}

function getFormattedTime(timestamp) {
    var datetime = new Date(0);
    datetime.setUTCSeconds(timestamp);

    var date = datetime.getDate();
    date += "/" + (datetime.getMonth() + 1);
    date += "/" + datetime.getFullYear();

    var time = datetime.getHours();
    var minutes = datetime.getMinutes();
    time += (minutes < 10 ? ":0" : ":") + datetime.getMinutes();

    return date + " " + time;
}

function showMedia(fileName) {
    clearCurrentMedia();

    document.getElementById("fileName").innerHTML = fileName.substring(fileName.lastIndexOf("/") + 1);
    
    var fileNameExt = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    var mimeType = mimeTypes[fileNameExt];

    var fileCacheMapItem = fileCache.get(fileName);

    if (fileCacheMapItem) {
        document.getElementById("datetime").innerHTML = getFormattedTime(fileCacheMapItem.properties.tags.DateTimeOriginal);

        switch (mimeType) {
        case "image":
            showImage(fileCacheMapItem.media, fileCacheMapItem.properties);
            break;
        }
    } else {
        getMediaEXIFProperties(fileName, (exifProperties) => {
            document.getElementById("datetime").innerHTML = getFormattedTime(exifProperties.tags.DateTimeOriginal);

            switch (mimeType) {
            case "image":
                var image = new Image();
                image.onload = () => {
                    fileCache.set(fileName, {
                        media: image,
                        properties: exifProperties
                    });                    
                    showImage(image, exifProperties);
                }
                image.onerror = (e) => {
                    console.log(e);
                };
                image.src = fileDataPrefix + fileName;
                break;
            }
        });
    }

    backupFileExplorerView();
}

function setMediaDisplayDimensions(imageAR) {
    var screenWidth = document.getElementById("mediaContainer").clientWidth;
    var screenHeight = document.getElementById("mediaContainer").clientHeight;
    var screenAR = screenWidth / screenHeight;

    if (imageAR > screenAR) { // i.e., image will have black strips at top and bottom
        $("#mediaFile").css("width", screenWidth + "px");
        $("#mediaFile").css("height", screenWidth / imageAR + "px");
    } else { //i.e., image will have black strips at left and right
        $("#mediaFile").css("width", screenHeight * imageAR + "px");
        $("#mediaFile").css("height", screenHeight + "px");
    }
}

function showImage(imageObj, properties) {
    document.getElementById("focalLength").innerHTML = properties.tags.FocalLength;
    document.getElementById("aperture").innerHTML = "f/" + properties.tags.FNumber;
    document.getElementById("shutterSpeed").innerHTML = Math.round(properties.tags.ExposureTime * 10000) / 10000 + "s";
    document.getElementById("iso").innerHTML = properties.tags.ISO;

    document.getElementById("mediaFile").src = imageObj.src;

    var imageAR = imageObj.width / imageObj.height;

    var screenWidth = document.getElementById("mediaContainer").clientWidth;
    var screenHeight = document.getElementById("mediaContainer").clientHeight;
    var screenAR = screenWidth / screenHeight;

    if (imageAR < screenAR) {
        imageAR = 1 / imageAR;
    }

    // reset mediaFile transformation
    $("#mediaFile").css({
        "transform-origin": "0% 0%",
        "transform": "rotate(0deg) translate(-50%, -50%)"
    });

    switch (properties.tags.Orientation) {
    case 3: // 180 degrees
        $("#mediaFile").css({
            "transform-origin": "25% 25%",
            "transform": "rotate(180deg)"
        });
        break;

    case 6: // 90 degrees
        if (imageAR <= 1) {
            $("#mediaFile").css({
                "transform-origin": "30% -20%",
                "transform": "scale(" + imageAR + "," + imageAR + ") rotate(90deg)"
            });
        } else {
            $("#mediaFile").css({
                "transform-origin": "50% 0%",
                "transform": "scale(" + imageAR + "," + imageAR + ") rotate(90deg)"
            });
        }
        break;

    case 8: // 270 degrees
        if (imageAR <= 1) {
            $("#mediaFile").css({
                "transform-origin": "0% 50%",
                "transform": "scale(" + imageAR + "," + imageAR + ") rotate(270deg)"
            });
        } else {
            $("#mediaFile").css({
                "transform-origin": "19% 69%",
                "transform": "scale(" + imageAR + "," + imageAR + ") rotate(270deg)"
            });
        }
        break;

    default:
        break;
    }

    document.getElementById("loadingMsgBox").style.display = "none";
    $("#mediaFile").css("opacity", "1");
}

function showFirstMediaMessage() {
    document.getElementById("firstFileMsgBox").style.display = "block";
    $("#firstFileMsgBox").delay(500).fadeOut(2000);
}

function showLastMediaMessage() {
    document.getElementById("lastFileMsgBox").style.display = "block";
    $("#lastFileMsgBox").delay(500).fadeOut(2000);
}

function changeFolder(moveToNextFolder, fallback) {
    var currentDirBaseName = dirNameBackup.substring(dirNameBackup.lastIndexOf('/') + 1);
    
    var uri = dirPrefix + dirNameBackup + "/.." + "&filter=" + filter.image;

    getUri(uri, (response) => {
        var incomingContents = JSON.parse(response).contents;
        
        var nextDirName = null;

        if (moveToNextFolder) {
            var found = false;

            for (var i = 0; i < incomingContents.length; i++) {
                if (found) {
                    nextDirName = incomingContents[i];
                    break;
                }
                found = incomingContents[i] == currentDirBaseName;
            }
        } else {
            for (var i = 1; i < incomingContents.length; i++) {
                if(incomingContents[i] == currentDirBaseName) {
                    nextDirName = incomingContents[i - 1];
                    break;
                }
            }
        }

        if (nextDirName) {
            updateFileExplorerView(dirNameBackup.substring(0, dirNameBackup.lastIndexOf('/') + 1) + nextDirName, true);
        } else {
            fallback();
        }
    });
}

function showNextMedia() {
    if (!currentFileListItem) {
        return;
    }

    if (currentFileListItem.nextSibling == null) {
        if (autoChangeFolder) {
            changeFolder(true, showLastMediaMessage);
        } else {
            showLastMediaMessage();
        }
    } else {
        var fileName = currentDirName + "/" + currentFileListItem.nextSibling.innerHTML;
        currentFileListItem = currentFileListItem.nextSibling;
        showMedia(fileName);
    }
}

function showPrevMedia() {
    if (!currentFileListItem) {
        return;
    }

    if (currentFileListItem.previousSibling.innerHTML == "..") {
        if (autoChangeFolder) {
            changeFolder(false, showFirstMediaMessage);
        } else {
            showFirstMediaMessage();
        }
    } else {
        var fileName = currentDirName + "/" + currentFileListItem.previousSibling.innerHTML;
        currentFileListItem = currentFileListItem.previousSibling;
        showMedia(fileName);
    }
}
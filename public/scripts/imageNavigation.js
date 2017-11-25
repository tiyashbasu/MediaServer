var imageDataPrefix = "fileData?path=";
var imageFileNamePrefix = "fileName?curFile=";

var imageCache = new Map();

function clearImage() {
    document.getElementById("theLoadingBox").style.display = "block";
    $("#theImage").css("opacity", "0.3");
}

function showImage(imageFileName) {
    clearImage();

    if (imageCache.get(imageFileName) == undefined) {
        var newImage = new Image();
        newImage.src = imageDataPrefix + imageFileName;
        imageCache.set(imageFileName, newImage);
        imageCache.get(imageFileName).onload = () => showImageObject(imageCache.get(imageFileName));
    } else {
        showImageObject(imageCache.get(imageFileName));
    }
}

function showImageObject(imageObj) {
    document.getElementById("theImage").src = imageObj.src;

    document.getElementById("theLoadingBox").style.display = "none";
    $("#theImage").css("opacity", "1");
}

function showFirstImageMessage() {
    document.getElementById("firstFileBox").style.display = "block";
    $("#firstFileBox").delay(500).fadeOut(2000);
}

function showLastImageMessage() {
    document.getElementById("lastFileBox").style.display = "block";
    $("#lastFileBox").delay(500).fadeOut(2000);
}

var swiper = new Hammer(document.getElementById("theImage"));
swiper.on("swipeleft", () => {
    showNextImage()
});
swiper.on("swiperight", () => {
    showPrevImage();
});

$('#next').click(() => {
    showNextImage()
});
$('#prev').click(() => {
    showPrevImage();
});

function showNextImage() {
    if (currentItem.nextSibling == null) {
        showLastImageMessage();
    } else {
        var fileName = document.getElementById('parentFolderName').innerHTML + "/" + currentItem.nextSibling.innerHTML;
        currentItem = currentItem.nextSibling;
        showImage(fileName);
    }
}

function showPrevImage() {
    if (currentItem.previousSibling.innerHTML == "..") {
        showFirstImageMessage();
    } else {
        var fileName = document.getElementById('parentFolderName').innerHTML + "/" + currentItem.previousSibling.innerHTML;
        currentItem = currentItem.previousSibling;
        showImage(fileName);
    }
}
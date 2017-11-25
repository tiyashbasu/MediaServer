var imageDataPrefix = "fileData?path=";
var imageFileNamePrefix = "fileName?curFile=";

var imageCache = new Map();

function emptyImageCache() {
    imageCache = new Map();
}

function clearImage() {
    document.getElementById("theLoadingBox").style.display = "block";
    $("#theImage").css("opacity", "0.3");
}

function showImage(imageFileName) {
    var imageObj = new Image();
    imageObj.src = imageDataPrefix + imageFileName;
    imageCache.set(imageFileName, imageObj);
    imageCache.get(imageFileName).onload = showImageObject(imageCache.get(imageFileName));
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
swiper.on("swipeleft", function(e) {
    showNextImage()
});
swiper.on("swiperight", function(e) {
    showPrevImage();
});

$('#next').click(() => {
    showNextImage()
});
$('#prev').click(() => {
    showPrevImage();
});

function getImageData(fileName) {
    var newImage = new Image();
    newImage.src = imageDataPrefix + fileName;

    imageCache.set(fileName, newImage);
}

function showPrevImage() {
    if (currentItem.previousSibling.innerHTML == "..") {
        showFirstImageMessage();
    } else {
        // console.log("Fetching prev from cache");
        clearImage();

        var fileName = document.getElementById('parentFolderName').innerHTML + "/" + currentItem.previousSibling.innerHTML;

        if (imageCache.get(fileName) == undefined) {
            getImageData(fileName);
        }
        
        currentItem = currentItem.previousSibling;
        showImageObject(imageCache.get(fileName));
    }
}

function showNextImage() {
    if (currentItem.nextSibling == null) {
        showLastImageMessage();
    } else {
        // console.log("Fetching prev from cache");
        clearImage();

        var fileName = document.getElementById('parentFolderName').innerHTML + "/" + currentItem.nextSibling.innerHTML;

        if (imageCache.get(fileName) == undefined) {
            getImageData(fileName);
        }
        
        currentItem = currentItem.nextSibling;
        showImageObject(imageCache.get(fileName));
    }
}
var imageDataPrefix = "fileData?path=";
var imageFileNamePrefix = "fileName?curFile=";
var filePropertiesPrefix = "fileProperties?path="

var imgCanvas = document.getElementById("theImage");
var imgCanvasCtx = imgCanvas.getContext("2d");

var imageCache = new Map();

function clearImage() {
    document.getElementById("theLoadingBox").style.display = "block";
    $("#theImage").css("opacity", "0.3");
}

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

function showImage(imageFileName) {
    clearImage();

    if (imageCache.get(imageFileName)) {
        getFileProperties(imageFileName, (properties) => {
            showImageObject(imageCache.get(imageFileName), properties.tags.Orientation);
        });
    } else {
        var newImage = new Image();
        newImage.src = imageDataPrefix + imageFileName;
        imageCache.set(imageFileName, newImage);
        imageCache.get(imageFileName).onload = () => {
            getFileProperties(imageFileName, (properties) => {
                showImageObject(imageCache.get(imageFileName), properties.tags.Orientation);
            });
        }
    }
}

function swap(a, b) {
    var temp = a;
    a = b;
    b = temp;
}

function setCanvasDimensions(imageAR) {
    var screenAR = screen.width / screen.height;
    if (imageAR > screenAR) { // i.e., image will have black strips at top and bottom
        imgCanvas.width = screen.width;
        imgCanvas.height = screen.width / imageAR;
    } else { //i.e., image will have black strips at left and right
        imgCanvas.width = screen.height * imageAR;
        imgCanvas.height = screen.height;
    }
}

function showImageObject(imageObj, orientation) {
    // document.getElementById("theImage").src = imageObj.src;

    var imageAR = imageObj.width / imageObj.height;
    setCanvasDimensions(imageAR);

    var imgWidth = imgCanvas.width;
    var imgHeight = imgCanvas.height;

    switch (orientation) {
    case 3: // 180 degrees
        imgCanvasCtx.rotate(Math.PI);
        imgCanvasCtx.translate(-imgCanvas.width, -imgCanvas.height);
        break;
    case 6: // 90 degrees
        imgWidth = imgCanvas.height;
        imgHeight = imgCanvas.height / imageAR;
        imgCanvasCtx.rotate(Math.PI * 0.5);
        imgCanvasCtx.translate(0, -(imgHeight + imgCanvas.width) * 0.5);
        break;
    case 8: // 270 degrees
        imgWidth = imgCanvas.height;
        imgHeight = imgCanvas.height / imageAR;
        imgCanvasCtx.rotate(Math.PI * -0.5);
        imgCanvasCtx.translate(-imgWidth, (imgCanvas.width - imgHeight) * 0.5);
        break;
    default:
        break;
    }
    imgCanvasCtx.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height, 0, 0, imgWidth, imgHeight);

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
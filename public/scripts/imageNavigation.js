var imageDataPrefix = "fileData?path=";
var imageFileNamePrefix = "fileName?curFile=";
var filePropertiesPrefix = "fileProperties?path=";
var imagePrefix = "file?path=";

var imageCache = new Map();

function clearCurrentImage() {
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
    clearCurrentImage();

    var imgMapItem = imageCache.get(imageFileName)

    if (imgMapItem) {
        showImageObject(imgMapItem.img, imgMapItem.exifProperties.tags.Orientation);
        
        document.getElementById("focalLength").innerHTML = imgMapItem.exifProperties.tags.FocalLength;
        document.getElementById("aperture").innerHTML = "f/" + imgMapItem.exifProperties.tags.FNumber;
        document.getElementById("shutterSpeed").innerHTML = Math.round(imgMapItem.exifProperties.tags.ExposureTime * 10000) / 10000 + "s";
        document.getElementById("iso").innerHTML = imgMapItem.exifProperties.tags.ISO;
    } else {
        var image = new Image();
        image.onload = () => {
            getFileProperties(imageFileName, (properties) => {
                imageCache.set(imageFileName, {img: image, exifProperties: properties});
                showImageObject(image, properties.tags.Orientation);

                document.getElementById("focalLength").innerHTML = properties.tags.FocalLength;
                document.getElementById("aperture").innerHTML = "f/" + properties.tags.FNumber;
                document.getElementById("shutterSpeed").innerHTML = Math.round(properties.tags.ExposureTime * 10000) / 10000 + "s";
                document.getElementById("iso").innerHTML = properties.tags.ISO;
            });
        }
        image.onerror = (e) => {
            console.log(e);
        };
        image.src = imageDataPrefix + imageFileName;
    }
}

function setImageDimensions(imageAR) {
    var screenWidth = document.getElementById("theImageContainer").clientWidth;
    var screenHeight = document.getElementById("theImageContainer").clientHeight;
    var screenAR = screenWidth / screenHeight;

    if (imageAR > screenAR) { // i.e., image will have black strips at top and bottom
        $("#theImage").css("width", screenWidth + "px");
        $("#theImage").css("height", screenWidth / imageAR + "px");
    } else { //i.e., image will have black strips at left and right
        $("#theImage").css("width", screenHeight * imageAR + "px");
        $("#theImage").css("height", screenHeight + "px");
    }
}

function showImageObject(imageObj, orientation) {
    document.getElementById("theImage").src = imageObj.src;

    var imageAR = imageObj.width / imageObj.height;

    var screenWidth = document.getElementById("theImageContainer").clientWidth;
    var screenHeight = document.getElementById("theImageContainer").clientHeight;
    var screenAR = screenWidth / screenHeight;

    if (imageAR < screenAR) {
        imageAR = 1 / imageAR;
    }

    // reset theImage transformation
    $("#theImage").css({
        "transform-origin": "0% 0%",
        "transform": "rotate(0deg) translate(-50%, -50%)"
    });

    switch (orientation) {
    case 3: // 180 degrees
        $("#theImage").css({
            "transform-origin": "25% 25%",
            "transform": "rotate(180deg)"
        });
        break;

    case 6: // 90 degrees
        if (imageAR <= 1) {
            $("#theImage").css({
                "transform-origin": "30% -20%",
                "transform": "scale(" + imageAR + "," + imageAR + ") rotate(90deg)"
            });
        } else {
            $("#theImage").css({
                "transform-origin": "50% 0%",
                "transform": "scale(" + imageAR + "," + imageAR + ") rotate(90deg)"
            });
        }
        break;

    case 8: // 270 degrees
        if (imageAR <= 1) {
            $("#theImage").css({
                "transform-origin": "0% 50%",
                "transform": "scale(" + imageAR + "," + imageAR + ") rotate(270deg)"
            });
        } else {
            $("#theImage").css({
                "transform-origin": "19% 69%",
                "transform": "scale(" + imageAR + "," + imageAR + ") rotate(270deg)"
            });
        }
        break;

    default:
        break;
    }

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

$("#showHideFileProps").hover(() => {
    $("#showHideFileProps").css("opacity", "0.7");
});

function showHideFileProperties() {
    if ($("#fileProperties").css("width") == "0px") {
        $("#fileProperties").css("width", "100%");

        $("#showHideFileProps").mouseout(() => {
            $("#showHideFileProps").css("opacity", "0.1");
        });
    } else {
        $("#fileProperties").css("width", "0%");

        $("#showHideFileProps").mouseout(() => {
            $("#showHideFileProps").css("opacity", "0");
        });
    }
}

$("#showHideFileProps").click(() => {
    showHideFileProperties();
});

$("#fileProperties").click(() => {
    showHideFileProperties();
});
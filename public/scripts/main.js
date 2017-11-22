var imageCache = [];
var curImageIndex = 0;

var imageSrcPrefix = "http://192.168.178.84:3000/imagedata?path=";

$(document).ready(function() {
    var defaultImage = new Image();
    defaultImage.src = imageSrcPrefix + "images/DSC02573.jpg";
    imageCache.push(defaultImage);
    imageCache[0].onload = () => showImage(imageCache[0]);
});

function clearImage() {
    document.getElementById("theLoadingBox").style.display = "block";

    $("#theImage").css("opacity", "0.3");
}

function showImage(imageObj) {
    document.getElementById("theLoadingBox").style.display = "none";

    $("#theImage").css("opacity", "1");
    document.getElementById("theImage").src = imageObj.src;
}

function showFirstImageMessage() {
    document.getElementById("firstImageBox").style.display = "block";
    $("#firstImageBox").delay(500).fadeOut(2000);
}

function showLastImageMessage() {
    document.getElementById("lastImageBox").style.display = "block";
    $("#lastImageBox").delay(500).fadeOut(2000);
}

$('body').on('contextmenu', 'img', (e) => {
    return false;
});

var swiper = new Hammer(document.getElementById("theImage"));
swiper.on("swipeleft", function(e) {
    getImage("next");
});
swiper.on("swiperight", function(e) {
    getImage("prev");
});

$('#next').click(() => {
    getImage("next");
});
$('#prev').click(() => {
    getImage("prev");
});

function getImage(mode) {
    if (mode == "prev") {
        if (curImageIndex == 0) {
            showFirstImageMessage();
        } else {
            // console.log("Fetching prev from cache");
            curImageIndex--;
            clearImage();
            showImage(imageCache[curImageIndex]);
        }
    } else { //if (mode == "next")
        if (curImageIndex < imageCache.length - 1) {
            // console.log("Fetching next from cache");
            curImageIndex++;
            clearImage();
            showImage(imageCache[curImageIndex]);
        } else {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    if (xhr.responseText == "-1") {
                        showLastImageMessage()
                    } else {
                        clearImage();

                        var newImage = new Image();
                        newImage.src = imageSrcPrefix + xhr.responseText;
                        imageCache.push(newImage);
                        
                        curImageIndex++;
                        imageCache[curImageIndex].onload = () => showImage(imageCache[curImageIndex]);
                    }
                }
            };

            var curimageCacheSrc = imageCache[curImageIndex].src;
            var url = "image?curFile=" +  curimageCacheSrc.split('=')[1] + "&next=1";
            xhr.open("GET", url, true);
            xhr.send();
        }
    }
}
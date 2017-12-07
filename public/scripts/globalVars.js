var filter = {image: "image"};

var mimeTypes = {
    jpg: "image",
    jpeg: "image",
    png: "image",
    bmp: "image",
    tiff: "image",
};

var dirPrefix = "dirContents?path=";
var fileDataPrefix = "fileData?path=";
var fileNamePrefix = "fileName?curFile=";
var filePropertiesPrefix = "fileProperties?path=";
var filePrefix = "file?path=";

var currentFileListItem;
var currentFileName;
var currentDirName;

var dirNameBackup;
var dirContentsBackup = [];

var showHideBtnHeight = $("#toggleFileExplorer").css("height");
var fsPaneExpandedHeight = "100%";

var fileCache = new Map();

var newFileViewed = false;
var newDirViewed = false;
var fullScreen = false;
var autoChangeFolder = false;

var isTappedOnce = false;
var tapTimeout;
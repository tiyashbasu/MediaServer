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

var newFileViewed = false;
var newFolderViewed = false;

var currentFileListItem;

var currentFolderName;
var currentFileExplorerListItems = [];

var showHideBtnHeight = $("#toggleFileExplorer").css("height");
var fsPaneExpandedHeight = "100%";

var fileCache = new Map();

var fullScreen = false;
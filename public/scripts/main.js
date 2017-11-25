var filter = "image";

$(document).ready(function() {
    populateFolderList("C:/Users/Tiyash Basu/Pictures/Sony-a68");
    document.getElementById("noFileBox").style.display = "block";
});

$('body').on('contextmenu', 'img', (e) => {
    return false;
});
'use strict';

var filter = {
    "image": ["jpg", "jpeg", "png"]
};

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var path = require('path');
var exifParser = require('exif-parser');

var app = express();

app.set('view engine', 'ejs');

app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.listen(3000, (err) => {
    if (err) {
        console.log("Could not start server.\nError: " + err);
    }

    console.log("Listening on port 3000...")
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/fileData', (req, res) => {
    res.sendFile(path.resolve(req.query.path));
});

app.get('/fileProperties', (req, res) => {
    fs.readFile(path.resolve(req.query.path), (err, rawFileData) => {
        var exifProperties = exifParser.create(rawFileData).parse();
        res.send(exifProperties);
    });
});

app.get('/fileName', (req, res) => {
    var absFileName = req.query.curFile;

    var pos = absFileName.lastIndexOf('/');
    var folderName = absFileName.substring(0, pos);
    var fileName = absFileName.substring(pos + 1, pos.length);

    fs.readdir(folderName, (err, files) => {
        var i = 0;
        
        while(i < files.length) {
            if (files[i++] == fileName) {
                break;
            }
        }
        
        var newFileName = "-1";

        if (req.query.prev == '1' && i > 1) {
            newFileName = folderName + "/" + files[i - 2];
        } else if (req.query.next == '1' && i < files.length) {
            newFileName = folderName + "/" + files[i];
        }

        res.send(newFileName);
        return;
    });
});

function sanitizePath(path) {
    var str = path.replace(/\\/g, "\\\\");
    str = str.replace(/\"/g, "");
    return str;
}

function getFilter(filterName) {
    switch (filterName) {
        case "image":
            return filter.image;
    }
}

app.get("/dirContents", (req, res) => {
    var folderName = sanitizePath(req.query.path);
    
    var fileExts = getFilter(req.query.filter);

    fs.readdir(folderName, (err, files) => {
        var itemList = [];
        
        if (files == undefined) {
            res.send({items: itemList});
            return;
        }

        files.forEach((item) => {
            if (item.indexOf('.') == -1) {
                itemList.push(item);
                return;
            }
            for (var i = 0; i < fileExts.length; i++) {
                if (item.toLowerCase().endsWith(fileExts[i]) || item.indexOf('.') == -1) {
                    itemList.push(item);
                    return;
                }
            }
        });
        res.send({items: itemList});
    });
});

app.get("/filter/:filterName", (req, res) => {
    res.send(getFilter(req.params.filterName));
});

// app.get("/test/:testString", (req, res) => {
//     console.log(req.params.testString);
//     res.send({});
// });
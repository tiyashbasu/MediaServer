'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');

var app = express();

app.set('view engine', 'ejs');

app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.listen(3000, () => console.log("Listening on port 3000..."));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/imagedata', (req, res) => {
    res.sendFile(req.query.path, {root: __dirname});
});

app.get('/image', (req, res) => {
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

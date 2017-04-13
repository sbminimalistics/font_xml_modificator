#!/usr/bin/env node
"use strict";

var colors = require('colors');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var express = require('express');
//var router = express.Router();
//var bodyParser = require('body-parser');
var busboy = require('connect-busboy'); //middleware for form/file upload
var fs = require('fs-extra');       //File System - for file manipulation
var opn = require('opn')
var formidable = require('formidable');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var modif = process.argv[2];


			//printint informative head;
			process.stdout.write("+++++++++++++++++++++++++++++");
			process.stdout.write("\n");
			console.log("font xml modificator");
			//eof of informative head;

			
//server initialization;
var app = express();
app.use(busboy());
app.post('/', function(req, res){
	var tempFileName = "";
	var fullFilePath = "";
	var form = new formidable.IncomingForm();
	//specify that we want to allow the user to upload multiple files in a single request
	form.multiples = true;
	form.uploadDir = path.join(__dirname, '/uploads');
	form.on('file', function(field, file) {
		tempFileName = new Date().toDateString().split(" ").join("")
			+"_"
			+new Date().toGMTString().split(" ")[4].split(":").join("")
			+"_"
			+file.name;
		fullFilePath = path.join(form.uploadDir, tempFileName);
		fs.rename(file.path, fullFilePath);
	});
  form.on('error', function(err){console.log('An error has occured: \n' + err);});
  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
	//res.write();
    res.end('success');
	readUploadedFile(fullFilePath);
  });
  form.parse(req);
});




app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function (req, res) {
	res.writeHead('content-type','text/html');
	res.write('<html>');
	res.write('Hello World!<br>');
	res.write('<form id="fileSelectionForm" method="post" action="" enctype="multipart/form-data">');
	res.write('<input id="upload-input" type="file" name="uploads[]" multiple="multiple"><br>');
	res.write('</form>');
	res.write('<script src="fileInput.js"></script>');
	res.write('</html>');
	res.end();
});


app.listen(5001, function () {
	process.stdout.write('...is listening on port 5001!');
	process.stdout.write("\n");
	process.stdout.write("+++++++++++++++++++++++++++++");
})

opn('http://localhost:5001', {app: 'chrome'});
//eof server initialization;



function getNextItemInfo(){
	currentItemWaittingForStat++;
	if(currentItemWaittingForStat < fileNames.length){
		var file = path.resolve('.', fileNames[currentItemWaittingForStat]);
		fs.stat(file, interpreterItem);
	}
}

function readUploadedFile(target){
	console.log(">readUploadedFile");
	//var content = fs.readFileSync(target, 'utf8');
	//console.log(content);   // Put all of the code here (not the best solution)
	fs.readFile(target, function(err, data) {
		parser.parseString(data, function (err, result) {
			console.dir(result);
			console.log('Done');
		});
	});
}

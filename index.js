#!/usr/bin/env node
"use strict";

var colors = require('colors');
var domparser = require('xmldom').DOMParser;
var xpath = require('xpath');
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
	readUploadedFile(res, fullFilePath);
	res.end();
  });
  form.parse(req);
});




app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function (req, res) {
	res.writeHead('content-type','text/html');
	res.write('<html>');
	res.write('<form id="fileSelectionForm" method="post" action="" enctype="multipart/form-data">');
	res.write('<input id="upload-input" type="file" name="uploads[]"><br>');
	res.write('</form>');
	res.write('<script src="fileInput.js"></script>');
	res.write('</html>');
	res.end();
});


app.listen(5001, function () {
	process.stdout.write('...is listening on port 5001!');
	process.stdout.write("\n");
	process.stdout.write("+++++++++++++++++++++++++++++");
	process.stdout.write("\n");
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

function readUploadedFile(res, target){
	console.log(">readUploadedFile fullPath:"+target);
	//var content = fs.readFileSync(target, 'utf8');
	//console.log(content);   // Put all of the code here (not the best solution)
	var syncData = fs.readFileSync(target, 'utf8');
	var doc = new domparser().parseFromString(syncData, 'text/xml');
	//console.log(doc);
	console.log("+++++++++++++++++++++++++++++++++++++++");
	var chars = xpath.select('//chars', doc)[0];
	console.log("chars found: "+chars.childNodes.length);
	for(var i=0; i < chars.childNodes.length; i++){
		console.log(chars.childNodes[0].nodeType);
	}
	var chars2 = xpath.select('//char', doc);
	//for(var j=0; j < chars2.length; j++){
		//console.log(chars2[j].attributes);
	//}
	
	parser.parseString(syncData, function (err, result) {
		//console.dir(result);
		console.log(result.font.chars[0].char[0]);
	});
	
	//console.log(syncData);
	
	/*fs.readFile(target, function(err, data) {
		if(err){throw err;}
		//var doc = new domparser().parseFromString(data, 'text/xml');
		//console.log(xpath.select('/', data));
		parser.parseString(data, function (err, result) {
			//console.dir(result);
			console.log('Done');
			res.writeHead('content-type','text/html');
			res.write('<html>');
			console.log(result.font.chars[0].char[0]);
			res.write('</html>');
			res.end();
			//res.end('success');
		});
	});*/
}

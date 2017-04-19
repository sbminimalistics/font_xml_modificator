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

Error.stackTraceLimit = 0;

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
  });
  form.parse(req);
});

app.post('/save', function(req, res){
	var tempFileName = "";
	var fullFilePath = "";
	var form = new formidable.IncomingForm();
	form.on('error', function(err){console.log('An error has occured: \n' + err);});
	form.on('end', function() {
		//res.write();
		console.log("form submited. end fired;");
		res.end();
	});
	form.on('field', function(name, value) {
		//res.write();
		console.log("form field '"+name+"' with value "+value+" recieved");
		if(name == "modifiedChars"){
			var b = value;
			console.log("%%%%%%%%%%%%%%%%%%%%%");
			var c = JSON.parse(value);
			console.log(c);
			console.log(c[0].$);
			console.log("%%%%%%%%%%%%%%%%%%%%%");
		}
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
	var syncData = fs.readFileSync(target, 'utf8');
	var doc = new domparser().parseFromString(syncData, 'text/xml');
	//console.log(doc);
	console.log("+++++++++++++++++++++++++++++++++++++++");
	var chars = xpath.select('//chars', doc)[0];
	console.log("chars found: "+chars.childNodes.length);
	console.log(chars.childNodes.toString());
	var chars2 = xpath.select('//char', doc);
	
	parser.parseString(syncData, function (err, result) {
		if(err){throw err;}
		if(result == null || result.font == null || result.font.chars[0] == null){
			throw new Error(colors.bgRed.white(' ERR: selected file does not hold font chars info '));
		}
		
		//appending jsonString with comments. They are needed only for readability on the frontend;
		var n=0;
		for(var i=0; i<chars.childNodes.length; i++){
			if(chars.childNodes[i].nodeType == 8){
				result.font.chars[0].char[n].$["comment"] = encodeURI(chars.childNodes[i].nodeValue);
				n++;
			}
		}
		//eof appending;
		
		var jsonString = JSON.stringify(result);
			
		res.writeHead('content-type','text/html');
		res.write('<html>');
		res.write('<div id="output"></div>');
		res.write('<script>var chars = '+jsonString+';</script>');
		res.write('<link rel="stylesheet" type="text/css" href="modificatorTable.css">');
		res.write('<form id="saveModifiedValuesForm" method="post" action="save" enctype="multipart/form-data">');
		res.write('<input id="modifiedChars" type="hidden" name="modifiedChars" value="">');
		res.write('</form>');
		res.write('<button id="save">save</button>');
		res.write('<script src="modificatorTable.js"></script>');
		res.write('</html>');
		res.end();
	});
}

#!/usr/bin/env node
"use strict";

var colors = require('colors');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var postfixConnector = "-";
var postfix = process.argv[2];


//printint informative head;
process.stdout.write("++++++++++++++++++++++++++++++++++++++++++++++++++");
for(var i=0; i<=process.argv[2].toString().length; i++){
	process.stdout.write("+");
}
process.stdout.write("\n");
console.log("clearing duplicated files with names that include: " + colors.bgWhite.black(String(process.argv[2])));
process.stdout.write("++++++++++++++++++++++++++++++++++++++++++++++++++");
for(var i=0; i<=process.argv[2].toString().length; i++){
	process.stdout.write("+");
}
process.stdout.write("\n");
//eof of informative head;

const folder = '.';
var fileNames = [];
var currentItemWaittingForStat = -1;


fs.readdir(folder, (err, files) => {
	files.forEach(file => {
		//console.log(file);
		fileNames.push(file.toString());
	});
	interpreterList();
})

function interpreterList(){
	//console.log(fileNames);
	currentItemWaittingForStat = -1;
	getNextItemInfo();
}

function getNextItemInfo(){
	currentItemWaittingForStat++;
	if(currentItemWaittingForStat < fileNames.length){
		var file = path.resolve('.', fileNames[currentItemWaittingForStat]);
		fs.stat(file, interpreterItem);
	}
}

function interpreterItem(err, res){
	if(res){
		console.log("progress: " + colors.bgWhite.black((currentItemWaittingForStat+1) + "of" + fileNames.length));
		if(res.isFile()){
			console.log("file: "+String(fileNames[currentItemWaittingForStat]));
			if(fileNames[currentItemWaittingForStat].indexOf(postfixConnector+""+postfix) > -1){
				var targetDuplicate =
					fileNames[currentItemWaittingForStat].substr(0,fileNames[currentItemWaittingForStat].indexOf(postfixConnector+""+postfix))
					+
					path.extname(fileNames[currentItemWaittingForStat]);
				console.log("files has duplicate without postfix: " + findFile(targetDuplicate));
				fs.unlink(targetDuplicate, (err, res2) => {
					if(err) console.log(err.message);
					console.log("file deleted: "+targetDuplicate);
					console.log("renaming file with postfix: "+fileNames[currentItemWaittingForStat]);
					fs.rename(fileNames[currentItemWaittingForStat], targetDuplicate, (err, res3) => {if(err)throw err;console.log("successfully renamed");});
					getNextItemInfo();
				});
			}else{
				getNextItemInfo();
			}
		}else{
			console.log("probably directory");
			getNextItemInfo();
		}
	}else{
		console.log("unrecognized or already deleted");
		console.log(err.message);
		getNextItemInfo();
	}
}

function findFile(id){
	return _.some(fileNames, function(c) {
		return c == id; 
	});
}
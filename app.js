var walk = require('walkdir');
var fs = require('fs');
var fse = require('fs-extra');
var S = require('string');
var path = require('path');
var timediff = require('timediff');
var cp = require('cp');
var Promise = require('promise');

var source_dir = '/Volumes/Public/webbox';
var target_dir = '/Volumes/VIDEO/comics';


var source_files = [];
var target_files = [];

var start = new Date();

contents(source_dir).then(function(files){
    source_files = files;
    return contents(target_dir);
}).then(function(files){

    target_files = files;

    var to_copy = diff(source_files, target_files);
    var to_delete = diff(target_files, source_files);

    to_copy.forEach(function(file, index, array){
        var source = path.join( source_dir, file);
        console.log( 'Copying: ' + source + '(' + index + '/' + array.length + ')' );
    });

    to_delete.forEach(function(file, index, array){
        var target = path.join(target_dir, file);
        cosole.log( 'Deleting: ' + target + '(' + index + '/' + array.length + ')' );
    });

});




/*
 Find files in list 1, but not in list 2;
 */
function diff( list_1, list_2 ){
  var list = list_1.filter(function(file){
      var exists = list_2.some(function(item){
        return item == file;
      });
  });
  return list;
}

/*
 Return all the files in a given directory (and sub directory)
 */
function contents(directory) {

  var promise = new Promise(function(require, reject) {

    var files = [];

    var emitter = walk(directory);

    emitter.on('file', function(filename, stat) {
      var relative_path = S(filename).chompLeft(directory).s;
      files.push(relative_path);
      console.log("<-- " + files.length + ' ' + relative_path);
    });

    emitter.on('end', function() {
      resolve(files);
    });

  });

  return promise;
}

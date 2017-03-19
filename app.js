var walk  = require('walkdir');
var fs    = require('fs');
var fse   = require('fs-extra');
var S     = require('string');
var path  = require('path');
let jf    = require('jsonfile');

var source_dir = '/Volumes/Public/webbox';
var target_dir = '/Volumes/MainExt/webbox';


contents(source_dir).then(function(files){

    console.log( 'Complete: ' + files.length + ' files found.');

    jf.writeFileSync('source_list.json', files);

    console.log( '.. archived.');

    let to_copy = files.filter(function(file){
        let dest_file = path.join(target_dir, file);
        let dest_found = fs.existsSync(dest_file);
        console.log( file + ' exists --> ' + dest_found);
        return !dest_found;
    });

    to_copy.forEach(function(file){
        let source = path.join(source_dir, file);
        let target = path.join(target_dir, file);
        console.log( '(cp) ' + source + ' --> ' + target );
        // fse.mkdirsSync(path.dirname(target));
        // fse.copySync(source_dir, target_dir, { preserveTimestamps: true })
    })

    console.log( 'Done..' );

    process.exit(0);

});


/*
 Return all the files in a given directory (and sub directory)
 */
function contents(directory) {

  var promise = new Promise(function(resolve, reject) {

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

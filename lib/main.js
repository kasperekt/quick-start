var fs = require('fs');
var path = require('path');
var prompt = require('./prompt');

function scanProject(basePath) {
  var pathWithSlash = basePath + '/';

  fs.readdir(pathWithSlash, function(err, files) {
    if (err) {
      console.error(err);
      return 1;
    }

    files.forEach(function(element) {
      var pathname = pathWithSlash + element;
      var isDir = fs.lstatSync(pathname).isDirectory();
      
      if (isDir) {
        scanProject(pathname);
      } else {
        prompt.read(pathname);
      }
    });
  });
}

function run(projectName) {
  var projectPath = './projects/' + projectName;
  scanProject(projectPath);
}

module.exports = {
  run: run
};

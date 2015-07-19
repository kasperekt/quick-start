var fs = require('fs');
var path = require('path');
var utils = require('./packageFileUtils');

var specialFiles = ['package.json'];

function isSpecialFile(pathname) {
  return specialFiles.some(function(file) {
    return file === pathname;
  });
}

function read(pathname) {
  var basename = path.basename(pathname);
  if (!isSpecialFile(basename)) return false;

  switch (basename) {
    case 'package.json': 
      utils.parsePackageFile(pathname);
      break;
    default:
      // no op
  }
} 

module.exports = {
  read: read,
  isSpecialFile: isSpecialFile
};

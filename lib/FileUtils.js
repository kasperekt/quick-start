var fs = require('fs');

function copyFile(src, dest, cb) {
  var readStream = fs.createReadStream(src);
  readStream.on('error', function(err) {
    cb(err);
  });

  var writeStream = fs.createWriteStream(dest);
  writeStream.on('error', function(err) {
    cb(err);
  });
  writeStream.on('close', function() {
    cb(null);
  });

  readStream.pipe(writeStream);
}

function copyDirectorySync(src, dest) {

}

module.exports = {
  copyFile: copyFile
};
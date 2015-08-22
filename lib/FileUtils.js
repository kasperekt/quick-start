var fs = require('fs');

function copyFile(src, dest) {
  fs.createReadStream(src)
    .pipe(fs.createWriteStream(dest));
}


module.exports = {
  copyFile: copyFile
};
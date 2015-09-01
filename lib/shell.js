exports.exec = function(cmd, args, cb) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var resp = '';

  child.stdout.on('error', function(buffer) {
    process.stderr.write(buffer.toString());
  });
  child.stderr.on('end', function() {
    process.stderr.write('END!\n');
  });

  child.stdout.on('data', function (buffer) {
    process.stdout.write(buffer.toString());
  });
  child.stdout.on('end', function() { cb (resp) });
};

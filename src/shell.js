exports.exec = function(cmd, args, cb) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args, {
    stdio: [process.stdin, 'pipe', process.stderr]
  });

  child.stdout.pipe(process.stdout);
  child.stdout.on('end', cb);
};

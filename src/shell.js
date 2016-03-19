export function exec(cmd, args, cb) {
  const spawn = require('child_process').spawn;
  const child = spawn(cmd, args, {
    stdio: [process.stdin, 'pipe', process.stderr],
  });

  child.stdout.pipe(process.stdout);
  child.stdout.on('end', cb);
}

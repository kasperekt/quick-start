export function exec(cmd, args, cb) {
  const spawn = require('child_process').spawn;
  const child = spawn(cmd, args, {
    stdio: [process.stdin, 'pipe', process.stderr],
  });

  child.stdout.pipe(process.stdout);
  child.stdout.on('end', cb);
}

/*
 * Executes list of commands one after one
 * Command format:
 *
 * { cmd: "echo", args: ["test"] }
 */
export function execCmdList(list) {
  if (list.length === 0) return;

  const cmd = list.shift();
  exec(cmd.cmd, cmd.args, () => {
    execCmdList(list);
  });
}

/*
 * Returns commands list if have one
 */
export function getCommandsList(config) {
  return config.commands;
}

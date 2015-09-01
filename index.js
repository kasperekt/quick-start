var path = require('path');
var fs = require('fs');
var wrench = require('wrench');
var exec = require('./lib/shell').exec;
var argv = require('minimist')(process.argv.slice(2), {
  boolean: [
    'n', 'new',
    's', 'scan',
    'd', 'delete',
    'git',
    'npm-install'
  ]
});

var exclude = ['node_modules', '.git', 'bower_components', 'npm-debug.log'];
var commands = {
  'git': { cmd: 'git', args: ['init'] },
  'npm-install': { cmd: 'npm', args: ['install'] }
};

function _getProjectPath(name) {
  return path.join(__dirname, 'projects', name);
}

function _projectExists(pathname) {
  try {
    var stats = fs.lstatSync(pathname);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

function _getCommandsList(commands) {
  return Object.keys(commands)
    .filter(function(command) {
      return argv[command];
    })
    .map(function(command) {
      return commands[command];
    });
}

function _afterCreate(dest) {
  process.chdir(path.resolve(process.cwd(), dest));
  console.log('Commands:', _getCommandsList(commands));
  execCmdList(_getCommandsList(commands));
}

function execCmdList(list) {
  if (list.length === 0) return;
  var cmd = list.shift();
  exec(cmd.cmd, cmd.args, function() {
    execCmdList(list);
  });
}

function newProject(name, dest) {
  var projectPath = _getProjectPath(name);
  
  if (!_projectExists(projectPath)) {
    console.error('Project doesn\'t exist!');
    process.exit(1);
  }

  try {
    wrench.copyDirSyncRecursive(
      projectPath,
      dest,
      {
        whitelist: true,
        exclude: function(filename, dir) {
          return exclude.some(function(filter) {
            return filter === filename;
          });
        }
      }
    );

    _afterCreate(dest);
    console.log('Successfully created ' + name + ' project!');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

function scanProject(name, src) {
  var projectPath = _getProjectPath(name);

  if (_projectExists(projectPath)) {
    console.log('Project already exists');
    process.exit(0);
  }

  try {
    wrench.copyDirSyncRecursive(
      src,
      projectPath,
      {
        whitelist: true,
        exclude: function(filename, dir) {
          return exclude.some(function(filter) {
            return filter === filename;
          });
        }
      }
    );  

    console.log('Successfully scanned ' + name + ' project!');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

function removeProject(name) {
  var projectPath = _getProjectPath(name);
  if (!_projectExists(projectPath)) {
    console.error(name + ' project doesn\'t exist!');
    process.exit(1);
  }

  try {
    wrench.rmdirSyncRecursive(projectPath);
    console.log('Successfully removed ' + name + ' project!');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

function printHelp() {
  console.log(
    'Usage: creator [-n | -s] [project_name] [destination]\n',
    '   -n, --new         new project\n',
    '   -s, --scan        scan project\n',
    '   -d, --delete      delete project'
  );
}

if (argv.n || argv.new) newProject.apply(null, argv._);
else if (argv.s || argv.scan) scanProject.apply(null, argv._);
else if (argv.d || argv.delete) removeProject.apply(null, argv._);
else printHelp();

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
    'npm-install',
    'npm-init'
  ]
});

/*
 * Constants
 *
 * These are constants for things like file or dir names.
 * If there would ever be a need for a quick change.
 */
var CONFIG_FILE_NAME = '.starterrc';
var PROJECTS_DIR_NAME = 'projects';

var defaultExclude = [
  'node_modules',
  '.git',
  'bower_components',
  'npm-debug.log',
  CONFIG_FILE_NAME
];
var defaultCommands = {
  'git': { cmd: 'git', args: ['init'] },
  'npm-install': { cmd: 'npm', args: ['install'] },
  'npm-init': { cmd: 'npm', args: ['init'] }
};

function _hasConfigFile(project) {
  var pathname = path.join(
    __dirname,
    PROJECTS_DIR_NAME, 
    project,
    CONFIG_FILE_NAME
  );

  try {
    var stats = fs.lstatSync(pathname);
    return stats.isFile();
  } catch (error) {
    console.error(error);
    return false;
  }
}

function _getProjectPath(name) {
  return path.join(__dirname, PROJECTS_DIR_NAME, name);
}

function _projectExists(pathname) {
  try {
    var stats = fs.lstatSync(pathname);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

function _getCommandsList(config) {
  if (config.commands) return config.commands;

  return Object.keys(defaultCommands)
    .filter(function(command) {
      return argv[command];
    })
    .map(function(command) {
      return defaultCommands[command];
    });
}

function _afterCreate(dest, commandsList) {
  process.chdir(path.resolve(process.cwd(), dest));
  execCmdList(commandsList);
}

function _createExcludeFilter(toFilter) {
  return function(filename, dir) {
    return toFilter.some(function(filter) {
      return filter === filename;
    });
  };
}

function _getExcludeFilter(config) {
  var toFilter = defaultExclude;
  
  if (config.exclude) {
    toFilter = config.exclude;
    toFilter.push(CONFIG_FILE_NAME);
  }
  
  return _createExcludeFilter(toFilter);
}

function _readJSONFile(filePath) {
  var pathname = path.resolve(__dirname, filePath);
  return JSON.parse(fs.readFileSync(pathname));
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

  if (_hasConfigFile(name)) {
    var config = _readJSONFile(
      path.join(__dirname, PROJECTS_DIR_NAME, name, CONFIG_FILE_NAME)
    );

    var excludeFilter = _getExcludeFilter(config);
    var commands = _getCommandsList(config);
}

  try {
    wrench.copyDirSyncRecursive(
      projectPath,
      dest,
      {
        whitelist: true,
        exclude: excludeFilter
      }
    );

    _afterCreate(dest, commands);
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
          return defaultExclude.some(function(filter) {
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

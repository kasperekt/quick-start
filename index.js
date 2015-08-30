var path = require('path');
var fs = require('fs');
var wrench = require('wrench');
var argv = require('minimist')(process.argv.slice(2), {
  boolean: [
    'c', 'create',
    's', 'scan',
    'd', 'delete'
  ]
});

var exclude = ['node_modules', '.git', 'bower_components', 'npm-debug.log'];

function getProjectPath(name) {
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

function createProject(name, dest) {
  var projectPath = getProjectPath(name);
  
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

    console.log('Successfully created ' + name + ' project!');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

function scanProject(name, src) {
  var projectPath = getProjectPath(name);

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
  var projectPath = getProjectPath(name);
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
    'Usage: creator [-c | -s] [project_name] [destination]\n',
    '   -c, --create      create project\n',
    '   -s, --scan        scan project'
  );
}

if (argv.c || argv.create) createProject.apply(null, argv._);
else if (argv.s || argv.scan) scanProject.apply(null, argv._);
else if (argv.d || argv.delete) removeProject.apply(null, argv._);
else printHelp();

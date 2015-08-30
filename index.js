var path = require('path');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2), {
  boolean: ['c', 'create']
});
var wrench = require('wrench');

function successCb() {
  console.log('Good!');
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
  var projectPath = path.join(__dirname, 'projects', name);
  
  if (!_projectExists(projectPath)) {
    console.error('Project doesn\'t exist!');
    return;
  }

  wrench.copyDirRecursive(
    projectPath,
    dest,
    {
      forceDelete: true
    },
    successCb
  );  
}

function scanProject(name, dest) {
  console.log('Scan -- name: %s, dest: %s', name, dest);
}

function printHelp() {
  console.log(
    'Usage: creator [-c | -s] [project_name] [destination]\n',
    '   -c, --create      create project\n',
    '   -s, --scan        scan project'
  );
}

if (argv.c || argv.create) createProject.apply(null, argv._);
else if (argv.s || argv.scan) scanProject().apply(null, argv._);
else printHelp();

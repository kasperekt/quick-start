const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const glob = require('glob');
const wrench = require('wrench');
const exec = require('./shell').exec;
const argv = require('minimist')(process.argv.slice(2), {
  boolean: [
    'n', 'new',
    's', 'scan',
    'd', 'delete',
    'v', 'version',
    'l', 'list',
  ],
});

/*
 * Constants
 *
 * These are constants for things like file or dir names.
 * If there would ever be a need for a quick change.
 */
const CONFIG_FILE_NAME = '.quickstartrc';
const PROJECTS_DIR_NAME = 'projects';

/*
 * Default exclude filter files
 *
 * These are most popular files to exlude,
 * while creating or scanning new project.
 */
const defaultExclude = [
  'node_modules',
  '.git',
  'bower_components',
  'npm-debug.log',
  CONFIG_FILE_NAME,
];

const defaultScanExclude = [
  'node_modules',
  '.git',
  'bower_components',
  'npm-debug.log',
];

/*
 * Returns config path based on project name
 */
function _getConfigPath(project) {
  return path.join(__dirname, PROJECTS_DIR_NAME, project, CONFIG_FILE_NAME);
}

/*
 * Executes list of commands
 */
function execCmdList(list) {
  if (list.length === 0) return;

  const cmd = list.shift();
  exec(cmd.cmd, cmd.args, () => {
    execCmdList(list);
  });
}

/*
 * Checks if project has config file added
 */
function _hasConfigFile(pathname) {
  try {
    const stats = fs.lstatSync(pathname);
    return stats.isFile();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

/*
 * Gets project path based on its name
 */
function _getProjectPath(name) {
  return path.join(__dirname, PROJECTS_DIR_NAME, name);
}

/*
 * Checks if project with given name exists
 */
function _projectExists(pathname) {
  try {
    const stats = fs.lstatSync(pathname);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

/*
 * Returns commands list if have one
 */
function _getCommandsList(config) {
  if (config.commands) {
    return config.commands;
  }
}

/*
 * Executes "after install" commands after creating project
 */
function _afterCreate(dest, commandsList) {
  process.chdir(path.resolve(process.cwd(), dest));
  execCmdList(commandsList);
}

/*
 * Returns function which serves as filter.
 * Pass array of filenames to exclude them.
 *
 * Supports wildcards
 */
function _createExcludeFilter(projectName, toFilter) {
  return (filename, dir) => {
    const projectPath = _getProjectPath(projectName);

    return toFilter.some((wildcardFilter) => {
      const files = glob.sync(wildcardFilter, {
        cwd: projectPath,
        root: projectPath,
      });

      return files.some((filter) => {
        const filterPath = path.resolve(projectPath, filter);
        const filePath = path.resolve(dir, filename);

        return filterPath === filePath;
      });
    });
  };
}

/*
 * Returns scan files exclude filter
 */
function _getScanExcludeFilter(projectName, config) {
  const toFilter = config.scanExclude || defaultScanExclude;
  return _createExcludeFilter(projectName, toFilter);
}

/*
 * Returns files exclude filter
 */
function _getExcludeFilter(projectName, config) {
  let toFilter = defaultExclude;

  if (config.exclude) {
    toFilter = config.exclude;
    toFilter.push(CONFIG_FILE_NAME);
  }

  return _createExcludeFilter(projectName, toFilter);
}

/*
 * Simple JSON file reader
 */
function _readJSONFile(filePath) {
  const pathname = path.resolve(__dirname, filePath);
  return JSON.parse(fs.readFileSync(pathname));
}

/*
 * Creates new project
 */
function newProject(name, dest) {
  const projectPath = _getProjectPath(name);

  if (!_projectExists(projectPath)) {
    console.error('Project doesn\'t exist!');
    process.exit(1);
  }

  const configPath = _getConfigPath(name);
  const config = _hasConfigFile(configPath) ?
    _readJSONFile(configPath) :
    {};

  const excludeFilter = _getExcludeFilter(name, config);
  const commands = _getCommandsList(config);

  try {
    wrench.copyDirSyncRecursive(
      projectPath,
      dest,
      {
        whitelist: true,
        exclude: excludeFilter,
      }
    );

    _afterCreate(dest, commands);
    console.log(`Successfully created ${name} project!`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

/*
 * Scans project and saves it in `projects/` directory
 */
function scanProject(name, src) {
  const projectPath = _getProjectPath(name);

  if (_projectExists(projectPath)) {
    console.log('Project already exists');
    process.exit(0);
  }

  const configPath = path.join(process.cwd(), src, CONFIG_FILE_NAME);
  const config = _hasConfigFile(configPath) ?
    _readJSONFile(configPath) :
    {};

  const excludeFilter = _getScanExcludeFilter(name, config);

  try {
    mkdirp(path.join(__dirname, PROJECTS_DIR_NAME));
    wrench.copyDirSyncRecursive(
      src,
      projectPath,
      {
        whitelist: true,
        exclude: excludeFilter,
      }
    );

    console.log(`Successfully scanned ${name} project!`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

/*
 * Checks if project with given name exists, then it removes it
 */
function removeProject(name) {
  const projectPath = _getProjectPath(name);
  if (!_projectExists(projectPath)) {
    console.error(`${name} project doesn't exist!`);
    process.exit(1);
  }

  try {
    wrench.rmdirSyncRecursive(projectPath);
    console.log(`Successfully removed ${name} project!`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

/*
 * Print help message in command line
 */
function printHelp() {
  console.log(
    'Usage: quick-start [-n | -s] [project_name] [destination]\n',
    '   -n, --new         new project\n',
    '   -s, --scan        scan project\n',
    '   -l, --list        show the list of your projects\n',
    '   -d, --delete      delete project\n\n'
  );
}

/*
 * Prints version info
 */
function printVersion() {
  const pkg = require('./package.json');
  console.log(pkg.version);
}

/*
 * Prints project list, only with it's names
 */
function printProjectsList() {
  try {
    const projects = fs.readdirSync(path.join(__dirname, 'projects'));

    projects
      .filter((project) => {
        const pathname = _getProjectPath(project);
        return fs.lstatSync(pathname).isDirectory();
      })
      .forEach((project) => {
        console.log(`- ${project}`);
      });
  } catch (e) {
    console.log('You haven\'t created any project');
    process.exit(0);
  }
}

/*
 * Executes command based on passed flags.
 * Otherwise, it prints help message.
 */
if (argv.n || argv.new) newProject.apply(null, argv._);
else if (argv.s || argv.scan) scanProject.apply(null, argv._);
else if (argv.d || argv.delete) removeProject.apply(null, argv._);
else if (argv.v || argv.version) printVersion.apply(null, argv._);
else if (argv.l || argv.list) printProjectsList.apply(null, argv._);
else printHelp();

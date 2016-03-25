import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import wrench from 'wrench';
import { execCmdList, getCommandsList } from './commands';
import { getExcludeFilter, getScanExcludeFilter } from './filters';
import {
  getProjectPath,
  getConfigPath,
  hasConfigFile,
  projectExists,
} from './project-utils';
import {
  CONFIG_FILE_NAME,
  PROJECTS_DIR_NAME,
  SUCCESS_EXIT_CODE,
  FAILURE_EXIT_CODE,
} from './constants';

/*
 * Executes "after install" commands after creating project
 */
function _afterCreate(dest, commandsList) {
  process.chdir(path.resolve(process.cwd(), dest));
  execCmdList(commandsList);
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
export function newProject(name, dest) {
  const projectPath = getProjectPath(name);

  if (!projectExists(projectPath)) {
    console.error('Project doesn\'t exist!');
    process.exit(FAILURE_EXIT_CODE);
  }

  const configPath = getConfigPath(name);
  const config = hasConfigFile(configPath) ?
    _readJSONFile(configPath) :
    {};

  const excludeFilter = getExcludeFilter(name, config);
  const commands = getCommandsList(config);

  try {
    wrench.copyDirSyncRecursive(
      projectPath,
      dest,
      { whitelist: true, exclude: excludeFilter }
    );

    _afterCreate(dest, commands);
    console.log(`Successfully created ${name} project!`);
  } catch (error) {
    console.error('Creating new project error: ', error);
    process.exit(FAILURE_EXIT_CODE);
  }
}

/*
 * Scans project and saves it in `projects/` directory
 */
export function scanProject(name, src) {
  const projectPath = getProjectPath(name);

  if (projectExists(projectPath)) {
    console.log('Project already exists');
    process.exit(SUCCESS_EXIT_CODE);
  }

  const configPath = path.join(process.cwd(), src, CONFIG_FILE_NAME);
  const config = hasConfigFile(configPath) ?
    _readJSONFile(configPath) :
    {};

  const excludeFilter = getScanExcludeFilter(name, config);

  try {
    mkdirp(path.join(__dirname, PROJECTS_DIR_NAME));
    wrench.copyDirSyncRecursive(
      src,
      projectPath,
      { whitelist: true, exclude: excludeFilter }
    );

    console.log(`Successfully scanned ${name} project!`);
  } catch (error) {
    process.exit(FAILURE_EXIT_CODE);
  }
}

/*
 * Checks if project with given name exists, then it removes it
 */
export function removeProject(name) {
  const projectPath = getProjectPath(name);
  if (!projectExists(projectPath)) {
    console.error(`${name} project doesn't exist!`);
    process.exit(FAILURE_EXIT_CODE);
  }

  try {
    wrench.rmdirSyncRecursive(projectPath);
    console.log(`Successfully removed ${name} project!`);
  } catch (error) {
    console.error(error);
    process.exit(FAILURE_EXIT_CODE);
  }
}

/*
 * Print help message in command line
 */
export function printHelp() {
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
export function printVersion() {
  const pkg = require('./package.json');
  console.log(pkg.version);
}

/*
 * Prints project list, only with it's names
 */
export function printProjectsList() {
  try {
    const projects = fs.readdirSync(path.join(__dirname, 'projects'));

    projects
      .filter((project) => {
        const pathname = getProjectPath(project);
        return fs.lstatSync(pathname).isDirectory();
      })
      .forEach((project) => {
        console.log(`- ${project}`);
      });
  } catch (e) {
    console.log('You haven\'t created any project');
    process.exit(SUCCESS_EXIT_CODE);
  }
}

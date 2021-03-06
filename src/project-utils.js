import fs from 'fs';
import path from 'path';
import homedir from 'homedir';
import {
  PROJECTS_DIR_NAME,
  CONFIG_FILE_NAME,
  MODULE_DIR_NAME,
} from './constants';

/**
 * Returns path where projects is stored
 */
export function getProjectPath(name) {
  return path.join(homedir(), MODULE_DIR_NAME, PROJECTS_DIR_NAME, name);
}

/**
 * Returns project configuration file path
 */
export function getConfigPath(project) {
  return path.join(getProjectPath(project), CONFIG_FILE_NAME);
}

/*
 * Checks if project has config file added
 */
export function hasConfigFile(pathname) {
  try {
    const stats = fs.lstatSync(pathname);
    return stats.isFile();
  } catch (error) {
    return false;
  }
}

/*
 * Checks if project with given name exists
 */
export function projectExists(pathname) {
  try {
    const stats = fs.lstatSync(pathname);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

/**
 * Exit codes
 */
export const SUCCESS_EXIT_CODE = 0;
export const FAILURE_EXIT_CODE = 1;

/**
 * Configuration file name
 */
export const CONFIG_FILE_NAME = '.quickstartrc';

/**
 * Projects directory name
 */
export const PROJECTS_DIR_NAME = 'projects';

/*
 * Defualt files to exclude while creating new project
 */
export const DEFAULT_EXCLUDE = [
  'node_modules',
  '.git',
  'bower_components',
  'npm-debug.log',
  CONFIG_FILE_NAME,
];

/**
 * Default list of files to exclude on scanning
 */
export const DEFAULT_SCAN_EXCLUDE = [
  'node_modules',
  '.git',
  'bower_components',
  'npm-debug.log',
];

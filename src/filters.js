import path from 'path';
import glob from 'glob';
import { getProjectPath } from './project-utils';
import {
  DEFAULT_SCAN_EXCLUDE,
  DEFAULT_EXCLUDE,
  CONFIG_FILE_NAME,
} from './constants';

/*
 * Returns function which serves as filter.
 * Pass array of filenames to exclude them.
 *
 * Supports wildcards
 */
export function createExcludeFilter(projectName, toFilter) {
  return (filename, dir) => {
    const projectPath = getProjectPath(projectName);

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
export function getScanExcludeFilter(projectName, config) {
  const toFilter = config.scanExclude || DEFAULT_SCAN_EXCLUDE;
  return createExcludeFilter(projectName, toFilter);
}

/*
 * Returns files exclude filter
 */
export function getExcludeFilter(projectName, config) {
  let toFilter = DEFAULT_EXCLUDE;

  if (config.exclude) {
    toFilter = config.exclude;
    toFilter.push(CONFIG_FILE_NAME);
  }

  return createExcludeFilter(projectName, toFilter);
}

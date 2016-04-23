jest.mock('homedir');

import path from 'path';
import { TEST_ENV_DIR } from './test-constants';
import { newProject } from '../src/index';
import { dirExists, fileExists, filesDontExist } from './test-utils';

describe('New project creation test', () => {
  let consoleLog;
  let consoleError;

  beforeAll(() => {
    // Silence console methods
    consoleLog = console.log;
    console.log = () => {};
    consoleError = console.error;
    console.error = () => {};
  });

  afterAll(() => {
    // Recover console methods
    console.log = consoleLog;
    console.error = consoleError;
  });

  it('should create new project', () => {
    const destination = path.resolve(TEST_ENV_DIR, 'newProjectTest');
    newProject('project-with-config', destination);

    expect(dirExists(destination)).toBe(true);
  });

  it('should copy files', () => {
    const destination = path.resolve(TEST_ENV_DIR, 'copyFilesTest');
    newProject('project-with-file', destination);

    const filePath = path.resolve(destination, 'index.html');
    expect(fileExists(filePath)).toBe(true);
  });

  it('should emit excluded files', () => {
    const destination = path.resolve(TEST_ENV_DIR, 'excludeFileTest');
    newProject('project-with-ignore', destination);

    const existingFilePath = path.resolve(destination, 'index.html');
    expect(fileExists(existingFilePath)).toBe(true);

    expect(filesDontExist(
      destination,
      'a.js',
      'b.js',
      'exclude-me.txt',
      'src/c.js'
    )).toBe(true);
  });

  it('should exit process when there is no such project', () => {
    const processExit = process.exit;
    process.exit = jest.fn();
    const destination = path.resolve(TEST_ENV_DIR, 'doesnt-matter');
    newProject('project-doesnt-exist', destination);
    expect(process.exit).toBeCalled();
    process.exit = processExit;
  });
});

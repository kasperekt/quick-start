jest.mock('homedir');

import path from 'path';
import { TEST_ENV_DIR } from './test-constants';
import { newProject } from '../src/index';
import { dirExists, fileExists } from './test-utils';

describe('Main functions test', () => {
  beforeEach(() => {
    // Silence all console logs
    console.log = () => {};
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
    const nonExistantFilePath = path.resolve(destination, 'exclude-me.txt');
    expect(fileExists(existingFilePath)).toBe(true);
    expect(fileExists(nonExistantFilePath)).toBe(false);
  });
});

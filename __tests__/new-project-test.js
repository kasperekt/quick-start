jest.mock('homedir');

import path from 'path';
import fs from 'fs';
import { TEST_ENV_DIR } from './test-constants';
import { newProject } from '../src/index';

function dirExists(dir) {
  const stat = fs.statSync(dir);
  return stat.isDirectory();
}

function fileExists(file) {
  const stat = fs.statSync(file);
  return stat.isFile();
}

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
});

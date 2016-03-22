jest.mock('homedir');

import path from 'path';
import fs from 'fs';
import { TEST_ENV_DIR } from './test-constants';
import { newProject } from '../src/index';

function dirExists(dir) {
  const stat = fs.statSync(dir);
  return stat.isDirectory();
}

describe('Main functions test', () => {
  it('should create new project', () => {
    const destination = path.resolve(TEST_ENV_DIR, 'newProjectTest');
    newProject('project-with-config', destination);

    expect(dirExists(destination)).toBe(true);
  });
});

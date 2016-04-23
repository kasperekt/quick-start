jest.mock('homedir');

import path from 'path';
import { TEST_ENV_DIR } from './test-constants';
import { PROJECTS_DIR_NAME } from '../src/constants.js';
import { removeProject } from '../src/index';
import { dirExists } from './test-utils';

describe('Removing project test', () => {
  const consoleLog = console.log;
  const consoleError = console.error;

  beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterAll(() => {
    console.log = consoleLog;
    console.error = consoleError;
  });

  it('should remove project', () => {
    const projectToRemove = 'project-to-remove';
    const projectPath = path.resolve(
      TEST_ENV_DIR,
      '.quickstart',
      PROJECTS_DIR_NAME,
      projectToRemove
    );
    removeProject(projectToRemove);
    expect(dirExists(projectPath)).toBe(false);
  });
});

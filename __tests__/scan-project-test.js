jest.mock('homedir');

import path from 'path';
import { scanProject } from '../src/index';
import { dirExists } from './test-utils';
import { TEST_ENV_DIR } from './test-constants';

describe('Scan project', () => {
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

  it('should save scanned project in right place', () => {
    const scannedProjectName = 'scanned-project-with-config';
    const projectSource = path.resolve(TEST_ENV_DIR, 'projects-to-scan', 'project-with-config');
    scanProject(scannedProjectName, projectSource);
    const scannedProjectPath = path.resolve(
      TEST_ENV_DIR,
      '.quickstart',
      'projects',
      scannedProjectName
    );

    expect(dirExists(scannedProjectPath)).toBe(true);
  });
});

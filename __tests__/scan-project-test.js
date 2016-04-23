jest.mock('homedir');

import path from 'path';
import { scanProject } from '../src/index';
import { dirExists } from './test-utils';
import { TEST_ENV_DIR } from './test-constants';

describe('Scan project', () => {
  const consoleLog = console.log;
  const consoleError = console.error;
  const processExit = process.exit;

  beforeAll(() => {
    // Silence console methods
    console.log = () => {};
    console.error = () => {};
    process.exit = jest.fn();
  });

  afterAll(() => {
    // Recover console methods
    console.log = consoleLog;
    console.error = consoleError;
    process.exit = processExit;
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

  it('should not save ignored files in project dir', () => {
    const scannedProjectName = 'scanned-project-with-ignore';
    const projectSource = path.resolve(
      TEST_ENV_DIR,
      'projects-to-scan',
      'project-with-ignore'
    );
    scanProject(scannedProjectName, projectSource);
    const scannedProjectPath = path.resolve(
      TEST_ENV_DIR,
      '.quickstart',
      'projects',
      scannedProjectName
    );

    expect(dirExists(scannedProjectPath)).toBe(true);
  });

  it('should let scan directory without config file', () => {
    const scannedProjectName = 'scanned-project-without-config';
    const projectSource = path.resolve(
      TEST_ENV_DIR,
      'projects-to-scan',
      'project-without-config'
    );
    scanProject(scannedProjectName, projectSource);
    const scannedProjectPath = path.resolve(
      TEST_ENV_DIR,
      '.quickstart',
      'projects',
      scannedProjectName
    );

    expect(dirExists(scannedProjectPath)).toBe(true);
  });

  it('should not allow to scan project with existing name', () => {
    const existingProjectName = 'project-with-config';
    const projectSource = path.resolve(
      TEST_ENV_DIR,
      'projects-to-scan',
      'existing-project'
    );
    scanProject(existingProjectName, projectSource);
    expect(process.exit).toBeCalled();
  });
});

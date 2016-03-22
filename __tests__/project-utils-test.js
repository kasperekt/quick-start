jest.mock('homedir');
import path from 'path';
import {
  getConfigPath,
  getProjectPath,
  hasConfigFile,
  projectExists,
} from '../src/project-utils';
import { CONFIG_FILE_NAME, PROJECTS_DIR_NAME } from '../src/constants';
import { TEST_ENV_DIR } from './test-constants';

describe('Project utils tests', () => {
  it('should return proper project path', () => {
    const project = 'example-project';
    const projectPath = path.resolve(
      TEST_ENV_DIR,
      '.quickstart',
      PROJECTS_DIR_NAME,
      project
    );

    expect(getProjectPath(project)).toBe(projectPath);
  });

  it('should return proper config path', () => {
    const project = 'example-project';
    const configPath = path.resolve(
      TEST_ENV_DIR,
      '.quickstart',
      PROJECTS_DIR_NAME,
      project,
      CONFIG_FILE_NAME
    );

    expect(getConfigPath(project)).toBe(configPath);
  });

  it('should check if project has config file', () => {
    const projectsPath = path.resolve(TEST_ENV_DIR, '.quickstart', 'projects');
    const projectWithConfig = path.resolve(
      projectsPath,
      'project-with-config',
      '.quickstartrc'
    );
    const projectWithoutConfig = path.resolve(
      projectsPath,
      'project-without-config',
      '.quickstartrc'
    );

    expect(hasConfigFile(projectWithConfig)).toBe(true);
    expect(hasConfigFile(projectWithoutConfig)).toBe(false);
  });

  it('should check if project exists', () => {
    const projectsPath = path.resolve(TEST_ENV_DIR, '.quickstart', 'projects');
    const existingProject = path.resolve(
      projectsPath,
      'project-with-config'
    );
    const fakeProject = path.resolve(
      projectsPath,
      'fake-project'
    );

    expect(projectExists(existingProject)).toBe(true);
    expect(projectExists(fakeProject)).toBe(false);
  });
});

jest.mock('homedir');
import path from 'path';
import { getConfigPath, getProjectPath } from '../src/project-utils';

describe('Project utils tests', () => {
  it('should return proper project path', () => {
    const project = 'example-project';
    const projectPath = path.resolve(
      __dirname,
      'env',
      '.quickstart/projects',
      project,
      '.quickstartrc'
    );

    expect(getProjectPath(project)).toBe(projectPath);
  });

  it('should return proper config path', () => {
    const project = 'example-project';
    const configPath = path.resolve(
      __dirname,
      'env',
      '.quickstart/projects',
      project,
      '.quickstartrc'
    );

    expect(getConfigPath(project)).toBe(configPath);
  });
});

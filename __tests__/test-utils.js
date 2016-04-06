import fs from 'fs';

export function dirExists(dir) {
  const stat = fs.statSync(dir);
  return stat.isDirectory();
}

export function fileExists(file) {
  try {
    const stat = fs.statSync(file);
    return stat.isFile();
  } catch (error) {
    return false;
  }
}

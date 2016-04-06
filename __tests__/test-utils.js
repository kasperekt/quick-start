import fs from 'fs';
import path from 'path';

export function dirExists(dir) {
  const stat = fs.statSync(dir);
  return stat.isDirectory();
}

export function fileExists(file) {
  try {
    const stat = fs.statSync(file);
    console.log(`${file} exists? [${stat.isFile()}]`);
    return stat.isFile();
  } catch (error) {
    return false;
  }
}

export function filesDontExist(dir, ...files) {
  return files
    .map(file => path.resolve(dir, file))
    .every(file => !fileExists(file));
}

const { readdirSync, writeFileSync, existsSync, lstatSync, unlinkSync, rmdirSync } = require('fs');
const { resolve, join } = require('path');

function getDirectories(source) {
  return readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

function deleteFolderRecursive(path) {
  if (existsSync(path)) {
    readdirSync(path).forEach((file, index) => {
      const curPath = join(path, file);
      if (lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        unlinkSync(curPath);
      }
    });

    rmdirSync(path);
  }
};

const modules = getDirectories(resolve(__dirname, '../projects/ng-utils'));

for (const mod of modules) {
  deleteFolderRecursive(resolve(__dirname, `../dist/ng-utils/${mod}/${mod}`));
  writeFileSync(resolve(__dirname, `../dist/ng-utils/${mod}/${mod}.entry.d.ts`), `export * from './index';`);
}

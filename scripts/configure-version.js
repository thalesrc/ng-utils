const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const [,, version] = process.argv;

// ----------------------------------------

const initialPackage = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8'));
const versionPackage = JSON.parse(readFileSync(resolve(__dirname, `../package.${version}.json`), 'utf8'));

const modifiedPackage = {
  ...initialPackage,
  ...versionPackage,
  dependencies: {
    ...initialPackage.dependencies,
    ...versionPackage.dependencies
  },
  devDependencies: {
    ...initialPackage.devDependencies,
    ...versionPackage.devDependencies
  }
};

writeFileSync(resolve(__dirname, '../package.json'), JSON.stringify(modifiedPackage), 'utf8');

// ----------------------------------------

const initialLibraryPackage = JSON.parse(readFileSync(resolve(__dirname, '../projects/ng-utils/package.json'), 'utf8'));
const versionLibraryPackage = JSON.parse(readFileSync(resolve(__dirname, `../projects/ng-utils/package.${version}.json`), 'utf8'));

const modifiedVersionPackage = {
  ...initialLibraryPackage,
  ...versionLibraryPackage,
  dependencies: {
    ...initialLibraryPackage.dependencies,
    ...versionLibraryPackage.dependencies
  },
  peerDependencies: {
    ...initialLibraryPackage.peerDependencies,
    ...versionLibraryPackage.peerDependencies
  }
};

writeFileSync(resolve(__dirname, '../projects/ng-utils/package.json'), JSON.stringify(modifiedVersionPackage), 'utf8');

const { exec } = require("child_process");

let { PACKAGE_VERSION } = process.env;
const [,, buildVersion] = process.argv;

// if (!PACKAGE_VERSION || !buildVersion) {
//   throw 'Version is not defined';
// }

if (!PACKAGE_VERSION) {
  PACKAGE_VERSION = '3.4.5';
}

const [major, minor, patch] = PACKAGE_VERSION.split('.');

const version = `${+/\d+/.exec(buildVersion)[0] * 10 + +major}.${minor}.${patch}`;

exec(`cd ./projects/ng-utils && npm version ${version} --no-git-tag-version`);

// console.log(`thalesrc-ng-utils-${version}.tgz`);
console.log(JSON.stringify(process.env) + ':::' + JSON.stringify(process.argv));

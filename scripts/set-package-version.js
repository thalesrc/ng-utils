const { exec } = require("child_process");

const { PACKAGE_VERSION } = process.env;
const [,, buildVersion] = process.argv;

if (!PACKAGE_VERSION || !buildVersion) {
  throw 'Version is not defined';
}

const [major, minor, patch] = PACKAGE_VERSION.split('.');

const version = `${+/\d+/.exec(buildVersion)[0] * 10 + +major}.${minor}.${patch}`;

exec(`cd ./projects/ng-utils && npm version ${version} --no-git-tag-version`);

console.log(`thalesrc-ng-utils-${version}.tgz`);

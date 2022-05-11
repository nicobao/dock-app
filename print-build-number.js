const fs = require('fs');
const path = require('path');
const bgr = require('build-gradle-reader');

const data = fs
  .readFileSync(path.resolve('./android/app/build.gradle'))
  .toString();

var representation = bgr(data);

const config = representation.android.defaultConfig;

console.log(`v${config.versionName} build-${config.versionCode}`);

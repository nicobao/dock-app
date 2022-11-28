const fs = require('fs');
const path = require('path');
const appConfig = require('../app.json');
const OLD_PACKAGE_NAME = 'com.dockapp';
const NEW_PACKAGE_NAME = appConfig.packageId;


console.log('Patch android package name');
console.log('NEW_PACKAGE_NAME: ' + NEW_PACKAGE_NAME);
const updatePackageId = (sourceFilePath, destinationFilePath) => {
  const oldFileContent = fs.readFileSync(sourceFilePath, 'ascii');
  const newFileContent = oldFileContent.replace(
    new RegExp(OLD_PACKAGE_NAME, 'g'),
    NEW_PACKAGE_NAME,
  );
  fs.writeFileSync(destinationFilePath, newFileContent);
};

if (OLD_PACKAGE_NAME !== NEW_PACKAGE_NAME) {
  const environments = ['main', 'debug'];

  environments.forEach(envVar => {
    const environmentBasePath = path.join('android', 'app', 'src', envVar);

    const javaBaseDirectory = path.join(environmentBasePath, 'java', path.sep);

    const newPackageDirectory = path.join(...NEW_PACKAGE_NAME.split('.'));
    const oldPackageDirectory = path.join(...OLD_PACKAGE_NAME.split('.'));

    const newFullPath = javaBaseDirectory + newPackageDirectory;
    const oldFullPath = javaBaseDirectory + oldPackageDirectory;

    fs.mkdirSync(newFullPath, {recursive: true});

    const files = fs.readdirSync(oldFullPath);

    for (const file of files) {
      const filePath = path.join(oldFullPath, file);
      console.log(`File: ${filePath}`)
      const oldFileContent = fs.readFileSync(filePath,
        'ascii',
      );
      const pattern = `package ${OLD_PACKAGE_NAME};`;
      const newFileContent = oldFileContent.replace(
        new RegExp(pattern, 'g'),
        `package ${NEW_PACKAGE_NAME};`,
      );
      fs.writeFileSync(path.join(newFullPath, file), newFileContent);
    }
    fs.rmdirSync(oldFullPath, {recursive: true});

    updatePackageId(
      path.join(environmentBasePath, 'AndroidManifest.xml'),
      path.join(environmentBasePath, 'AndroidManifest.xml'),
    );
    updatePackageId(
      path.join('android', 'app', 'build.gradle'),
      path.join('android', 'app', 'build.gradle'),
    );
  });
}

const syncDirectory = require('sync-directory');
const path = require('path');

const sdkRoot = path.resolve(__dirname, '../../wallet-sdk');
const appModules = path.resolve(__dirname, '../node_modules/@docknetwork/');

function syncPackage(packageName) {
  return syncDirectory.sync(
    path.resolve(sdkRoot, `./packages/${packageName}`),
    path.resolve(appModules, `./wallet-sdk-${packageName}`),
    {
      afterEachSync(props) {
        console.log(props);
      },
      watch: true,
      exclude: [/node_modules/],
    },
  );
}

syncPackage('core');
syncPackage('react-native');
syncPackage('credentials');

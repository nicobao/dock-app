# dock-app

## Project setup
```bash
yarn install
cd ios
pod install
```

## Starting the app
To start the app you need 2 separate terminal tabs.

```bash
# start the metro server
yarn start


# start the ios emulator
yarn ios

# for android you need to run
yarn android

```

## Wallet sdk
To build using the local wallet-sdk you need to clone the wallet-sdk repo to the parent dir of the app. It's required in order to copy the sdk files and run the file watcher. Note that symlinks are not supported on react-native.

The structure should look like:
- root-folder:
    - dock-app
    - wallet-sdk


```bash
# clone the wallet-sdk repo to the proper folder
git clone git@github.com:docknetwork/react-native-sdk.git

# run the script to sync the files and watch for changes

yarn sync-sdk
```

## Wallet sdk bundle
The wallet sdk uses a json-rpc client to connect to a webview. Its rquired to handle webassembly properly.

In case you update any service in the wallet-sdk a new js bundle will need to be generated.

For doing that you can runnin the following script:

```bash
# from the dock-app project
node  ../wallet-sdk/packages/react-native/bundler/build-and-copy.js

# it will create a fresh js bundle and copy the assets to the app
# to test the new bundle you will need to restart the app

# for ios
yarn ios
# or for android
yarn android
```

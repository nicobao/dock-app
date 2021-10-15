# dock-app

## Project setup
```
yarn install
cd ios
pod install
```


## Webview
This project is using a webview to handle polkadot-js and webassembly
You need to clone the repository: https://github.com/docknetwork/react-native-sdk

Webview server setup:

```
yarn install
```

## Starting the app
To start the app you need 3 separate terminal tabs
```
# 1: start the metro server
yarn start


# 2: start the webview server
# In the https://github.com/docknetwork/react-native-sdk project
yarn start


# 3: start the ios emulator
yarn ios


```


## Create new build tag

```
# Run the script to increment the app build
yarn increment_version

# Commit your updates
git add .
git commit -S -m "update build number"

# Create the build tag
git tag -a v0.1-build-42 -m "build 42"

# Push the tag
git push origin v0.1-build-42

# Check github actions, it will trigger the release for iOS and Android
https://github.com/docknetwork/dock-app/actions

```
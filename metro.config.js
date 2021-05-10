/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');
const { getDefaultConfig } = require('metro-config');
// const exclusionList = require('metro-config/src/defaults/exclusionList');

const extraNodeModules = require('node-libs-react-native');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
      babelTransformerPath: require.resolve('react-native-react-bridge/lib/plugin'),
    },
    resolver: {
      // blacklistRE: exclusionList([/rn-rpc-webview\/source\/.*/]),
      resolverMainFields: ["react-native", "main"],
      extraNodeModules: {
        ...extraNodeModules,
        vm: require.resolve('vm-browserify'),
        mrklt: path.resolve(__dirname, "./src/mrklt.js"),
        'credentials-context': path.resolve(__dirname, "./rn-packages/credentials-context.js"),
        'security-context': path.resolve(__dirname, "./rn-packages/security-context.js"),
      }
    }
  };
})

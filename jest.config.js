const config = {
  preset: 'react-native',
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 25,
      lines: 25,
      statements: 25,
    }
  },
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  setupFiles: ['<rootDir>/test/testSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(@polkadot|@babel|@react-native|@docknetwork|react-native|rn-fetch|redux-persist-filesystem|@react-navigation|@react-native-community|react-navigation|react-navigation-redux-helpers|@sentry))',
  ],
  transform: {
    '^.+\\.(ts|js)$':
      '<rootDir>/node_modules/react-native/jest/preprocessor.js',
    '^.+\\.svg$': '<rootDir>/test/svg-transformer.js',
  },
  moduleNameMapper: {
    '^src(.*)$': '<rootDir>/src$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  collectCoverage: false,
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx}'],
};

module.exports = config;

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Optimize transformer settings
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_classnames: false,
    keep_fnames: false,
    mangle: {
      keep_classnames: false,
      keep_fnames: false,
    },
  },
};

// Optimize resolver settings
config.resolver = {
  ...config.resolver,
  resolverMainFields: ['react-native', 'browser', 'main'],
  platforms: ['ios', 'android', 'native', 'web'],
  alias: {
    buffer: require.resolve('buffer'),
  },
};

// Enable concurrent transformations for faster builds
config.maxWorkers = Math.max(1, require('os').cpus().length - 1);

// Reset cache configuration to avoid cache issues
config.resetCache = true;

module.exports = config;

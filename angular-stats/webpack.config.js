const { withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');
const package_json = require('./package.json');

const mfConfig = withModuleFederationPlugin({
  name: 'angularApp',
  filename: 'remoteEntry.js',
  exposes: {
    './Stats': './src/app/stats/stats.entry.ts',
  },
  shared: {
    '@angular/core': {
      singleton: true,
      strictVersion: false,
      requiredVersion: package_json.dependencies['@angular/core'],
    },
    '@angular/common': {
      singleton: true,
      strictVersion: false,
      requiredVersion: package_json.dependencies['@angular/common'],
    },
    '@angular/elements': {
      singleton: true,
      strictVersion: false,
      requiredVersion: package_json.dependencies['@angular/elements'],
    },
    '@angular/platform-browser': {
      singleton: true,
      strictVersion: false,
      requiredVersion: package_json.dependencies['@angular/platform-browser'],
    },
  },
});

// safely extend after getting the config object
if (!mfConfig.module) mfConfig.module = {};
if (!mfConfig.module.rules) mfConfig.module.rules = [];

mfConfig.module.rules.push({
  test: /\.m?js$/,
  resolve: { fullySpecified: false },
});

mfConfig.experiments = {
  ...mfConfig.experiments,
  outputModule: true,
  topLevelAwait: true,
};

mfConfig.output = {
  ...mfConfig.output,
  module: true,
  library: { type: 'module' },
};

module.exports = mfConfig;
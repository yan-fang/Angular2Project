const webpack = require('webpack');
const path = require('path');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

module.exports = function (env = {}) {
  const { paths, baseLoaders, baseResolve } = require('./base.js')(env);

  return {
    cache: true,
    entry: {
      vendor: ['./src/vendor_test.ts'],
    },
    output: {
      filename: 'vendor.bundle.js',
      path: paths.dist,
      library: 'vendor_lib',
    },
    module: {
      loaders: [
        ...baseLoaders,
        {
          test: /\.ts$/,
          loader: [
            `awesome-typescript-loader?configFileName=${paths.tsconfigSpec}`,
            'angular2-template-loader'
          ]
        }
      ]
    },
    plugins: [
      new webpack.DllPlugin({
        name: 'vendor_lib',
        path: paths.vendorManifest,
      }),
      new webpack.SourceMapDevToolPlugin({
        filename: null, // if no value is provided the sourcemap is inlined
        test: /\.(ts|js)($|\?)/i // process .js and .ts files only
      })
    ],
    resolve: {
      modules: baseResolve.modules,
      extensions: baseResolve.extensions,
      plugins: [
        new TsConfigPathsPlugin({configFileName: paths.tsconfigSpec})
      ]
    }
  };
};

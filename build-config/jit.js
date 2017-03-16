const webpack = require('webpack');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

module.exports = function (env = {}) {
  const { entry, output, baseLoaders, basePlugins, baseResolve, devServer } = require('./base.js')(env);

  return {
    cache: true,
    performance: {
      /**
       * Combines size of all entry bundles and makes sure
       * they are below default threshold of 250k.
       * TODO: change to 'error' once bundles can be reduced further.
       */
      hints: 'warning'
    },
    entry: entry,
    output: output,
    module: {
      loaders: [
        ...baseLoaders,
        {
          test: /\.ts$/, loader: [
          'awesome-typescript-loader',
          'angular-router-loader',
          'angular2-template-loader'
        ]
        }
      ],
    },
    plugins: [
      ...basePlugins,
      new webpack.ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        __dirname
      )
    ],
    resolve: {
      modules: baseResolve.modules,
      extensions: baseResolve.extensions,
      plugins: [
        new TsConfigPathsPlugin()
      ]
    },
    devServer: devServer
  };
}

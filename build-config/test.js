const webpack = require('webpack');
const path = require('path');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

module.exports = function (env = {}) {
  const { paths, baseLoaders, baseResolve } = require('./base.js')(env);

  const enableCoverage = env.enableCoverage;

  const coverageLoader = enableCoverage ? [
    {
      enforce: 'post',
      test: /\.ts/,
      include: path.resolve('src/'),
      exclude: [
        /\.spec\.ts$/
      ],
      loader: 'istanbul-instrumenter-loader?esModules=true'
    }
  ] : [];

  return {
    cache: true,
    module: {
      loaders: [
        ...baseLoaders,
        {
          test: /\.ts$/,
          loader: [
            `awesome-typescript-loader?configFileName=${paths.tsconfigSpec}`,
            'angular2-template-loader'
          ]
        },
        ...coverageLoader
      ]
    },
    plugins: [
      new webpack.DllReferencePlugin({
        context: '.',
        manifest: require(paths.vendorManifest),
      }),
      new webpack.ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        __dirname
      ),
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

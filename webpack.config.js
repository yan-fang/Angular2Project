const path = require('path');
const webpack = require('webpack');
const dashboardPlugin = require('webpack-dashboard/plugin');

const config = {
  cache: true,
  devtool: 'hidden-source-map',
  entry: {
    polyfills: './src/polyfills',
    vendor: './src/vendor',
    main: './src/main'
  },

  output: {
    path: path.join(__dirname, '_dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },
  module: {
    loaders: [
      { test: /\.ts$/,   loaders: ['awesome-typescript-loader', 'angular-router-loader'] },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.html/,  loader: 'raw-loader' },
      { test: /\.css$/,  loader: 'to-string-loader!css-loader' },
    ],
  },

  plugins: [
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      __dirname
    ),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['polyfills', 'vendor', 'main'].reverse(),
      minChunks: Infinity
    }),
    new dashboardPlugin()
  ],

  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules')
    ],
    extensions: ['.ts', '.js', '.json']
  },

  devServer: {
    historyApiFallback: true,
    watchOptions: { aggregateTimeout: 300, poll: 1000 }
  }
};

module.exports = config;

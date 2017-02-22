const path = require('path');
const webpack = require('webpack');
const dashboardPlugin = require('webpack-dashboard/plugin');
const browserSyncPlugin = require('browser-sync-webpack-plugin');

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
      { test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader',
          'angular-router-loader',
          'angular2-template-loader'
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.html/,
        loader: 'raw-loader'
      },
      {
        test: /\.css$/,
        loaders: [
          'to-string-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: [
          'raw-loader',
          'sass-loader'
        ]
      }
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
    new dashboardPlugin(),
    new browserSyncPlugin(
      // BrowserSync options
      {
        host: 'localhost',
        port: 3001, // Site will be available at http://localhost:3001/
        proxy: 'http://localhost:3000/', // proxy the Webpack Dev Server endpoint through BrowserSync
        open: true, // Open the browser from automatically. Possible values "ui", "local", true, false
        // browser: ["google chrome", "firefox"], // Open the site in Chrome & Firefox
      },
      // plugin options
      {
        // prevent BrowserSync from reloading the page and let Webpack Dev Server take care of this
        reload: false
      }
    )
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
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules|\.git|\.vscode|\.idea/
    }
  }
};

module.exports = config;

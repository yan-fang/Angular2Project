const path = require('path');
const webpack = require('webpack');
const dashboardPlugin = require('webpack-dashboard/plugin');
const browserSyncPlugin = require('browser-sync-webpack-plugin');
const ngtools = require('@ngtools/webpack');
const copyPlugin = require('copy-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');

const config = function(env)  {
  const locale = (env || {}).locale;

  const aotConfiguration = !locale || locale === 'en' ? ({
    tsConfigPath: './tsconfig.json',
    mainPath: "./src/main.ts"
  }) : ({
    tsConfigPath: './tsconfig.json',
    mainPath: './src/main.ts',
    i18nFile: './i18n/messages.' + locale + '.xlf',
    i18nFormat: 'xlf',
    locale: locale
  });

  return {
    cache: true,
    devtool: 'hidden-source-map',
    entry: {
      polyfills: './src/polyfills.ts',
      vendor: './src/vendor.ts',
      main: './src/main.ts'
    },
    output: {
      path: path.join(process.cwd(), '_dist'),
      filename: '[name].bundle.js',
      sourceMapFilename: '[name].map',
      chunkFilename: '[id].chunk.js'
    },
    module: {
      loaders: [
        { test: /\.ts$/,
          loaders: [
            '@ngtools/webpack'
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
      new ngtools.AotPlugin(aotConfiguration),
      new webpack.ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        __dirname
      ),
      new webpack.optimize.CommonsChunkPlugin({
        name: ['polyfills', 'vendor', 'main'].reverse(),
        minChunks: Infinity
      }),
      // Copy over the public assets to the build directory
      new copyPlugin([{ from: 'public', to: 'public' }]),
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
      ),
      new htmlPlugin({
        template: 'src/index.html'
      })
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
}

module.exports = config;

const path = require('path');
const webpack = require('webpack');
const browserSyncPlugin = require('browser-sync-webpack-plugin');
const ngtools = require('@ngtools/webpack');
const copyPlugin = require('copy-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const configureEnv = (() => {
  // Used primarily to set runtime environment variable. Just looks for `-p` flag.
  let isProd = Object.keys(process.argv).indexOf('-p') > -1;
  return {
    isProd,

    // Used with AOTPlugin to override runtime environment variable.
    pathToEnvModule: isProd ? 'src/app/environments/environment.prod.ts' : 'src/app/environments/environment.ts'
  };
})();

module.exports = function(env = {}) {
  const locale = env.locale;
  const mode = env.mode;

  const aotConfiguration = (() => {
    const common = {
      tsConfigPath: './tsconfig.json',
      mainPath: "./src/main.ts",
      hostReplacementPaths: {
        // Replaces env file with prod environment file
        'src/app/environments/environment.ts': configureEnv.pathToEnvModule
      }
    };

    return !locale || locale === 'en' ? common : Object.assign({}, common, {
      i18nFile: './i18n/messages.' + locale + '.xlf',
      i18nFormat: 'xlf',
      locale: locale
    });
  })();

  const config =  {
    cache: true,
    devtool: 'source-map',
    performance: {
      /**
       * Combines size of all entry bundles and makes sure
       * they are below default threshold of 250k.
       * TODO: change to 'error' once bundles can be reduced further.
       */
      hints: 'warning'
    },
    entry: {
      polyfills: './src/polyfills.ts',
      vendor: './src/vendor.ts',
      main: './src/main.ts'
    },
    output: {
      path: path.join(process.cwd(), '_dist'),
      filename: '[name].bundle.js',
      sourceMapFilename: '[name].bundle.js.map',
      chunkFilename: '[id].chunk.js'
    },
    module: {
      loaders: [
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
      new webpack.optimize.CommonsChunkPlugin({
        name: ['polyfills', 'vendor', 'main'].reverse(),
        minChunks: Infinity
      }),
      // Copy over the public assets to the build directory
      new copyPlugin([{ from: 'public', to: 'public' }]),
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
      // write generated bundles to index.html
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

  if (mode === 'aot') {
    console.log('   Mode: AOT');

    config.module.loaders.push(
      { test: /\.ts$/, loader: ['@ngtools/webpack'] }
    );

    config.plugins.push(
      new ngtools.AotPlugin(aotConfiguration),

      // This plugin needs to be added right after the ts loader has been added
      // https://github.com/angular/angular/issues/11580
      new webpack.ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        __dirname
      )
    );
  } else {
    console.log('   Mode: JIT');

    config.module.loaders.push(
      {
        test: /\.ts$/, loader: [
        'awesome-typescript-loader',
        'angular-router-loader',
        'angular2-template-loader'
      ]}
    );

    // This plugin needs to be added right after the ts loader has been added
    // https://github.com/angular/angular/issues/11580
    config.plugins.push(
      new webpack.ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        __dirname
      )
    );

    // [at-loader] Needs this to support new paths and baseUrl feature of TS 2.0
    config.resolve.plugins = [
      new TsConfigPathsPlugin()
    ];
  }

  return config;
};


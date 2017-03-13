const path = require('path');
const webpack = require('webpack');
const browserSyncPlugin = require('browser-sync-webpack-plugin');
const ngtools = require('@ngtools/webpack');
const copyPlugin = require('copy-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

function aotConfiguration(locale) {
  const configureEnv = (() => {
    // Used primarily to set runtime environment variable. Just looks for `-p` flag.
    const isProd = Object.keys(process.argv).indexOf('-p') > -1;
    return {
      isProd,

      // Used with AOTPlugin to override runtime environment variable.
      pathToEnvModule: isProd ? 'src/app/environments/environment.prod.ts' : 'src/app/environments/environment.ts'
    };
  })();

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
}

const baseLoaders = [
  {
    test: /requirejs\/require/,
    use: 'script-loader'
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
];

const basePlugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: ['polyfills', 'vendor', 'main'].reverse(),
    minChunks: Infinity
  }),
  // Copy over the public assets to the build directory: ./_dist
  new copyPlugin([
    { from: 'public', to: 'public' },
    { from: 'ease1/bower_components', to: 'bower_components' },
    { from: 'ease1/ease-ui', to: 'ease-ui' }
  ]),
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
];

const devServer = {
  historyApiFallback: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules|\.git|\.vscode|\.idea/
  },
  proxy: {
    "/ease-app-web": {
      target: "http://localhost:8000/",
      secure: false
    }
  }
};

const baseResolve = {
  modules: [
    path.resolve(__dirname, 'ease1'),
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, 'node_modules')
  ],
  extensions: ['.ts', '.js', '.json']
};

const entry = {
  polyfills: './src/polyfills.ts',
  vendor: './src/vendor.ts',
  main: './src/main.ts'
};

const output = {
  path: path.join(process.cwd(), '_dist'),
  filename: '[name].bundle.js',
  sourceMapFilename: '[name].bundle.js.map',
  chunkFilename: '[id].chunk.js'
};


module.exports = function (env = {}) {
  const locale = env.locale;
  const mode = env.mode;
  const enableCoverage = env.enableCoverage;

  if (mode === "karma") {
    console.log('   Mode: Karma');

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

    return ({
      cache: true,
      module: {
        loaders: [
          ...baseLoaders,
          {
            test: /\.ts$/,
            loader: [
              'awesome-typescript-loader?configFileName=tsconfig-spec.json',
              'angular2-template-loader'
            ]
          },
          ...coverageLoader
        ]
      },
      plugins: [
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
          new TsConfigPathsPlugin({configFileName: 'tsconfig-spec.json'})
        ]
      }
    });


  } else if (mode === 'aot') {
    console.log('   Mode: AOT');

    return ({
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
      entry: entry,
      output: output,
      module: {
        loaders: [
          ...baseLoaders,
          { test: /\.ts$/, loader: ['@ngtools/webpack'] }
        ],
      },
      plugins: [
        ...basePlugins,
        new ngtools.AotPlugin(aotConfiguration(locale)),
        // This plugin needs to be added right after the ts loader has been added
        // https://github.com/angular/angular/issues/11580
        new webpack.ContextReplacementPlugin(
          /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
          __dirname
        )
      ],
      resolve: baseResolve,
      devServer: devServer,
    });

  } else {
    console.log('   Mode: JIT');

    return ({
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
      devServer: devServer,
    });
  };
}
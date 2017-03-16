const path = require('path');
const webpack = require('webpack');
const browserSyncPlugin = require('browser-sync-webpack-plugin');
const ngtools = require('@ngtools/webpack');
const copyPlugin = require('copy-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');

// Used primarily to set runtime environment variable. Just looks for `--env.build=prod` flag.
// TODO: [Youssef] We will switch to `-p` flag once the following issue is fixed: https://github.com/webpack/webpack/issues/4468.
const isProd = process.argv.includes('--env.build=prod');

const devPort = 3000;

const paths = {
  polyfills: path.join(process.cwd(), 'src/polyfills.ts'),
  vendor: path.join(process.cwd(), 'src/vendor.ts'),
  main: path.join(process.cwd(), 'src/main.ts'),
  ease1: path.join(process.cwd(), 'ease1'),
  src: path.join(process.cwd(), 'src'),
  node_modules: path.join(process.cwd(), 'node_modules'),
  dist: path.join(process.cwd(), '_dist'),
  tsconfig: path.join(process.cwd(), 'tsconfig.json'),
  tsconfigSpec: path.join(process.cwd(), 'tsconfig-spec.json'),
  env: path.join(process.cwd(), 'src/shared/environments/environment.ts'),
  envProd: path.join(process.cwd(), 'src/shared/environments/environment.prod.ts'),
  vendorManifest: path.join(process.cwd(), '_dist/vendor-manifest.json'),

};

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

const basePlugins = (() => {
  // TODO: [Youssef] Discuss with Devops where will static files be deployed to
  const srcMapPath = isProd ? 'http://<PROD_INTERNAL_DOMAIN>/' : `http://localhost:${devPort}/`;

  const baseDefaultPlugins = [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map', // if no value is provided the sourcemap is inlined
      append: `\n//# sourceMappingURL=${srcMapPath}[url]`,
      test: /\.(ts|js)($|\?)/i // process .js and .ts files only
    }),
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
    // BrowserSync options
    new browserSyncPlugin(
      {
        host: 'localhost',
        port: 3001, // Site will be available at http://localhost:3001/
        proxy: `http://localhost:${devPort}/`, // proxy the Webpack Dev Server endpoint through BrowserSync
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

  const prodPlugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    })
  ];

  if (isProd) {
    return [
      ...prodPlugins,
      ...baseDefaultPlugins
    ];
  }

  return baseDefaultPlugins;
})();

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
    paths.ease1,
    paths.src,
    paths.node_modules
  ],
  extensions: ['.ts', '.js', '.json']
};

const entry = {
  polyfills: paths.polyfills,
  vendor: paths.vendor,
  main: paths.main
};

const output = {
  path: paths.dist,
  filename: '[name].bundle.js',
  sourceMapFilename: '[name].bundle.js.map',
  chunkFilename: '[id].chunk.js'
};

module.exports = function (env) {
  const mode = env.mode;

  console.info(`   isProd: ${isProd}`);
  console.info(`   Mode: ${mode}`);

  if (isProd) {
    console.info(`   Paths: ${JSON.stringify(paths, null, 6)}`);
  }

  return {
    isProd,
    paths,
    entry,
    output,
    devServer,
    baseLoaders,
    basePlugins,
    baseResolve
  }
};

const ngtools = require('@ngtools/webpack');
const webpack = require('webpack');
const path = require('path');

module.exports = function (env = {}) {
  const { isProd, entry, paths, output, baseLoaders, basePlugins, baseResolve, devServer } = require('./base.js')(env);

  const locale = env.locale;

  function aotConfiguration(locale) {
    const configureEnv = (() => {
      return {
        isProd,

        // Used with AOTPlugin to override runtime environment variable.
        pathToEnvModule: isProd ? paths.envProd : paths.env
      };
    })();

    const common = {
      tsConfigPath: paths.tsconfig,
      mainPath: paths.main,
      hostReplacementPaths: {}
    };

    // Replaces env file with prod environment file
    common.hostReplacementPaths[paths.env] = configureEnv.pathToEnvModule;

    return !locale || locale === 'en' ? common : Object.assign({}, common, {
      i18nFile: './i18n/messages.' + locale + '.xlf',
      i18nFormat: 'xlf',
      locale: locale
    });
  }

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
    devServer: devServer
  };
};

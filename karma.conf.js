module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'karma-typescript'],

    // list of files / patterns to load in the browser
    files: [
        'src/base.spec.ts',
        { pattern: 'src/**/!(main).+(ts|html|scss)' },
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.ts': ['karma-typescript'],
      'src/**/*.scss': ['scss']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'karma-typescript'],

    specReporter: {
      maxLogLines: 5,         // limit number of lines logged per test
      suppressErrorSummary: false,  // do not print error summary
      suppressFailed: false,  // do not print information about failed tests
      suppressPassed: false,  // do not print information about passed tests
      suppressSkipped: true,  // do not print information about skipped tests
      showSpecTiming: false // print the time elapsed for each spec
    },

    // Karma-typescript tsconfig location
    karmaTypescriptConfig: {
        tsconfig: "./tsconfig.json",
        coverageOptions: {
          instrumentation: true,
          exclude: /\.(d|spec)\.ts/
        },
        reports: {
          "html": "coverage",
          "json-summary": "coverage",
          "text": "",
          "text-summary": ""
        },
        transforms: [
          // This transform setting is here temporarily until karma-typescript version 2.1.8
          // This will change to something like angulat-mode: true and these will be on by default
          require("karma-typescript/transforms/angular2-template-url-rewriter"),
          require("karma-typescript/transforms/angular2-style-urls-rewriter")
        ]

    },

    coverageReporter: {
      instrumenterOptions: {
        istanbul: {
          noCompact: true // (useful for debugging when true)
        }
      }
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],
    // browsers: ['Chrome'],
    // browsers: ['Firefox'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}

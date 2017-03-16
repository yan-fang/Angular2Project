exports.config = {
  allScriptsTimeout: 11000,
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:3001/',
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  cucumberOpts: {
    format: ['pretty'],
    require: ['./e2e/steps/**/*.steps.ts']
  },
  specs: [
    './e2e/features/**/*.feature'
  ],
  useAllAngular2AppRoots: true,
  beforeLaunch: function () {
    require('ts-node').register({
      project: './e2e'
    });
  },
  onPrepare: function () {
    browser.ignoreSynchronization = true;
    browser.manage().window().maximize();
  }
};

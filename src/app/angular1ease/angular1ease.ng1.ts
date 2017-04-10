import 'angular'; // imports angular 1.3

import { UpgradeModule } from '@angular/upgrade/static';
import { setUpLocationSync } from '@angular/router/upgrade';

import { requirejs } from './ng1-connector';
import { addEnvDeps } from './env.ng1';
import { Angular1Ease } from './angular1ease.service';

const REQUIRE_DEPS = [
  'require',
  'angular',
  'ease',
  'ui.router.extras.future',
  'easeTemplates',
  'app'
];

const ANGULAR_DEPS = [
  'EASEApp'
];

declare const NG1EASE_BUILD_VERSION: string;
const buildVersion = NG1EASE_BUILD_VERSION;

export function prepareAngular1Ease(upgrade: UpgradeModule): Promise<any> {
  let res: any = null;
  const r = new Promise(resolve => res = resolve);

  const angular1Ease: Angular1Ease = upgrade.injector.get(Angular1Ease);

  if (!angular1Ease.loaded) {
    configureRequireJS();

    const { requireDeps, angularDeps, runFunctions } = addEnvDeps(REQUIRE_DEPS, ANGULAR_DEPS, upgrade.injector);

    /* tslint:disable:variable-name */
    requirejs(requireDeps, (_require: any, angular: any) => {
      const m = angular.module('Ng1EaseApp', angularDeps).run(runFunction());
      runFunctions.forEach(f => m.run(f));
      upgrade.bootstrap(document.body, ['Ng1EaseApp']);
      setUpLocationSync(upgrade);

      angular1Ease.angular1injector = upgrade.$injector;

      res(true);
    });
    /* tslint:enable:variable-name */
  } else {
    res(true);
  }
  return r;
}

function runFunction(): Function {
  let oldUpdate: any = null;
  function runFn($rootScope: any, $urlRouter: any) {
    oldUpdate = $urlRouter.update;

    $rootScope.$on('$stateChangeStart', (e: any, toState: any) => {
      $urlRouter.update = oldUpdate;
      if (toState.name === 'accountSummary') {
        $urlRouter.update = () => null;
        e.preventDefault();
      }
    });
  }
  (<any>runFn).$inject = ['$rootScope', '$urlRouter'];
  return runFn;
}


function configureRequireJS() {

  requirejs.config({
    waitSeconds: 0,
    paths: {
      angularMocks: '/public/static/js/angular-mocks',
      lodash: `/ease-ui/${buildVersion}/bower_components/lodash/lodash.min`,
      jsencrypt: `/ease-ui/${buildVersion}/bower_components/jsencrypt/bin/jsencrypt.min`,
      jquery: `/ease-ui/${buildVersion}/bower_components/jquery/dist/jquery.min`,
      angular: `/ease-ui/${buildVersion}/bower_components/angular/angular.min`,
      ease: `/ease-ui/${buildVersion}/dist/ease`,
      'ui.router.extras.core': `/ease-ui/${buildVersion}/bower_components/ui-router-extras/` +
      `release/modular/ct-ui-router-extras.core.min`,
      'ui.router.extras.future': `/ease-ui/${buildVersion}/bower_components/ui-router-extras/` +
      `release/modular/ct-ui-router-extras.future.min`,
      'angular-formly': `/ease-ui/${buildVersion}/bower_components/angular-formly/dist/formly.min`,
      formlyBootstrap: `/ease-ui/${buildVersion}/bower_components/angular-formly-templates-bootstrap` +
      `/dist/angular-formly-templates-bootstrap`,
      'api-check': `/ease-ui/${buildVersion}/bower_components/api-check/dist/api-check.min`,
      text: `/ease-ui/${buildVersion}/bower_components/requirejs-text/text`,
      noext: `/ease-ui/${buildVersion}/bower_components/requirejs-plugins/src/noext`,
      async: `/ease-ui/${buildVersion}/bower_components/requirejs-plugins/src/async`,
      domReady: `/ease-ui/${buildVersion}/bower_components/requirejs-domready/domReady`,
      pdfjs: `/ease-ui/${buildVersion}/bower_components/pdfjs-dist/build/pdf.combined`,
      compatibilityPdf: `/ease-ui/${buildVersion}/bower_components/pdfjs-dist/web/compatibility`,
      c1Date: `/ease-ui/${buildVersion}/bower_components/c1Date/min/c1Date.min`,
      easeUIComponents: `/ease-ui/${buildVersion}/bower_components/easeUIComponents/dist/ease-ui-components.min`,
      adobeTarget: `/ease-ui/${buildVersion}/bower_components/adobe-target/at`,
      Chat247: `/ease-ui/${buildVersion}/bower_components/Chat247/247tag`,
      slick: `/ease-ui/${buildVersion}/bower_components/angular-slick/dist/slick.min`,
      slickCarousel: `/ease-ui/${buildVersion}/bower_components/slick-carousel/slick/slick.min`,
      easeCoreUtils: `/ease-ui/${buildVersion}/dist/utils/easeCoreUtils-module`,
      AccountDetailModule: `/ease-ui/${buildVersion}/dist/features/AccountDetail/AccountDetail-module`,
      WelcomeModule: `/ease-ui/${buildVersion}/dist/features/Welcome/Welcome-module`,
      RetailAccountLinks: `/ease-ui/${buildVersion}/dist/features/AccountSummary/links`,
      ContentAccountLinks: `/ease-ui/${buildVersion}/dist/features/cdn/links`,
      CreditCardCosLink: `/ease-ui/${buildVersion}/dist/features/CreditCard/link`,
      EscapeHatchLinks: `/ease-ui/${buildVersion}/dist/features/EscapeHatch/links`,
      PhysicalAddressLink: `/ease-ui/${buildVersion}/dist/features/CustomerSettings/PersonalInformation/links`,
      LogOutLinks: `/ease-ui/${buildVersion}/dist/features/logOut/links`,
      LogoutModule: `/ease-ui/${buildVersion}/dist/features/logOut/Logout-module`,
      customerSettings: `/ease-ui/${buildVersion}/dist/features/CustomerSettings/CustomerSettings-module`,
      UMMModule: `/ease-ui/${buildVersion}/dist/features/UMMPayment/UMMPayment-module`,
      GlobalFooterModule: `/ease-ui/${buildVersion}/dist/features/GlobalFooter/GlobalFooter-module`,
      SummaryHeaderModule: `/ease-ui/${buildVersion}/dist/features/SummaryHeader/SummaryHeader-module`,
      TransferModule: `/ease-ui/${buildVersion}/dist/features/Transfer/Transfer-module`,
      SessionTimeoutModule: `/ease-ui/${buildVersion}/dist/features/SessionTimeout/SessionTimeout-module`,
      StatementModule: `/ease-ui/${buildVersion}/dist/features/Statement/Statement-module`,
      EscapeHatchModule: `/ease-ui/${buildVersion}/dist/features/EscapeHatch/EscapeHatch-module`,
      LanguageToggleModule: `/ease-ui/${buildVersion}/dist/features/LanguageToggle/LanguageToggle-module`,
      LanguageToggleDirective: `/ease-ui/${buildVersion}/dist/features/LanguageToggle/LanguageToggle-directive`,
      LanguageToggleService: `/ease-ui/${buildVersion}/dist/features/LanguageToggle/LanguageToggle-service`,
      usabilla: `/ease-ui/${buildVersion}/dist/features/Usabilla/Usabilla`,
      SecurityModule: `/ease-ui/${buildVersion}/dist/features/Security/Security-module`,
      easeTemplates: `/ease-ui/${buildVersion}/dist/templates/easeTemplateCache`,
      AlertsModule: `/ease-ui/${buildVersion}/dist/features/Alerts/Alerts-module`,
      pubSubBootstrap: `https://nexus.ensighten.com/capitalone/Bootstrap`,
      AutoLoan: `/ease-ui/bower_components/AutoLoan/AutoLoan-module.js?t=` +
      Date.now(),
      Bank: `/ease-ui/bower_components/Bank/Bank-module.js?t=` + Date.now(),
      BillPay: `/ease-ui/bower_components/BillPay/BillPay-module.js?t=` +
      Date.now(),
      Checkbook: `/ease-ui/bower_components/Checkbook/Checkbook-module.js?t=` +
      Date.now(),
      CreditCard: `/ease-ui/bower_components/CreditCard/CreditCard-module.min.js?t=` +
      Date.now(),
      Debit: `/ease-ui/bower_components/Debit/Debit-module.js?t=` + Date.now(),
      FundsForecast: `/ease-ui/bower_components/FundsForecast/FundsForecast-module.js?t=` +
      Date.now(),
      HomeLoans: `/ease-ui/bower_components/HomeLoans/HomeLoans-module.js?t=` +
      Date.now(),
      app: `/ease-ui/${buildVersion}/dist/app`,
      coreProperty: `/ease-ui/bower_components/easeCustomerFeatures/${buildVersion}/utils/easeCustomerProperty`,
      coreUtils: `/ease-ui/bower_components/easeCustomerFeatures/${buildVersion}/utils/easeCustomerUtils`,
      coreFeatures: `/ease-ui/bower_components/easeCustomerFeatures/${buildVersion}/customerFeaturesApp`,
      settingsModule: `/ease-ui/bower_components/easeCustomerFeatures/${buildVersion}/CustomerSettings/Settings/Settings-module`,
      personalInformationModule: `/ease-ui/bower_components/easeCustomerFeatures/${buildVersion}/CustomerSettings/PersonalInformation` +
      `/PersonalInformation-module`,
      MigrateModule: `/ease-ui/bower_components/easeCustomerFeatures/${buildVersion}/Migrate/Migrate-module`,
      AccountSummaryModule: `/ease-ui/bower_components/easeCustomerFeatures/${buildVersion}/AccountSummary/AccountSummary-module`,
      AtmFinderModule: `/ease-ui/bower_components/easeCustomerFeatures/${buildVersion}/AtmFinder/AtmFinder-module`,
      microajax: `/ease-ui/${buildVersion}/dist/lib/microajax`,
      coreloader: `/ease-ui/${buildVersion}/dist/core/coreloader`
    },
    shim: {
      angular: { exports: 'angular' },
      ease: ['angular', 'lodash', 'jquery'],
      'ui.router.extras.core': ['ease'],
      'ui.router.extras.future': ['ui.router.extras.core'],
      'angular-formly': ['ease', 'api-check'],
      formlyBootstrap: ['angular-formly'],
      easeCoreUtils: ['ease'],
      compatibilityPdf: ['pdfjs'],
      EscapeHatchLinks: ['ease'],
      PhysicalAddressLink: ['ease'],
      LogOutLinks: ['ease'],
      RetailAccountLinks: ['ease'],
      ContentAccountLinks: ['ease'],
      CreditCardCosLink: ['ease'],
      easeUIComponents: ['ease', 'moment'],
      easeTemplates: ['angular'],
      AtmFinderModule: ['easeCoreUtils'],
      TransferModule: ['easeCoreUtils'],
      UMMModule: ['easeCoreUtils'],
      AccountSummaryModule: [
        'easeCoreUtils',
        'AtmFinderModule',
        'UMMModule',
        'TransferModule',
        'RetailAccountLinks',
        'ContentAccountLinks',
        'PhysicalAddressLink'
      ],
      AccountDetailModule: ['easeCoreUtils'],
      AlertsModule: ['easeCoreUtils'],
      slick: ['ease'],
      LanguageToggleService: ['ease', 'LanguageToggleModule'],
      LanguageToggleModule: ['ease'],
      slickCarousel: ['slick'],
      ContentProperties: ['ease'],
      easeDropdownModule: ['EaseProperties', 'easeUtils', 'pubsubServiceModule'],
      dropdown: ['easeDropdownModule'],
      commonModule: ['EaseProperties'],
      app: ['easeCoreUtils'],
      coreFeatures: ['easeCoreUtils'],
      Chat247: ['coreFeatures']
    },
    packages: [
      { name: 'moment', location: `/ease-ui/${buildVersion}/bower_components/moment`, main: 'moment' }
    ],
    priority: ['coreloader', 'angular']
  });
}

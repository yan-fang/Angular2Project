import 'angular'; // imports angular 1.3
import { UpgradeModule } from '@angular/upgrade/static';
import { requirejs } from './ng1-connector';
import { addEnvDeps } from './env.ng1';
import { Angular1Ease } from './angular1ease.service';
import { setUpLocationSync } from '@angular/router/upgrade';

const REQUIRE_DEPS = [
  'require', 'angular', 'ease', 'easeCoreUtils', 'easeUIComponents',
  'EASEApp', 'LogOutLinks', 'CreditCardCosLink', 'ui.router.extras.future',
  'AccountSummaryModule'
];

const ANGULAR_DEPS = [
  'ui.router', 'oc.lazyLoad', 'restangular', 'easeUIComponents',
  'EaseProperties', 'ContentProperties', 'easeAppUtils', 'EaseExceptionsModule',
  'pubsubServiceModule', 'easeUIComponents', 'EaseLocalizeModule', 'ngIdle',
  'pascalprecht.translate', 'UniversalTranslateModule', 'angular-lo-dash', 'EaseModalModule',
  'LogOutLinks', 'EaseDatePicker', 'easeMultiDateSelector', 'easeDateRangePicker',
  'ngAnimate', 'ngAria', 'ngStorage', 'easeDropdownModule', 'Easetooltip', 'EASEApp'
];

export function prepareAngular1Ease(upgrade: UpgradeModule): Promise<any> {
  let res: any = null;
  const r = new Promise(resolve => res = resolve);

  const angular1Ease: Angular1Ease = upgrade.injector.get(Angular1Ease);

  if (! angular1Ease.loaded) {
    configureRequireJS();

    const {requireDeps, angularDeps, runFunctions} = addEnvDeps(REQUIRE_DEPS, ANGULAR_DEPS, upgrade.injector);

    requirejs(requireDeps, (_require: any, angular: any) => {
      const m = angular.module('Ng1EaseApp', angularDeps).config(configFunction()).run(runFunction());
      runFunctions.forEach(f => m.run(f));
      upgrade.bootstrap(document.body, ['Ng1EaseApp']);
      setUpLocationSync(upgrade);

      angular1Ease.angular1injector = upgrade.$injector;

      res(true);
    });
  } else {
    res(true);
  }
  return r;
}

function configFunction(): Function {
  function configFn($ocLazyLoadProvider: any, $locationProvider: any) {
    $locationProvider.html5Mode(true);

    $ocLazyLoadProvider.config({
      jsLoader: requirejs
    });
  }
  (<any>configFn).$inject = ['$ocLazyLoadProvider', '$locationProvider'];
  return configFn;
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
      lodash: '/bower_components/lodash/index',
      jquery: '/bower_components/jquery/dist/jquery.min',
      angular: '/bower_components/angular/angular.min',
      ease: '/bower_components/EASECoreLite/ease',
      'ui.router.extras.core': '/bower_components/ui-router-extras/release/modular/ct-ui-router-extras.core.min',
      'ui.router.extras.future': '/bower_components/ui-router-extras/release/modular/ct-ui-router-extras.future.min',
      'angular-formly': '/bower_components/angular-formly/dist/formly.min',
      formlyBootstrap: '/bower_components/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap',
      'api-check': '/bower_components/api-check/dist/api-check.min',
      text: '/bower_components/requirejs-text/text',
      noext: '/bower_components/requirejs-plugins/src/noext',
      async: '/bower_components/requirejs-plugins/src/async',
      domReady: '/bower_components/requirejs-domready/domReady',
      pdfjs: '/bower_components/pdfjs-dist/build/pdf.combined',
      compatibilityPdf: '/bower_components/pdfjs-dist/web/compatibility',
      c1Date: '/bower_components/c1Date/min/c1Date.min',
      easeUIComponents: '/bower_components/easeUIComponents/dist/ease-ui-components.min',
      moment: '/bower_components/moment/min/moment.min',
      slick: '/bower_components/angular-slick/dist/slick.min',
      slickCarousel: '/bower_components/slick-carousel/slick/slick.min',
      easeCoreUtils: '/bower_components/EASECoreLite/utils/easeCoreUtils-module',
      AccountSummaryModule: '/bower_components/EASECoreLite/features/AccountSummary/AccountSummary-module',
      AccountDetailModule: '/bower_components/EASECoreLite/features/AccountDetail/AccountDetail-module',
      RetailAccountLinks: '/bower_components/EASECoreLite/features/AccountSummary/links',
      EscapeHatchLinks: '/bower_components/EASECoreLite/features/EscapeHatch/links',
      UMMModule: '/bower_components/EASECoreLite/features/UMMPayment/UMMPayment-module',
      GlobalFooterModule: '/bower_components/EASECoreLite/features/GlobalFooter/GlobalFooter-module',
      SummaryHeaderModule: '/bower_components/EASECoreLite/features/SummaryHeader/SummaryHeader-module',
      TransferModule: '/bower_components/EASECoreLite/features/Transfer/Transfer-module',
      StatementModule: '/bower_components/EASECoreLite/features/Statement/Statement-module',
      EscapeHatchModule: '/bower_components/EASECoreLite/features/EscapeHatch/EscapeHatch-module',
      LanguageToggleModule: '/bower_components/EASECoreLite/features/LanguageToggle/LanguageToggle-module',
      LanguageToggleDirective: '/bower_components/EASECoreLite/features/LanguageToggle/LanguageToggle-directive',
      LanguageToggleService: '/bower_components/EASECoreLite/features/LanguageToggle/LanguageToggle-service',
      usabilla: '/bower_components/EASECoreLite/features/Usabilla/Usabilla',
      pubSubBootstrap: 'https://nexus.ensighten.com/capitalone/Bootstrap',
      Bank: '/ease-ui/bower_components/Bank/Bank-module',
      HomeLoans: '/src/HomeLoans-module',
      easeAccordion: '/bower_components/EASECoreLite/utils/components/easeaccordion/easeAccordion',
      easeGoogleMap: '/bower_components/EASECoreLite/utils/components/easegooglemap/easeGoogleMap',
      easeUtils: '/bower_components/EASECoreLite/utils/easeUtils-module',
      EASEApp: '/bower_components/EASECoreLite/public/app',
      LogOutLinks: '/bower_components/EASECoreLite/properties/logOut/links',
      CreditCardCosLink: '/bower_components/EASECoreLite/properties/CreditCard/link'
    },
    shim: {
      angular: {
        exports: 'angular'
      },
      ease: ['angular', 'lodash', 'jquery'],
      'ui.router.extras.core': ['ease'],
      'ui.router.extras.future': ['ui.router.extras.core'],
      'angular-formly': ['ease', 'api-check'],
      formlyBootstrap: ['angular-formly'],
      easeCoreUtils: ['ease'],
      compatibilityPdf: ['pdfjs'],
      EscapeHatchLinks: ['ease'],
      PhysicalAddressLink: ['ease'],
      RetailAccountLinks: ['ease'],
      easeUIComponents: ['ease', 'moment', 'easeCoreUtils'],
      easeUtils: ['easeCoreUtils'],
      TransferModule: ['easeCoreUtils', 'easeUtils'],
      UMMModule: ['easeCoreUtils', 'easeUtils'],
      AccountSummaryModule: ['easeCoreUtils', 'easeUtils', 'UMMModule', 'TransferModule', 'RetailAccountLinks'],
      AccountDetailModule: ['easeCoreUtils', 'easeUtils'],
      slick: ['ease'],
      LanguageToggleService: ['ease', 'LanguageToggleModule'],
      LanguageToggleModule: ['ease'],
      slickCarousel: ['slick'],
      ContentProperties: ['ease'],
      easeDropdownModule: ['EaseProperties', 'easeUtils', 'pubsubServiceModule'],
      dropdown: ['easeDropdownModule'],
      commonModule: ['EaseProperties']
    }
  });
}

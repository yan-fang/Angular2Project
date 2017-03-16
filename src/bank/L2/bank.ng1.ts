import { requirejs } from './ng1-connector';
import { addEnvDeps } from './env.ng1';
import { Injector } from '@angular/core';

const baseRequireDeps = [
  'require',
  'angular',
  'easeUIComponents',
  'easeCoreUtils',
  'UMMModule',
  'TransferModule',
  'AccountDetailModule',
  'AccountSummaryModule',
  'SummaryHeaderModule',
  'GlobalFooterModule',
  'EscapeHatchModule',
  'LanguageToggleService',
  'domReady!', 'noext',
  'ease',
  'ui.router.extras.future',
  'EscapeHatchLinks',
  'RetailAccountLinks',
  'easeCoreUtils',
];

const baseAngularDeps = [
  'ngAnimate',
  'ngAria',
  'ngStorage',
  'ui.router',
  'ct.ui.router.extras.future',
  'oc.lazyLoad',
  'restangular',
  'ngIdle',
  'EaseProperties',
  'ContentProperties',
  'EaseExceptionsModule',
  'pubsubServiceModule',
  'easeAppUtils',
  'easeAccordion',
  'accountServicesModule',
  'EaseLocalizeModule',
  'CommonModule',
  'EaseDatePicker',
  'easeMultiDateSelector',
  'easeDateRangePicker',
  'Easetooltip',
  'easeDropdownModule',
  'easeGoogleMap',
  'filterComponent',
  'EaseModalModule',
  'GlobalFooterModule',
  'SummaryHeaderModule',
  'EscapeHatchModule',
  'easeUIComponents',
  'pascalprecht.translate',
  'LanguageToggleModule',
  'UniversalTranslateModule',
  'AccountDetailsModule',
  'summaryModule'
];

/**
 * Returns a module name that can be bootstrapped with NgUpgrade
 */
export function prepareBank(injector: Injector): Promise<string> {
  let resolve: Function;
  const res = new Promise(r => resolve = r);

  const { requireDeps, angularDeps, runFunctions } = addEnvDeps(
    baseRequireDeps,
    baseAngularDeps,
    injector
  );

  configureRequireJS();
  requirejs(requireDeps, (_require: any, angular: any) => {
    const module = angular
      .module('BankL2', angularDeps)
      .config(configFunction())
      .run(navigate());

    runFunctions.map(runFunction => module.run(runFunction));

    resolve('BankL2');
  });

  return res;
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
      easeGoogleMap: '/bower_components/EASECoreLite/utils/components/easegooglemap/easeGoogleMap'
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
      easeUIComponents: ['ease', 'moment'],
      TransferModule: ['easeCoreUtils'],
      UMMModule: ['easeCoreUtils'],
      AccountSummaryModule: ['easeCoreUtils', 'UMMModule', 'TransferModule', 'RetailAccountLinks'],
      AccountDetailModule: ['easeCoreUtils'],
      slick: ['ease'],
      LanguageToggleService: ['ease', 'LanguageToggleModule'],
      LanguageToggleModule: ['ease'],
      slickCarousel: ['slick'],
      ContentProperties: ['ease'],
      easeDropdownModule: ['EaseProperties', 'easeUtils', 'pubsubServiceModule'],
      dropdown: ['easeDropdownModule'],
      commonModule: ['EaseProperties']
    },
    priority: ['angular']
  });
}

declare let angular: any;
function configFunction(): Function {
  function configFn($stateProvider: any, $futureStateProvider: any, $ocLazyLoadProvider: any,
    $urlRouterProvider: any, easeConstant: any, keepaliveProvider: any,
    idleProvider: any, $translateProvider: any, $locationProvider: any,
    $compileProvider: any, transferStateProvider: any) {

    $compileProvider.debugInfoEnabled(false);
    console.log(arguments);
    console.log($urlRouterProvider);
    console.log(transferStateProvider);

    $locationProvider.html5Mode(true);
    $ocLazyLoadProvider.config({
      jsLoader: requirejs
    });

    let loadAndRegisterFutureStates = function ($http: any) {
      // Ease1 Todo[TODO][SD] This should be served from end-point so that it is user specific
      return $http.get('/bower_components/EASECoreLite/futureStates.json').then(function (resp: any) {
        angular.forEach(resp.data, function (fstate: any) {
          // register each lobs returned from this call with $futureStateProvider
          $futureStateProvider.futureState(fstate);
        });
      });
    };

    $futureStateProvider.stateFactory('ocLazyload', ocLazyLoadStateFactory);
    $futureStateProvider.addResolve(loadAndRegisterFutureStates);
    configureIdleandKeepaliveProvider(idleProvider, keepaliveProvider, easeConstant);
    configureTranslateProvider($translateProvider, easeConstant);

    let bankState = {
      name: 'mainState',
      url: '/*path',
      onEnter: function ($injector: any) {
        let summaryService = $injector.get('summaryService');
        let easeUtilsFactory = $injector.get('EASEUtilsFactory');
        easeUtilsFactory.defaultHandler(summaryService);
      }
    };

    $stateProvider.state(bankState);
  }
  (<any>configFn).$inject = [
    '$stateProvider', '$futureStateProvider', '$ocLazyLoadProvider', '$urlRouterProvider',
    'EaseConstant', 'KeepaliveProvider', 'IdleProvider', '$translateProvider', '$locationProvider', '$compileProvider'
    , 'transferStateProvider'
  ];
  return configFn;
}

function navigate() {
  function runFn($rootScope: any, easeEvent: any, $state: any, summaryService: any, idle: any, easeUtilsFactory: any,
    languageToggleService: any, featureToggleFactory: any, easeConstant: any, $timeout: any, $window: any, $location: any,
    contentOneFactory: any, contentConstant: any, appCookie: any) {
    // let url = $location.absUrl();
    console.log($rootScope);
    console.log(easeEvent);
    console.log(idle);
    console.log(summaryService);
    console.log(easeUtilsFactory);
    console.log($timeout);
    console.log($window);
    console.log($location);
    console.log(contentOneFactory);
    console.log(contentConstant);
    console.log(appCookie);

    // $rootScope.$state = $state;
    // $rootScope.$on('$stateChangeStart', function(e: any, toState: any, toParams: any, fromState: any) {
    //     console.log(e);
    //     console.log(toParams);

    //     let isOnLoginPage = /login/.test(toState.name);
    //     // Ease1 Todo: enter and exit functionalities, need to tie these into site Catalyst when we get the params
    //     easeEvent.exiting({
    //         type: 'exit',
    //         event: fromState.name
    //     });
    //     easeEvent.entering({
    //         type: 'entry',
    //         event: toState.name
    //     });
    //     if (isOnLoginPage) {
    //         idle.unwatch();
    //     } else {
    //         idle.watch();
    //     }
    // });
    // $rootScope.$on('$stateChangeError', function(e: any) {
    //     e.preventDefault();
    // });

    // let pageTitle = 'Standalone';
    // $rootScope.$on('$stateChangeSuccess', function() {
    //     if ($state.current.title) {
    //         $rootScope.title = pageTitle + ' | ' + $state.current.title;
    //     }
    // });

    // $rootScope.$on('featureToggleUsabilla', function() {
    //     let featureToggleData = featureToggleFactory.getFeatureToggleDataSingle(easeConstant.features.usabillaFeature),
    //         isUsabillaButtonDisplay = featureToggleData[easeConstant.features.usabillaFeature];
    //     if (isUsabillaButtonDisplay) {
    //         let sessionId = appCookie.read('TLTSID');
    //         $timeout(function() {
    //             if ('usabilla_live' in $window) {
    //                 $window.usabilla_live(isUsabillaButtonDisplay ? 'show' : 'hide');
    //                 $window.usabilla_live('data', {
    //                     'custom': { 'SessionID': sessionId }
    //                 });
    //             }
    //         }, 500);
    //     } else {
    //         'usabilla_live' in $window && $window.usabilla_live('hide');
    //     }
    // });

    featureToggleFactory.initializeFeatureToggleData(easeConstant.features.usabillaFeature);

    languageToggleService.registerRefreshOnTranslateAddPartEvent();
    languageToggleService.registerThrowErrorOnMissingTranslationErrorEvent();
    languageToggleService.registerThrowErrorOnTranslateLoadFailureEvent();
    languageToggleService.registerChangeLanguageOnCustomerPreferencesLoadedEvent();

    setTimeout(() => {
      $state.go('mainState', {}, { location: false });
    }, 0);
  }
  (<any>runFn).$inject = ['$rootScope', 'easeEvent', '$state', 'summaryService', 'Idle', 'EASEUtilsFactory',
    'languageToggleService', 'featureToggleFactory', 'EaseConstant', '$timeout', '$window', '$location',
    'contentOneFactory', 'ContentConstant', 'appCookie'];
  return runFn;
}

function ocLazyLoadStateFactory($q: any, $ocLazyLoad: any, futureState: any) {
  let deferred = $q.defer();
  $ocLazyLoad.load(futureState.src).then(function () {
    deferred.resolve();
  }, function (error: any) {
    deferred.reject(error);
  });
  return deferred.promise;
}

/**
 * Configure Angular Translate.
 *
 * @param $translateProvider the provider to configure.
 * @param easeConstant Constants for Ease
 */
function configureTranslateProvider($translateProvider: any, easeConstant: any) {
  $translateProvider.useLoader('UniversalTranslate', {
    baseUrl: easeConstant.baseUrl
  });
  $translateProvider.preferredLanguage('en_US');
  $translateProvider.useLoaderCache(true);
  $translateProvider.useStorage('languageToggleStorage');
  $translateProvider.useMissingTranslationHandler('languageToggleMissingTranslationHandler');
  $translateProvider.useSanitizeValueStrategy('escapeParameters');
}

function configureIdleandKeepaliveProvider(idleProvider: any, keepaliveProvider: any, easeConstant: any) {
  idleProvider.idle(easeConstant.kIdleTime);
  idleProvider.timeout(easeConstant.kTimeoutTime);
  keepaliveProvider.http(easeConstant.baseUrl + easeConstant.keepaliveUrl);
  keepaliveProvider.interval(easeConstant.keepaliveInterval);
}


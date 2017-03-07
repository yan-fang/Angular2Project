function getRequireJsDeps() {
  return [
    'require', 'angular', 'easeUIComponents', 'easeCoreUtils',
    'UMMModule', 'TransferModule', 'AccountDetailModule', 'AccountSummaryModule',
    'SummaryHeaderModule', 'GlobalFooterModule', 'EscapeHatchModule',
    'LanguageToggleService'
  ];
}

function getEaseAngularDeps() {
  return [
    'ngAnimate', 'ngAria', 'ngStorage',
    'ui.router', 'ct.ui.router.extras.future',
    'oc.lazyLoad', 'restangular', 'ngIdle',
    'EaseProperties', 'ContentProperties',
    'EaseExceptionsModule', 'pubsubServiceModule',
    'easeAppUtils',
    'easeAccordion', 'accountServicesModule', 'EaseLocalizeModule', 'CommonModule',
    'EaseDatePicker', 'easeMultiDateSelector', 'easeDateRangePicker', 'Easetooltip',
    'easeDropdownModule', 'easeGoogleMap', 'filterComponent', 'EaseModalModule',
    'GlobalFooterModule', 'SummaryHeaderModule', 'EscapeHatchModule',
    'easeUIComponents',
    'pascalprecht.translate', 'LanguageToggleModule', 'UniversalTranslateModule',
    'AccountDetailsModule', 'summaryModule'
  ];
}

function configFn($stateProvider, $futureStateProvider, $ocLazyLoadProvider, $urlRouterProvider, EaseConstant,
  KeepaliveProvider, IdleProvider, $translateProvider, $locationProvider, $compileProvider) {
  $compileProvider.debugInfoEnabled(false);

  $locationProvider.html5Mode(false);
  $ocLazyLoadProvider.config({
    jsLoader: requirejs
  });
  var loadAndRegisterFutureStates = function($http) {
    // [TODO][SD] This should be served from end-point so that it is user specific
    return $http.get('/bower_components/EASECoreLite/futureStates.json').then(function(resp) {
      angular.forEach(resp.data, function(fstate) {
        //register each lobs returned from this call with $futureStateProvider
        $futureStateProvider.futureState(fstate);
      });
    });
  };
  $futureStateProvider.stateFactory('ocLazyload', ocLazyLoadStateFactory);
  $futureStateProvider.addResolve(loadAndRegisterFutureStates);
  configureIdleandKeepaliveProvider(IdleProvider, KeepaliveProvider, EaseConstant);
  configureTranslateProvider($translateProvider, EaseConstant);

  var mainState = {
    name: 'mainState',
    url: '/*path',
    onEnter: function($injector) {
      var summaryService = $injector.get('summaryService');
      var EASEUtilsFactory = $injector.get('EASEUtilsFactory');
      EASEUtilsFactory.defaultHandler(summaryService);
    }
  };

  $stateProvider.state(mainState);
  // End
}

configFn.$inject = ['$stateProvider', '$futureStateProvider', '$ocLazyLoadProvider', '$urlRouterProvider',
  'EaseConstant', 'KeepaliveProvider', 'IdleProvider', '$translateProvider', '$locationProvider', '$compileProvider'
];

function runFn($rootScope, easeEvent, $state, summaryService, Idle, EASEUtilsFactory,
  languageToggleService, featureToggleFactory, EaseConstant, $timeout, $window, $location,
  contentOneFactory, ContentConstant, appCookie) {
  var url = $location.absUrl();
  $rootScope.$state = $state;
  $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState) {
    var isOnLoginPage = /login/.test(toState.name);
    //Todo: enter and exit functionalities, need to tie these into site Catalyst when we get the params
    easeEvent.exiting({
      type: 'exit',
      event: fromState.name
    });
    easeEvent.entering({
      type: 'entry',
      event: toState.name
    });
    if (isOnLoginPage) {
      Idle.unwatch();
    } else {
      Idle.watch();
    }
  });
  $rootScope.$on('$stateChangeError', function(e) {
    e.preventDefault();
  });

  var pageTitle = "Standalone";
  $rootScope.$on('$stateChangeSuccess', function() {
    if ($state.current.title) {
      $rootScope.title = pageTitle + ' | ' + $state.current.title;
    }
  });

  $rootScope.$on('featureToggleUsabilla', function() {
    var featureToggleData = featureToggleFactory.getFeatureToggleDataSingle(EaseConstant.features.usabillaFeature),
      isUsabillaButtonDisplay = featureToggleData[EaseConstant.features.usabillaFeature];
    if (isUsabillaButtonDisplay) {
      var sessionId = appCookie.read('TLTSID');
      $timeout(function() {
        if ('usabilla_live' in $window) {
          $window.usabilla_live(isUsabillaButtonDisplay ? 'show' : 'hide');
          $window.usabilla_live('data', {
            'custom': { 'SessionID': sessionId }
          });
        }
      }, 500);
    } else {
       'usabilla_live' in $window && $window.usabilla_live('hide');
    }
  });

  featureToggleFactory.initializeFeatureToggleData(EaseConstant.features.usabillaFeature);

  languageToggleService.registerRefreshOnTranslateAddPartEvent();
  languageToggleService.registerThrowErrorOnMissingTranslationErrorEvent();
  languageToggleService.registerThrowErrorOnTranslateLoadFailureEvent();
  languageToggleService.registerChangeLanguageOnCustomerPreferencesLoadedEvent();
}

runFn.$inject = ['$rootScope', 'easeEvent', '$state', 'summaryService', 'Idle', 'EASEUtilsFactory',
  'languageToggleService', 'featureToggleFactory', 'EaseConstant', '$timeout', '$window', '$location',
  'contentOneFactory', 'ContentConstant', 'appCookie'
];

function ocLazyLoadStateFactory($q, $ocLazyLoad, futureState) {
  var deferred = $q.defer();
  $ocLazyLoad.load(futureState.src).then(function() {
    deferred.resolve();
  }, function(error) {
    deferred.reject(error);
  });
  return deferred.promise;
}

/**
 * Configure Angular Translate.
 *
 * @param $translateProvider the provider to configure.
 * @param EaseConstant Constants for Ease
 */
function configureTranslateProvider($translateProvider, EaseConstant) {
  $translateProvider.useLoader('UniversalTranslate', {
    baseUrl: EaseConstant.baseUrl
  });
  $translateProvider.preferredLanguage('en_US');
  $translateProvider.useLoaderCache(true);
  $translateProvider.useStorage('languageToggleStorage');
  $translateProvider.useMissingTranslationHandler('languageToggleMissingTranslationHandler');
  $translateProvider.useSanitizeValueStrategy('escapeParameters');
}

function configureIdleandKeepaliveProvider(IdleProvider, KeepaliveProvider, EaseConstant) {
  IdleProvider.idle(EaseConstant.kIdleTime);
  IdleProvider.timeout(EaseConstant.kTimeoutTime);
  KeepaliveProvider.http(EaseConstant.baseUrl + EaseConstant.keepaliveUrl);
  KeepaliveProvider.interval(EaseConstant.keepaliveInterval);
}

define(getRequireJsDeps(), function(require, angular) {
  'use strict';
  require(['optional!pubSubBootstrap', 'optional!usabilla'], function() {
    'usabilla_live' in window && window.usabilla_live('hide');
  });
  angular.module('EASEApp', getEaseAngularDeps())
    .config(configFn)
    .run(runFn);
});

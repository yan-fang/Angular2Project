'use strict';

function getRequireJsDeps() {
  return [
    'require', 'angular', 'coreloader', 'easeUIComponents', 'easeCoreUtils',
    'WelcomeModule', 'UMMModule', 'TransferModule', 'AtmFinderModule', 'AccountDetailModule',
    'SummaryHeaderModule', 'GlobalFooterModule', 'customerSettings', 'personalInformationModule',
    'SecurityModule', 'SessionTimeoutModule', 'EscapeHatchModule', 'AccountSummaryModule',
    'LanguageToggleService', 'LogoutModule', 'AlertsModule', 'coreFeatures'
  ];
}

define(getRequireJsDeps(), function(require, angular, coreloader) {

  require(['optional!pubSubBootstrap', 'optional!usabilla'], function() {
    'usabilla_live' in window && window.usabilla_live('hide');
  });

  function getEaseAngularDeps() {
    return [
      'ngAnimate', 'ngAria', 'ngStorage',
      'ui.router', 'ct.ui.router.extras.future',
      'oc.lazyLoad', 'restangular', 'ngIdle',
      'EaseProperties', 'ContentProperties',
      'EaseExceptionsModule', 'pubsubServiceModule',
      'easeTemplates', 'easeAppUtils',
      'easeAccordion', 'accountServicesModule', 'EaseLocalizeModule', 'CommonModule',
      'EaseDatePicker', 'easeMultiDateSelector', 'easeDateRangePicker', 'Easetooltip',
      'easeDropdownModule', 'filterComponent', 'EaseModalModule',
      'GlobalFooterModule', 'SummaryHeaderModule', 'customerSettingsModule',
      'personalInformationModule', 'SecurityModule', 'SessionTimeoutModule', 'EscapeHatchModule',
      'easeUIComponents', 'tmh.dynamicLocale',
      'pascalprecht.translate', 'LanguageToggleModule', 'UniversalTranslateModule',
      'WelcomeModule', 'LogoutModule', 'AccountDetailsModule', 'AlertsModule', 'coreFeatures'
    ];
  }

  configFn.$inject = ['$stateProvider', '$futureStateProvider', '$ocLazyLoadProvider', '$urlRouterProvider',
    'EaseConstant', 'KeepaliveProvider', 'IdleProvider', '$translateProvider', '$locationProvider',
    '$compileProvider', 'languagePreferencesFactoryProvider', 'tmhDynamicLocaleProvider', '$urlMatcherFactoryProvider'
  ];

  function configFn($stateProvider, $futureStateProvider, $ocLazyLoadProvider, $urlRouterProvider, EaseConstant,
    KeepaliveProvider, IdleProvider, $translateProvider, $locationProvider, $compileProvider, i18nProvider, 
    tmhDynamicLocaleProvider, $urlMatcherFactoryProvider) {
    $compileProvider.debugInfoEnabled(false);
    $urlMatcherFactoryProvider.caseInsensitive(true);
    i18nProvider.setInitialLanguagePreferences(coreloader.getLocale());
    !!history.pushState ? $locationProvider.html5Mode(true) : $locationProvider.html5Mode(false);
    $ocLazyLoadProvider.config({
      jsLoader: require
    });
    var loadAndRegisterFutureStates = function($http) {
      // [TODO][SD] This should be served from end-point so that it is user specific
      return $http.get('/ease-ui' + EaseConstant.kBuildVersionPath + '/dist/futureStates.json').then(function(
        resp) {
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
    configureLocaleProvider(tmhDynamicLocaleProvider, EaseConstant);

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

  runFn.$inject = ['$rootScope', 'easeEvent', '$state', 'summaryService', '$templateCache', 'Idle',
    'EASEUtilsFactory',
    'languageToggleService', 'featureToggleFactory', 'EaseConstant', '$timeout', '$window', '$location',
    'contentOneFactory', 'ContentConstant', 'appCookie', 'dateLocalizationService', '$translate',
    'languagePreferencesFactory', 'tmhDynamicLocale', '_', 'ChatService'
  ];

  function runFn($rootScope, easeEvent, $state, summaryService, $templateCache, Idle, EASEUtilsFactory,
    languageToggleService, featureToggleFactory, EaseConstant, $timeout, $window, $location,
    contentOneFactory, ContentConstant, appCookie, dateLocalizationService, $translate, languagePreferencesFactory,
    tmhDynamicLocale, _, ChatService) {
    $rootScope.$state = $state;
    $translate.use(languagePreferencesFactory.currentLocale);
    if (languagePreferencesFactory.currentLocale !== EaseConstant.kEnglishLocale.toLowerCase()) {
      tmhDynamicLocale.set(languagePreferencesFactory.currentLocale.toLowerCase());
    }

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

    var pageTitle = ContentConstant.kCoreGlobalHeaderData[ContentConstant.kCoreGlobalHeaderPageTitle];
    pageTitle = function() {
      var globalHeaderContentOneData = {};
      contentOneFactory.initializeContentOneData(ContentConstant.kHeader, null, languagePreferencesFactory.currentLocale).then(function(data) {
        globalHeaderContentOneData = data[ContentConstant.kCoreGlobalHeader + languagePreferencesFactory.currentLocale.replace('-', '_')];
        EASEUtilsFactory.setglobalHeaderContentData(globalHeaderContentOneData);
        EASEUtilsFactory.setdropdownContentData(data[ContentConstant.kCoreGlobalDropdown + languagePreferencesFactory.currentLocale.replace('-', '_')]);
        pageTitle = globalHeaderContentOneData[ContentConstant.kCoreGlobalHeaderPageTitle] ?
          globalHeaderContentOneData[ContentConstant.kCoreGlobalHeaderPageTitle] :
          ContentConstant.kCoreGlobalHeaderData[ContentConstant.kCoreGlobalHeaderPageTitle];
        $rootScope.$broadcast('headerContentLoaded');
      }, function() {
        globalHeaderContentOneData = ContentConstant.kCoreGlobalHeaderData;
        EASEUtilsFactory.setglobalHeaderContentData(globalHeaderContentOneData);
        EASEUtilsFactory.setdropdownContentData(ContentConstant.kCoreProfileDropdownData);
        pageTitle = globalHeaderContentOneData[ContentConstant.kCoreGlobalHeaderPageTitle];
        $rootScope.$broadcast('headerContentLoaded');
      });
      return pageTitle;
    }();
    $rootScope.$on('$stateChangeSuccess', function() {
      if ($state.current.title) {
        $rootScope.title = pageTitle + ' | ' + $state.current.title;
      }
    });

    var customerPlatformEvent = $rootScope.$on('customerPlatFormReady', function (evt, args) {
      var sessionId = appCookie.read('TLTSID');
      var custom = {};
      var featureToggleData = featureToggleFactory.getFeatureToggleData(),
        isUsabillaButtonDisplay = featureToggleData[EaseConstant.features.usabillaFeature],
        isEscapeHatchDisplay = featureToggleData[EaseConstant.features.enableEscapeHatch],
        isLoadAdobeTarget = featureToggleData[EaseConstant.features.adobeTargetFeature],
        isLoadChat247 = featureToggleData[EaseConstant.features.chat247];
      if (isUsabillaButtonDisplay) {
        $window.usabilla_live(isUsabillaButtonDisplay ? 'show' : 'hide');
      }

      if (isLoadChat247) {
        ChatService.initiateChat();
      }

      if (isLoadAdobeTarget) {
        require(['optional!adobeTarget'], loadUsabilla);
      } else {
        loadUsabilla();
      }

      function loadUsabilla() {
        if (isUsabillaButtonDisplay) {
          custom.sessionId = sessionId;
        }
        if (isEscapeHatchDisplay) {
          custom.spi = args.customerPlatform;
          custom.cardCustomer = (/EOS/i.test(args.customerPlatform) || /COS/i.test(args.customerPlatform)) ? 
          'Yes' : 'No';
        }
        if (isLoadAdobeTarget) {
          var adobeTargetCampaignData = [];
          if ($window.ttMETA) {
            $window.ttMETA.forEach(function(data) {
              if (!_.isEmpty(data.campaign)) {
                adobeTargetCampaignData.push(data.campaign + ' - ' + data.experience);
              }
            });
          }
          custom.adobeTarget = adobeTargetCampaignData.toString()
        }

        $timeout(function () {
          if ('usabilla_live' in $window) {
            $window.usabilla_live('data', {
              'custom': {
                'SessionID': custom.sessionId,
                'SPI': custom.spi,
                'AdobeTarget': custom.adobeTarget,
                'Card Customer': custom.cardCustomer
              }
            });
          }
        }, 500);
      }
      customerPlatformEvent();
    });

    languageToggleService.registerRefreshOnTranslateAddPartEvent();
    languageToggleService.registerThrowErrorOnMissingTranslationErrorEvent();
    languageToggleService.registerThrowErrorOnTranslateLoadFailureEvent();

    // Load the selected locale for the Date Localization Service
    dateLocalizationService.loadLocale(languagePreferencesFactory.currentLocale);
  }

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

    var availableLocaleKeys = ['en_US', 'es_US', 'en_CA', 'fr_CA'];
    var availableLocaleAliases = {
      'en-US': 'en_US',
      'es-US': 'es_US',
      'en-CA': 'en_CA',
      'fr-CA': 'fr_CA'
    };

    $translateProvider.registerAvailableLanguageKeys(availableLocaleKeys, availableLocaleAliases);
    $translateProvider.preferredLanguage('en_US');
    $translateProvider.useLoaderCache(true);
    $translateProvider.useMissingTranslationHandler('languageToggleMissingTranslationHandler');
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
  }

  function configureLocaleProvider(tmhDynamicLocaleProvider, EaseConstant) {
    tmhDynamicLocaleProvider.localeLocationPattern('ease-ui' + EaseConstant.kBuildVersionPath + '/bower_components/angular/i18n/angular-locale_{{locale}}.js');
  }

  function configureIdleandKeepaliveProvider(IdleProvider, KeepaliveProvider, EaseConstant) {
    IdleProvider.idle(EaseConstant.kIdleTime);
    IdleProvider.timeout(EaseConstant.kTimeoutTime);
    KeepaliveProvider.http(EaseConstant.baseUrl + EaseConstant.keepaliveUrl);
    KeepaliveProvider.interval(EaseConstant.keepaliveInterval);
  }

  return angular.module('EASEApp', getEaseAngularDeps())
    .config(configFn)
    .run(runFn);
});

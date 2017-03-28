define(['angular'],
  function(angular) {
    'use strict';

    configFn.$inject = ['$stateProvider', '$urlRouterProvider', 'EaseConstant', 'easeTemplatesProvider',
      'easeFilesProvider', 'addAccountStateProvider', '$urlMatcherFactoryProvider'
    ];

    function configFn($stateProvider, $urlRouterProvider, EaseConstant, easeTemplatesProvider,
      easeFilesProvider, addAccountStateProvider, $urlMatcherFactoryProvider) {

      $urlMatcherFactoryProvider.caseInsensitive(true);

      var customerSettingsState = {
        name: 'customerSettings',
        abstract: true,
        url: '',
        resolve: {
          summaryData: ['summaryService', '$q', function(summaryService, $q) {
            var deferred = $q.defer();
            if (!summaryService.getLobArray().length) {
              summaryService.set().then(function(data) {
                deferred.resolve(data['accounts']);
              }, function() {
                deferred.reject([]);
              });
            } else {
              summaryService.get().then(function(data) {
                deferred.resolve(data['accounts']);
              }, function() {
                deferred.reject([]);
              });
            }
            return deferred.promise;
          }],
          customerPreferencesData: ['EASEUtilsFactory', function(EASEUtilsFactory) {
            if (!EASEUtilsFactory.isCustomerPreferencesDirty()) {
              EASEUtilsFactory.setCustomerSummary();
            }
            return EASEUtilsFactory.getCustomerSummary();
          }],
          contentDataProfilePref: ['contentOneFactory', '$q', 'ContentConstant',
            function(contentOneFactory, $q, ContentConstant) {
              return contentOneFactory.initializeContentOneData(ContentConstant.kProfileprefs);
            }],
          contentDataSettings: ['contentOneFactory', '$q', 'ContentConstant', 'languagePreferencesFactory',
            function(contentOneFactory, $q, ContentConstant, languagePreferencesFactory) {
              var deferred = $q.defer();
              contentOneFactory.initializeContentOneData(ContentConstant.kAccountPreferences, null, 
                languagePreferencesFactory.currentLocale).then(function(data) {
                  deferred.resolve(data[ContentConstant.kCoreAccountPreferences 
                    + languagePreferencesFactory.currentLocale.replace('-','_')]);
                });
              return deferred.promise;
            }],
          errorContentData: ['contentOneFactory', '$q', 'ContentConstant', function(contentOneFactory, $q,
            ContentConstant) {
            var deferred = $q.defer();
            contentOneFactory.initializeContentOneData(ContentConstant.kSnagUrl).then(function(data) {
              deferred.resolve(data);
            }, function() {
              var data = {
                'common_snag_en_US': {
                  'core.common.snag.featureoff.button.label': 'Okay',
                  'core.common.snag.modal.featureoff.label': 'This feature isn’t available right now,' +
                    'but we’re working on it. Try again in a bit.',
                  'core.common.snag.featureoff.short.label': 'This feature is currently unavailable.' +
                    'Try again in a bit.',
                  'core.common.snag.modal.cantsave1.label': 'Something went wrong and we can’t save your',
                  'core.common.snag.modal.header': 'We’ve hit a snag.',
                  'core.common.snag.modal.needtofix.label': 'Looks like we need to fix something, so we’re ' +
                    'working on it. Try again in a bit.',
                  'core.common.snag.transactions.label': 'We can’t display your transactions right now, but ' +
                    'we’re working on it. Please try again in a bit.',
                  'core.common.snag.modal.cantsave2.label': ' Give it another try in a moment.'
                }
              };
              deferred.resolve(data);
            });
            return deferred.promise;
          }],
          i18nData: ['EaseLocalizeService', function(EaseLocalizeService) {
            return EaseLocalizeService.get('customerSettings');
          }],
          customerSettingsDependencies: ['$ocLazyLoad', 'summaryData', '$q', function($ocLazyLoad, summaryData, $q) {
            var deferred = $q.defer();
            $ocLazyLoad.load({
              serie: true,
              files: [easeFilesProvider.get('services', 'CustomerSettings'),
                easeFilesProvider.get('controller', 'CustomerSettings')
              ]
            }).then(function() {
              deferred.resolve('customerSettingsDependencies');
            }, function(error) {
              console.log('Failed to load customerSettingsDependencies: ' + error);
              deferred.reject([]);
            });
            return deferred.promise;
          }]
        },
        controller: 'CustomerSettingsController',
        controllerAs: 'customerSettings',
        templateUrl: easeTemplatesProvider.get('CustomerSettings')
      };
      try {
        $stateProvider.state(customerSettingsState);
      } catch (e) {
        console.log(e);
      }
    }

    return angular.module('customerSettingsModule', ['ui.router', 'restangular', 'oc.lazyLoad',
      'ngImgCrop', 'EaseProperties', 'easeAppUtils', 'EaseLocalizeModule'
    ]).config(configFn);

  });

define(['angular'],
  function(angular) {

    'use strict';

    var SecurityModule = angular.module('SecurityModule',['ngMessages']);
    SecurityModule.config(config);

    config.inject = ['$stateProvider', 'easeTemplatesProvider', 'easeFilesProvider'];

    function config($stateProvider, easeTemplatesProvider, easeFilesProvider) {
      var securityState = {
        name: 'security',
        url: '/security',
        resolve : {
          accountSummaryData: function(summaryService) {
            if (!summaryService.getLobArray().length) {
              return summaryService.set();
            }
            return summaryService.get();
          },
          dependencies: function($ocLazyLoad, $injector) {
            return $ocLazyLoad.load({
              serie: true,
              files: [ easeFilesProvider.get('services', 'Security'),
                easeFilesProvider.get('controller', 'Security'),
                easeFilesProvider.get('directive', 'Security')
              ]
            });
          },
          contentData: function(contentOneFactory, ContentConstant, $q, languagePreferencesFactory, EASEUtilsFactory) {
            var deferred = $q.defer();
            contentOneFactory.initializeContentOneData(ContentConstant.kSecurityPrefs, null,
              languagePreferencesFactory.currentLocale).then(function(data) {
                var labels = data[ContentConstant.kCoreGlobalDropdown
                + languagePreferencesFactory.currentLocale.replace('-', '_')];
                securityState.title = labels['ease.core.profiledropdown.securitysettings.label'];
                EASEUtilsFactory.setCustomerTitleData(securityState.title);
                deferred.resolve(data);
              });
            return deferred.promise;
          },
          featureToggleData: function($q, featureToggleFactory, EaseConstant) {
            var deferred = $q.defer();
            featureToggleFactory.getFeatureToggleDataByGroup(EaseConstant.features.groups.security)
              .then(function(data) {
                deferred.resolve(data);
              });
            return deferred.promise;
          },
          featureToggleDataCIC: function(featureToggleFactory, EaseConstant) {
            return featureToggleFactory.initializeFeatureToggleData(EaseConstant.features.showCICLinkFeature);
          },
          username: ['$q', 'dependencies', 'SecurityFactory', function($q, dependencies, SecurityFactory) {
            var deferred = $q.defer();
            SecurityFactory.fetchUsername().then(function(data) {
              deferred.resolve(data.username)
            });
            return deferred.promise;
          }]

        },

        controller: 'SecurityController',
        controllerAs : 'securityCtrl',
        title: 'Security',
        templateUrl : easeTemplatesProvider.get('Security')
      };

      var changePassword = {
        name: 'security.changePassword',
        url: '/changePassword',
        controller: 'ChangePasswordController'
      };
      var changeUsername = {
        name: 'security.changeUsername',
        url: '/changeUsername',
        controller: 'ChangeUsernameController'
      };
      $stateProvider
        .state(securityState)
        .state(changePassword)
        .state(changeUsername);
    }
    config.$inject = ["$stateProvider", "easeTemplatesProvider", "easeFilesProvider"];

  });

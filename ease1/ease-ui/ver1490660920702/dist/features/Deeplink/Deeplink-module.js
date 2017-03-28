define([
  'angular',
  'DeeplinkProvider',
  'DeeplinkStates'
], function(angular, DeeplinkProvider, DeeplinkStates) {
  var DeeplinkModule = angular.module('DeeplinkModule', []);

  DeeplinkModule.provider('Deeplink', DeeplinkProvider);

  DeeplinkModule
    .config(config);

  config.$inject = ['$stateProvider', 'DeeplinkProvider'];
  function config($stateProvider, DeeplinkProvider) {

    DeeplinkStates.call(DeeplinkProvider);

    $stateProvider
      .state('deepLink', {
        url: '/deepLink/:platformId/:feature/:language?featureLob&product&accountReferenceId',
        resolve: {
          deeplinkDependencies: ["$timeout", "$state", "$stateParams", "$sessionStorage", "Deeplink", "$ocLazyLoad", "appCookie", "EaseConstant", "EASEUtilsFactory", function($timeout, $state, $stateParams, $sessionStorage, Deeplink, $ocLazyLoad,
                                         appCookie, EaseConstant, EASEUtilsFactory) {
            var params = $stateParams;

            if (angular.isUndefined(params.featureLob)) {
              params.featureLob = 'core';
            }

            $sessionStorage.urlParams = params;

            EASEUtilsFactory.setDeepLinkPlatformId(params.platformId);
            EASEUtilsFactory.setDeepLinkSession(params.featureLob);


            if (params.featureLob === 'core') {
              $timeout(function() {
                $state.go(params.feature, {location: 'replace'});
              });
            } else {
              Deeplink.go(params.feature);
            }
          }]
        }
      });
  }

  return DeeplinkModule;
});

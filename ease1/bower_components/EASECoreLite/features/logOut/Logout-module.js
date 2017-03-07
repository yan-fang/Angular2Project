define([
  'angular'
], function(angular) {
  var logoutModule = angular.module('LogoutModule', []);

  logoutModule.config(config);

  config.$inject = ['$stateProvider'];
  function config($stateProvider) {

    $stateProvider
      .state('logout', {
        url: '/logout',
        resolve: {
          logoutCall: function($state, EaseConstant, EASEUtilsFactory) {
            EASEUtilsFactory.logout().then(function(){
              EASEUtilsFactory.redirectToLogoutCentral();
            });
             
          }
        }
      });
  }

  return logoutModule;
});

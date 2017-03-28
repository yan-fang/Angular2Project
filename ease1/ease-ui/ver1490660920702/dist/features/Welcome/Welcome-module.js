define([
  'angular'
], function(angular) {
  var WelcomeModule = angular.module('WelcomeModule', ['ct.ui.router.extras.future']);

  WelcomeModule.config(config)
    .factory('WelcomeFactory',WelcomeFactory)
    .controller('WelcomeController', WelcomeController)
    .controller('EscidController', EscidController);


  config.$inject = ['$stateProvider', 'easeTemplatesProvider', '$urlRouterProvider',
    '$futureStateProvider', 'EaseConstant'];
  function config($stateProvider, easeTemplatesProvider, $urlRouterProvider, $futureStateProvider, EaseConstant) {

    $stateProvider
      .state('welcome', {
        url: '/welcome',
        templateUrl: easeTemplatesProvider.get('Welcome'),
        controller: 'WelcomeController',
        controllerAs: 'welcome',
        title: 'Welcome'
      });

    $stateProvider
      .state('escid', {
        params: {
          value:''
        },
        resolve: {
          i18nData: ["EaseLocalizeService", function (EaseLocalizeService) {
            return EaseLocalizeService.get('login');
          }]
        },
        templateUrl: easeTemplatesProvider.get('Welcome', '', 'Escidindex'),
        controller: 'EscidController',
        controllerAs: 'escid'
      });

    $urlRouterProvider.when(EaseConstant.states.kCreditCardDeepLinkUrl, ['$state', '$interval',
      function($state, $interval){
        var checkFutureStates = $interval(function() {
          var futureStates = $futureStateProvider.get();
          if (!_.isEmpty(futureStates)) {
            $interval.cancel(checkFutureStates);
            $state.go(EaseConstant.states.kCreditCardDeepLink);
          }
        }, 100);
      }]);
  }

  EscidController.$inject =['$stateParams', 'i18nData'];
  function EscidController($stateParams, i18nData){

    var vm = this;

    angular.extend(vm, {
      i18n: i18nData
    });

    vm.escidMessage = $stateParams.value.displayMessage;
  }


  WelcomeController.$inject =['$state','EaseConstant', 'pubsubService', 'WelcomeFactory', 'appCookie', '$location'];
  function WelcomeController($state, EaseConstant, pubsubService, WelcomeFactory, appCookie, $location) {
    var vm = this;
    var isCore = false;

    var navigationParams = readNavigationCookieAndConvertToJSON();

    if (navigationParams && navigationParams.action && navigationParams.product) {
      $state.get().some(function(each) {
        if (each && each.url && each.url.toLowerCase().indexOf(navigationParams.action.toLowerCase()) > 0) {
          isCore = true;
          if(navigationParams.acctrefid) {
            $location.url('/' + EaseConstant.states.kAccountSummary + '/' + navigationParams.acctrefid
              + '/' + navigationParams.action);
            appCookie.erase(EaseConstant.cookies.kNavigation);
          }else {
            if(navigationParams.action.toLowerCase()==='pay' && navigationParams.product.toLowerCase()==='card') {
              isCore = false;
            } else {
              $state.go(each.name);
              appCookie.erase(EaseConstant.cookies.kNavigation);
            }
          }
          return true;
        }
        return false;
      })

      if(!isCore) {
        switch (navigationParams.product.toLowerCase()) {
          case 'card' : {
            $location.url(EaseConstant.states.kCreditCardDeepLinkUrl);
            break;
          }
          case 'enterprise' : {
            appCookie.erase(EaseConstant.cookies.kNavigation);
            goToAccountSummary();
            break;
          }
          default : {
            $location.url('/' + navigationParams.product + '/' + navigationParams.acctrefid
              + '/' + navigationParams.action);
          }
        }
      }
    } else {
      goToAccountSummary();
    }

    function readNavigationCookieAndConvertToJSON() {
      var navigationCookie = appCookie.read(EaseConstant.cookies.kNavigation);
      var navigationParams;

      if (navigationCookie) {
        try {
          navigationParams = JSON.parse(JSON.parse(navigationCookie));
        } catch (e) {
          console.log('error while parsing navigation cookie value');
        }

        navigationParams = _.mapKeys(navigationParams, function (value, key) {
          return key.toLowerCase();
        });
      }

      return navigationParams;
    }

    function goToAccountSummary(){
      WelcomeFactory.initMessageCache();
      $state.go(EaseConstant.states.kAccountSummary);
    }
  }

  WelcomeFactory.$inject = ['Restangular', 'easeExceptionsService', 'EaseConstant', 'EASEUtilsFactory'];
  function WelcomeFactory(Restangular, easeExceptionsService, EaseConstant, EASEUtilsFactory){

    var factory = {
      initMessageCache:initMessageCache
    };

    function initMessageCache() {
      EASEUtilsFactory.setCustomerActivityHeader('50000');
      Restangular.setBaseUrl(EaseConstant.baseUrl);
      var initMessageCacheService = Restangular.all(EaseConstant.kInitMessageCacheUrl);

      initMessageCacheService.get('').then(function(data) {
        // do nothing
      }, function(ex) {
        throw easeExceptionsService.createEaseException({
          'module': 'LoginModule.services',
          'function': 'factory.loginBackendFactory.initMessageCache',
          'message': ex.statusText,
          'cause': ex
        });
      });
    }

    return factory;

  }
});

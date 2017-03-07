define([
  'angular',
  'EscapeHatchLinks'],
  function(angular) {
    'use strict';
    angular.module('EscapeHatchModule', ['easeAppUtils', 'ui.router', 'EscapeHatchLinks'])
      .factory('EscapeHatchFactory', ['EscapeHatchLinks', 'EASEUtilsFactory', '$sessionStorage', 'EaseConstant','$q',
        'customerPlatformDetailsFactory', EscapeHatchFactory])
      .directive('escapeHatch', EscapeHatchDirective)
      .controller('EscapeHatchController', EscapeHatchController);

    function EscapeHatchDirective() {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: '/ease-ui/dist/features/EscapeHatch/html/EscapeHatch-banner.html',
        controller: EscapeHatchController,
        controllerAs: 'escape'
      }
    }

    function EscapeHatchController(EscapeHatchFactory, $scope, $rootScope, $state, $sessionStorage, EASEUtilsFactory,
      pubsubService, featureToggleFactory, EaseConstant, customerPlatformDetailsFactory, EaseModalService, $q, summaryService) {
      var vm = this;
      // models
      angular.extend(vm, {
        lobs : null,
        displayHatch: '',
        modalType: 'escapeModal'
      });

      // methods
      angular.extend(vm, {
        open: function() {
          openHatch();
        },
        close: function() {
          closeHatch();
        },
        captureClick: function(lob) {
          pubsubService.pubsubTrackAnalytics({
            name : lob + ':escape hatch:button'
          });
        }
      });

      $rootScope.$on('$stateChangeSuccess',
          function (event, toState) {
              vm.displayEscapeHatch = !(/logout/.test(toState.name) || /welcome/.test(toState.name) || /escid/.test(toState.name));
      });

      $rootScope.$on('logout', function(){
              vm.displayEscapeHatch = false;
      });

      featureToggleFactory.initializeFeatureToggleData(EaseConstant.features.enableEscapeHatch).then(function (data) {
        if (data[EaseConstant.features.enableEscapeHatch]) {
          customerPlatformDetailsFactory.initializeCustomerPlatform().then(
            function (platformData) {
              vm.featureAvailable = platformData.customerPlatform.indexOf('EASEM') === -1 &&
                platformData.customerPlatform.indexOf('EASEW') === -1 &&
                platformData.customerPlatform.indexOf('EASE') > -1;
              if (vm.featureAvailable) {
                EscapeHatchFactory.getAccounts(summaryService).then(function(data) {
                  vm.lobs =  EscapeHatchFactory.getLobsAuth(data['accounts']);
                })
              }
            });
        }

      });

      function openHatch() {
        EaseModalService('/ease-ui/dist/features/EscapeHatch/html/EscapeHatch-index.html', {});
        pubsubService.pubsubTrackAnalytics({
          name : 'escape hatch link'
        });
        pubsubService.pubsubPageView({
          scDLLevel1: 'ease',
          scDLLevel2: 'escape hatch',
          scDLLevel3: '',
          scDLLevel4: '',
          scDLLevel5: '',
          scDLCountry: 'us',
          scDLLanguage: 'english',
          scDLSystem: 'ease_web',
          scDBLOB: ''
        });
      }

      function closeHatch() {
        vm.displayHatch = '';
        var currentState = $state.current.name;
        var pubsubLevel2 = getPubSubLevel2(currentState);
        var pubsubLevel3 = currentState.indexOf('customerSettings') !== -1 ? getPubSubLevel3(currentState) : '';
        var pubsubLOB = currentState.indexOf('transactions') !== -1 ? getPubSubLOB(currentState) : '';
        pubsubService.pubsubPageView({
          scDLLevel1: 'ease',
          scDLLevel2: pubsubLevel2,
          scDLLevel3: pubsubLevel3,
          scDLLevel4: '',
          scDLLevel5: '',
          scDLCountry: 'us',
          scDLLanguage: 'english',
          scDLSystem: 'ease_web',
          scDBLOB: pubsubLOB
        });
        $scope.$modalCancel();
      }

      function getPubSubLevel2(currentState) {
        if (currentState === 'accountSummary') {
          return 'account summary';
        } else if (currentState.indexOf('customerSettings') !== -1) {
          return 'profile preferences';
        } else {
          return 'account details';
        }
      }

      function getPubSubLevel3(currentState) {
        if (currentState.indexOf('personalInformation') !== -1) {
          return 'personal information';
        } else if (currentState.indexOf('settings') !== -1) {
          return 'settings';
        } else {
          return 'messages and alerts';
        }
      }

      function getPubSubLOB(currentState) {
        if (currentState.indexOf('HomeLoans') !== -1) {
          return 'home loans';
        } else if (currentState.indexOf('AutoLoan') !== -1) {
          return 'coaf';
        } else if (currentState.indexOf('CreditCard') !== -1) {
          return 'card';
        } else {
          return '360';
        }
      }
    };

    function EscapeHatchFactory(EscapeHatchLinks, EASEUtilsFactory, $sessionStorage, EaseConstant, $q) {
      var lobs = [
        {
          'name' : 'bank',
          'description' : 'Capital One Bank',
          'pubsubVal' : 'retail',
          'id' : 'liBank',
          'linkId' : 'linkBank',
          'image' : '/ease-ui' + EaseConstant.kBuildVersionPath +
            '/dist/features/EscapeHatch/images/hatch-bank-icon.png',
          'linkToUse' : '',
          'linkLogin' : EscapeHatchLinks.urlBankLogin,
          'linkAuth' : EscapeHatchLinks.urlBankAuth
        },
        {
          'name' : 'card',
          'description' : 'Credit Cards',
          'pubsubVal' : 'card',
          'id' : 'liCard',
          'linkId' : 'linkCard',
          'image' : '/ease-ui' + EaseConstant.kBuildVersionPath +
            '/dist/features/EscapeHatch/images/hatch-card-icon.png',
          'linkToUse' : '',
          'linkLogin' : EscapeHatchLinks.urlCardLogin,
          'linkAuth' : EscapeHatchLinks.urlCardAuth
        },
        {
          'name' : '360',
          'description' : 'Capital One 360',
          'pubsubVal' : '360',
          'id' : 'li360',
          'linkId' : 'link360',
          'image' : '/ease-ui' + EaseConstant.kBuildVersionPath +
            '/dist/features/EscapeHatch/images/hatch-360-icon.png',
          'linkToUse' : '',
          'linkLogin' : EscapeHatchLinks.url360Login,
          'linkAuth' : EscapeHatchLinks.url360Auth
        },
        {
          'name' : 'auto',
          'description' : 'Auto Loans',
          'pubsubVal' : 'coaf',
          'id' : 'liAuto',
          'linkId' : 'linkAuto',
          'image' : '/ease-ui' + EaseConstant.kBuildVersionPath +
            '/dist/features/EscapeHatch/images/hatch-auto-icon.png',
          'linkToUse' : '',
          'linkLogin' : EscapeHatchLinks.urlAutoLogin,
          'linkAuth' : EscapeHatchLinks.urlAutoAuth
        },
        {
          'name' : 'home',
          'description' : 'Home Loans',
          'pubsubVal' : 'home loans',
          'id' : 'liHome',
          'linkId' : 'linkHome',
          'image' : '/ease-ui' + EaseConstant.kBuildVersionPath +
            '/dist/features/EscapeHatch/images/hatch-home-icon.png',
          'linkToUse' : '',
          'linkLogin' : EscapeHatchLinks.urlHomeLogin,
          'linkAuth' : EscapeHatchLinks.urlHomeAuth
        }
      ];

      var lobNotations = {
        'retail' : 'bank',
        'MMA' : 'bank',
        'CC' : 'card',
        '360' : '360',
        'AL' : 'auto',
        'MLA' : 'home',
        'HLC' : 'home',
        'HIL' : 'home',
        'ILA' : 'home'
      }

      return {
        getLobsLogin: function() {
          lobs.forEach(function(lob) {
            lob.linkToUse = lob.linkLogin;
          });
          return lobs;
        },
        getAccounts: function(summaryService) {
          var deferred = $q.defer();
          if (EASEUtilsFactory.getSummaryData().accounts) {
            deferred.resolve(EASEUtilsFactory.getSummaryData());
          } else {
            summaryService.set().then(function() {
              deferred.resolve(EASEUtilsFactory.getSummaryData());
            });

          }
          return deferred.promise;
        },
        getLobsAuth: function(accounts) {
          var newLobs = [];
          var accountData = accounts;
          var accountSet = {
            'bank' : 'false',
            'card' : 'false',
            '360' : 'false',
            'auto' : 'false',
            'home' : 'false'
          };

          if (accountData) {
            accountData.forEach(function(account) {
            var lob = account.subCategory === null || account.subCategory === '' ? account.category :
              account.subCategory;
              accountSet[lobNotations[lob]] = 'true';
            });
            lobs.forEach(function(lob) {
              if (accountSet[lob.name] === 'true') {
                lob.linkToUse = lob.linkAuth;
                newLobs.push(lob);
              }
            });
          }
          return newLobs;
        }
      }
    }
  }
);

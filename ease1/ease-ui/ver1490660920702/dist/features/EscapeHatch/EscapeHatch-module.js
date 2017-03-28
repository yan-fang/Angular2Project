define(['angular', 'EscapeHatchLinks'],
  function(angular) {
    'use strict';
    angular.module('EscapeHatchModule', ['easeAppUtils', 'ui.router', 'EscapeHatchLinks'])
      .factory('EscapeHatchFactory', EscapeHatchFactory)
      .controller('EscapeHatchController', EscapeHatchController)
      .controller('EscapeBannerController', EscapeBannerController)
      .directive('escapeHatch', EscapeHatchDirective);

    function EscapeHatchDirective() {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: '/ease-ui/dist/features/EscapeHatch/html/EscapeHatch-banner.html',
        controller: 'EscapeBannerController',
        controllerAs: '$ctrl'
      }
    }

    EscapeBannerController.$inject = ['$rootScope', 'EaseModalService', 'pubsubService', 'featureToggleFactory',
      'EaseConstant', 'customerPlatformDetailsFactory'
    ];

    function EscapeBannerController($rootScope, easeModalService, pubsubService, featureToggleFactory, EaseConstant,
      customerPlatformDetailsFactory) {
      var vm = this;
      angular.extend(vm, {
        lobs: [],
        open: function() {
          openHatch();
        }
      });

      function openHatch() {
        easeModalService('/ease-ui/dist/features/EscapeHatch/html/EscapeHatch-index.html', {});
        pubsubService.pubsubTrackAnalytics({
          name: 'escape hatch link'
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

      $rootScope.$on('$stateChangeSuccess',
        function(event, toState) {
          vm.displayEscapeHatch = !(/logout/.test(toState.name) || /welcome/.test(toState.name) || /escid/.test(
            toState.name) || /verify/.test(toState.name));
        });

      $rootScope.$on('logout', function() {
        vm.displayEscapeHatch = false;
      });

      $rootScope.$on('featureToggleReady', function() {
        var featureToggleData = featureToggleFactory.getFeatureToggleData();
        var isEscapeHatchDisplay = featureToggleData[EaseConstant.features.enableEscapeHatch];
        if (isEscapeHatchDisplay) {
          customerPlatformDetailsFactory.initializeCustomerPlatform().then(
            function(platformData) {
              vm.featureAvailable = platformData.customerPlatform.indexOf('EASEM') === -1 &&
                platformData.customerPlatform.indexOf('EASEW') === -1 &&
                platformData.customerPlatform.indexOf('EASE') > -1;
            });
        }
      });
    }

    EscapeHatchController.$inject = ['EscapeHatchFactory', '$scope', '$state', 'pubsubService', 'summaryService'];

    function EscapeHatchController(EscapeHatchFactory, $scope, $state, pubsubService, summaryService) {
      var vm = this;

      EscapeHatchFactory.getAccounts(summaryService).then(function(data) {
        $scope.$evalAsync(function() {
          vm.lobs = EscapeHatchFactory.getLobsAuth(data['accounts']);
        });
      });

      // models
      angular.extend(vm, {
        modalType: 'escapeModal',
        close: function() {
          closeHatch();
        },
        captureClick: function(lob) {
          pubsubService.pubsubTrackAnalytics({
            name: lob + ':escape hatch:button'
          });
        }
      });

      function closeHatch() {
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
    }

    EscapeHatchFactory.$inject = ['EscapeHatchLinks', 'EASEUtilsFactory', 'EaseConstant', '$q'];

    function EscapeHatchFactory(EscapeHatchLinks, EASEUtilsFactory, EaseConstant, $q) {
      var lobs = [{
        'name': 'bank',
        'description': 'Capital One Bank',
        'pubsubVal': 'retail',
        'id': 'liBank',
        'linkId': 'linkBank',
        'image': '/ease-ui' + EaseConstant.kBuildVersionPath +
          '/dist/features/EscapeHatch/images/hatch-bank-icon.png',
        'linkToUse': '',
        'linkLogin': EscapeHatchLinks.urlBankLogin,
        'linkAuth': EscapeHatchLinks.urlBankAuth
      }, {
        'name': 'card',
        'description': 'Credit Cards',
        'pubsubVal': 'card',
        'id': 'liCard',
        'linkId': 'linkCard',
        'image': '/ease-ui' + EaseConstant.kBuildVersionPath +
          '/dist/features/EscapeHatch/images/hatch-card-icon.png',
        'linkToUse': '',
        'linkLogin': EscapeHatchLinks.urlCardLogin,
        'linkAuth': EscapeHatchLinks.urlCardAuth
      }, {
        'name': '360',
        'description': 'Capital One 360',
        'pubsubVal': '360',
        'id': 'li360',
        'linkId': 'link360',
        'image': '/ease-ui' + EaseConstant.kBuildVersionPath +
          '/dist/features/EscapeHatch/images/hatch-360-icon.png',
        'linkToUse': '',
        'linkLogin': EscapeHatchLinks.url360Login,
        'linkAuth': EscapeHatchLinks.url360Auth
      }, {
        'name': 'auto',
        'description': 'Auto Loans',
        'pubsubVal': 'coaf',
        'id': 'liAuto',
        'linkId': 'linkAuto',
        'image': '/ease-ui' + EaseConstant.kBuildVersionPath +
          '/dist/features/EscapeHatch/images/hatch-auto-icon.png',
        'linkToUse': '',
        'linkLogin': EscapeHatchLinks.urlAutoLogin,
        'linkAuth': EscapeHatchLinks.urlAutoAuth
      }, {
        'name': 'home',
        'description': 'Home Loans',
        'pubsubVal': 'home loans',
        'id': 'liHome',
        'linkId': 'linkHome',
        'image': '/ease-ui' + EaseConstant.kBuildVersionPath +
          '/dist/features/EscapeHatch/images/hatch-home-icon.png',
        'linkToUse': '',
        'linkLogin': EscapeHatchLinks.urlHomeLogin,
        'linkAuth': EscapeHatchLinks.urlHomeAuth
      }];

      var lobNotations = {
        'retail': 'bank',
        'MMA': 'bank',
        'CC': 'card',
        '360': '360',
        'AL': 'auto',
        'MLA': 'home',
        'HLC': 'home',
        'HIL': 'home',
        'ILA': 'home'
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
            'bank': 'false',
            'card': 'false',
            '360': 'false',
            'auto': 'false',
            'home': 'false'
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

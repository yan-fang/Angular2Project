define('AccountSummaryModule',['angular'],
  function(angular) {
    'use strict';
    var AccountSummaryModule = angular.module('summaryModule', ['ui.router', 'restangular', 'oc.lazyLoad',
      'EaseProperties', 'ContentProperties', 'easeAppUtils', 'UMMPaymentModule', 'TransferModule',
      'RetailAccountLinks'
    ]);

    summaryConfigFn.$inject = ['$stateProvider', '$urlRouterProvider', 'EaseConstant', 'ContentConstant',
      'easeTemplatesProvider', 'paymentStateProvider', 'easeFilesProvider', 'easePartialsProvider',
      'transferStateProvider', 'addAccountStateProvider', '$urlMatcherFactoryProvider'
    ];

    function summaryConfigFn($stateProvider, $urlRouterProvider, EaseConstant,
      ContentConstant, easeTemplatesProvider, paymentStateProvider, easeFilesProvider, easePartialsProvider,
      transferStateProvider, addAccountStateProvider, $urlMatcherFactoryProvider) {
      $urlMatcherFactoryProvider.caseInsensitive(true);
      var accountSummaryState = {
        name: 'accountSummary',
        url: '/accountSummary',
        resolve: {
          i18nData: ['EaseLocalizeService', 'EASEUtilsFactory', '$q',
            function(EaseLocalizeService, EASEUtilsFactory, $q) {
              var deferred = $q.defer();
              var i18nData = EaseLocalizeService.get('accountSummary').then(function(data) {
                EASEUtilsFactory.setAccSummaryI18(data);
                deferred.resolve(data);
              });
              return deferred.promise;
            }
          ],
          contentDataAccountSummary: ['contentOneFactory', '$q', function(contentOneFactory, $q) {
            var deferred = $q.defer();
            contentOneFactory.initializeContentOneData(ContentConstant.kAccountSummary).then(function(
              contentOne) {
              if (contentOne) {
                deferred.resolve(contentOne);
              } else {
                deferred.resolve({});
              }
            });
            return deferred.promise;
          }],
          'accountSummaryData': ['summaryService', function(summaryService) {
            return summaryService.set(true);
          }],
          'ummPaymentDependencies': ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'UMMPaymentModule',
              files: [easeFilesProvider.get('services', 'UMMPayment')]
            });
          }],
          'accountSummaryDependencies': function() {
            require(['AccountSummaryServices', 'AccountSummaryController', 'AccountSummaryDirectives', 'AccountSummarySingleProdService']);
          },
          'featureToggleData': ['featureToggleFactory', function(featureToggleFactory) {
            return featureToggleFactory.initializeFeatureToggleData();
          }],
          'refreshMessaging': ['accountSummaryData', 'messagingService', 'EASEUtilsFactory', function(
            accountSummaryData, messagingService, EASEUtilsFactory) {
            var pageContext = "AccountSummary";
            var obj = messagingService.getReferenceID(
              accountSummaryData.accounts, true, pageContext, 1, true
            );
            EASEUtilsFactory.setCustomerActivityHeader('50000', EASEUtilsFactory.getCurrentBusinessSyncId());
            messagingService.getMessagesOnAccountSummary(obj);
          }],
          errorContentData: ['contentOneFactory', '$q', 'ContentConstant', function(contentOneFactory, $q,
                                                                                    ContentConstant) {
            var deferred = $q.defer();
            contentOneFactory.initializeContentOneData(ContentConstant.kSnagUrl).then(function(c1data) {
              deferred.resolve(c1data);
            }, function() {
              var data = {
                'common_snag_en_US': {
                  "core.common.snag.modal.header": "We've hit a snag.",
                  "core.common.snag.modal.featureoff.label": "This feature isn’t available right now, but we’re working on it. Try again in a bit.",
                  "core.common.snag.featureoff.short.label": "This feature is currently unavailable. Try again in a bit.",
                  "core.common.snag.featureoff.button.label": "Okay"
                }
              };
              deferred.resolve(data);
            });
            return deferred.promise;
          }]
        },
        controller: 'AccountSummaryController',
        controllerAs: 'summary',
        templateUrl: easeTemplatesProvider.get('AccountSummary'),
        title: 'Account Summary'
      };

      //Setup Transfer Money States Dynamically
      transferStateProvider.set(accountSummaryState, 'accountSummary.transfer', 'accountSummary.transferSuccess',
        'accountSummary.transferCancel', 'accountSummary.transferCancelConfirm', 'accountSummary.transferError',
        'accountSummary.transferEdit');
      var transferMoneyStates = transferStateProvider.get();
      var transferStart = transferMoneyStates.transferStart;
      var transferSuccess = transferMoneyStates.transferSuccess;
      var transferEdit = transferMoneyStates.transferEdit;
      var transferCancel = transferMoneyStates.transferCancel;
      var transferCancelConfirm = transferMoneyStates.transferCancelConfirm;
      var transferError = transferMoneyStates.transferError;

      $stateProvider.state(accountSummaryState)
        .state(transferStart)
        .state(transferSuccess)
        .state(transferEdit)
        .state(transferCancel)
        .state(transferError)
        .state(transferCancelConfirm);

      paymentStateProvider.set('accountSummary.paymentSummary', accountSummaryState);
      addAccountStateProvider.set('SummAccPrefAddExtAccount', accountSummaryState);
    }

    AccountSummaryModule.config(summaryConfigFn);

    AccountSummaryModule.filter('monthName', [function() {
      return function(monthNumber) { //1 = January
        var monthNames = ['January', 'February', 'March', 'April',
          'May', 'June', 'July', 'August', 'September',
          'October', 'November', 'December'
        ];
        return monthNames[monthNumber - 1];
      };
    }]);

    AccountSummaryModule.filter('getAmount', ['EASEUtilsFactory',
      function(EASEUtilsFactory) {
        return function(value) {
          if (typeof value !== 'undefined' && value !== '') {
            return EASEUtilsFactory.getAmountFromValue(value, 'USD');
          } else {
            return '';
          }
        };
      }
    ]);

    AccountSummaryModule.filter('getTransactionAmount',
      function() {
        return function(value, symbol) {
          value = value.format('0,0.00');
          if (value < 0) {
            return '-' + symbol + Math.abs(value);
          } else {
            return symbol + value;
          }
        };
      });

    AccountSummaryModule.filter('getCents', ['EASEUtilsFactory',
      function(EASEUtilsFactory) {
        return function(value) {
          if (typeof value !== 'undefined' && value !== '') {
            if (isNaN(parseFloat(value))) {
              return '';
            }
            return EASEUtilsFactory.getCentsFromValue(value);
          } else {
            return '';
          }
        };
      }
    ]);

    AccountSummaryModule.filter('searchByText', function() {
      return function(items, searchText) {
        var filtered = [],
          searchMatch = new RegExp(searchText, 'i');
        if ((items !== null) && (items.length > 0)) {
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (searchMatch.test(item.transactionMerchant.name) ||
              searchMatch.test(item.transactionMerchant.merchantType)) {
              filtered.push(item);
            }
          }
        }
        return filtered;
      };
    });

    return AccountSummaryModule;
  });

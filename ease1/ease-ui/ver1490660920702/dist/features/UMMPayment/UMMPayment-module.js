define(['angular'], function(angular) {
  'use strict';
  var UMMPaymentModule = angular.module('UMMPaymentModule', ['EaseProperties', 'EaseLocalizeModule', 'easeAppUtils',
    'restangular', 'easeDropdownModule', 'pubsubServiceModule'
  ]);

  UMMPaymentModule.provider('paymentState', ["$stateProvider", "$urlRouterProvider", "$locationProvider", "easeFilesProvider", "EaseConstant", function($stateProvider, $urlRouterProvider, $locationProvider,
                                                     easeFilesProvider, EaseConstant) {

    var provider = this;

    function registerPayment(stateName, parentState, url) {
      $stateProvider.state(stateName, {
        params: {
          payment: ''
        },
        url: !url ? EaseConstant.easeURLs.payment : url,
        parent: parentState,
        resolve: {
          accountSummaryInfo: ['summaryService', function(summaryService) {
            return summaryService.get();
          }],
          ummPaymentService: ['$ocLazyLoad', '$injector', '$stateParams', 'accountSummaryInfo',
            function($ocLazyLoad, $injector, $stateParams, accountSummaryInfo) {
              return $ocLazyLoad.load({
                name: 'UMMPaymentModule',
                files: [easeFilesProvider.get('services', 'UMMPayment')]
              }).then(function() {
                var ummPaymentFactory = $injector.get('UmmPaymentFactory');
                function getCategoryId() {
                  var categoryId;
                  if ($stateParams.payment && $stateParams.payment.lineOfBusiness) {
                    categoryId = $stateParams.payment.lineOfBusiness;
                  } else {
                    accountSummaryInfo.accounts.forEach(function(account) {
                      if (account.referenceId === $stateParams.accountReferenceId) {
                        categoryId = account.category;
                      }
                    });
                  }
                  return categoryId;
                }
                var modalDetails = {
                  category: getCategoryId(),
                  accountRefId: $stateParams.accountReferenceId
                };
                ummPaymentFactory.getUmmPaymentModal(modalDetails, $stateParams);
                return ummPaymentFactory;
              });
            }],
          errorContentData: ['contentOneFactory', 'ContentConstant', '$q', 
            function(contentOneFactory, ContentConstant, $q) {
              var deferred = $q.defer();
              contentOneFactory.initializeContentOneData(ContentConstant.kSnagUrl).then(function(data) {
                deferred.resolve(data);
              }, function() {
                var data = ContentConstant.kcommon_snag_en_US;
                deferred.resolve(data);
              });
              return deferred.promise;
            }]
        }
      });
    }
    angular.extend(provider, {
      set: function(stateName, parentNameState, url) {
        registerPayment(stateName, parentNameState, url);
      }
    });

    this.$get = function() {
      return provider;
    };

  }]);

  return UMMPaymentModule;
});

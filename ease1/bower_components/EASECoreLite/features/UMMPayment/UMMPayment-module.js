define(['angular'], function(angular) {
  'use strict';
  var UMMPaymentModule = angular.module('UMMPaymentModule', ['EaseProperties', 'easeAppUtils', 'restangular',
    'easeDropdownModule', 'pubsubServiceModule'
  ]);

  UMMPaymentModule.provider('paymentState', function($stateProvider, $urlRouterProvider, $locationProvider,
    easeFilesProvider, EaseConstant) {

    var provider = this;

    function registerPayment(stateName, parentState, url) {
      $stateProvider.state(stateName, {
        params: {
          payment: ''
        },
        url: !url ? EaseConstant.easeURLs.payment : url,
        'parent': parentState,
        resolve: {
          'ummPaymentService': function($ocLazyLoad, $injector, $stateParams, EASEUtilsFactory) {
            return $ocLazyLoad.load({
              name: 'UMMPaymentModule',
              files: [easeFilesProvider.get('services', 'UMMPayment')]
            }).then(function() {
              var ummPaymentFactory = $injector.get('UmmPaymentFactory');
              function getCategoryId() {
                var categoryId;
                if ($stateParams.payment && $stateParams.payment.lineOfBusiness) {
                  return $stateParams.payment.lineOfBusiness;
                } else {
                  EASEUtilsFactory.getSummaryData().accounts.forEach(function(account) {
                    if (account.referenceId === $stateParams.accountReferenceId) {
                      categoryId = account.category;
                    }
                  })
                  return categoryId;
                }
              }
              var modalDetails = {
                category: getCategoryId(),
                accountRefId: $stateParams.accountReferenceId
              };
              ummPaymentFactory.getUmmPaymentModal(modalDetails, $stateParams);
              return ummPaymentFactory;
            })
          }
        }
      })
    }
    angular.extend(provider, {
      set: function(stateName, parentNameState, url) {
        registerPayment(stateName, parentNameState, url);
      }
    });

    this.$get = function() {
      return provider;
    };

  });

  return UMMPaymentModule;
});

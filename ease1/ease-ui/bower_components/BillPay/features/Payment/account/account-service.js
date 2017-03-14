define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .factory('AccountsService', AccountsService);

  AccountsService.$inject = [
    'Restangular',
    'BillPayConstants',
    'EaseConstantFactory',
    'EASEUtilsFactory',
    'easeHttpInterceptor',
    'BillPayErrorHandlerService'
  ];

  function AccountsService(
    Restangular,
    BillPayConstants,
    EaseConstantFactory,
    EASEUtilsFactory,
    easeHttpInterceptor,
    BillPayErrorHandlerService
  ) {

    var eligibleAccounts = {};

    var api = {
      getEligibleAccountsRestCall: getEligibleAccountsRestCall,
      getEligibleAccounts: getEligibleAccounts,
      deleteEligibleAccounts: deleteEligibleAccounts
    };

    function getEligibleAccounts() {
      return eligibleAccounts;
    }

    function deleteEligibleAccounts() {
      angular.copy({}, eligibleAccounts);
    }

    function getEligibleAccountsRestCall(subCategory) {

      var headers = {
        EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
        BUS_EVT_ID: BillPayConstants.CUSTOMER_ACC_EVT_ID
      };

      easeHttpInterceptor.setBroadCastEventOnce('BillPay');
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());

      var promise = Restangular.all(BillPayConstants.billPayEligibleAccountsUrl)
        .get('', buildQueryObject(subCategory), headers);
      initializeEligibleAccounts(promise);

      return promise;
    }

    function initializeEligibleAccounts(promise) {
      promise.then(function(data) {
        // 1. everything is ok
        deleteEligibleAccounts();
        angular.copy(data, eligibleAccounts);

        // 2. no account return
        if (!data) BillPayErrorHandlerService.handleError();
      }, function(err) {
        BillPayErrorHandlerService.handleError(err);
      });
    }

    function buildQueryObject(subCategory) {
      return {
        accountSubCategory: subCategory
      };
    }

    /* test-code */
    api.__testonly__ = {};
    api.__testonly__.setEligibleAccounts = function(account) {
      eligibleAccounts = account;
    };
    /* end-test-code */

    return api;
  }

});

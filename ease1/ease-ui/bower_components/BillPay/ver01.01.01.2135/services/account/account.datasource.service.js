define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').factory('AccountDSService', AccountDSService);

  AccountDSService.$inject = [
    '$q',
    'Restangular',
    'BillPayConstants',
    'EaseConstantFactory',
    'easeHttpInterceptor',
    'EASEUtilsFactory',
    'BillPayErrorHandlerService'
  ];

  function AccountDSService(
    $q,
    Restangular,
    BillPayConstants,
    EaseConstantFactory,
    easeHttpInterceptor,
    EASEUtilsFactory,
    BillPayErrorHandlerService
  ) {

    var headers;
    var service;
    var account = {};
    var accounts = {};

    var api = {
      clearData: clearData,
      getAccounts: getAccounts,
      getAccountList: getAccountList,
    };

    function clearData() {
      angular.copy({}, accounts);
    }

    function getAccounts() {
      return accounts;
    }

    function getAccountList(subCategory) {
      preSetRestangular(BillPayConstants.CUSTOMER_ACC_EVT_ID);
      
      var deferred = $q.defer();

      service.get('', { accountSubCategory: subCategory }, headers)
      .then(function(data) {
        angular.copy(data, accounts);
        deferred.resolve(data);
      }, function(err) {
        BillPayErrorHandlerService.handleError(err);
        deferred.reject(err);
      });
      
      return deferred.promise;
    }

    function preSetRestangular(BUS_EVT_ID) {
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      easeHttpInterceptor.setBroadCastEventOnce('BillPay');

      headers = {
        EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
        BUS_EVT_ID: BUS_EVT_ID
      };

      service = Restangular.all(BillPayConstants.billPayEligibleAccountsUrl);
    }


    return api;
  }
});

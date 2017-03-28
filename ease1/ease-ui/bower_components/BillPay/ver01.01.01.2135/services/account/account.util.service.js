define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').factory('AccountUtilService', AccountUtilService);

  AccountUtilService.$inject = [
    'AccountDSService'
  ];

  function AccountUtilService(
    AccountDSService
  ) {
    var api = {
      getAccountByID: getAccountByID
    };

    function getAccountByID(accountId) {
      var accountDetail;
      var accounts = AccountDSService.getAccounts().accounts;
      accounts.forEach(function(element) {
        if (element.referenceId === accountId) accountDetail = element;
      });
      return accountDetail;
    }

    return api;
  }
});

define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .service('BillPayErrorHandlerService', BillPayErrorHandlerService);

  BillPayErrorHandlerService.$inject = [
    '$state',
    'BillPayConstants'
  ];

  function BillPayErrorHandlerService($state, BillPayConstants) {
    var error = {};

    var api = {
      getError: getError,
      deleteError: deleteError,
      handleError: handleError
    }

    function getError() {
      return error;
    }

    function deleteError() {
      error = null;
    }

    function handleError(errorObj, message) {
      deleteError();
      setupErrorMessage(errorObj, message);
      var currentState = $state.current.name;

      // 1. handle error in bank page
      if (/^BankDetails/.test(currentState)) {
        $state.go('BankDetails.billpayError');
        return;
      }

      // 2. handle error in bill pay page
      if (/^BillPay/.test(currentState)) {
        $state.go('BillPay.error');
        return;
      }
    }

    function setupErrorMessage(errorObj, message) {
      if (message) {
        error = message;
      } else {
        error = _.get(errorObj, ['cause', 'data', 'message']) ||
                BillPayConstants.billPayDefaultErrorMsg;
      }
    }

    /* test-code */
    api.__testonly__ = {};
    api.__testonly__.setupErrorMessage = setupErrorMessage;
    api.__testonly__.setError = function(input) {
      error = input;
    }
    /* end-test-code */

    return api;
  }
});

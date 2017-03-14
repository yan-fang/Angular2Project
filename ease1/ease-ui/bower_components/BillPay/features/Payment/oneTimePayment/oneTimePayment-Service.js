define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .service('OneTimePaymentService', OneTimePaymentService)

  OneTimePaymentService.$inject = [
    '$filter',
    'Restangular',
    'BillPayConstants',
    'EaseConstantFactory',
    'EASEUtilsFactory',
    'easeHttpInterceptor',
    'BillPayErrorHandlerService',
    'PayeeListService',
    '$state'
  ];

  function OneTimePaymentService(
    $filter,
    Restangular,
    BillPayConstants,
    EaseConstantFactory,
    EASEUtilsFactory,
    easeHttpInterceptor,
    BillPayErrorHandlerService,
    PayeeListService,
    $state
  ) {

    var paymentInfo = {};
    var actionMode = 'Make';

    var api = {
      getPaymentInfo: getPaymentInfo,
      initPaymentInfo: initPaymentInfo,
      deletePaymentInfo: deletePaymentInfo,
      paymentRestCall: paymentRestCall
    };

    function getPaymentInfo() {
      return paymentInfo;
    }

    function initPaymentInfo(
      payee,
      eligibleAccounts,
      paymentDetail,
      earliestPaymentDate,
      eBillReferenceId,
      transactionReferenceId,
      paymentConfirmationNumber
    ) {
      deletePaymentInfo();
      paymentInfo.payee = payee;
      paymentInfo.account = getAccount(eligibleAccounts, paymentDetail);
      paymentInfo.paymentAmount = getPaymentAmount(paymentDetail);
      paymentInfo.paymentDate = getPaymentDate(earliestPaymentDate, paymentDetail);
      paymentInfo.memoText = getMemoText(paymentDetail);
      paymentInfo.eBillReferenceId = eBillReferenceId;
      paymentInfo.paymentConfirmationNumber = paymentConfirmationNumber;
      paymentInfo.transactionReferenceId = transactionReferenceId;
      actionMode = (!transactionReferenceId) ? 'Make' : 'Edit';
    }

    function deletePaymentInfo() {
      actionMode = 'Make';
      return angular.copy({}, paymentInfo);
    }

    function paymentRestCall() {
      var activityHeader = (actionMode === 'Make') ?
        BillPayConstants.PAYMENT_ADD_EVT_ID :
        BillPayConstants.PAYMENT_EDIT_EVT_ID;

      var headers = {
        EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
        BUS_EVT_ID: activityHeader
      };

      easeHttpInterceptor.setBroadCastEventOnce('BillPay');
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());

      var promise = Restangular.all(BillPayConstants.billPayAddPaymentUrl)
        .customPOST(createRequestBody(), createSubURL(), '', headers);
      windup(promise);

      return promise;
    }

    function createSubURL() {
      var url = encodeURIComponent(paymentInfo.payee.payeeReferenceId);
      if (actionMode === 'Edit') url += '/' + encodeURIComponent(paymentInfo.transactionReferenceId);
      return url;
    }

    function createRequestBody() {
      var request = {};
      request.payeeReferenceId = paymentInfo.payee.payeeReferenceId;
      request.paymentAmount = getAmount(paymentInfo.paymentAmount);
      request.paymentDate = $filter('date')(paymentInfo.paymentDate, 'yyyy-MM-dd');
      request.memoText = paymentInfo.memoText;
      request.accountReferenceId = paymentInfo.account.referenceId;
      request.eBillReferenceId = paymentInfo.eBillReferenceId;

      // clean memo text
      if (/^\s*$/.test(request.memoText)) request.memoText = undefined;

      return request;
    }

    function windup(promise) {
      // var accountReferenceId = paymentInfo.account.referenceId
      promise.then(function(data) {
        PayeeListService.updatePayeeList($state.params.accountReferenceId);
        paymentInfo.paymentAmount = getAmount(paymentInfo.paymentAmount);
        paymentInfo.paymentConfirmationNumber = data.paymentConfirmationNumber;
        paymentInfo.transactionReferenceId = data.transactionReferenceId;
      }, function(err) {
        PayeeListService.updatePayeeList($state.params.accountReferenceId);
        BillPayErrorHandlerService.handleError(err);
      });
    }

    function getAmount(input) {
      if ((typeof input) === 'number') return input;
      input = input.replace(/[^\d|\.+]/g, '');
      return parseFloat(input);
    }

    function getAccount(eligibleAccounts, paymentDetail) {
      if (!paymentDetail.payerDetail) {
        if (!eligibleAccounts || !eligibleAccounts.accounts) return;
        return eligibleAccounts.accounts[0];
      }
      var payerDetail = paymentDetail.payerDetail;
      var accounts = eligibleAccounts.accounts;

      for (var i = 0; i < accounts.length; i++) {
        var account = accounts[i];
        if (account.referenceId === payerDetail.accountReferenceId) return account;
      }
    }

    function getPaymentAmount(paymentDetail) {
      if (!paymentDetail.transactionInfo) return;
      return paymentDetail.transactionInfo.paymentAmount;
    }

    function getPaymentDate(earliestPaymentDate, paymentDetail) {
      var transactionInfo = paymentDetail.transactionInfo;
      if (!transactionInfo) return earliestPaymentDate;
      return new Date(transactionInfo.paymentDetailDates.paymentDate);
    }

    function getMemoText(paymentDetail) {
      if (!paymentDetail.transactionInfo) return '';
      return paymentDetail.transactionInfo.paymentMemo;
    }

    /* test-code */
    api.__testonly__ = {};
    api.__testonly__.setPaymentInfo = function(input) {
      paymentInfo = input;
    }
    api.__testonly__.setActionMode = function(input) {
      actionMode = input;
    }
    api.__testonly__.getActionMode = function() {
      return actionMode;
    }
    api.__testonly__.getAccount = getAccount;
    api.__testonly__.getAmount = getAmount;
    api.__testonly__.createRequestBody = createRequestBody;
    /* end-test-code */

    return api;
  }

});

define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').factory('OneTimePaymentUtilService', OneTimePaymentUtilService);

  OneTimePaymentUtilService.$inject = [
    '$stateParams',
    'PaymentDateService',
    'OneTimePaymentDSService',
    'RecurringPaymentUtilService'
  ];

  function OneTimePaymentUtilService(
    $stateParams,
    PaymentDateService,
    OneTimePaymentDSService,
    RecurringPaymentUtilService
  ) {
    var oneTimeForm = {};

    var api = {
      getForm: getForm,
      initForm: initForm,
      initEditForm: initEditForm,
      initFormFromRecurring: initFormFromRecurring
    };

    function getForm() {
      return oneTimeForm;
    }

    function initForm(payee, account) {
      emptyForm();

      oneTimeForm = {
        transactionReferenceId: undefined,
        payeeReferenceId: payee.payeeReferenceId,
        accountReferenceId: account.accounts.referenceId,
        eBillReferenceId: $stateParams.unscheduledeBillReferenceId,
        paymentDate: new Date(PaymentDateService.getEarliestPaymentDate(payee)),
        paymentAmount: undefined,
        memoText: undefined
      }

      return oneTimeForm;
    }

    function initFormFromRecurring(payee, account) {
      initForm(payee, account);
      var recurringForm = RecurringPaymentUtilService.getForm()

      oneTimeForm.accountReferenceId = recurringForm.accountReferenceId;
      oneTimeForm.paymentDate = new Date(recurringForm.firstPaymentDate);
      oneTimeForm.paymentAmount = recurringForm.paymentAmount;

      return oneTimeForm;
    }

    function initEditForm(payee, account) {
      var paymentDetail = OneTimePaymentDSService.getPaymentDetail();
      initForm(payee, account);

      oneTimeForm.transactionReferenceId = paymentDetail.paymentReferenceId;
      oneTimeForm.accountReferenceId = paymentDetail.payerDetail.accountReferenceId;
      oneTimeForm.paymentDate = new Date(paymentDetail.transactionInfo.paymentDetailDates.paymentDate);
      oneTimeForm.paymentAmount = paymentDetail.transactionInfo.paymentAmount;
      oneTimeForm.memoText = paymentDetail.transactionInfo.paymentMemo;
      
      return oneTimeForm;
    }

    function emptyForm() {
      angular.copy({}, oneTimeForm);
    }


    return api;
  }
});
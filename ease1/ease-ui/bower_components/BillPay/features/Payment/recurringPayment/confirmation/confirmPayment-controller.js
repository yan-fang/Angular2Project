define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .controller('ConfirmRecurringPaymentController', ConfirmRecurringPaymentController);

  ConfirmRecurringPaymentController.$inject = [
    '$state',
    '$stateParams',
    'RecurringPaymentService',
    'BillPayPubSubFactory'
  ];

  function ConfirmRecurringPaymentController($state, $stateParams, RecurringPaymentService, BillPayPubSubFactory) {
    var vm = this;
    angular.extend(this, {
      modalClass: 'billPay-confirm-payment-modal',
      accountSubCategory: $stateParams.subCategory,
      paymentInformation: getPaymentInfo(),
      displayAmount: getDisplayAmount,
      close: closeModal
    });

    logSitecatalystEvent('recurringSuccess');

    function closeModal() {
      $state.go($state.current.parent, {}, {
        reload: ($state.current.parent.indexOf('PayeeList') === -1)
      });
    }

    function getPaymentInfo() {
      var paymentInfo = RecurringPaymentService.getPaymentInfo();
      return paymentInfo;
    }

    function getDisplayAmount(input) {
      if ((typeof input) === 'number') return input;
      input = input.replace(/[^\d|\.+]/g, '');
      return parseFloat(input);
    }

    function logSitecatalystEvent(viewName) {
      BillPayPubSubFactory.logTrackAnalyticsPageView(
        '360',
        viewName
      );
    }

    /* test-code */
    vm.__testonly__ = {};
    vm.__testonly__.getPaymentInfo = getPaymentInfo;
    /* end-test-code */
  }
});

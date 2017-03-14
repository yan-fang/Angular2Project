define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .controller('ConfirmPaymentController', ConfirmPaymentController);

  ConfirmPaymentController.$inject = [
    '$state',
    '$stateParams',
    'OneTimePaymentService',
    'PaymentDateService',
    'BillPayPubSubFactory',
    '$timeout'
  ];

  function ConfirmPaymentController(
    $state,
    $stateParams,
    OneTimePaymentService,
    PaymentDateService,
    BillPayPubSubFactory,
    $timeout
  ) {

    var vm = this;

    angular.extend(this, {
      modalClass: 'billPay-confirm-payment-modal',
      accountSubCategory: $stateParams.subCategory,
      actionType: $stateParams.actionType,
      paymentInfo: getPaymentInfo(),

      close: closeModal,
      convertStringToDate: stringToDate
    });

    logSitecatalystEvent(
      'oneTimeEditPaymentConfirmation',
      'oneTimePaymentConfirmation'
    );

    function closeModal() {
      $state.go($state.current.parent, {}, {
        reload: ($state.current.parent.indexOf('PayeeList') === -1)
      }).finally(function() {
        returnFocus($stateParams.returnFocusId || null);
      });

      logSitecatalystEvent(
        'bankAccountDetail',
        'billPayCenter'
      );
    }

    function stringToDate(string) {
      return new Date(string);
    }

    function getPaymentInfo() {
      // 1. get payment information from OneTimePaymentService
      var paymentInfo = OneTimePaymentService.getPaymentInfo();

      // 2. check payment date in paymentInfo
      if (!paymentInfo.payee) {
        $state.go($state.current.parent);
        return;
      }
      if (!paymentInfo.account) {
        $state.go($state.current.parent);
        return;
      }
      if (!paymentInfo.paymentAmount) {
        $state.go($state.current.parent);
        return;
      }
      if (!paymentInfo.paymentDate) {
        $state.go($state.current.parent);
        return;
      }
      if (!paymentInfo.paymentConfirmationNumber) {
        $state.go($state.current.parent);
        return;
      }
      if (!paymentInfo.transactionReferenceId) {
        $state.go($state.current.parent);
        return;
      }

      // 3. set up arrive date
      paymentInfo.arriveDate = PaymentDateService.getArriveDate(
        paymentInfo.paymentDate,
        paymentInfo.payee.paymentDeliveryLeadDaysCount,
        $stateParams.subCategory
      );

      return paymentInfo;
    }

    function returnFocus(id) {
      if (!id) return;

      $timeout(function() {
        try {
          document
            .getElementById(id)
            .focus();
        /*eslint-disable */
        } catch (err) {
        }
        /*eslint-enable */
      }, 100);
    }

    function logSitecatalystEvent(editPaymentView, makePaymentView) {
      var viewName = (vm.actionType === 'Edit') ? editPaymentView : makePaymentView;

      BillPayPubSubFactory.logTrackAnalyticsPageView(
        $stateParams.subCategory,
        viewName
      );
    }

    /* test-code */
    vm.__testonly__ = {};
    vm.__testonly__.logSitecatalystEvent = logSitecatalystEvent;
    vm.__testonly__.getPaymentInfo = getPaymentInfo;
    vm.__testonly__.returnFocus = returnFocus;
    /* end-test-code */
  }
});

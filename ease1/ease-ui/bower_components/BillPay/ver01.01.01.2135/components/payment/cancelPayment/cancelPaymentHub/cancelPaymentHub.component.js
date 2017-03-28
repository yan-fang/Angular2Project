define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('cancelPaymentHub', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/' +
                   'components/payment/cancelPayment/cancelPaymentHub/cancelPaymentHub.component.html',
      controller: CancelPaymentController,
      scope: {
        id: '@'
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  CancelPaymentController.$inject = [
    '$state',
    '$stateParams',
    '$timeout',
    'OneTimePaymentDSService',
    'RecurringPaymentDSService',
    'BillPayErrorHandlerService',
    'BillPayPubSubFactory'
  ];

  function CancelPaymentController(
    $state,
    $stateParams,
    $timeout,
    OneTimePaymentDSService,
    RecurringPaymentDSService,
    BillPayErrorHandlerService,
    BillPayPubSubFactory
  ) {

    var vm = this;
    var upcomingFocusId = $stateParams.upcomingFocusId;
    angular.extend(this, {
      modalClass: 'billPay-cancel-recurring-payment-modal',
      isRecurring: getPageMode(),
      isSubmitted: false,
      selectedOption: undefined,

      close: closeModal
    });

    function closeModal() {
      $state.go($state.current.parent, {}, {
        reload: vm.isSubmitted
      }).finally(function() {
        returnFocus(upcomingFocusId);
        if (!vm.isSubmitted) {
          BillPayPubSubFactory.logTrackAnalyticsPageView(
            $stateParams.subCategory,
            'bankAccountDetail'
          );
        }
      });
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

    function getPageMode() {
      var recurringDetail = RecurringPaymentDSService.getPaymentDetail();
      var onetimeDetail = OneTimePaymentDSService.getPaymentDetail();

      if (recurringDetail.paymentPlanReferenceId) return true;
      if (onetimeDetail.paymentReferenceId) return false;
      BillPayErrorHandlerService.handleError();
    }

  }
});

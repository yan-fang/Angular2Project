define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('cancelPayment', function() {
    return {
      templateUrl: '/ease-ui/bower_components/BillPay/@@version/' + 
                   'components/payment/cancelPayment/cancelPayment.component.html',
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
    'PaymentDetailService', 
    'RecurringPaymentDetailService',
    'BillPayErrorHandlerService',
    'BillPayPubSubFactory'
  ];

  function CancelPaymentController(
    $state, 
    $stateParams,
    $timeout,
    PaymentDetailService,
    RecurringPaymentDetailService,
    BillPayErrorHandlerService,
    BillPayPubSubFactory
  ) {
 
    var vm = this;

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
        returnFocus($stateParams.upcomingFocusId);
        
        BillPayPubSubFactory.logTrackAnalyticsPageView(
          $stateParams.subCategory, 
          'bankAccountDetail'
        );
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
      var recurringDetail = RecurringPaymentDetailService.getPaymentInfo();
      var onetimeDetail = PaymentDetailService.getPaymentInfo();
      
      if (recurringDetail.paymentPlanReferenceId) return true;
      if (onetimeDetail.paymentReferenceId) return false;
      BillPayErrorHandlerService.handleError();
    }

    /* test-code */
    vm.__testonly__ = {};
    vm.__testonly__.returnFocus = returnFocus;
    /* end-test-code */
  }
});

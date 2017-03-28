define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('recurringStopByPayments', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/payment/paymentForm/recurringPayment/recurringPayment/components/recurringStopByPayments/recurringStopByPayments.component.html',
      controller: controller,
      scope: {
        id: '@',
        mode: '@',
        recurringForm: '=',
        switchPaymentModeFn: '&',
        switchFn: '&'
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  controller.$inject = [
    'PayeeDetailService',
    'BillPayPubSubFactory'
  ]

  function controller(
    PayeeDetailService,
    BillPayPubSubFactory
  ) {
    var vm = this;

    // Bindable properties
    angular.extend(this, {
      payee: PayeeDetailService.getPayeeDetail(),

      goToOnetimeFn: goToOnetimeFn,
      done: done
    });

    (function initNumberOfPayment() {
      var numberOfPayments = vm.recurringForm.numberOfPayments;
      vm.recurringForm.numberOfPayments = (numberOfPayments === 0) ? 2: numberOfPayments;
      logSitecatalystEvent('recurringEndAfterXPayment')
    })()

    function goToOnetimeFn() {
      vm.switchPaymentModeFn();
    }

    function done() {
      vm.switchFn({ name: 'MAIN' });
    }

    // broadcast sitecatalyst event when user in recurring payment modal  
    function logSitecatalystEvent(viewName) {
      BillPayPubSubFactory.logTrackAnalyticsPageView(
        '360',
        viewName
      );
    }
  }
});

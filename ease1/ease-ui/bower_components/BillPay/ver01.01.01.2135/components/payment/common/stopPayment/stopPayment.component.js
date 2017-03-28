define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('stopPayment', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/' +
                   'payment/common/stopPayment/stopPayment.component.html',
      scope: {
        id: '@',
        inputObj: '=',
        field: '@',
        noStopFn: '&?',
        stopByDateFn: '&?',
        stopByPaymentsFn: '&?',
        finalPaymentDate: '@',
        numberOfPayments: '@',
        lastPaymentAmount: '@'
      },
      controller: controller,
      controllerAs: '$ctrl',
      bindToController: true
    };
  });

  function controller($timeout) {
    var vm = this;

    // Bindable properties
    angular.extend(this, {
      id: this.id || 'stop-payment',
      showStopOptions: (this.inputObj[this.field] === 'Indefinitely') ? false : true,

      showOptions: showOptions
    });

    function showOptions() {
      vm.showStopOptions = true;
      $timeout(function() {
        document.querySelectorAll('[type="radio"][id^="stop-payment-input"]:checked')[0].focus();
      }, 100);
    }
  }
});

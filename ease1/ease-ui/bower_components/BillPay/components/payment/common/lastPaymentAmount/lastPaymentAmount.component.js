define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('lastPaymentAmount', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/@@version/components/' + 
                   'payment/common/lastPaymentAmount/lastPaymentAmount.component.html',
      scope: {
        id: '@', 
        form: '=',
        inputObj: '=',
        field: '@'
      },
      controller: controller,
      controllerAs: '$ctrl',
      bindToController: true
    };
  });

  controller.inject = ['$scope', 'BillPayPubSubFactory'];

  function controller(BillPayPubSubFactory) {
    var vm = this;

    // Bindable properties
    angular.extend(this, {
      id: this.id || 'last-payment-amount',
      isDifferentAmount: (this.inputObj[this.field] > 0) ? true : false,

      toggleAmountInput: toggleAmountInput
    });
    
    function toggleAmountInput() {
      BillPayPubSubFactory.logChangeEvent('different amount:checkbox');
      if (!vm.isDifferentAmount) vm.inputObj[vm.field] = 0;
    }

  }
});
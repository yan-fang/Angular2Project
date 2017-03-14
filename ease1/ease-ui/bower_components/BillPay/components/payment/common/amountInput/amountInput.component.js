define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('amountInput', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/@@version/components/' + 
                   'payment/common/amountInput/amountInput.component.html',
      scope: { 
        id: '@',
        label: '@',
        subLabel: '@',
        form: '=',
        amount: '='
      },
      controller: controller,
      controllerAs: '$ctrl',
      bindToController: true
    };
  });

  function controller() {
    
    // Bindable properties
    angular.extend(this, {
      id: this.id || 'amount-input',
      label: this.label || 'Amount'
    });
  }

});
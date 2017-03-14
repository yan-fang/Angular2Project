define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('billpayAmount', function() {
    return {
      templateUrl: '/ease-ui/bower_components/BillPay/@@version/components' + 
                   '/payment/common/billpayAmount/billpayAmount.component.html',
      controller: controller,
      restrict: 'E',
      scope: {
        id: '@',
        label: '@',
        subLabel: '@',
        amount: '=',
        form: '=',
        validateFn: '&?'
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  function controller($scope) {
    var vm = this;

    // Bindable properties
    angular.extend(this, {
      id: this.id || 'billpay-amount',
      label: this.label || 'Amount',
      contentObj: {
        placeholder: '0.00',
        validationMsg: 'You cannot move more than $99,999.99 online.'
      },

      validateAmount: validateAmount
    });

    function validateAmount(amount) {
      // 1. parse string to number
      var amount = parseFloat(amount.replace(/[^0-9.]/g, ''));
      
      // 2. Payment amount cannot be $0.00 
      if (amount === 0) {
        vm.contentObj.validationMsg = 'Payment amount cannot be $0.00';
        return false;
      }

      // 3. Payment amount cannot be $0.00 
      if (amount < 1) {
        vm.contentObj.validationMsg = 'Payment amount cannot be less than $1.00';
        return false;
      }

      // 4. Payment amount cannot be $0.00 
      if (amount > 99999.99) {
        vm.contentObj.validationMsg = 'Payment amount cannot exceed $99,999.99';
        return false;
      }

      return true;
    }

    $scope.$watch(function() {
      return vm.amount;
    }, function() {
      vm.form.$setValidity('amount', false);
      if (!vm.amount) return;
      var amount = parseFloat(vm.amount.replace(/[^0-9.]/g, ''));
      if (amount >= 1 && amount < 100000) vm.form.$setValidity('amount', true);
    })
  }
});

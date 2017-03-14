define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('payFrom', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/@@version/components/' + 
                   'payment/common/payFrom/payFrom.component.html',
      scope: { 
        id: '@',
        form: '=',
        accounts: '=',
        displayField: '@',
        inputObj: '=',
        field: '@',
        accountOnChange: '&?'
      },
      controller: controller,
      controllerAs: '$ctrl',
      bindToController: true
    };
  });

  function controller($scope) {
    var vm = this;
    var isChangingAccount = false;

    // Bindable properties
    angular.extend(this, {
      id: this.id || 'pay-from-input'
    });

    $scope.$watch(function() {
      return vm.inputObj[vm.field];
    }, function() {
      if (isChangingAccount) vm.accountOnChange();
      isChangingAccount = true;
    });    
  }
});
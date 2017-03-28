define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('selectAccount', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/payment/common/selectAccount/selectAccount.component.html',
      controller: controller,
      scope: {
        id: '@',
        form: '=',
        accounts: '=',
        selectedAccountId: '=', 
        accountOnChange: '&?'
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  function controller($scope) {
    var vm = this;
    var isChangingAccount = false;

    // Bindable properties
    angular.extend(this, {
      selectedAccount: getSelectedAccount()
    });

    $scope.$watch(function() {
      return vm.selectedAccount;
    }, function() {
      vm.selectedAccountId = vm.selectedAccount.referenceId;
      if (isChangingAccount) vm.accountOnChange();
      isChangingAccount = true;
    });

    function getSelectedAccount() {
      if (!vm.selectedAccountId) {
        vm.selectedAccountId = vm.accounts[0].referenceId;
        return vm.accounts[0];
      }

      for (var i = 0; i < vm.accounts.length; i++) {
        var account = vm.accounts[i];
        if (account.referenceId === vm.selectedAccountId) return account;
      }
    }

  }
});

define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('payeeAccountInfo', function() {
    return {
      restrict: 'E',
      scope: {
        payeeService: '=',
        payeeInfo: '=',
        flowType: '=',
        submit: '&',
        showBackButton: '@?',
        back: '&?',
        loading: '@',
        fixableErrors: '=?'
      },
      templateUrl: '/ease-ui/bower_components/BillPay/@@version/' +
                   'components/payee/payeeAccountInfo/payee-account-info.component.html',
      controller: payeeAccountInfoController,
      controllerAs: '$ctrl',
      bindToController: true
    };
  });

  payeeAccountInfoController.$inject = [
    '$scope'
  ];

  function payeeAccountInfoController($scope) {
    var vm = this;

    angular.extend(this, {
      loading: '',
      inputMatch: true,
      alphaNumericRegex: /^[A-z0-9 .']+$/,
      zipRegex: /^\d{5}([\-]\d{4}|[\-]____){0,1}$/,
      payeeInfoCache: angular.copy(vm.payeeInfo),
      formChanged: false,

      compareAccountNumbers: compareAccountNumbers,
      clearError: clearError
    });

    init();

    function init() {
      $scope.$watch(function() {
        return !angular.equals(vm.payeeInfo, vm.payeeInfoCache);
      }, function(newVal) {
        vm.formChanged = newVal;
      });
    }

    /**
     * When given two account numbers as input, sets a property on the controller to indicate a
     * success or unsuccessful match. This is used to show errors and enable/disable the submit
     * button
     *
     * @param {string} accountNumberOne - Account number
     * @param {string} accountNumberTwo - Account number confirmation
     */
    function compareAccountNumbers(accountNumberOne, accountNumberTwo) {
      vm.inputMatch = accountNumberOne === accountNumberTwo;
    }

    /**
     * Used in an ng-change event to remove the field in question from the recoverable
     * error list
     *
     * @param {string} fieldName - error array key to remove
     */
    function clearError(fieldName) {
      var idx = vm.fixableErrors.indexOf(fieldName);

      if (idx !== -1) {
        vm.fixableErrors.splice(idx, 1);
      }
    }
  }
});

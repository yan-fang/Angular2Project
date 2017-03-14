define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('payeeSuccess', function() {
    return {
      restrict: 'E',
      scope: {
        payeeInfo: '=',
        flowType: '=',
        pendingPayments: '='
      },
      templateUrl: '/ease-ui/bower_components/BillPay/@@version/' +
                   'components/payee/payeeSuccess/payee-success.component.html',
      controller: payeeSuccessController,
      controllerAs: '$ctrl',
      bindToController: true
    };

    function payeeSuccessController() {
    }
  });
});

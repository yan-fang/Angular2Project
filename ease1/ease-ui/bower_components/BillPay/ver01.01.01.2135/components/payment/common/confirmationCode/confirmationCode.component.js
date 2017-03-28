define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('confirmationCode', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/payment/common/confirmationCode/confirmationCode.component.html',
      controller: controller,
      scope: {
        id: '@',
        code: '@'
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  function controller() {

    // Bindable properties
    angular.extend(this, {
    });
  }
});

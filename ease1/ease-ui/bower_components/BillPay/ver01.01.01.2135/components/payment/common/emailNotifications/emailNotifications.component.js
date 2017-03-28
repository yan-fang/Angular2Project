define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('emailNotifications', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/' + 
                   'payment/common/emailNotifications/emailNotifications.component.html',
      scope: {
        id: '@',
        email: '@',
        checkboxOptions: '=',
        inputObj: '='
      },
      controller: controller,
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  function controller() {

    // Bindable properties
    angular.extend(this, {
      id: this.id || 'email-notifications'
    });
  }
});
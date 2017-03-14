define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('dateInput', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/@@version/components/' + 
                   'payment/common/dateInput/dateInput.component.html',
      scope: { 
        id: '@',
        label: '@',
        subLabel: '@',
        form: '=',
        date: '=',
        inputObj: '=',
        field: '@',
        iconClick: '&?'
      },
      controller: controller,
      controllerAs: '$ctrl',
      bindToController: true
    };
  });

  function controller() {

    // Bindable properties
    angular.extend(this, {
      id: this.id || 'date-input',
      label: this.label || 'Start Payments'
    });
  }
});
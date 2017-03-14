define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('frequencySelection', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/@@version/components/' + 
                   'payment/common/frequencySelection/frequencySelection.component.html',
      scope: { 
        id: '@',
        datasource: '=',
        frequency: '=',
        displayField: '@',
        valueField: '@'
      },
      controller: controller,
      controllerAs: '$ctrl',
      bindToController: true
    };
  });

  function controller() {

    // Bindable properties
    angular.extend(this, {
      id: this.id || 'frequency-selector'
    });
  }
});
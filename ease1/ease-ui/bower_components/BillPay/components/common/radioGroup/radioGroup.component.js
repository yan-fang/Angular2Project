define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('radioGroup', function() {
    return {
      templateUrl: '/ease-ui/bower_components/BillPay/@@version/components/common/radioGroup/radioGroup.component.html',
      controller: controller,
      scope: {
        id: '@',
        radioOptions: '=',
        selectedOption: '='
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

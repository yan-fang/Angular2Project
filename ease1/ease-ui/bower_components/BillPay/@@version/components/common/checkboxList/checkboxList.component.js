define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('checkboxList', function() {
    return {
      templateUrl: '/ease-ui/bower_components/BillPay/@@version/components' + 
                   '/common/checkboxList/checkboxList.component.html',
      scope: {
        id: '@',
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
    });
  }
});
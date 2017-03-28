define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('submitButton', function() {
    return {
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/' + 
                   'components/common/submitButton/submitButton.component.html',
      controller: controller,
      scope: {
        id: '@',
        label: '@',
        isDisabled: '@',
        isLoading: '@',
        submitFn: '&',
        /**********************************************************
         * action: green 
         * destructive: red
         * regressive: gray
         * progressive: blue
         * progressive ghost: transparent background with blue text
         **********************************************************/
        bgColor: '@'
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

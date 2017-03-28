define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('numberInput', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/' + 
                   'payment/common/numberInput/numberInput.component.html',
      scope: { 
        id: '@',
        mode: '@',
        form: '=',
        inputObj: '=',
        field: '@',
        label: '@',
        subLabel: '@',
        goToOnetimeFn: '&'
      },
      controller: controller,
      controllerAs: '$ctrl',
      bindToController: true
    };
  });

  function controller($scope) {
    var vm = this;

    // Bindable properties
    angular.extend(this, {
      id: this.id || 'number-input',
      label: this.label || 'Number'
    });

    $scope.$watch(function() {
      return vm.inputObj[vm.field];
    }, function(newVal) {
      if (newVal === undefined || newVal === null) return;
      var element = document.getElementsByClassName('inline-label')[0];
      element.style.left = (newVal.toString().length + 1) * 10 + 20 + 'px';
    });
  }
});
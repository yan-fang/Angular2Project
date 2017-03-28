define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('selectFrequency', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/payment/common/selectFrequency/selectFrequency.component.html',
      controller: controller,
      scope: {
        id: '@',
        datasource: '=',
        frequency: '=',
        displayField: '@',
        valueField: '@'
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  controller.$inject = [ '$scope' ];

  function controller($scope) {
    var vm = this;

    // Bindable properties
    angular.extend(this, {
      selectedFrequency: getSelectedFrequency()
    });

    function getSelectedFrequency() {
      if (!vm.frequency) {
        vm.frequency = vm.datasource[0].value;
        return vm.datasource[0];
      }

      for (var i = 0; i < vm.datasource.length; i++) {
        var data = vm.datasource[i];
        if (data.value === vm.frequency) return data;
      }
    }

    $scope.$watch(function() {
      return vm.selectedFrequency;
    }, function() {
      vm.frequency = vm.selectedFrequency.value;
    });
  }
});

define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('radioGroup', function() {
    return {
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/common/radioGroup/radioGroup.component.html',
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
    var vm = this;

    // Bindable properties
    angular.extend(this, {
      setTabIndex: setTabIndex
    });

    function setTabIndex(index) {
      if (vm.selectedOption === undefined && index === 0) {
        return 0;
      }
      if (vm.selectedOption === vm.radioOptions[index].value) {
        return 0;
      }
      return -1;
    }
  }
});

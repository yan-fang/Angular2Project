define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('billpayDropdown', function() {
    return {
      restrict: 'E',
      require: '^ngModel',
      templateUrl: '/ease-ui/bower_components/BillPay/@@version/components/' + 
                   'common/dropdown/dropdown.component.html',
      scope: { 
        id: '@',
        datasource: '=',
        ngModel: '=',
        displayField: '@',
        valueField: '@',
        inputAriaLabel: '@'
      },
      controller: controller,
      controllerAs: '$ctrl',
      bindToController: true
    };
  });

  function controller() {
    var vm = this;

    // Bindable properties
    angular.extend(this, {
      id: this.id || 'billpay-dropdown',
      persistItems: angular.copy(this.datasource),
      items: angular.copy(this.datasource),
      selectedItem: this.ngModel[this.displayField],
      dropdown: {
        isOpen: false,
        required: true,
        data: {
          id: this.id || 'billpay-dropdown',
          label: this.inputAriaLabel,
          placeholder: '',
          errorMessage: ''
        }
      },

      select: select
    });

    function select(item) {
      vm.ngModel = vm.valueField ? item[vm.valueField] : item;  
      vm.selectedItem = item[vm.displayField];
    }
  }
  
});
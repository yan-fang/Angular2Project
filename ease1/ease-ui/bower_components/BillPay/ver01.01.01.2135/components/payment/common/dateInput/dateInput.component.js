define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('dateInput', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/' + 
                   'payment/common/dateInput/dateInput.component.html',
      scope: { 
        id: '@',
        label: '@',
        subLabel: '@',
        form: '=',
        date: '=',
        iconClick: '&?'
      },
      controller: controller,
      controllerAs: '$ctrl',
      bindToController: true
    };
  });

  controller.$inject = [
    '$stateParams',
    'PayeeDetailService',
    'PaymentDateService'
  ]
  
  function controller(
    $stateParams,
    PayeeDetailService,
    PaymentDateService
  ) {
    var vm = this;

    // Bindable properties
    angular.extend(this, {
      id: this.id || 'date-input',
      label: this.label || 'Start Payments',
      accountSubCategory: $stateParams.subCategory,
      payee: PayeeDetailService.getPayeeDetail(),

      getArriveDate: getArriveDate
    });

    function getArriveDate() {
      return PaymentDateService.getArriveDate(
        vm.date,
        vm.payee.paymentDeliveryLeadDaysCount,
        $stateParams.subCategory
      );
    }
  }
});
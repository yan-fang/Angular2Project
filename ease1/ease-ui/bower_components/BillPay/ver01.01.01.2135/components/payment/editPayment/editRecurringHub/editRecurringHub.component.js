define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('editRecurringHub', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/payment/editPayment/editRecurringHub/editRecurringHub.component.html',
      controller: controller,
      scope: {
        id: '@',
        recurringOption: '='
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  controller.$inject = [
    '$stateParams', 
    '$filter', 
    'AccountUtilService',
    'RecurringPaymentDSService', 
    'RecurringPaymentUtilService'
  ];

  function controller(
    $stateParams, 
    $filter, 
    AccountUtilService,
    RecurringPaymentDSService, 
    RecurringPaymentUtilService
  ) {
    var vm = this;
    var paymentDetail = RecurringPaymentDSService.getPaymentDetail();
    var account = AccountUtilService.getAccountByID(paymentDetail.accountReferenceId);

    // Bindable properties
    angular.extend(this, {
      selectedOption: undefined,
      editPaymentOptions: getEditPaymentOptions(),
      infoList: getInfoList(),

      returnOption: returnOption
    });

    function getEditPaymentOptions() {
      return [  
        { label: 'Edit all future payments', value: 'RECURRING'},
        { label: 'Only Edit ' + $filter('date')(paymentDetail.adjustedNextPaymentDate,'MMM dd, yyyy'), value: 'ONE_TIME'} 
      ];
    }

    function getInfoList() {
      return [
        {
          label: 'Payment To',
          detail: $filter('showPayeeName')(paymentDetail.payeeInfo, 'displayName')
        }, {
          label: 'Amount',
          detail: $filter('currency')(paymentDetail.paymentPlanDetailModel.paymentAmount)
        }, {
          label: 'Send On',
          detail: $filter('date')(paymentDetail.adjustedNextPaymentDate, 'MMM dd, yyyy')
        }, {
          label: 'Frequency',
          detail: RecurringPaymentUtilService
            .getFrequencyDisplayValue(paymentDetail.paymentPlanDetailModel.frequencyCode)
        }, {
          label: 'Pay From',
          detail: $filter('showPayeeName')(account, 'displayName')
        }
      ];
    }

    function returnOption() {
      vm.recurringOption = vm.selectedOption;
    }
  }
});

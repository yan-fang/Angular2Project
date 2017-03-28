define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('oneTimeMain', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/payment/paymentForm/oneTimePayment/oneTimePayment/components/oneTimeMain/oneTimeMain.component.html',
      controller: controller,
      scope: {
        id: '@',
        mode: '@',
        isSubmitted: '=',
        onetimeForm: '=',
        switchFn: '&'
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  controller.$inject = [
    '$stateParams',
    'PayeeDetailService',
    'AccountDSService',
    'OneTimePaymentDSService',
    'BillPayPubSubFactory'
  ]

  function controller(
    $stateParams,
    PayeeDetailService,
    AccountDSService,
    OneTimePaymentDSService,
    BillPayPubSubFactory
  ) {
    var vm = this;
    var payee = PayeeDetailService.getPayeeDetail();
    var accounts = AccountDSService.getAccounts();
      
    // Bindable properties
    angular.extend(this, {
      isPaymentProcessing: false,
      payee: payee,
      eligibleAccounts: accounts,

      accountOnChange: accountOnChange,
      getAmountSubLabel: PayeeDetailService.getAmountSubLabel,
      getStartDateSubLabel: PayeeDetailService.getStartDateSubLabel,
      pickPaymentDate: pickPaymentDate,
      submitForm: submitForm
    });

    function pickPaymentDate() {
      vm.switchFn({name: 'DATE'});
    }

    function accountOnChange() {
      BillPayPubSubFactory.logChangeEvent($stateParams.subCategory + ':pay from change:dropdown');
    }

    function submitForm() {
      vm.isPaymentProcessing = true;
      if (vm.mode === 'make') {
        OneTimePaymentDSService.addOneTimePayment(vm.onetimeForm)
        .then(function() {
          vm.isPaymentProcessing = false;
          vm.isSubmitted = true;
        });
      }

      if (vm.mode === 'edit') {
        OneTimePaymentDSService.editOneTimePayment(
          vm.onetimeForm,
          vm.onetimeForm.transactionReferenceId
        ).then(function() {
          vm.isPaymentProcessing = false;
          vm.isSubmitted = true;
        });
      }
    }
  }
});


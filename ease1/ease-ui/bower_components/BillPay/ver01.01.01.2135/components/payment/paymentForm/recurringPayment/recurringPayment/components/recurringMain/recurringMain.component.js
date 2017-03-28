define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('recurringMain', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/payment/paymentForm/recurringPayment/recurringPayment/components/recurringMain/recurringMain.component.html',
      controller: controller,
      scope: {
        id: '@',
        mode: '@',
        isSubmitted: '=',
        recurringForm: '=',
        switchFn: '&'
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  controller.$inject = [
    'PayeeDetailService',
    'AccountDSService',
    'RecurringPaymentUtilService',
    'RecurringPaymentDSService'
  ]

  function controller(
    PayeeDetailService,
    AccountDSService,
    PaymentService,
    PaymentDSService
  ) {
    var vm = this;

    // Bindable properties
    angular.extend(this, {
      isPaymentProcessing: false,
      payee: PayeeDetailService.getPayeeDetail(),
      eligibleAccounts: AccountDSService.getAccounts(),
      frequencyOptions: PaymentService.getFrequencyOptions(),
      notificationOptions: PaymentService.getNotificationOptions(),

      getAmountSubLabel: PayeeDetailService.getAmountSubLabel,
      getStartDateSubLabel: PayeeDetailService.getStartDateSubLabel,
      pickPaymentDate: pickPaymentDate,
      clearStopPaymentInfo: clearStopPaymentInfo,
      changeStopPaymentDate: changeStopPaymentDate,
      changeNumberOfPayment: changeNumberOfPayment,
      accountOnChange: accountOnChange,
      submitForm: submitForm
    });

    function pickPaymentDate() {
      vm.switchFn({name: 'FIRST_DATE'});
    }

    function clearStopPaymentInfo() {
      vm.recurringForm.finalPaymentDate = undefined;
      vm.recurringForm.numberOfPayments = 0;
      vm.recurringForm.finalPaymentAmount = undefined;
    }

    function changeStopPaymentDate() {
      if (!vm.recurringForm.finalPaymentDate) clearStopPaymentInfo()
      vm.switchFn({name: 'STOP_BY_DATE'});
    }

    function changeNumberOfPayment() {
      if (!vm.recurringForm.numberOfPayments) clearStopPaymentInfo()
      vm.switchFn({name: 'STOP_BY_PAYMENTS'});
    }

    function accountOnChange() {
      console.log('????');
    }

    function submitForm() {
      vm.isPaymentProcessing = true;

      if (vm.mode === 'make') {
        PaymentDSService.addRecurringPayment(
          vm.recurringForm
        ).then(function() {
          vm.isPaymentProcessing = false;
          vm.isSubmitted = true;
        });
      }

      if (vm.mode === 'edit') {
        PaymentDSService.editRecurringPayment(
          vm.recurringForm,
          vm.recurringForm.paymentPlanReferenceId
        ).then(function() {
          vm.isPaymentProcessing = false;
          vm.isSubmitted = true;
        });
      }
    }
  }
});

define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('recurringPayment', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/payment/paymentForm/recurringPayment/recurringPayment/recurringPayment/recurringPayment.component.html',
      controller: controller,
      scope: {
        id: '@',
        mode: '@',
        switchPaymentModeFn: '&',
        isSubmitted: '='
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  controller.$inject = [
    'AccountDSService',
    'PayeeDetailService',
    'RecurringPaymentUtilService',
    'BillPayPubSubFactory'
  ]

  function controller(
    AccountDSService,
    PayeeDetailService,
    RecurringPaymentUtilService,
    BillPayPubSubFactory
  ) {
    var vm = this;
    var payee = PayeeDetailService.getPayeeDetail();
    var account = AccountDSService.getAccounts();
    var recurringForm = getRecurringForm();

    // Bindable properties
    angular.extend(this, {
      pageName: 'MAIN',
      datepickerConfig: getDatePickerConfig(),
      recurringForm: recurringForm,

      switchPage: switchPage
    });

    logSitecatalystEvent('recurringOnLoad');

    function switchPage(name) {
      vm.pageName = name;

      if (vm.pageName === 'MAIN') {
        logSitecatalystEvent('recurringOnLoad');
      }
    }

    function getDatePickerConfig() {
      return {
        minDate: payee.earliestPaymentDate,
        maxDate: getMaxDate(),
        selectedDatelabel: 'SEND',
        arrivedDatelabel: 'ARRIVE',
        leadDays: payee.paymentDeliveryLeadDaysCount,
        nextPage: 'MAIN'
      }
    }

    function getMaxDate(maxDate) {
      var maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);
      return maxDate;
    }

    function getRecurringForm() {
      return (vm.mode === 'edit') ?
        RecurringPaymentUtilService.initEditForm(payee, account) :
        RecurringPaymentUtilService.initForm(payee, account);
    }

    // broadcast sitecatalyst event when user in recurring payment modal  
    function logSitecatalystEvent(viewName) {
      BillPayPubSubFactory.logTrackAnalyticsPageView(
        '360',
        viewName
      );
    }

  }
});

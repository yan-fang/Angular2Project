define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('oneTimePayment', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/payment/paymentForm/oneTimePayment/oneTimePayment/oneTimePayment/oneTimePayment.component.html',
      controller: controller,
      scope: {
        id: '@',
        mode: '@',
        isFromRecurring: '@',
        isSubmitted: '='
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  controller.$inject = [
    '$stateParams',
    'AccountDSService',
    'PayeeDetailService',
    'OneTimePaymentUtilService',
    'BillPayPubSubFactory'
  ]  
  
  function controller(
    $stateParams,
    AccountDSService,
    PayeeDetailService,
    OneTimePaymentUtilService,
    BillPayPubSubFactory
  ) {
    var vm = this;
    var payee = PayeeDetailService.getPayeeDetail();
    var accounts = AccountDSService.getAccounts()
    var onetimeForm = getOnetimeForm();

    // Bindable properties
    angular.extend(this, {
      pageName: 'MAIN',
      datepickerConfig: getDatePickerConfig(),
      onetimeForm: onetimeForm,

      switchPage: switchPage
    });

    (vm.mode === 'edit') ? 
      logSitecatalystEvent('oneTimeEditPaymentLanding') : 
      logSitecatalystEvent('oneTimePaymentLanding');

    function switchPage(pageName) {
      vm.pageName = pageName;

      if (pageName === 'DATE') {
        (vm.mode === 'edit') ? 
          logSitecatalystEvent('oneTimeEditPaymentDateSelection') : 
          logSitecatalystEvent('oneTimePaymentDateSelection');
      }
      if (pageName === 'MAIN') { 
        (vm.mode === 'edit') ? 
          logSitecatalystEvent('oneTimeEditPaymentLanding') : 
          logSitecatalystEvent('oneTimePaymentLanding');
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

    function getOnetimeForm() {
      if (vm.isFromRecurring === 'true') {
        return OneTimePaymentUtilService.initFormFromRecurring(payee, accounts);
      }

      return (vm.mode === 'edit') ?
        OneTimePaymentUtilService.initEditForm(payee, accounts) : 
        OneTimePaymentUtilService.initForm(payee, accounts);
    }

    // broadcast sitecatalyst event when user in recurring payment modal  
    function logSitecatalystEvent(viewName) {
      BillPayPubSubFactory.logTrackAnalyticsPageView(
        $stateParams.subCategory,
        viewName
      );
    }
  }
});

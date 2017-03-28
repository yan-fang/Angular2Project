define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('recurringPaymentConfirmation', function() {
    return {
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/payment/paymentForm/recurringPayment/recurringPaymentConfirmation/recurringPaymentConfirmation.component.html',
      controller: controller,
      scope: {
        id: '@'
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

    controller.$inject = [
    '$filter',
    'PayeeDetailService',
    'AccountUtilService',
    'RecurringPaymentUtilService',
    'BillPayPubSubFactory'
  ]

  function controller(
    $filter,
    PayeeDetailService,
    AccountUtilService,
    RecurringPaymentUtilService,
    BillPayPubSubFactory
  ) {
    var vm = this;
    var payee = PayeeDetailService.getPayeeDetail();
    var recurringForm = RecurringPaymentUtilService.getForm();
    var account = AccountUtilService.getAccountByID(recurringForm.accountReferenceId);

    // Bindable properties
    angular.extend(this, {
      payee: payee,
      infoList: getInfoList(),

      recurringForm: recurringForm
    });

    logSitecatalystEvent('recurringSuccess');

    function getInfoList() {
      var infoList = [];

      infoList.push({
          label: 'Payment To',
          detail: $filter('showPayeeName')(payee, 'displayName')
      });

      infoList.push({
        label: 'Amount',
        detail: $filter('currency')(recurringForm.paymentAmount.replace(/[^0-9\.]/g, ''))
      });

      infoList.push({
        label: 'How Often',
        detail: RecurringPaymentUtilService.getFrequencyDisplayValue(recurringForm.frequency)
      });

      infoList.push({
        label: 'First Payment',
        detail: $filter('date')(recurringForm.firstPaymentDate, 'MMM dd, yyyy')
      });

      if (recurringForm.finalPaymentDate) {
        infoList.push({
          label: 'Last Payment',
          detail: $filter('date')(recurringForm.finalPaymentDate, 'MMM dd, yyyy')
        });
      }

      if (recurringForm.finalPaymentAmount) {
        infoList.push({
          label: 'Last Payment Amount',
          detail: $filter('currency')(recurringForm.finalPaymentAmount.replace(/[^0-9\.]/g, ''))
        });
      }
      
      infoList.push({
        label: 'Pay From',
        detail: $filter('showPayeeName')(account, 'displayName')
      });

      return infoList;
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

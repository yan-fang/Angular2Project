define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('oneTimeConfirmation', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/payment/paymentForm/oneTimePayment/oneTimeConfirmation/oneTimeConfirmation.component.html',
      controller: controller,
      scope: {
        id: '@',
        mode: '@'
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  controller.$inject = [
    '$filter',
    '$stateParams',
    'PayeeDetailService',
    'AccountUtilService',
    'PaymentDateService',
    'OneTimePaymentUtilService',
    'BillPayPubSubFactory'
  ];

  function controller(
    $filter,
    $stateParams,
    PayeeDetailService,
    AccountUtilService,
    PaymentDateService,
    OneTimePaymentUtilService,
    BillPayPubSubFactory
  ) {
    var vm = this;
    var accountSubCategory = $stateParams.subCategory
    var payee = PayeeDetailService.getPayeeDetail();
    var onetimeForm = OneTimePaymentUtilService.getForm();;

    // Bindable properties
    angular.extend(this, {
      accountSubCategory: accountSubCategory,
      payee: payee,
      arriveDate: getArrivedDate(),
      onetimeForm: onetimeForm,
      infoList: getInfoList()
    });

    (vm.mode === 'edit') ? 
      logSitecatalystEvent('oneTimeEditPaymentConfirmation') : 
      logSitecatalystEvent('oneTimePaymentConfirmation');

    function getArrivedDate() {
      return PaymentDateService.getArriveDate(
        onetimeForm.paymentDate, 
        payee.paymentDeliveryLeadDaysCount,
        accountSubCategory);
    }

    function getInfoList() {
      var infoList = [];

      infoList.push({
        label: 'Payment To',
        detail: $filter('showPayeeName')(payee, 'displayName')
      });

      infoList.push({
        label: 'Pay From',
        detail: $filter('showPayeeName')(AccountUtilService.getAccountByID(onetimeForm.accountReferenceId), 'displayName')
      });

      infoList.push({
        label: (accountSubCategory === '360') ? 'Send On' : 'Pay On',
        detail: $filter('date')(onetimeForm.paymentDate, 'MMM dd, yyyy')
      });

      if (accountSubCategory === '360') {
        infoList.push({
          label: 'Arrives at ' + payee.payeeName,
          detail: $filter('date')(getArrivedDate(), 'MMM dd, yyyy')
        });
      }
      console.log(onetimeForm);
      infoList.push({
        label: 'Amount',
        detail: $filter('currency')(onetimeForm.paymentAmount.toString().replace(/[^0-9.]/g, ''))
      });

      if (onetimeForm.memoText) {
        infoList.push({
          label: 'Memo',
          detail: onetimeForm.memoText
        });
      }

      return infoList;
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

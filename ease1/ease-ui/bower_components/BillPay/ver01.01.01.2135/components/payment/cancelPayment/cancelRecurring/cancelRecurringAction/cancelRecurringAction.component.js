define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('cancelRecurringAction', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135' +
      '/components/payment/cancelPayment/cancelRecurring/cancelRecurringAction/cancelRecurringAction.component.html',
      controller: CancelRecurringPaymentController,
      scope: {
        id: '@',
        isSubmitted: '=',
        selectedOption: '='
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  CancelRecurringPaymentController.$inject = [
    '$stateParams',
    '$filter',
    'BillPayPubSubFactory',
    'AccountUtilService',
    'OneTimePaymentDSService',
    'RecurringPaymentDSService',
    'RecurringPaymentUtilService'
  ];

  function CancelRecurringPaymentController(
    $stateParams,
    $filter,
    BillPayPubSubFactory,
    AccountUtilService,
    OneTimePaymentDSService,
    RecurringPaymentDSService,
    RecurringPaymentUtilService
  ) {
    var vm = this;
    var paymentDetail = RecurringPaymentDSService.getPaymentDetail();
    var account = AccountUtilService.getAccountByID(paymentDetail.accountReferenceId);

    angular.extend(this, {
      isCancelPaymentProcessing: false,
      infoList: getInfoList(),
      cancelPaymentOptions: RecurringPaymentUtilService.getCancelOptions(paymentDetail),

      cancelPayment: cancelPayment
    });

    function cancelPayment() {
      vm.isCancelPaymentProcessing = true;
      if (vm.selectedOption === 'one') {
        OneTimePaymentDSService
          .cancelOneTimePayment($stateParams.transactionReferenceId)
          .then(cancelPaymentSuccess);
      } else if (vm.selectedOption === 'all') {
        RecurringPaymentDSService
          .cancelRecurringPayment($stateParams.paymentPlanReferenceId, account.referenceId)
          .then(cancelPaymentSuccess);
      }
    }

    function cancelPaymentSuccess() {
      vm.isSubmitted = true;
      vm.isCancelPaymentProcessing = false;
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

    // broadcast sitecatalyst event when user in cancel recurring payment modal
    BillPayPubSubFactory.logTrackAnalyticsPageView(
      $stateParams.subCategory,
      'cancelRecurringOnLoad'
    );

  }
});

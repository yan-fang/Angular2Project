define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('cancelRecurringAction', function() {
    return {
      templateUrl: '/ease-ui/bower_components/BillPay/@@version' + 
      '/components/payment/cancelRecurring/cancelRecurringAction/cancelRecurringAction.component.html',
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
    'RecurringPaymentDetailService', 
    'AccountsService', 
    'CancelPaymentService', 
    'CancelRecurringPaymentService'
  ];

  function CancelRecurringPaymentController(
    $stateParams,
    $filter,
    BillPayPubSubFactory,
    RecurringPaymentDetailService, 
    AccountsService,
    CancelPaymentService, 
    CancelRecurringPaymentService
  ) {
    var vm = this;
    var paymentDetail = RecurringPaymentDetailService.getPaymentInfo();
    var account = getPaymentAccount();

    angular.extend(this, {
      isCancelPaymentProcessing: false,
      infoList: getInfoList(),
      cancelPaymentOptions: CancelRecurringPaymentService.getRecurringCancelPaymentOptions(paymentDetail),

      cancelPayment: cancelPayment
    });

    function cancelPayment() {
      vm.isCancelPaymentProcessing = true;
      if (vm.selectedOption === 'one') {
        CancelPaymentService
          .cancelPaymentRestCall($stateParams.transactionReferenceId)
          .then(cancelPaymentSuccess);
      } else if (vm.selectedOption === 'all') {
        CancelRecurringPaymentService
          .cancelPaymentPlanRestCall($stateParams.paymentPlanReferenceId, account.referenceId)
          .then(cancelPaymentSuccess);
      }
    }

    function cancelPaymentSuccess() {
      vm.isSubmitted = true;
      vm.isCancelPaymentProcessing = false;
    }

    function getPaymentAccount() {
      var accountDetail;
      var accountId = RecurringPaymentDetailService.getPaymentInfo().accountReferenceId;
      var accounts = AccountsService.getEligibleAccounts().accounts;
      accounts.forEach(function(element) {
        if (element.referenceId === accountId) accountDetail = element;
      });
      return accountDetail;
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
          detail: CancelRecurringPaymentService
            .getFrequencyDisplayValue(paymentDetail.paymentPlanDetailModel.frequencyCode)
        }, {
          label: 'Pay From',
          detail: $filter('showPayeeName')(account, 'displayName')
        }
      ];
    }

    // broadcast sitecatalyst event when user in cancel payment modal  
    BillPayPubSubFactory.logTrackAnalyticsPageView(
      $stateParams.subCategory, 
      'oneTimeCancelPaymentLanding'
    );

    /* test-code */
    vm.__testonly__ = {};
    /* end-test-code */
  }
});

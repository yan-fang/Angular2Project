define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('cancelOneTimeAction', function() {
    return {
      templateUrl: '/ease-ui/bower_components/BillPay/@@version' + 
      '/components/payment/cancelOneTime/cancelOneTimeAction/cancelOneTimeAction.component.html',
      controller: CancelOneTimePaymentController,
      scope: {
        id: '@',
        isSubmitted: '='
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  CancelOneTimePaymentController.$inject = [
    '$stateParams',
    '$filter',
    'BillPayPubSubFactory',
    'PaymentDetailService',
    'AccountsService',
    'CancelPaymentService'
  ];

  function CancelOneTimePaymentController(
    $stateParams, 
    $filter,
    BillPayPubSubFactory,
    PaymentDetailService, 
    AccountsService,
    CancelPaymentService
  ) {
 
    var vm = this;
    var subCategory = $stateParams.subCategory;
    var paymentDetail = PaymentDetailService.getPaymentInfo();

    angular.extend(this, {
      isCancelPaymentProcessing: false,
      paymentDetail: paymentDetail,
      infoList: getInfoList(),

      accountSubCategory: $stateParams.subCategory,

      cancelPayment: cancelPayment
    });

    function getInfoList() {
      var infoList = [];

      infoList.push({
        label: 'Payment To',
        detail: $filter('showPayeeName')(paymentDetail.payeeInfo, 'displayName')
      });

      infoList.push({
        label: 'Pay From',
        detail: $filter('showPayeeName')(getPaymentAccount(), 'displayName')
      });

      infoList.push({
        label: (subCategory === '360') ? 'Send On' : 'Pay On',
        detail: $filter('date')(paymentDetail.transactionInfo.paymentDetailDates.paymentDate, 'MMM dd, yyyy')
      });

      if (subCategory === '360' && paymentDetail.transactionInfo.paymentDetailDates.paymentDeliveryDate) {
        infoList.push({
          label: 'Arrives at ' + paymentDetail.payeeInfo.payeeName,
          detail: $filter('date')(paymentDetail.transactionInfo.paymentDetailDates.paymentDeliveryDate, 'MMM dd, yyyy')
        });
      }

      infoList.push({
        label: 'Amount',
        detail: $filter('currency')(paymentDetail.transactionInfo.paymentAmount)
      });

      if (paymentDetail.transactionInfo.paymentMemo) {
        infoList.push({
          label: 'Memo',
          detail: paymentDetail.transactionInfo.paymentMemo
        });
      }

      return infoList;
    }

    function cancelPayment() {
      vm.isCancelPaymentProcessing = true;
      
      CancelPaymentService
        .cancelPaymentRestCall($stateParams.transactionReferenceId)
        .then(function() {
          this.isSubmitted = true;
          this.isCancelPaymentProcessing = false;
        }.bind(this));
    }

    function getPaymentAccount() {
      var accountDetail;
      var accountId = PaymentDetailService.getPaymentInfo().payerDetail.accountReferenceId;
      var accounts = AccountsService.getEligibleAccounts().accounts;
      accounts.forEach(function(element) {
        if (element.referenceId === accountId) accountDetail = element;
      });
      return accountDetail;
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

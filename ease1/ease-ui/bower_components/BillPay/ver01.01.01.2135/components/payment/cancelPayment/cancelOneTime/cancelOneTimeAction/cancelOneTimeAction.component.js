define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('cancelOneTimeAction', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135' + 
      '/components/payment/cancelPayment/cancelOneTime/cancelOneTimeAction/cancelOneTimeAction.component.html',
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
    'OneTimePaymentDSService',
    'AccountUtilService'
  ];

  function CancelOneTimePaymentController(
    $stateParams, 
    $filter,
    BillPayPubSubFactory,
    OneTimePaymentDSService, 
    AccountUtilService
  ) {
 
    var vm = this;
    var subCategory = $stateParams.subCategory;
    var paymentDetail = OneTimePaymentDSService.getPaymentDetail();

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
        detail: $filter('showPayeeName')(
          AccountUtilService.getAccountByID(paymentDetail.payerDetail.accountReferenceId), 
          'displayName')
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
      
      OneTimePaymentDSService
        .cancelOneTimePayment($stateParams.transactionReferenceId)
        .then(function() {
          vm.isSubmitted = true;
          vm.isCancelPaymentProcessing = false;
        });
    }

    // broadcast sitecatalyst event when user in cancel payment modal  
    BillPayPubSubFactory.logTrackAnalyticsPageView(
      $stateParams.subCategory, 
      'oneTimeCancelPaymentLanding'
    );

  }
});

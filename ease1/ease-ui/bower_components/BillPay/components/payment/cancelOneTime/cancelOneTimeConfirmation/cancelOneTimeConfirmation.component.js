define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('cancelOneTimeConfirmation', function() {
    return {
      templateUrl: '/ease-ui/bower_components/BillPay/@@version' + 
      '/components/payment/cancelOneTime/cancelOneTimeConfirmation/cancelOneTimeConfirmation.component.html',
      controller: ConfirmCancelPaymentController,
      scope: {
        id: '@'
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  ConfirmCancelPaymentController.$inject = [
    '$stateParams', 
    'BillPayPubSubFactory',
    'PaymentDetailService'
  ];

  function ConfirmCancelPaymentController(
    $stateParams, 
    BillPayPubSubFactory,
    PaymentDetailService
  ) {
          
    angular.extend(this, {
      paymentDetail: PaymentDetailService.getPaymentInfo()
    });

    // broadcast sitecatalyst event when user in cancel payment modal  
    BillPayPubSubFactory.logTrackAnalyticsPageView(
      $stateParams.subCategory, 
      'oneTimeCancelPaymentConfirmation'
    );
  }
});

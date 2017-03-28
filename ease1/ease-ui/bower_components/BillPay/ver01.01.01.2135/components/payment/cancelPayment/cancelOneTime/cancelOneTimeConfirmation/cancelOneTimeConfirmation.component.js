define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('cancelOneTimeConfirmation', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135' + 
      '/components/payment/cancelPayment/cancelOneTime/cancelOneTimeConfirmation/cancelOneTimeConfirmation.component.html',
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
    'OneTimePaymentDSService'
  ];

  function ConfirmCancelPaymentController(
    $stateParams, 
    BillPayPubSubFactory,
    OneTimePaymentDSService
  ) {
          
    angular.extend(this, {
      paymentDetail: OneTimePaymentDSService.getPaymentDetail()
    });

    // broadcast sitecatalyst event when user in cancel payment modal  
    BillPayPubSubFactory.logTrackAnalyticsPageView(
      $stateParams.subCategory, 
      'oneTimeCancelPaymentConfirmation'
    );
  }
});

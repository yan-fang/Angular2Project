define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('cancelRecurringConfirmation', function() {
    return {
      templateUrl: '/ease-ui/bower_components/BillPay/@@version' + 
      '/components/payment/cancelRecurring/cancelRecurringConfirmation/cancelRecurringConfirmation.component.html',
      controller: ConfirmCancelRecurringPaymentController,
      scope: {
        id: '@',
        selectedOption: '='
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  ConfirmCancelRecurringPaymentController.$inject = [
    '$stateParams', 
    'BillPayPubSubFactory',
    'RecurringPaymentDetailService',
    'CancelRecurringPaymentService'
  ];

  function ConfirmCancelRecurringPaymentController(
    $stateParams, 
    BillPayPubSubFactory,
    RecurringPaymentDetailService,
    CancelRecurringPaymentService
  ) {
    
    angular.extend(this, {
      paymentDetail: RecurringPaymentDetailService.getPaymentInfo(),

      getFrequencyDisplayValue: getFrequencyDisplayValue
    });


    function getFrequencyDisplayValue(key) {
      return CancelRecurringPaymentService.getFrequencyDisplayValue(key);
    }

    // broadcast sitecatalyst event when user in cancel payment modal  
    BillPayPubSubFactory.logTrackAnalyticsPageView(
      $stateParams.subCategory,
      'oneTimeCancelPaymentConfirmation'
    );
  }
});

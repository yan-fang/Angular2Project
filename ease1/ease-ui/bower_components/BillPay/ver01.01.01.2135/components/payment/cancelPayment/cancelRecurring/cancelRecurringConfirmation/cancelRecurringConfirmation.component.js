define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('cancelRecurringConfirmation', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135' +
      '/components/payment/cancelPayment/cancelRecurring/cancelRecurringConfirmation/cancelRecurringConfirmation.component.html',
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
    'RecurringPaymentDSService',
    'RecurringPaymentUtilService'
  ];

  function ConfirmCancelRecurringPaymentController(
    $stateParams,
    BillPayPubSubFactory,
    RecurringPaymentDSService,
    RecurringPaymentUtilService
  ) {
    var vm = this;
    
    angular.extend(this, {
      paymentDetail: RecurringPaymentDSService.getPaymentDetail(),

      getFrequencyDisplayValue: getFrequencyDisplayValue
    });


    function getFrequencyDisplayValue(key) {
      return RecurringPaymentUtilService.getFrequencyDisplayValue(key);
    }

    BillPayPubSubFactory.logTrackAnalyticsPageView(
      $stateParams.subCategory,
      vm.selectedOption === 'one' ? 'cancelSingleRecurringSuccess': 'cancelAllRecurringSuccess'
    );

  }
});

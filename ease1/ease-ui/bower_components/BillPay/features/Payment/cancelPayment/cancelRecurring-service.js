define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .service('CancelRecurringPaymentService', CancelRecurringPaymentService)


  CancelRecurringPaymentService.$inject = [
    'Restangular',
    'BillPayConstants',
    'EaseConstantFactory',
    'EASEUtilsFactory',
    'easeHttpInterceptor',
    'BillPayErrorHandlerService',
    '$filter'
  ];

  function CancelRecurringPaymentService(
    Restangular,
    BillPayConstants,
    EaseConstantFactory,
    EASEUtilsFactory,
    easeHttpInterceptor,
    BillPayErrorHandlerService,
    $filter
  ) {

    var api = {
      cancelPaymentPlanRestCall: cancelPaymentPlanRestCall,
      getRecurringCancelPaymentOptions: getRecurringCancelPaymentOptions,
      getFrequencyDisplayValue: getFrequencyDisplayValue
    };

    function cancelPaymentPlanRestCall(paymentPlanReferenceId, accountReferenceId) {
      var url = BillPayConstants.billPayCancelRecurringPaymentUrl + 
                encodeURIComponent(paymentPlanReferenceId) + 
                '?accountReferenceId=' + encodeURIComponent(accountReferenceId);

      var headers = {
        EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
        BUS_EVT_ID: BillPayConstants.RECURRING_PAYMENT_CANCEL_EVT_ID
      };

      easeHttpInterceptor.setBroadCastEventOnce('BillPay');
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      Restangular.setFullRequestInterceptor(setInterceptor);
 
      var promise = Restangular.all(url).remove({}, headers);
      checkError(promise);
      
      return promise;
    }

    function getRecurringCancelPaymentOptions(paymentDetail) {
      return [  
        { label: 'Cancel all future payments', value: 'all'},
        { label: 'Only Cancel ' + $filter('date')(paymentDetail.adjustedNextPaymentDate,'MMM dd, yyyy'), value: 'one'} 
      ];
    }

    function getFrequencyDisplayValue(key) {
      var map = { 
        'Weekly'       :  'Weekly',
        'Every2Weeks'  :  'Every 2 Weeks',
        'Every4Weeks'  :  'Every 4 Weeks', 
        'TwiceAMonth'  :  'Twice A Month', 
        'Monthly'      :  'Monthly', 
        'Every2Months' :  'Every 2 Months',
        'Every3Months' :  'Every 3 Months', 
        'Every4Months' :  'Every 4 Months', 
        'Every6Months' :  'Every 6 Months', 
        'Annually'     :  'Annually'  
      };
      return map[key];     
    }

    function checkError(promise) {
      promise.then(function() {
        // normal flow
      }, function(err) {
        BillPayErrorHandlerService.handleError(err);
      });
    }

    function setInterceptor(element, operation) {
      return {
        element: (operation === 'remove') ? null : element
      };
    }

    /* test-code */
    api.__testonly__ = {};
    api.__testonly__.setInterceptor = setInterceptor;
    /* end-test-code */

    return api;
  }  
});
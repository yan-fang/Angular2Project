define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .service('CancelPaymentService', CancelPaymentService)


  CancelPaymentService.$inject = [
    'Restangular',
    'BillPayConstants',
    'EaseConstantFactory',
    'EASEUtilsFactory',
    'easeHttpInterceptor',
    'BillPayErrorHandlerService'
  ];

  function CancelPaymentService(
    Restangular,
    BillPayConstants,
    EaseConstantFactory,
    EASEUtilsFactory,
    easeHttpInterceptor,
    BillPayErrorHandlerService
  ) {

    var api = {
      cancelPaymentRestCall: cancelPaymentRestCall
    };

    function cancelPaymentRestCall(transactionReferenceId) {
      var url = BillPayConstants.billPayCancelPaymentUrl + 
                encodeURIComponent(transactionReferenceId);

      var headers = {
        EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
        BUS_EVT_ID: BillPayConstants.PAYMENT_CANCEL_EVT_ID
      };

      easeHttpInterceptor.setBroadCastEventOnce('BillPay');
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      Restangular.setFullRequestInterceptor(setInterceptor);
 
      var promise = Restangular.all(url).remove({}, headers);
      checkError(promise);
      
      return promise;
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
define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .service('PaymentDetailService', paymentDetailService);

  paymentDetailService.$inject = [
    'Restangular', 
    'BillPayConstants', 
    'EaseConstantFactory',
    'EASEUtilsFactory', 
    'easeHttpInterceptor', 
    'BillPayErrorHandlerService'
  ];

  function paymentDetailService(
    Restangular, 
    BillPayConstants, 
    EaseConstantFactory, 
    EASEUtilsFactory,
    easeHttpInterceptor, 
    BillPayErrorHandlerService
  ) {

    var paymentDetail = {};

    var api = {
      setPaymentDetail: setPaymentDetail,
      getPaymentInfo: getPaymentInfo,
      deletePaymentDetail: deletePaymentDetail,
      getPaymentDetailRestCall: getPaymentDetailRestCall
    };

    function setPaymentDetail(input) {
      paymentDetail = input;
    }

    function getPaymentInfo() {
      return paymentDetail;
    }

    function deletePaymentDetail() {
      angular.copy({}, paymentDetail);
    }

    function getPaymentDetailRestCall(transactionReferenceId, accountReferenceId) {

      var headers = {
        EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
        BUS_EVT_ID: BillPayConstants.PAYMENT_RETRIEVE_EVT_ID
      };

      easeHttpInterceptor.setBroadCastEventOnce('BillPay');
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());

      var promise = Restangular.all(BillPayConstants.billPayPaymentDetailUrl)
                               .get(
                                 encodeURIComponent(transactionReferenceId), 
                                 buildQueryObject(accountReferenceId), headers);
      initializePayee(promise);

      return promise;
    }

    function initializePayee(promise) {
      promise.then(function(data) {  
        deletePaymentDetail();
        angular.copy(data, paymentDetail);
      }, function(err) {   
        BillPayErrorHandlerService.handleError(err);   
      });
    }

    function buildQueryObject(accountReferenceId) {
      return {
        accountReferenceId: accountReferenceId
      };
    }

    /* test-code */
    api.__testonly__ = {};
    api.__testonly__.setPaymentDetail = function(input) {
      paymentDetail = input;
    };
    /* end-test-code */

    return api;
  }

});
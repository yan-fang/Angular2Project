define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .service('RecurringPaymentDetailService', RecurringPaymentDetailService);

  RecurringPaymentDetailService.$inject = [
    'Restangular', 
    'BillPayConstants', 
    'EaseConstantFactory',
    'EASEUtilsFactory', 
    'easeHttpInterceptor', 
    'BillPayErrorHandlerService'
  ];

  function RecurringPaymentDetailService(
    Restangular, 
    BillPayConstants, 
    EaseConstantFactory, 
    EASEUtilsFactory,
    easeHttpInterceptor, 
    BillPayErrorHandlerService
  ) {

    var recurringPaymentDetail = {};

    var api = {
      getPaymentInfo: getPaymentInfo,
      deleteRecurringPaymentDetail: deleteRecurringPaymentDetail,
      getRecurringPaymentDetailRestCall: getRecurringPaymentDetailRestCall
    };

    function getPaymentInfo() {
      return recurringPaymentDetail;
    }

    function deleteRecurringPaymentDetail() {
      angular.copy({}, recurringPaymentDetail);
    }

    function getRecurringPaymentDetailRestCall(paymentPlanReferenceId, accountReferenceId) {

      var headers = {
        EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
        BUS_EVT_ID: BillPayConstants.RECURRING_PAYMENT_RETRIEVE_EVT_ID
      };

      easeHttpInterceptor.setBroadCastEventOnce('BillPay');
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());

      var promise = Restangular.all(BillPayConstants.billPayRecurringPaymentDetailUrl)
                               .get(
                                 encodeURIComponent(paymentPlanReferenceId), 
                                 buildQueryObject(accountReferenceId), headers);
      initializePayee(promise);

      return promise;
    }

    function initializePayee(promise) {
      promise.then(function(data) {  
        deleteRecurringPaymentDetail();
        angular.copy(data, recurringPaymentDetail);
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
      recurringPaymentDetail = input;
    };
    /* end-test-code */

    return api;
  }

});
define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').factory('RecurringPaymentDSService', RecurringPaymentDSService);

  RecurringPaymentDSService.$inject = [
    '$q',
    '$state',
    'Restangular',
    'BillPayConstants',
    'EaseConstantFactory',
    'easeHttpInterceptor',
    'EASEUtilsFactory',
    'PayeeListService',
    'BillPayErrorHandlerService'
  ];

  function RecurringPaymentDSService(
    $q,
    $state,
    Restangular,
    BillPayConstants,
    EaseConstantFactory,
    easeHttpInterceptor,
    EASEUtilsFactory,
    PayeeListService,
    BillPayErrorHandlerService
  ) {

    var headers;
    var service;
    var recurringPaymentDetail = {};
    var recurringPaymentList = {};

    var api = {
      getPaymentDetail: getPaymentDetail,
      deletePaymentInfo: deletePaymentInfo,
      addRecurringPayment: addRecurringPayment,
      getRecurringPaymentDetail: getRecurringPaymentDetail,
      getRecurringPaymentList: getRecurringPaymentList,
      editRecurringPayment: editRecurringPayment,
      cancelRecurringPayment: cancelRecurringPayment,
    };

    function getPaymentDetail() {
      return recurringPaymentDetail;
    }

    function deletePaymentInfo() {
      angular.copy({}, recurringPaymentDetail);
    }

    function addRecurringPayment(form) {
      var requestBody = buildBody(form);
      preSetRestangular(BillPayConstants.RECURRING_PAYMENT_ADD_EVT_ID);

      var deferred = $q.defer();
      
      service.customPOST(requestBody, null, null, headers).then(function(data) {
        PayeeListService.updatePayeeList($state.params.accountReferenceId);
        form.paymentPlanReferenceId = data.paymentPlanReferenceId;
        form.adjustedNextPaymentDate = data.adjustedNextPaymentDate;
        deferred.resolve(data);
      }, function(err) {
        BillPayErrorHandlerService.handleError(err);
        deferred.reject(err);
      });

      return deferred.promise;
    }

    function getRecurringPaymentDetail(paymentPlanReferenceId, accountReferenceId) {
      paymentPlanReferenceId = encodeURIComponent(paymentPlanReferenceId);
      accountReferenceId = encodeURIComponent(accountReferenceId);
      preSetRestangular(BillPayConstants.RECURRING_PAYMENT_RETRIEVE_EVT_ID);
      
      var deferred = $q.defer();

      service.get(paymentPlanReferenceId, { accountReferenceId: accountReferenceId }, headers)
      .then(function(data) {
        angular.copy(data, recurringPaymentDetail);
        deferred.resolve(data);
      }, function(err) {
        BillPayErrorHandlerService.handleError(err);
        deferred.reject(err);
      });
      
      return deferred.promise;
    }

    function getRecurringPaymentList() {
    }

    function editRecurringPayment(form, paymentPlanReferenceId) {
      var requestBody = buildBody(form);
      paymentPlanReferenceId = encodeURIComponent(paymentPlanReferenceId);
      preSetRestangular(BillPayConstants.RECURRING_PAYMENT_EDIT_EVT_ID);

      var deferred = $q.defer();

      service.customPOST(requestBody, paymentPlanReferenceId, null, headers).then(function(data) {
          PayeeListService.updatePayeeList($state.params.accountReferenceId);
          form.paymentPlanReferenceId = data.paymentPlanReferenceId;
          form.adjustedNextPaymentDate = data.adjustedNextPaymentDate;
          deferred.resolve(data);
        }, function(err) {
          BillPayErrorHandlerService.handleError(err);
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function cancelRecurringPayment(paymentPlanReferenceId, accountReferenceId) {
      paymentPlanReferenceId = encodeURIComponent(paymentPlanReferenceId);
      accountReferenceId = encodeURIComponent(accountReferenceId);
      preSetRestangular(BillPayConstants.RECURRING_PAYMENT_CANCEL_EVT_ID);

      var deferred = $q.defer();

      service.customDELETE(paymentPlanReferenceId, { accountReferenceId: accountReferenceId}, headers)
      .then(function(data) {
        deferred.resolve(data);
      }, function(err) {
        BillPayErrorHandlerService.handleError(err);
        deferred.reject(err);
      });

      return deferred.promise;
    }

    function buildBody(form) {
      var body = {};
      angular.copy(form, body);

      body.paymentAmount = body.paymentAmount.toString().replace(/[^0-9.]/g, '');
      if (body.finalPaymentAmount) {
        body.finalPaymentAmount = body.finalPaymentAmount.toString().replace(/[^0-9.]/g, '');
      }

      return body;
    }

    function preSetRestangular(BUS_EVT_ID) {
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      easeHttpInterceptor.setBroadCastEventOnce('BillPay');
      Restangular.setFullRequestInterceptor(setInterceptor);

      headers = {
        EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
        BUS_EVT_ID: BUS_EVT_ID
      };

      service = Restangular.all(BillPayConstants.billPayRecurringPaymentUrl);
    }

    function setInterceptor(element, operation) {
      return {
        element: (operation === 'remove') ? null : element
      };
    }


    return api;
  }
});
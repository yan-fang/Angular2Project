define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').factory('OneTimePaymentDSService', OneTimePaymentDSService);

  OneTimePaymentDSService.$inject = [
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

  function OneTimePaymentDSService(
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
    var oneTimePaymentDetail = {};
    var oneTimePaymentList = {};

    var api = {
      getPaymentDetail: getPaymentDetail,
      deletePaymentInfo: deletePaymentInfo,
      addOneTimePayment: addOneTimePayment,
      getOneTimePaymentDetail: getOneTimePaymentDetail,
      getOneTimePaymentList: getOneTimePaymentList,
      editOneTimePayment: editOneTimePayment,
      cancelOneTimePayment: cancelOneTimePayment,
    };

    function getPaymentDetail() {
      return oneTimePaymentDetail;
    }

    function deletePaymentInfo() {
      angular.copy({}, oneTimePaymentDetail);
    }

    function addOneTimePayment(form) {
      var requestBody = buildBody(form);
      preSetRestangular(BillPayConstants.PAYMENT_ADD_EVT_ID);

      var deferred = $q.defer();

      service.customPOST(requestBody, null, null, headers)
      .then(function(data) {
        PayeeListService.updatePayeeList($state.params.accountReferenceId);
        form.paymentConfirmationNumber = data.paymentConfirmationNumber;
        form.transactionReferenceId = data.transactionReferenceId;
        deferred.resolve(data);
      }, function(err) {
        BillPayErrorHandlerService.handleError(err);
        deferred.reject(err);
      });
      
      return deferred.promise;
    }

    function getOneTimePaymentDetail(transactionReferenceId, accountReferenceId) {
      transactionReferenceId = encodeURIComponent(transactionReferenceId);
      accountReferenceId = encodeURIComponent(accountReferenceId);
      preSetRestangular(BillPayConstants.OneTime_PAYMENT_RETRIEVE_EVT_ID);
      
      var deferred = $q.defer();

      service.get(transactionReferenceId, { accountReferenceId: accountReferenceId }, headers)
      .then(function(data) {
        angular.copy(data, oneTimePaymentDetail);
        deferred.resolve(data);
      }, function(err) {
        BillPayErrorHandlerService.handleError(err);
        deferred.reject(err);
      });
      
      return deferred.promise;
    }

    function getOneTimePaymentList() {
    }

    function editOneTimePayment(form, transactionReferenceId) {
      var requestBody = buildBody(form);
      transactionReferenceId = encodeURIComponent(transactionReferenceId);
      preSetRestangular(BillPayConstants.PAYMENT_EDIT_EVT_ID);

      var deferred = $q.defer();

      service.customPOST(requestBody, transactionReferenceId, null, headers)
      .then(function(data) {
        PayeeListService.updatePayeeList($state.params.accountReferenceId);
        form.paymentConfirmationNumber = data.paymentConfirmationNumber;
        form.transactionReferenceId = data.transactionReferenceId;
        deferred.resolve(data);
      }, function(err) {
        BillPayErrorHandlerService.handleError(err);
        deferred.reject(err);
      });

      return deferred.promise;
    }

    function cancelOneTimePayment(transactionReferenceId) {
      transactionReferenceId = encodeURIComponent(transactionReferenceId);
      preSetRestangular(BillPayConstants.PAYMENT_CANCEL_EVT_ID);

      var deferred = $q.defer();

      service.customDELETE(transactionReferenceId, null, headers)
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

      return body;
    }

    function preSetRestangular(BUS_EVT_ID) {
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      Restangular.setFullRequestInterceptor(setInterceptor);
      easeHttpInterceptor.setBroadCastEventOnce('BillPay');

      headers = {
        EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
        BUS_EVT_ID: BUS_EVT_ID
      };

      service = Restangular.all(BillPayConstants.billPayOneTimePaymentUrl);
    }

    function setInterceptor(element, operation) {
      return {
        element: (operation === 'remove') ? null : element
      };
    }


    return api;
  }
});
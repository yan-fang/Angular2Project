define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .service('DeletePayeeService', DeletePayeeService)


  DeletePayeeService.$inject = [
    '$q',
    'Restangular',
    'BillPayConstants',
    'EaseConstantFactory',
    'EASEUtilsFactory',
    'easeHttpInterceptor',
    'BillPayErrorHandlerService',
    'PayeeListService',
    '$state'
  ];

  function DeletePayeeService(
    $q,
    Restangular,
    BillPayConstants,
    EaseConstantFactory,
    EASEUtilsFactory,
    easeHttpInterceptor,
    BillPayErrorHandlerService,
    PayeeListService,
    $state
  ) {

    var api = {
      deletePayeeRestCall: deletePayeeRestCall,
      setPayeeToDelete: setPayeeToDelete,
      getPayeeToDelete: getPayeeToDelete,
      getPaymentListRestCall: getPaymentListRestCall,
      getPaymentList: getPaymentList,
      deletePaymentList: deletePaymentList,
      resetDeleteData: resetDeleteData
    };

    var payeeToDelete = {};
    var paymentList = {};

    function setPayeeToDelete(payee) {
      payeeToDelete = payee;
    }

    function getPayeeToDelete() {
      return payeeToDelete;
    }

    function getPaymentList() {
      return paymentList;
    }

    function deletePaymentList() {
      angular.copy({}, paymentList);
    }

    function deletePayeeRestCall() {
      var deferred = $q.defer();

      var url = BillPayConstants.billPayDeletePayeeUrl + '/' +
                encodeURIComponent(payeeToDelete.payeeReferenceId) +
                BillPayConstants.cancelPaymentsQueryParam + 'true';

      var headers = {
        EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
        BUS_EVT_ID: BillPayConstants.PAYEE_DELETE_EVT_ID
      };

      easeHttpInterceptor.setBroadCastEventOnce('BillPay');
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      Restangular.setFullRequestInterceptor(setInterceptor);

      Restangular
        .all(url)
        .remove({}, headers)
        .then(function(res) {
          PayeeListService.removePayee(payeeToDelete.payeeReferenceId);
          deferred.resolve(res);
        }, function(err) {
          PayeeListService.updatePayeeList($state.params.accountReferenceId);
          BillPayErrorHandlerService.handleError(err);
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function getPaymentListRestCall(payeeReferenceId) {
      var paymentListReq = Restangular.all(BillPayConstants.billPayGetPaymentListUrl);

      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      easeHttpInterceptor.setBroadCastEventOnce('BillPay');

      var deferred = $q.defer();

      var headers = {
        EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
        BUS_EVT_ID: BillPayConstants.PAYMENT_LIST_EVT_ID
      };

      paymentListReq.get('', {
        payeeReferenceId: payeeReferenceId
      }, headers).then(function(data) {
        angular.copy(data, paymentList);
        deferred.resolve(data);
      }, function(err) {
        BillPayErrorHandlerService.handleError(err);
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function setInterceptor(element, operation) {
      return {
        element: (operation === 'remove') ? null : element
      };
    }

    function resetDeleteData() {
      payeeToDelete = '';
      paymentList = [];
    }

    /* test-code */
    api.__testonly__ = {};
    api.__testonly__.setInterceptor = setInterceptor;
    /* end-test-code */

    return api;
  }
});

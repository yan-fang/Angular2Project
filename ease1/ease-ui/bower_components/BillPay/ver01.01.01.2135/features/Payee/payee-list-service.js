define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .factory('PayeeListService', PayeeListService);

  PayeeListService.$inject = [
    '$state',
    'Restangular',
    'BillPayConstants',
    'EaseConstantFactory',
    'easeHttpInterceptor',
    'BillPayErrorHandlerService',
    'EASEUtilsFactory',
    '$q'
  ];

  function PayeeListService(
    $state,
    Restangular,
    BillPayConstants,
    EaseConstantFactory,
    easeHttpInterceptor,
    BillPayErrorHandlerService,
    EASEUtilsFactory,
    $q
  ) {

    var payeeList = [],
      loading = { inProgress: false };

    var service = {
      getLoading: getLoading,
      getPayeeList: getPayeeList,
      updatePayeeList: updatePayeeList,
      removePayee: removePayee,
      deletePayeeList: deletePayeeList
    }

    function getLoading() {
      return loading;
    }

    /**
     * Returns the stored list of the user's configured payees
     *
     * @returns {array} - List of user's configured payees
     */
    function getPayeeList() {
      return payeeList;
    }

    /**
     * Fetches user's list of payees from the OL
     *
     * @param {string} accountReferenceId - The user's account reference ID
     * @returns {promise} - Will contain either the payee list entries or an empty array
     */
    function updatePayeeList(accountReferenceId) {
      if($state.current.parent !== 'BillPay.PayeeList') return;
      angular.copy({ inProgress: true }, loading);

      var deferred = $q.defer(),
        headers = {
          EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
          BUS_EVT_ID: BillPayConstants.PAYEE_LIST_EVT_ID
        };

      easeHttpInterceptor.setBroadCastEventOnce('BillPay');
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());

      Restangular.all(BillPayConstants.billPayPayeeListUrl)
        .get('', { accountReferenceId: accountReferenceId }, headers)
        .then(function(data) {
          angular.copy({ inProgress: false }, loading);
          angular.copy((data.entries || []), payeeList);
          deferred.resolve(data.entries || []);
        }, function(err) {
          angular.copy({ inProgress: false }, loading);
          angular.copy([], payeeList);
          BillPayErrorHandlerService.handleError(err);
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function removePayee(payeeReferenceId) {
      var res = payeeList.filter(function(element) {
        return element.payeeReferenceId !== payeeReferenceId;
      });

      payeeList = angular.copy(res, payeeList);
    }

    /**
     * Resets the payee list
     */
    function deletePayeeList() {
      angular.copy([], payeeList);
    }


    return service;
  }
});

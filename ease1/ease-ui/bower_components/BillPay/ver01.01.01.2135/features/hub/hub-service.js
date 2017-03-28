define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .factory('HubService', HubService);

  HubService.$inject = [
    '$state',
    '$location',
    'BillPayConstants',
    'Restangular',
    'easeHttpInterceptor',
    'EASEUtilsFactory',
    '$q',
    'BillPayErrorHandlerService',
    'BillPayEnvironmentConstants'
    // ,'$http'
  ];

  function HubService(
    $state,
    $location,
    BillPayConstants,
    Restangular,
    easeHttpInterceptor,
    EASEUtilsFactory,
    $q,
    BillPayErrorHandlerService,
    BillPayEnvironmentConstants
    //, $http
  ) {
    var service = {
      getRxpUrl: getRxpUrl
    };

    return service;

    function getRxpUrl() {
      var rxpGetUrl = Restangular.all(''),
        deferred = $q.defer(),
        headers = {
          EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
          BUS_EVT_ID: BillPayConstants.RXP_URL_GET_EVT_ID,
          'Content-Type': 'text/plain'
        };

      Restangular.setBaseUrl(BillPayEnvironmentConstants.olbrRxpUrl);
      easeHttpInterceptor.setBroadCastEventOnce('BillPay');

      rxpGetUrl.get('', {}, headers)
        .then(function(res) {
          deferred.resolve(res.data);
        }, function(err) {
          BillPayErrorHandlerService.handleError(err);
          deferred.reject(err);
        });

      return deferred.promise;
    }
  }
});

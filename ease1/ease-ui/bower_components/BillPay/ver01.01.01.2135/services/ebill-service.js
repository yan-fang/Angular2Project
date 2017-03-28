define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .factory('ebillService', ebillService);

  ebillService.$inject = [
    '$q'
  ];

  function ebillService(
    $q
  ) {
    var service = {
      markAsPaid: markAsPaid
    };

    return service;

    /**
     * Submits mark as paid / file ebill request to the OL
     *
     * @returns {promise}
     */
    function markAsPaid() {
      return $q.when(true);
    }
  }
});

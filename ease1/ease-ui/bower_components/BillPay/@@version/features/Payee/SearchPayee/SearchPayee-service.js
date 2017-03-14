define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .factory('SearchPayeeService', SearchPayeeService);

  SearchPayeeService.$inject = [
    'EaseConstantFactory',
    '$location',
    'BillPayConstants',
    'Restangular',
    'easeHttpInterceptor',
    'EASEUtilsFactory'
  ];

  function SearchPayeeService(
    EaseConstantFactory,
    $location,
    BillPayConstants,
    Restangular,
    easeHttpInterceptor,
    EASEUtilsFactory
  ) {
    var payeeName = '',
      payeeList = [],
      payeeListIndex = 0;

    var service = {
      getSuggestions: getSuggestions,
      setSearchData: setSearchData,
      setSearchTerm: setSearchTerm,
      setSelectedIndex: setSelectedIndex,
      getPayeeName: getPayeeName,
      getPayeeList: getPayeeList,
      getSelectedIndex: getSelectedIndex,
      resetSearchData: resetSearchData
    };

    return service;

    /**
     * Queries the OL payee search service to return a list of possible payees for a given string.
     * Should only be called with strings of at least three characters in length.
     *
     * @param {string} payeeName - Search term to use to query the API
     * @returns {promise} - The results of the request to the OL payee search service
     */
    function getSuggestions(payeeName) {

      var url = BillPayConstants.billPaySearchPayeeUrl
              + '?payeeName=' + encodeURIComponent(payeeName)
              + '&subCategory=' + encodeURIComponent($location.search().subCategory);

      var payeeSearchService = Restangular.all(url);
      
      var headers = {
        EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
        BUS_EVT_ID: BillPayConstants.PAYEE_SEARCH_EVT_ID
      };

      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      easeHttpInterceptor.setBroadCastEventOnce('BillPay');

      return payeeSearchService.get('', {}, headers);
    }

    function setSearchData(pl) {
      payeeList = pl;
    }

    function setSearchTerm(pn) {
      payeeName = pn;
    }

    function setSelectedIndex(idx) {
      payeeListIndex = idx;
    }

    function getPayeeName() {
      return payeeName;
    }

    function getPayeeList() {
      return payeeList;
    }

    function getSelectedIndex() {
      return payeeListIndex;
    }

    function resetSearchData() {
      payeeName = '';
      payeeList = [];
      payeeListIndex = 0;
    }
  }
});

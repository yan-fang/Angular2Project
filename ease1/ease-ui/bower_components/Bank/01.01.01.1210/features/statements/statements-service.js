define(['angular'], function(angular) {
'use strict';
  angular
    .module('BankModule')
    .factory('BankStatementsFactory',BankStatementsFactory)
    .constant('BankStatementConstants', {
      bankStatementsUrl1: 'Bank/accounts/',
      bankStatementsUrl2: '/statements',
      bankStatementsPdfUrl1: '/statement/'
    });

  BankStatementsFactory.$inject = ['$q', 'Restangular','BankStatementConstants', 'EASEUtilsFactory'];
  function BankStatementsFactory($q, Restangular, BankStatementConstants, EASEUtilsFactory) {

    return {
      getBankStatements : getBankStatements,
      getPdfUrl: getPdfUrl
    };

    function getBankStatements(accountReferenceId) {
      var deferred = $q.defer();
      var statementListUri = buildStatementListUri(accountReferenceId);
      //audit business evnt id for statement list call
      EASEUtilsFactory.setCustomerActivityHeader('50050');
      var bankStatementsApi = Restangular.all(statementListUri);

        var businessEventId = {
            GET_BANK_STATEMENTS : '50050'
        };

      bankStatementsApi.get('',{}, {
          EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
          BUS_EVT_ID: businessEventId.GET_BANK_STATEMENTS
        }).then(
        function successfulResolver(data) {
          deferred.resolve(data);
        },
        function rejectResolver(ex) {
          deferred.reject(ex);
        });
      return deferred.promise;
    }

    function getPdfUrl(accountReferenceId, statementReferenceId) {
      var restURL = Restangular.all(BankStatementConstants.bankStatementsUrl1
      + encodeURIComponent(accountReferenceId) + BankStatementConstants.bankStatementsPdfUrl1 + statementReferenceId);
      //audit business evnt id for statement pdf call
      EASEUtilsFactory.setCustomerActivityHeader('50050');
      return restURL.getRestangularUrl();
    }

    function buildStatementListUri(accountReferenceId) {
      var uri = BankStatementConstants.bankStatementsUrl1 +
        encodeURIComponent(accountReferenceId) + BankStatementConstants.bankStatementsUrl2;
      return uri;
    }
  }

});

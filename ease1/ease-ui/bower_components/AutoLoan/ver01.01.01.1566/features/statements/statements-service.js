define(['angular'], function(angular) {
  'use strict';

  var app = angular.module('AutoLoanStatementsModule');
  app.service('autoLoanStatementService',
    function($q, Restangular) {

      this.getListOfStatements = function(accountReferenceId, fromDate, toDate, callback) {
        var deferred = $q.defer(),
          url = 'AutoLoan' + '/accounts/' + encodeURIComponent(accountReferenceId) +
              '/documents?' + 'fromDate=' + fromDate + '&toDate=' + toDate,
          headers = {'BUS_EVT_ID': 1234},
          getLstStatements = Restangular.all(url);
        getLstStatements.get('', {}, headers).then(function(data) {
          deferred.resolve(data);
          callback(data);
        }, function(error) {
          deferred.resolve(error);
          callback(error);
        });
        return deferred.promise;
      };

      this.getDocumentURL = function(accountReferenceId, documentRefId, isAdaStatement, fileName) {
        var restURL = 'AutoLoan/accounts/' + encodeURIComponent(accountReferenceId) + '/documents/' + documentRefId +
          '/' + fileName + '?makeAdaCompliant=' + isAdaStatement;
        return Restangular.all(restURL).getRestangularUrl();
      };

    });
});

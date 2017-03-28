define(['angular'],
  function() {
    'use strict';


    PaperlessPreferenceService.$inject = ['$q', 'Restangular', 'EASEUtilsFactory', 'EaseConstantFactory'];

    var BUS_EVT_GET = '50118';
    var BUS_EVT_PUT = '50119';

    function getPaperlessPreferenceUrl(accountReferenceId) {
      return 'AutoLoan/preferences/paperless/' + encodeURIComponent(accountReferenceId);
    }

    function PaperlessPreferenceService($q, Restangular, EASEUtilsFactory, EaseConstantFactory) {

      function getHeaders(businessEventId) {
        return {
          'BUS_EVT_ID': businessEventId, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()
        }
      }

      this.getPaperlessPreference = function(accountReferenceId) {
        var url = getPaperlessPreferenceUrl(accountReferenceId);
        var deferred = $q.defer();
        var headers = getHeaders(BUS_EVT_GET);

        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        Restangular.all(url).get('', {}, headers).then(
          function(data) {
            deferred.resolve(data);
          },
          function(ex) {
            deferred.reject(ex);
          })
        ;
        return deferred.promise;
      };

      this.putPaperlessPreference = function(accountReferenceId, isEnrolled) {
        var url = getPaperlessPreferenceUrl(accountReferenceId) + (isEnrolled ? '/set' : '/unset');

        var deferred = $q.defer();
        var headers = getHeaders(BUS_EVT_PUT);

        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        Restangular.all(url).post('', {}, headers).then(
          function(data) {
            deferred.resolve(data);
          },
          function(ex) {
            deferred.reject(ex);
          });
        return deferred.promise;
      };
    }

    return PaperlessPreferenceService;
  });

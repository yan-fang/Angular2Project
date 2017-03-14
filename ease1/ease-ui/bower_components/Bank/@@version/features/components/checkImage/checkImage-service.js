define(['angular'], function (angular) {
  'use strict';

  angular
      .module('BankModule')
      .factory('checkImageFactory', checkImageFactory)
      .constant('CheckImageConstants', {
        checkImageUrl1: 'Bank/accounts/',
        checkImageUrl2: '/check-images/'
      });

  checkImageFactory.$inject = ['$q', 'Restangular', 'CheckImageConstants', 'EASEUtilsFactory'];
  function checkImageFactory($q, Restangular, CheckImageConstants, EASEUtilsFactory) {

    return {
      getCheckImageRestCall : getCheckImageRestCall
    };


    function getCheckImageRestCall(accountReferenceId, frontCheckImageReferenceId) {
      var deferred = $q.defer();
      var checkImageUri = buildCheckImageUri(accountReferenceId, frontCheckImageReferenceId);

      var businessEventId = {
        GET_CHECK_IMAGE: '50047'
      };

      var checkImageApi = Restangular.all(checkImageUri);

      checkImageApi.get('', {},{
          EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
          BUS_EVT_ID: businessEventId.GET_CHECK_IMAGE
        }).then(
          function successfulResolver(data) {
            deferred.resolve(data);
          },
          function rejectResolver(ex) {
            deferred.reject(ex);
          });
      return deferred.promise;

    }

    function buildCheckImageUri(accountReferenceId, checkImageReferenceId) {
      var encodedId = encodeURIComponent(accountReferenceId);
      var encodedCheckImageId = encodeURIComponent(checkImageReferenceId);
      var uri = CheckImageConstants.checkImageUrl1 + encodedId + CheckImageConstants.checkImageUrl2 + encodedCheckImageId;
      return uri;
    }

  }
});

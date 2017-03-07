define(['angular'], function(angular) {
  'use strict';
  angular.module('easeAppUtils').factory('prefetchFactory', prefetchFactory);

  prefetchFactory.$inject = ['Restangular', 'EaseConstant', '$q'];

  function prefetchFactory(Restangular, EaseConstant, $q) {
    var prefetchRestService = '';

    function initializePrefetch(lobApp, accountIds) {
      Restangular.setBaseUrl(EaseConstant.baseUrl);
      var url = '';
      url = lobApp + '/prefetch';

      if (typeof accountIds !== 'undefined') {
        // .customPOST([elem, path, params, headers])
        prefetchRestService = Restangular.one(url).withHttpConfig({ timeout: EaseConstant.kPrefetchCallTimeout }).
        customPOST((accountIds), '', {}, {
          Authorization: 'Basic',
          'Content-Type': 'application/x-www-form-urlencoded'
        });
      } else {
        prefetchRestService = Restangular.one(url).withHttpConfig({ timeout: EaseConstant.kPrefetchCallTimeout }).get();
      }

      prefetchRestService
        .then(function successfulResolver() {
          console.log('prefetch ping Success');
        })
        .catch(function rejectResolver(ex) {
          console.log('prefetch ping Failure - ' + ex.statusMessage);
        });
    }
    var factory = {
      initializePrefetch: initializePrefetch
    };
    return factory;
  }
});

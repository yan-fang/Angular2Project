define(['angular'], function(angular) {
  'use strict';
  angular.module('easeAppUtils').factory('contentOneFactory', contentOneFactory);

  contentOneFactory.$inject = ['Restangular', 'EaseConstant', '$q', 'ContentConstant', '$locale', 'EASEUtilsFactory'];

  function contentOneFactory(Restangular, EaseConstant, $q, ContentConstant, $locale, EASEUtilsFactory) {

    var contentOneData = {};
    var dataStore = {};

    function getContentOneData(pageType) {
      if (dataStore.hasOwnProperty(pageType)) {
        return dataStore[pageType];
      }
    }

    function initializeContentOneData(pageType, pageFeature) {
      EASEUtilsFactory.clearCustomerActivityHeader();
      var deferred = $q.defer();
      var url = ContentConstant.urlContentOne + '/' + pageType;
      contentOneData = getContentOneData(pageType);
      if (contentOneData) {
        deferred.resolve(contentOneData);
      } else {
        Restangular.setBaseUrl(EaseConstant.baseUrl);

        if (typeof pageFeature !== 'undefined') {
          url = url + '/' + pageFeature;
        }
        var contentOneRestService = Restangular.one(url + '?localeInfo=' + $locale.id);

        contentOneRestService.get().then(
          function successfulResolver(data) {
            dataStore[pageType] = data;
            deferred.resolve(data);
          });
      }
      return deferred.promise;
    }
    var factory = {
      initializeContentOneData: initializeContentOneData,
      getContentOneData: getContentOneData
    };
    return factory;
  }
});

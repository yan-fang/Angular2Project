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

    function initializeContentOneData(pageType, pageFeature, locale) {
      EASEUtilsFactory.clearCustomerActivityHeader();
      var deferred = $q.defer(), langPref = undefined;
      var url = ContentConstant.urlContentOne + '/' + pageType;
      contentOneData = getContentOneData(pageType);
      if (contentOneData) {
        deferred.resolve(contentOneData);
      } else {
        Restangular.setBaseUrl(EaseConstant.baseUrl);

        if (!!pageFeature) {
          url = url + '/' + pageFeature;
        }
        // TODO: when ContentOne is fully replaced by Chariot we will remove this service
        // or when all the implemtation is done we will use this variable instead
        // languagePreferencesFactory.currentLocale
        langPref = locale || EaseConstant.kEnglishLocale;
        var contentOneRestService = Restangular.one(url + '?localeInfo=' + langPref.toLowerCase());

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

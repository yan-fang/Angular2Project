define(['angular'], function(angular) {
  'use strict';
  var AutoLoanLocalizeService = angular.module('AutoLoanLocalizeModule', [])
    .factory('AutoLoanLocalizeService', ['$q', '$http', '$locale',
      function($q, $http, $locale) {
        var i18nData;

        return {
          get: function(attr, deferred) {
            var deferred = deferred ? deferred : $q.defer(),
              resource = '/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/utils/i18n/resources-locale_'
                + $locale.id + '.json';
            if (!i18nData) {
              var httpPromise = $http.get(resource);
              httpPromise.then(function(response) {
                i18nData = response.data;
                deferred.resolve(i18nData[attr]);
              }, function() {
                deferred.reject('Failed to load i18n resource file');
              });
            } else {
              deferred.resolve(i18nData[attr]);
            }
            return deferred.promise;
          }
        };
      }
    ]);
  return AutoLoanLocalizeService;
});

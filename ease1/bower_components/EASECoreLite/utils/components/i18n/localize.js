define(['angular'], function(angular) {
  'use strict';
  var EaseLocalizeService = angular.module('EaseLocalizeModule', [])
    .factory('EaseLocalizeService', ['$q', '$http', '$locale', 'EaseConstant',
      function($q, $http, $locale, EaseConstant) {
        var i18nData = null,
          lobData = null,
          httpPromise = null;
        return {
          promise: httpPromise,
          get: function(attr, lob) {
            var deferred = $q.defer(),
              resource = (lob) ? '/ease-ui/bower_components/' + lob + '/utils/i18n/resources-locale_' + $locale.id +
              '.json' : '/ease-ui' + EaseConstant.kBuildVersionPath + '/dist/utils/components/i18n/resources-locale_' +
              $locale.id + '.json';
            if (lob || i18nData === null) {
              httpPromise = $http.get(resource);
              httpPromise.then(function(response) {
                if (lob) {
                  lobData = response.data;
                  deferred.resolve(lobData[attr]);
                } else {
                  i18nData = response.data;
                  deferred.resolve(i18nData[attr]);
                }
              }, function(error) {
                console.log("i18n File not found");
              });
            } else {
              if (lob) {
                deferred.resolve(lobData[attr]);
              } else {
                deferred.resolve(i18nData[attr]);
              }
            }
            return deferred.promise;
          }
        };
      }
    ]);
  return EaseLocalizeService;
});

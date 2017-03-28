define(['angular'], function(angular) {
  'use strict';
  return angular.module('EaseLocalizeModule', ['tmh.dynamicLocale'])
    .factory('EaseLocalizeService', ['$q', '$http', '$locale', 'EaseConstant', 'tmhDynamicLocale',
      function($q, $http, $locale, EaseConstant, tmhDynamicLocale) {
        var i18nData = null,
          lobData = null,
          httpPromise = null;
        return {
          promise: httpPromise,
          get: function(attr, lob) {
            var deferred = $q.defer(),
              resource = '', locale;
            locale = tmhDynamicLocale.get() || $locale.id;
            resource = (lob) ? '/ease-ui/bower_components/' + lob + '/utils/i18n/resources-locale_' + locale +
              '.json': '/ease-ui' + EaseConstant.kBuildVersionPath + '/dist/utils/components/i18n/resources-locale_' +
              locale + '.json';
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
                console.log('i18n File not found: ' + error);
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
    ])
    .provider('languagePreferencesFactory', ['EaseConstant', function(EaseConstant) {

      var self = this,
        languagePreferences = '',
        languagePreferencesText = '';

      self.setInitialLanguagePreferences = function(value) {
        languagePreferences = value;
        languagePreferencesText = self.getLanguageText(value);
      };

      self.getLanguageText = function(lang) {
        if (lang === EaseConstant.kEnglishLocale) {
          return 'English';
        } else if (lang === EaseConstant.kSpanishLocale) {
          return 'Espa\u00f1ol';
        }
      };

      self.$get = function() {

        if (!languagePreferences) {
          languagePreferences = EaseConstant.kEnglishLocale;
          languagePreferencesText = self.getLanguageText(EaseConstant.kEnglishLocale);
        }

        return {
          currentLocale: languagePreferences,
          currentLocaleText: languagePreferencesText,
          setLanguagePreferences: changeLanguagePreferences
        };

        function changeLanguagePreferences(value) {
          this.currentLocale = languagePreferences = value;
          this.currentLocaleText = languagePreferencesText = self.getLanguageText(value);
        }

      };

    }]);
});

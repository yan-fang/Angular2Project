define(['angular', 'moment', 'require'], function(angular, moment, require) {
  'use strict';
  angular.module('easeAppUtils')
    .constant('localeConstants', {
      defaultLocale: 'en-US',
      // Mappings between four supported CapitalOne Locale Id's and Locale Id's of moment.js and ngTranslate
      localeMap: {
        'EN-US': {
          momentLocaleId: 'en',
          ngTranslateLocaleId: 'en_US'
        },
        'ES-US': {
          momentLocaleId: 'es',
          ngTranslateLocaleId: 'es_US'
        },
        'EN-CA': {
          momentLocaleId: 'en-ca',
          ngTranslateLocaleId: 'en_CA'
        },
        'FR-CA': {
          momentLocaleId: 'fr-ca',
          ngTranslateLocaleId: 'fr_CA'
        }
      }})
    .factory('dateLocalizationService', dateLocalizationService)
    .filter('l10nDate', l10nDate);

  dateLocalizationService.$inject = ['localeConstants'];
  function dateLocalizationService(localeConstants) {
    function loadLocale(localeToLoad) {
      // default the locale to English
      moment.locale('en');

      var momentLocaleId = localeConstants.localeMap[localeToLoad.toUpperCase()].momentLocaleId;

      // Moment.js' default locale is 'en' so no need to 'require' it
      if (momentLocaleId === 'en') {
        return;
      }

      function loadLocaleCallback() {
        moment.locale(momentLocaleId);
      }

      // Requiring the locale by using the Module ID (the parameter is not a path)
      // 'moment' used here refers to the package (i.e. module prefix) defined in main.tpl
      require(['moment/locale/' + momentLocaleId], loadLocaleCallback);
    }

    // Localize the provided Date object into a string of the given format
    // See http://momentjs.com/docs/#/parsing/ for all supported input types
    // See http://momentjs.com/docs/#/displaying/ for the list of supported formats
    function localize(date, format) {
      return moment(date).format(format);
    }

    return {
      loadLocale : loadLocale,
      localize : localize
    };
  }

  // Usage: {{ myDate | l10nDate : 'ddd, MMM DD, YYYY' }}
  l10nDate.$inject = ['dateLocalizationService'];
  function l10nDate(dateLocalizationService) {
    return function(input, format) {
      return dateLocalizationService.localize(input, format);
    }
  }
});

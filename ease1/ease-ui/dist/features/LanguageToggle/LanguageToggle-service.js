define(['angular'],
  function(angular) {
    'use strict';

    var LOCALE_COOKIE = 'locale_pref';

    angular
      .module('LanguageToggleModule')
      .factory('languageToggleService', [
        'easeExceptionsService', '$q', '$http', 'EaseConstant', '$rootScope', '$translate',
        languageToggleService
      ])
      .factory('languageToggleStorage', [
        'appCookie', '$http', 'EaseConstant',
        languageToggleStorage
      ])
      .factory('languageToggleMissingTranslationHandler', [
        '$rootScope',
        languageToggleMissingTranslationHandler
      ]);

    /**
     * Service backing the language toggle feature.
     *
     * @param easeExceptionsService
     * @param $http
     * @returns {{put: putLanguagePreference, get: getLanguagePreference, putLanguagePreference: putLanguagePreference,
     *  getLanguagePreference: getLanguagePreference, getLanguages: getLanguages,
     *  registerRefreshOnTranslateAddPartEvent: registerRefreshOnTranslateAddPartEvent,
     *  registerThrowErrorOnTranslateLoadFailureEvent: registerThrowErrorOnTranslateLoadFailureEvent}}
     */
    function languageToggleService(easeExceptionsService, $q, $http, EaseConstant, $rootScope, $translate) {
      return {
        getLanguages: getLanguages,
        registerRefreshOnTranslateAddPartEvent: registerRefreshOnTranslateAddPartEvent,
        registerThrowErrorOnMissingTranslationErrorEvent: registerThrowErrorOnMissingTranslationErrorEvent,
        registerThrowErrorOnTranslateLoadFailureEvent: registerThrowErrorOnTranslateLoadFailureEvent,
        registerChangeLanguageOnCustomerPreferencesLoadedEvent: registerChangeLanguageOnCustomerPreferencesLoadedEvent
      };

      /**
       * Obtains a list of all supported languages.
       *
       * @returns @returns {Promise} with data {{label: string, value: string}[]}
       */
      function getLanguages() {

        var deferred = $q.defer();

        $http.get(EaseConstant.baseUrl + '/languages').then(success, error);

        return deferred.promise;

        function success(response) {
          deferred.resolve(response.data);
        }

        function error() {
          deferred.resolve([{
            label: 'header.language.english',
            value: 'en_US'
          }]);
        }
      }

      /**
       * Automatically refresh translation table after a call to $translatePartialLoader.addPart('somePart');
       *
       * @param $rootScope the scope on which to listen for the desired event.
       * @param $translate the service on which to refresh the translation table.  Avoid circular reference by having
       *  this passed in by the caller.
       */
      function registerRefreshOnTranslateAddPartEvent() {
        $rootScope.$on('$translatePartialLoaderStructureChanged', function() {
          $translate.refresh();
        });
      }

      /**
       * Throw an EaseException if a missing translation identifier occurs.
       *
       * @param $rootScope the scope on which to listen for the desired event.
       */
      function registerThrowErrorOnMissingTranslationErrorEvent() {
        $rootScope.$on('$translateMissingTranslationError', function(event, translationId) {
          throw easeExceptionsService.createEaseException({
            'module': 'LanguageToggleModule',
            'function': 'languageToggleService.registerThrowErrorOnMissingTranslationErrorEvent',
            'cause': 'failed to find translation for ' + translationId
          });
        });
      }

      /**
       * Throw an EaseException if the angular translate asynchronous loader returns with a rejected promise (i.e. a
       * request for a message partial fails).
       *
       * @param $rootScope the scope on which to listen for the desired event.
       */
      function registerThrowErrorOnTranslateLoadFailureEvent() {
        $rootScope.$on('$translateLoadingError', function(event, detail) {
          throw easeExceptionsService.createEaseException({
            'module': 'LanguageToggleModule',
            'function': 'languageToggleService.registerThrowErrorOnTranslateLoadFailure',
            'cause': 'failed to load partial for lang ' + detail.language
          });
        });
      }

      /**
       * Change the selected language based on the customer preference on the server after the customer completes login
       * and the customer preferences are available.
       *
       * @param $rootScope the scope on which to listen for the desired event.
       * @param $translate the service on which to change the current language.  Avoid circular reference by having
       *  this passed in by the caller.
       */
      function registerChangeLanguageOnCustomerPreferencesLoadedEvent() {
        $rootScope.$on('customerSummaryLoaded', function(event, customerPreferences) {
          if (angular.isDefined(customerPreferences.language)) {
            $translate.use(customerPreferences.language);
          }
        });
      }
    }

    /**
     * Implementation of Angular Translate's custom storage interface that stores in a cookie and attempts to store
     * the preference via a web service as well.
     *
     * Note: get and put methods are required for Angular Translate's custom storage.  The get() method doesn't
     * support async calls so it should just read a cookie but the put can write the option to the server.
     *
     * @param appCookie utility used to manipulate cookies
     * @param $http
     * @param EaseConstant
     * @returns {{put: putLanguagePreference, get: getLanguagePreference}}
     */
    function languageToggleStorage(appCookie, $http, EaseConstant) {
      return {
        put: putLanguagePreference,
        get: getLanguagePreference
      };

      /**
       * Store the language preference under the supplied name.
       *
       * @param name
       * @param value
       */
      function putLanguagePreference(name, value) {
        appCookie.create(LOCALE_COOKIE, value);
        //The actual service is not yet implemented, keeping this commented until service is implemented
        //$http.put(EaseConstant.baseUrl + '/customer/profile/preferences/language', {language: value});
      }

      /**
       * Retrieve the language preference for the supplied name.
       *
       */
      function getLanguagePreference() {
        return appCookie.read(LOCALE_COOKIE);
      }
    }

    /**
     * Implementation of Angular Translate's custom error handler interface that emits an error event when a
     * translation is not found.
     *
     * @param $rootScope
     * @returns {emitMissingTranslationError}
     */
    function languageToggleMissingTranslationHandler($rootScope) {

      return emitMissingTranslationError;

      /**
       * @param translationId The id that failed to translate
       * @returns {*} the value to use when a translation is missing, in this case translationId.
       */
      function emitMissingTranslationError(translationId) {
        $rootScope.$emit('$translateMissingTranslationError', translationId);
        return translationId;
      }
    }
  });

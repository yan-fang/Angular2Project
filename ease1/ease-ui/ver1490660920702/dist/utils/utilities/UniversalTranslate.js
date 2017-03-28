define(['angular'], function(angular) {
  'use strict';

  angular.module('UniversalTranslateModule', [])
    .factory('UniversalTranslate', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {
    var needToLoadParts;
    var ut = createUT;
    var partMap = {};
    var queryTemplate = '?feature={part}&lang={locale}';
    var flatFileTemplate = '/{part}-{locale}.json';
    var loaderPromise;

    function Part(partName) {
      this.locales = {};
      this.name = partName;
      this.load = true;
      this.isFlatFile = false;
      this.url = '';
    }

    function createUT(options) {
      options.baseUrl = options.baseUrl || '';

      if (angular.isUndefined(loaderPromise)) { loaderPromise = $q.defer(); }

      var dataToReturn = [];
      var localeKey = options.key;
      var partsToLoad = _getPartsToLoad(localeKey);

      if (_hasParts()) {
        if (needToLoadParts) {
          var part;
          var calls = [];

          for (var partName in partMap) {
            part = partMap[partName];

            if (part.load === true) {
              part.load = false;
              calls.push($http.get(_buildUrl(part, options)));
            } else {
              dataToReturn.push(part.locales[localeKey]);
            }
          }

          $q.all(calls).then(function(response) {
            for (var i = 0; i < partsToLoad.length; i++) {
              partsToLoad[i].locales[localeKey] = response[i].data;
              partsToLoad[i].load = false;
              dataToReturn.push(response[i].data);
            }

            loaderPromise.resolve(dataToReturn);
          }, function onError() {
            loaderPromise.reject(options.key);
          });
        } else {
          for (var partName in partMap) {
            dataToReturn.push(partMap[partName].locales[localeKey]);
          }

          loaderPromise.resolve(dataToReturn);
        }
      } else {
        loaderPromise.resolve();
      }

      return loaderPromise.promise;
    }

    function load(futureParts) {
      loaderPromise = $q.defer();

      if (angular.isArray(futureParts)) {
        futureParts.map(_buildPart);
      } else {
        _buildPart(futureParts);
      }

      $rootScope.$emit('$translatePartialLoaderStructureChanged');
      return loaderPromise.promise;

      function _buildPart(futurePart) {
        if (!partMap[futurePart.name]) {
          partMap[futurePart.name] = new Part(futurePart.name);
        }

        partMap[futurePart.name].url = futurePart.url;
        partMap[futurePart.name].isFlatFile = futurePart.flatFile || false;
      }
    }

    function _getPartsToLoad(locale) {
      var partsToLoad = [];
      needToLoadParts = false;

      for (var partName in partMap) {
        if (!partMap[partName].locales[locale]) {
          partMap[partName].load = true;
        }

        if (partMap[partName].load === true) {
          partsToLoad.push(partMap[partName]);
        }
      }

      if (partsToLoad.length > 0) {
        needToLoadParts = true;
      }

      return partsToLoad;
    }

    function _hasParts() {
      for (var partName in partMap) {
        if (partMap.hasOwnProperty(partName)) {
          return true;
        }
      }

      return false;
    }

    function _buildUrl(part, options) {
      var partMatch = new RegExp('\\{part\\}', 'g');
      var localeMatch = new RegExp('\\{locale\\}', 'g');
      var url = part.isFlatFile ? (part.url + flatFileTemplate) : (options.baseUrl + part.url + queryTemplate);

      url = url.replace(partMatch, part.name);
      url = url.replace(localeMatch, options.key);

      return url;
    }

    ut.load = load;

    return ut;

  }]);
});

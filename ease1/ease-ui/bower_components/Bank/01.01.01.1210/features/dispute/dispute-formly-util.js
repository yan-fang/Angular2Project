define(['angular'], function(angular) {
  'use strict';
  angular
    .module('BankModule')
    .factory('DisputeFormlyUtil', DisputeFormlyUtil);

  DisputeFormlyUtil.$inject = ['$q', '$http', 'BankFiles'];
  function DisputeFormlyUtil($q, $http, BankFiles) {

    var formlyBundle;
    var originalModels;

    return {
      initFormlyConfiguration: initFormlyConfiguration,
      getFormlyConfig: getFormlyConfig,
      setFormlyConfig: setFormlyConfig,
      resetModels: resetModels
    };

    function initFormlyConfiguration(path) {
      var deferred = $q.defer();
      var endpoint = BankFiles.getFilePath(path);
      var callForResourceBundle = $http.get(endpoint);

      callForResourceBundle.then(function success(response) {
        originalModels = response.data.models;
        deferred.resolve(response.data);
      }, function failure() {
        deferred.reject();
      });
      return deferred.promise;
    }

    function getFormlyConfig() {
      return formlyBundle;
    }

    function setFormlyConfig(formlyConfig) {
      formlyBundle = formlyConfig;
    }

    function resetModels() {
      formlyBundle.models = originalModels;
    }
  }
});

define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .factory('FeatureToggleService', FeatureToggleService);

  FeatureToggleService.$inject = [
    'Restangular',
    'BillPayConstants',
    'EaseConstantFactory',
    '$q'
  ];

  function FeatureToggleService(
    Restangular,
    BillPayConstants,
    EaseConstantFactory,
    $q
  ) {
    var api = {
      getFeatureToggleDataFromOL: getFeatureToggleDataFromOL,
      getFeatureToggleData: getFeatureToggleData
    };

    var featureToggleData = BillPayConstants.featureToggle;

    function getFeatureToggleDataFromOL() {
      var deferred = $q.defer();
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      Restangular.all(BillPayConstants.billPayFeatureToggleUrl)
        .get('')
        .then(function success(data) {
          angular.copy(data, featureToggleData);
          deferred.resolve(true);
        }, function error() {
          deferred.resolve(true);
        });
      return deferred.promise;
    }

    function getFeatureToggleData() {
      return featureToggleData;
    }

    return api;
  }
});

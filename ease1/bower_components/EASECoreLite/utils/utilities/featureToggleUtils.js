define(['angular'], function(angular) {
  'use strict';
  angular.module('easeAppUtils').factory('featureToggleFactory', featureToggleFactory);

  featureToggleFactory.$inject = ['Restangular', 'EaseConstant', '$q', 'easeExceptionsService', '$rootScope',
    'EASEUtilsFactory'
  ];

  function featureToggleFactory(Restangular, EaseConstant, $q, easeExceptionsService, $rootScope, EASEUtilsFactory) {

    var featureToggleData = {};
    var dataStore = {};
    var FEATURENAME = 'featureName';
    var GROUPNAME = 'groupname';
    var EASE = 'EASE';
    var groupFeatureToggleData = {};

    function getFeatureToggleData() {
      return featureToggleData;
    }

    function getFeatureToggleDataSingle(pageType) {
      if (dataStore.hasOwnProperty(pageType)) {
        return dataStore[pageType];
      }
    }

    function getGroupFeatureToggleDataFromDatastore(groupName) {
      return groupFeatureToggleData[groupName];
    }

    function setGroupFeatureToggleDataStore(data, groupName) {
      groupFeatureToggleData[groupName] = data;
    }

    function getFeatureToggleDataByGroup(groupName) {
      var deferred = $q.defer();
      if (this.getGroupFeatureToggleDataFromDatastore(groupName)) {
        deferred.resolve(this.getGroupFeatureToggleDataFromDatastore(groupName));
      } else {
        var featuresUri = EaseConstant.kFeaturesRetrieveUrl + '?groupName' + '=' + groupName;
        Restangular.setBaseUrl(EaseConstant.baseUrl);
        Restangular.one(featuresUri).get().then(function(data) {
            setGroupFeatureToggleDataStore(data, groupName);
            deferred.resolve(data);
          },
          function(ex) {
            // reject the promise with no value and just throw an exception
            deferred.reject();
            throw easeExceptionsService.createEaseException({
              'module': 'easeAppUtils',
              'function': 'featureToggleFactory.getFeatureToggleDataByGroup',
              'message': ex.statusText,
              'cause': ex
            });
          });
      }

      return deferred.promise;

    }
    /*
      Function will always return a Promise of the value of FeatureToggleData
     */
    function initializeFeatureToggleData(featureParam) {

      var deferred = $q.defer();

      if (featureToggleData.fromServer) {
        deferred.resolve(featureToggleData);
      } else {
        Restangular.setBaseUrl(EaseConstant.baseUrl);
        var featuresUri = EaseConstant.kFeaturesRetrieveUrl;

        //Retrieve a specific feature belonging to a group
        if (typeof featureParam !== 'undefined') {
          featuresUri = featuresUri + '?' + GROUPNAME + '=' + EASE + '&' + FEATURENAME + '=' + featureParam;
        }
        Restangular.one(featuresUri).get().then(function(data) {
            //update featureToggle Data and return the new value
            if (typeof featureParam !== 'undefined') {
              dataStore[featureParam] = data;
            } else {
              featureToggleData = data;
            }
            deferred.resolve(data);
            //Event is being listened from FeedbackModule.js
            if (featureParam === EaseConstant.features.usabillaFeature) {
              //TODO: replace usabilla
              $rootScope.$emit('featureToggleUsabilla');
            }
          },
          function(ex) {
            // reject the promise with no value and just throw an exception
            deferred.reject();
            throw easeExceptionsService.createEaseException({
              'module': 'easeAppUtils',
              'function': 'featureToggleFactory.initializeFeatureToggleData',
              'message': ex.statusText,
              'cause': ex
            });
          });
      }
      return deferred.promise;
    } //end initializeFeatureToggleData

    var factory = {
      initializeFeatureToggleData: initializeFeatureToggleData,
      getFeatureToggleData: getFeatureToggleData,
      getFeatureToggleDataSingle: getFeatureToggleDataSingle,
      getFeatureToggleDataByGroup: getFeatureToggleDataByGroup,
      setGroupFeatureToggleDataStore: setGroupFeatureToggleDataStore,
      getGroupFeatureToggleDataFromDatastore: getGroupFeatureToggleDataFromDatastore
    };

    return factory;
  } // end FeatureToggleFactory
});

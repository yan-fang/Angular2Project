/**
 * Created by axc017 on 9/7/16.
 */
define(['angular'], function(angular) {

  'use strict';
  angular
    .module('BankModule')
    .factory('CommonDisputeFactory', DisputeFactory);

  DisputeFactory.$inject = ['$state', 'DisputeFormlyUtil', 'BankPubSubFactory'];
  function DisputeFactory($state, DisputeFormlyUtil, BankPubSubFactory) {

    return {
      close: close
    };

    function close() {
      var levels = {"level3": ""};
      BankPubSubFactory.logTrackAnalyticsPageView(levels);
      DisputeFormlyUtil.resetModels();
      $state.go('BankDetails.transactions');
    }
  }
});

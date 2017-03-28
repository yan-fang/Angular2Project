define('AutoLoanPubSub',['angular', 'lodash'], function(angular) {
  'use strict';

  var module = angular.module('AutoLoanPubsubModule', ['pubsubServiceModule']);

  module.factory('AutoLoanPubsubService', AutoLoanPubsubService);

  AutoLoanPubsubService.$inject = ['pubsubService'];

  function AutoLoanPubsubService(pubsubService) {
    var services = {};
    services.trackPageView = function(data) {
      pubsubService.pubsubTrackAnalytics({
        taxonomy: _.assign({
          level1: 'ease',
          level2: '',
          level3: '',
          level4: '',
          level5: '',
          country: 'us',
          language: 'english',
          system: 'ease_web'
        }, data),
        lob: 'coaf'
      });

    };

    services.trackPageViewTrackAccountType = function(data,dataTaxonomy) {
      pubsubService.pubsubTrackAnalytics(_.assign({
        taxonomy: _.assign({
          level1: 'ease',
          level2: '',
          level3: '',
          level4: '',
          level5: '',
          country: 'us',
          language: 'english',
          system: 'ease_web'
        }, dataTaxonomy),
        lob: 'coaf',
        accountType:''
      },data));

    };

    services.trackClickEvent = function(event) {
      pubsubService.pubsubTrackAnalytics(event);
    };

    services.trackButtonClickEvent = function(eventName) {
      pubsubService.pubsubButtonClick({buttonName: eventName});
    };

    return services;
  }

  return module;
});





require(["AutoLoanPubSub"]);

//# sourceMappingURL=pubsub-service.js.map
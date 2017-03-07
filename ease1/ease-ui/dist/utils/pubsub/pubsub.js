define(['angular'], function(angular) {
  'use strict';
  var pubsubService = angular.module('pubsubServiceModule', [ ])
    .factory('pubsubService', ['$window', function($window) {
      var pubsub = function(eventName, value) {
        try {
          if (value.scDLLevel2 === 'login' && typeof $window.publisherFW === 'undefined') {
            var pubsublogin = setInterval(function() {
              try {
                $window.publisherFW.publishEvent(eventName, value);
                clearInterval(pubsublogin);
              } catch (ex) {}
            }, 300)
          } else {
            $window.publisherFW.publishEvent(eventName, value);
          }
        } catch (e) {
          console.log('there is error in pubsub framework: ' + e);
        }
      };
      return {
        pubsubTrackAnalytics: function(value) {
          pubsub('trackAnalytics', value);
        },
        pubsubPageView: function(value) {
          pubsub('pageView', value);
        },
        pubsubLinkClick: function(value) {
          pubsub('linkClicked', value);
        },
        pubsubNavClick: function(value) {
          pubsub('navClicked', value);
        },
        pubsubButtonClick: function(value) {
          pubsub('buttonClicked', value);
        },
        pubsubformfieldClick: function(value) {
          pubsub('formfieldClicked', value);
        },
        pubsubDrawerClose: function(value) {
          pubsub('drawerClose', value);
        },
        pubsubDrawerOpen: function(value) {
          pubsub('drawerOpen', value);
        },
        pubsubCarouselClicked: function(value) {
          this.pubsubTrackAnalytics(value);
        },
        pubsubDropdownSelected: function(value) {
          pubsub('dropdownSelected', value);
        }
      };
    }]);
  return pubsubService;
});

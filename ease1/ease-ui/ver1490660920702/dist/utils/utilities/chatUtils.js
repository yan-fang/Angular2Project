define(['angular', 'require'], function(angular, require) {
  'use strict';
  angular.module('easeAppUtils').service('ChatService', ChatService);

  ChatService.$inject = ['$window', 'featureToggleFactory', 'EaseConstant'];

  function ChatService($window, featureToggleFactory, EaseConstant) {

    function initiateChat() {
      if(!$window._tfsq) {
        require(['optional!Chat247'], function(){
          $window._tfsq = [];
        });
      }
    }

    function setChatData(scope, chatData, eventType, callBackFunction) {
      featureToggleFactory.initializeFeatureToggleData().then(function(feature) {
        if (feature && feature[EaseConstant.features.chat247]) {
          pushChatData(scope, chatData, eventType, callBackFunction);
        }
      });
    }

    function pushChatData(scope, chatData, eventType, callBackFunction) {
      $window._tfsq.push([scope, chatData, eventType, callBackFunction]);
    }

    function deleteChatData() {
      $window._tfsq = [];
    }

    return {
      initiateChat: initiateChat,
      setChatData: setChatData,
      deleteChatData: deleteChatData
    };
  }
});

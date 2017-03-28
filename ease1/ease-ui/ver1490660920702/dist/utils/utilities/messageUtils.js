define(['angular'], function(angular) {
  'use strict';

  angular.module('easeAppUtils').factory('messagingService',  messagingService);

  messagingService.$inject = ['Restangular', 'EASEUtilsFactory', 'EaseConstant', '$sessionStorage', '$rootScope', '$q',
    'summaryService', 'featureToggleFactory', '$injector', 'appCookie', 'languagePreferencesFactory', '$filter',
    '$window'];

  function messagingService(Restangular, EASEUtilsFactory, EaseConstant, $sessionStorage, $rootScope, $q,
                          summaryService, featureToggleFactory, $injector, appCookie, languagePreferencesFactory,
                            $filter, $window) {

    var getPrirorityMessage = function(messages) {
      var firstMessage = messages[0];
      messages.forEach(function(item, i) {
        if (parseInt(item.priority) > parseInt(firstMessage.priority)) {
          firstMessage = item;
        }
      });
      return firstMessage;
    };

    var mapOverRideTypeToUrl = function(overRideType) {
      var basePath = { redirectingPath: '', internalToEase: true };
      switch (overRideType) {
        case 'EXTERNAL':
          basePath.internalToEase = false;
          break;
        case 'INT_COS':
        case 'INT_TRANSITE':
          basePath.internalToEase = false;
          break;
      }
      return basePath;
    };

    var getRedirectingUrl = function(button) {
      var linkingData = { path: '', internalToEase: '' };
      var overRideType = button.overRideType ? button.overRideType : '';
      var basePath = mapOverRideTypeToUrl(overRideType);
      linkingData.path = basePath.redirectingPath.concat(button.link.path);
      linkingData.internalToEase = basePath.internalToEase;
      return linkingData;
    };

    var formatFlapMessage = function(messages) {
      messages.forEach(function(item, i) {
        var msgHtml = '';
        var msgLink = {};
        var msgBody = '';
        try {
          if (item.article.section[0].headline) {
            msgHtml = item.article.section[0].headline;
          }
          if (item.article.section[0].body) {
            msgBody = item.article.section[0].body;
          }
          if (item.article.section[0].button.length > 0) {
            var button = item.article.section[0].button[0];
            var linkingData = getRedirectingUrl(button);
            msgLink.overRideType = item.article.section[0].button[0].overRideType ?
              item.article.section[0].button[0].overRideType : '';
            msgLink.value = button.value;
            msgLink.linkType = button.link.type;
            msgLink.path = linkingData.path;
            msgLink.internalToEase = linkingData.internalToEase;
          }
        } catch (exp) {
          msgHtml = item;
          msgLink = item;
          msgBody = item;
        }
        item.message = msgHtml;
        item.msgLink = msgLink;
        item.msgBody = msgBody;
        item.responseUrlHref = item.responseUrlHref ? item.responseUrlHref : '';
        item.messageAnalyticsTracker = item.messageAnalyticsTracker ? item.messageAnalyticsTracker : '';
      });
      return messages;
    };

    var formatButtonMessages = function(btnMessages) {
      var buttonDetails = btnMessages.article.section[0].button[0];
      var subMessage = {};
      subMessage.action = buttonDetails.link.path ? buttonDetails.link.path.toLowerCase() : '';
      subMessage.buttonText = buttonDetails.value ? buttonDetails.value : '';
      subMessage.textAboveButton = buttonDetails.addText ? buttonDetails.addText : '';
      subMessage.responseUrlHref = btnMessages.responseUrlHref ? btnMessages.responseUrlHref : '';
      subMessage.messageAnalyticsTracker = btnMessages.messageAnalyticsTracker ? btnMessages.messageAnalyticsTracker : '';
      return subMessage;
    };

    var getGenericMessage = function(msgs, trust) {
      var priorityMessage = getPrirorityMessage(msgs);
      var msgHtml = '';
      try {
        if (priorityMessage.article.section[0].headline) {
          msgHtml = priorityMessage.article.section[0].headline;
        } else if (priorityMessage.article.section[0].body) {
          msgHtml = priorityMessage.article.section[0].body;
        }
      } catch (exp) {
        msgHtml = priorityMessage;
      }
      priorityMessage.messageAnalyticsTracker = priorityMessage.messageAnalyticsTracker ? priorityMessage.messageAnalyticsTracker : '' ;
      priorityMessage.message = msgHtml;
      priorityMessage.responseUrlHref = priorityMessage.responseUrlHref ? priorityMessage.responseUrlHref : '';
      return priorityMessage;
    };

    function getCreditCardCollectionData() {
      var summaryData = EASEUtilsFactory.getSummaryData();
      var featureToggleData = featureToggleFactory.getFeatureToggleData();
      var deferred = $q.defer();
      var accountDetails = [],
        creditCardDetails = [],
        promises = [];
      _.forEach(summaryData.accounts, function(account){
        var accountDetail = [account.referenceId, account.category, 'ACTIVE'];
        accountDetails.push(accountDetail.join('|'));
        if(account.category === 'CC' && account.collectionTreatmentCategoryCode) {
            var creditCardDetail = [account.referenceId, $filter('limitTo')(account.accountNumberTLNPI, '-4'),
              account.collectionTreatmentCategoryCode];
            creditCardDetails.push(creditCardDetail.join('|'));
        } else if (account.category === 'CC' && !account.collectionTreatmentCategoryCode && summaryData.accounts.length > 1
          && featureToggleData && featureToggleData[EaseConstant.features.cardDetails]) {
          Restangular.setBaseUrl(EaseConstant.baseUrl);
          var getCreditCardDetailsUrl = Restangular.all(EaseConstant.kGetCreditCardDetailsUrl);
          var obj = {
            'accountReferenceId' : account.referenceId
          };
          EASEUtilsFactory.setCustomerActivityHeader('50081');
          getCreditCardDetailsUrl.post(obj).then(function(data) {
            if(data.collectionTreatmentCategoryCode) {
              var creditCardDetail = [account.referenceId, $filter('limitTo')(account.accountNumberTLNPI, '-4'),
                data.collectionTreatmentCategoryCode];
              creditCardDetails.push(creditCardDetail.join('|'));
            }
            deferred.resolve(data);
          });
          promises.push(deferred.promise);
        }
      });
      $q.all(promises).then(function() {
        setChatVariables(accountDetails, creditCardDetails);
        promises = [];
      });
    }

    function setChatVariables(accountDetails, creditCardDetails) {
      var ChatService = $injector.get('ChatService');
      var chatData = {
        tfsProfileReferenceID: appCookie.read('C1_PID'),
        tfsAcctIdStatusAndProductIdentifier: accountDetails,
        tfsLOB: 'Enterprise',
        tfsSection: 'Account Summary',
        tfsLanguage: languagePreferencesFactory.currentLocale,
        tfsLogin: 'YES',
        tfsPageURL: $window.location.href,
        tfsCollectionAcctData: _.isEmpty(creditCardDetails) ? 'NA' : creditCardDetails,

        tfsSegment: 'NA', // EGS or HVS
        tfsGroup: 'NA',
        tfsFunction: 'NA',
        tfsUnit: 'NA',
        tfsConversionStage: 'NA'
      };
      ChatService.setChatData('page', chatData, 'pageload');
    }

    var messageSummary = null;

    return {
      messages: [],
      messagingReferenceId: '',
      promises: [],
      messageAnalytics: [],
      getMessageSummary: function() {
        return messageSummary;
      },
      setMessageSummary: function(value) {
        if ($rootScope.$root.$$phase !== '$apply' && $rootScope.$root.$$phase !== '$digest') {
          $rootScope.$apply(function() {
            messageSummary = value;
          });
        } else {
          messageSummary = value;
        }
      },

      callGlobalMessage: function(refID) {
        var self = this;
        var isGlobalMsg = true;
        var getMessageRequestPayLoad = {};
        var deferred = $q.defer();
        var acctRefId = [];
        acctRefId.push('');
        getMessageRequestPayLoad.accountReferenceIds = acctRefId;
        getMessageRequestPayLoad.customerDateTime = refID.customerDateTime;
        getMessageRequestPayLoad.numOfMsgs = refID.numOfMsgs;
        getMessageRequestPayLoad.pageContext = refID.pageContext;
        getMessageRequestPayLoad.logAsViewed = refID.logAsViewed;

        Restangular.setBaseUrl(EaseConstant.baseUrl);
        var getMessage = Restangular.all(EaseConstant.kGetMessageUrl);
        getMessage.post(getMessageRequestPayLoad).then(function(msgData) {
          deferred.resolve(msgData);
          self.setMessageSummary(msgData);
          if (isGlobalMsg) {
            $rootScope.$broadcast('UPDATE_GLOBAL_MSG', self.getGlobalMessage(), null, null);
          }
        }, function(){
          $rootScope.$broadcast('UPDATE_GLOBAL_MSG', self.getGlobalMessage(), null, null);
        });
        self.promises.push(deferred.promise);
        return deferred.promise;
      },
      getMessagesOnAccountSummary: function(refID) {
        var self = this;
        self.messageAnalytics = [];
        self.promises = [];
        var globalAnalyticsTracker = '';
        EASEUtilsFactory.setCustomerActivityHeader('50000');
        self.callGlobalMessage(refID).then(function() {
          globalAnalyticsTracker = self.getGlobalMessage() && self.getGlobalMessage().messageAnalyticsTracker ?
            self.getGlobalMessage().messageAnalyticsTracker : '';
          self.messageAnalytics.push(globalAnalyticsTracker);
        });
        self.getMessageApi(refID);

        $q.all(self.promises).then(function() {
          var customerPlatformDetailsFactory = $injector.get('customerPlatformDetailsFactory');
          var data = customerPlatformDetailsFactory.getCustomerPlatformData();
          var splitData = data.customerPlatform.split(',');
          var taxonomyVal  = {
            level1: 'ease',
            level2: 'account summary',
            level3: '',
            level4: '',
            level5: '',
            country: 'us',
            language: 'english',
            system: 'ease_web'
          };
          var accountAction = splitData.join('|');
          var lob = summaryService.getLobArray().join(' | ');
          EASEUtilsFactory.setMsgAnalytics(self.messageAnalytics);
          EASEUtilsFactory.pubsubTrackAnalyticswithMsg(taxonomyVal, lob, accountAction);
          self.promises = [];
          featureToggleFactory.initializeFeatureToggleData().then(function (feature) {
            if(feature && feature[EaseConstant.features.chat247]) {
                getCreditCardCollectionData();
            }
          });
        });
      },

      getMessageApi: function(refID) {
        var self = this;
        self.messages.length = 0;
        self.setMessageSummary('');
        var deferred = $q.defer();
        if (refID.accountReferenceIds.length > 0) {
          $sessionStorage.IsRefresh = true;
        }

        refID.accountReferenceIds.forEach(function(id, j) {
          var deferredReq = $q.defer();
          var getMessageRequestPayLoad = {};
          var acctRefId = [];
          acctRefId.push(id);
          getMessageRequestPayLoad.accountReferenceIds = acctRefId;
          getMessageRequestPayLoad.customerDateTime = refID.customerDateTime;
          getMessageRequestPayLoad.numOfMsgs = refID.numOfMsgs;
          getMessageRequestPayLoad.pageContext = refID.pageContext;
          getMessageRequestPayLoad.logAsViewed = refID.logAsViewed;

          //Call OL Messaging API
          Restangular.setBaseUrl(EaseConstant.baseUrl);
          var getMessage = Restangular.all(EaseConstant.kGetMessageUrl);
          getMessage.post(getMessageRequestPayLoad).then(function(msgData) {
            deferredReq.resolve(msgData);
            self.setMessageSummary(msgData);
            var tileMessages = self.getFlapMessage((id));
            var messages = tileMessages;
            messages.messagingReferenceId = decodeURIComponent(id);
            var mudFlapAnalyticsTracker = messages && messages.flapMessages && messages.flapMessages[0]
               && messages.flapMessages[0].messageAnalyticsTracker ? messages.flapMessages[0].messageAnalyticsTracker : '';
            var buttonFlapAnalyticsTracker = messages && messages.buttonMessage && messages.buttonMessage.messageAnalyticsTracker ?
              messages.buttonMessage.messageAnalyticsTracker : '';
            self.messages[j] = messages;
            self.messageAnalytics.push(mudFlapAnalyticsTracker);
            self.messageAnalytics.push(buttonFlapAnalyticsTracker);
            self.messagingReferenceId = new Date();
          }, function(ex) {
            deferredReq.reject(ex);
          });
          self.promises.push(deferredReq.promise);
          deferred = deferredReq;
        });
        return deferred.promise;
      },
      // Do not call respond to message eAPI for already viewed messages
      responseMessageApi: function(responseUrlHref, responseType, pageContext, busEvtId) {
        if (typeof responseUrlHref === 'undefined' || responseUrlHref === '') {
          return false;
        }
        var d = new Date();
        var viewDate = d.toISOString();
        var respondToMsgObj = {
          "url": responseUrlHref,
          "action": responseType || 'VIEWED',
          "viewedDateTime": viewDate,
          "pageContext": pageContext || "summary",
          "viewedCount": "1"
        }
        busEvtId = busEvtId || '50000';
        EASEUtilsFactory.setCustomerActivityHeader(busEvtId);
        Restangular.setBaseUrl(EaseConstant.baseUrl);
        var respondToMessage = Restangular.all(EaseConstant.kGetResponseMessageUrl);
        respondToMessage.post(respondToMsgObj).then(function(msgResponse) {}, function(msgResponse) {
          console.log(msgResponse);
        });
      },
      getGlobalMessage: function(showBackgroundImg) {
        var self = this;
        var globalMsg = { message: '', path: '', linkingText: '', internalToEase: true, messageAnalyticsTracker: '', customBgImgLink: '' };
        var msgSummary = self.getMessageSummary();
        if (msgSummary && msgSummary.global && msgSummary.global.length > 0) {
          globalMsg = getGenericMessage(self.getMessageSummary().global);
        }

        //Obtain feature toggle data
        var featureToggleData = featureToggleFactory.getFeatureToggleData();

        //Initializing global message flag to true, to allow display as usual
        // unless flag is false
        var isGlobalMsgFeatureToggle = true;
        if (featureToggleData && (typeof featureToggleData[EaseConstant.features.globalMessageFeatureName] !== 'undefined')) {
          //set the flag from feature toggle data
          isGlobalMsgFeatureToggle = featureToggleData[EaseConstant.features.globalMessageFeatureName];
        }

        //We check for both conditions - global message being (null or empty) OR (feature toggle
        // flag is set to false) - then use the greeting message
        if ((globalMsg && globalMsg.message === '') || (isGlobalMsgFeatureToggle === false)) {
          globalMsg.message = self.greetingMessage();
          globalMsg.showDefaultBgImg = showBackgroundImg === 'noBackgroundImg' ? false : true;
        } else {
          //Use actual message from the OL service.
          globalMsg.message = self.greetingMessageChunks(globalMsg.message);
          var button = globalMsg.article.section[0].button[0];
          if (button) {
            var linkingData = getRedirectingUrl(button);
            globalMsg.linkingText = button.value;
            globalMsg.path = linkingData.path;
            globalMsg.internalToEase = linkingData.internalToEase;
            globalMsg.overRideType = angular.isDefined(button.overRideType) ? button.overRideType : '';
          }
          var media = globalMsg.article.section[0].media[0];
          if (media && media.path) {
            globalMsg.customBgImgLink = media.path;
          }
          else {
            globalMsg.showDefaultBgImg = true;
          }
        }
        return globalMsg;
      },

      getFlapMessage: function(accountRefId) {
        var self = this;
        var flapArray = [];
        var buttonMessage = {},
          tileMessages = {};
        if (this.getMessageSummary() && this.getMessageSummary().accounts) {
          this.getMessageSummary().accounts.forEach(function(msg) {
            if (accountRefId === msg.accountReferenceId) {
              flapArray = msg.flapMessage;
              buttonMessage = msg.subMessage;
            }
          });
        }

        tileMessages.buttonMessage = (buttonMessage.length > 0) ? formatButtonMessages(buttonMessage[0]) : '';
        tileMessages.flapMessages = (flapArray.length > 0) ? formatFlapMessage(flapArray) : '';


        return tileMessages;
      },

      // logAsViewed is set to true by default for core. Other LOB's should set this boolean
      // according to their requirement.
      getReferenceID: function(accounts, refresh, pageContext, numOfMsgs, logAsViewed) {
        var self = this;
        var accountRefIds = [];
        var d = new Date();
        var customerDateTime = d.toISOString();
        accounts.forEach(function(item, i) {
          if (item.accountMessage) {
            if (['closed', 'restricted'].indexOf(item.accountMessage[0].level) === -1) {
              accountRefIds.push(encodeURIComponent(item.referenceId));
            }
          } else {
            accountRefIds.push(encodeURIComponent(item.referenceId));
          }
        });
        return {
          accountReferenceIds: accountRefIds,
          customerDateTime: customerDateTime,
          pageContext: pageContext,
          numOfMsgs: numOfMsgs || 1,
          logAsViewed: logAsViewed || false
        }
      },
      greetingMessageChunks: function(str) {
        var splitStr = str.split(' ');
        var greetingChunks = [];
        var line = [];

        for (var i = 0; i < splitStr.length; i++) {
          line.push(splitStr[i]);
          if (line.join(' ').toString().length > 45) {
            if (greetingChunks.length == 2) {
              line.splice(line.length - 1, 1, '...');
            }
            greetingChunks.push(line.join(' ').toString());
            line.splice(0, line.length);
            if (greetingChunks.length == 3) {
              break;
            }
          }
        }
        if (greetingChunks.length < 3) {
          if (line.join(' ').toString().length > 45) {
            line.splice(line.length - 1, 1, '...');
          }
          greetingChunks.push(line.join(' ').toString());
        }
        return greetingChunks.join('\n').toString();
      },
      greetingMessage: function() {
        var isUSLocale = (/en-us/i).test(languagePreferencesFactory.currentLocale)
        var now = new Date(),
          hours = now.getHours(),
          greeting = 'Hi';
        if (hours >= 0 && hours < 12) {
          greeting = isUSLocale ? 'Good Morning!' : '¡Buenos Días!';
        } else {
          if (hours >= 12 && hours < 18) {
            greeting = isUSLocale ? 'Good Afternoon!' : '¡Buenas Tardes!';
          } else {
            if (hours >= 18) {
              greeting = isUSLocale ? 'Good Evening!' : '¡Buenas Noches!';
            }
          }
        }
        return greeting;
      }
    };
  }
});

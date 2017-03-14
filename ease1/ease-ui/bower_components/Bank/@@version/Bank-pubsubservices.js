define(['angular'], function(angular) {
'use strict';
  angular
      .module('BankModule')
      .factory('BankPubSubFactory', BankPubSubFactory)
      .constant('PubSubDisputeEventMap', {
        "ach": {
          "levels": {
            "level3": "report a problem"
          }
        },
        "atm": {
          "levels": {
            "level3": "report a problem"
          }
        },
        "billPay": {
          "levels": {
            "level3": "report a problem"
          }
        },
        "debitcard": {
          "levels": {
            "level3": "report a problem"
          }
        },
        "retail": {
          "levels": {
            "level3": "report a problem"
          }
        },
      "billPayDisputeSelection" : {
        "levels": {
          "level3": "report a problem",
          "level4": "dispute this payment"
        }
      },
      "customerInfo" : {
        "levels": {
          "level3": "report a problem",
          "level4": "dispute this payment",
          "level5": "customer contact form"
        }
      },
        "customerInfoFraud" : {
        "levels": {
          "level3": "report a problem",
            "level4": "This might be fraud",
            "level5": "customer contact form"
        }
      },
      "fraudGeneralQuestions" : {
        "levels": {
          "level3": "report a problem",
            "level4": "This might be fraud",
            "level5": "general bill pay questions"
        }
      },
      "fraudDetailQuestions" : {
        "levels": {
          "level3": "report a problem",
            "level4": "This might be fraud",
            "level5": "detailed bill pay questions"
        }
      },
      "fraudOrDisputePage" : {
        "levels": {
          "level3": "report a problem"

        }
      },
      "billPayGeneral" : {
        "levels": {
          "level3": "report a problem",
          "level4": "dispute this payment",
          "level5": "general bill pay questions"
        }
      },
      "billPayDetailedQuestions" : {
        "levels": {
          "level3": "report a problem",
          "level4": "dispute this payment",
          "level5": "detailed bill pay questions"
        }
      },
      "retailDisputeConfirmation" : {
        "levels": {
          "level3": "report a problem",
          "level4": "dispute this payment",
          "level5": "reviewing charge"
        }
      },
      "retailFraudDisputeConfirmation" : {
        "levels": {
          "level3": "report a problem",
          "level4": "This might be fraud",
          "level5": "reviewing charge"
        }
      },
      "fraudCheckList": {
        "levels": {
          "level3": "report a problem",
          "level4": "this might be fraud"
        } },
      "cardAvailablePage": {
        "levels": {
          "level3": "report a problem",
          "level4": "do you still have your card"
        } },
      "addressCheckPage": {
        "levels": {
          "level3": "report a problem",
          "level4": "this might be fraud",
          "level5": "get a new card"
        }
      },
      "cardLockedPage": {
        "levels": {
          "level3": "report a problem",
          "level4": "this might be fraud",
          "level5": "reviewing charge"
        }
      },
      "callToComplete":{
        "levels": {
          "level3": "report a problem",
          "level4": "this might be fraud",
          "level5": "update address"
        }
      },
      "disputeCheckList":{
        "levels": {
          "level3": "report a problem",
          "level4": "dispute this purchase"
        }
      },
        "disputeForm": {
          "levels": {
            "level3": "report a problem",
            "level4": "dispute this purchase"
          }
        },
        "disputeSubmitted": {
          "levels": {
            "level3": "report a problem",
            "level4": "dispute this purchase",
            "level5": "reviewing charge"
          }
        },
      "callCenterLink" : "dial c1:link"
      })
    .constant('PubSubTransactionDrawerEventMap', {
      "atm-withdrawal" :{
        "eventName" : "360:ETS:ATM Withdrawal:Drawer:Open"
      },
      "atm-deposit" :{
        "eventName" : "360:ETS:ATM Deposit:Drawer:Open"
      },
      "debitcard" :{
        "eventName" : "360:ETS:Debit Card Purchase:Drawer:Open"
      },
      "ach" :{
        "eventName" : "360:ETS:ACH:Drawer:Open"
      },
      "billpay" :{
        "eventName" : "360:ETS:Bill Pay:Drawer:Open"
      },
      "checks" :{
        "eventName" : "360:ETS:Check Deposit:Drawer:Open"
      },
      "default" :{
        "eventName" : "360:ETS:Other:Drawer:Open"
      },
      "overdraft" :{
        "eventName" : "360:ETS:Overdraft:Drawer:Open"
      },
      "p2p" :{
        "eventName" : "360:ETS:P2P:Drawer:Open"
      },
      "paperpayment" :{
        "eventName" : "360:ETS:Paperpayment:Drawer:Open"
      },
      "retail-billpay" :{
        "eventName" : "retail:ETS:Retail Bill Pay:Drawer:Open"
      }
    });

  //----------------------------------- Pub Sub Factory --------------------------------------------------------

  BankPubSubFactory.$inject = ['pubsubService','PubSubTransactionDrawerEventMap' , 'BankAccountUtilities'];
  function BankPubSubFactory(pubsubService,PubSubTransactionDrawerEventMap, BankAccountUtilities) {


    var PubSubFactory = {
      logTrackAnalyticsPageView    : logTrackAnalyticsPageView,
      logTrackAnalyticsClick       : logTrackAnalyticsClick,
      logTrackAnalyticsDrawerOpen  : logTrackAnalyticsDrawerOpen,
      logTrackAnalyticsDrawerClose : logTrackAnalyticsDrawerClose,
      logPageViewEvent             : logPageViewEvent,
      logClickEvent                : logClickEvent,
      logDrawerOpenEvent           : logDrawerOpenEvent,
      logDrawerCloseEvent          : logDrawerCloseEvent,
      logButtonClickEvent          : logButtonClickEvent,
      logCarouselClickEvent        : logCarouselClickEvent
    };

    return PubSubFactory;

    /**
     * Logs a page view to the new trackAnalytics pubsub queue.
     *
     * @public
     * @method logTrackAnalyticsPageView
     *
     * @param {Object} data  Data to be mixed in to the 'taxonomy' property
     */
    function logTrackAnalyticsPageView(levels) {
      pubsubService.pubsubTrackAnalytics({
        taxonomy: _.assign({
          level1: 'ease',
          level2: levels.level2 ? levels.level2 : "account details",
          level3: levels.level3 ? levels.level3 : "",
          level4: levels.level4 ? levels.level4 : "",
          level5: levels.level5 ? levels.level5 : "",
          country: 'us',
          language: 'english',
          system: 'ease_web'
        }, levels),
        lob: BankAccountUtilities.isRetailAccount() ? 'retail' : '360'
      });
    }

    /**
     * Logs a click to the new trackAnalytics pubsub queue.
     *
     * @public
     * @method logTrackAnalyticsClick
     *
     * @param {String} name  The name of the event to track (e.g. foo:link or foo:button)
     */
    function logTrackAnalyticsClick(name) {
      pubsubService.pubsubTrackAnalytics({
        name: name
      });
    }

    /**
     * Logs drawer open event to the new trackAnalytics pubsub queue.
     *
     * @public
     * @method logTrackAnalyticsDrawerOpen
     *
     * @param {String} name  The name of the event to track (e.g. foo:link or foo:button)
     */
    function logTrackAnalyticsDrawerOpen(name) {
      pubsubService.pubsubTrackAnalytics({
        name: (PubSubTransactionDrawerEventMap[name]).eventName
      });
    }

    /**
     * Logs drawer close event to the new trackAnalytics pubsub queue.
     *
     * @public
     * @method logTrackAnalyticsDrawerClose
     *
     * @param {String} name  The name of the event to track (e.g. foo:link or foo:button)
     */
    function logTrackAnalyticsDrawerClose(name) {
      pubsubService.pubsubTrackAnalytics({
        name: name
      });
    }

    /**
     * log page view event
     */
    function logPageViewEvent(levels) {

      pubsubService.pubsubPageView({
        scDLLevel1: "ease",
        scDLLevel2: levels.level2 ? levels.level2 : "account details",
        scDLLevel3: levels.level3 ? levels.level3 : "",
        scDLLevel4: levels.level4 ? levels.level4 : "",
        scDLLevel5: levels.level5 ? levels.level5 : "",
        scDLCountry: "us",
        scDLLanguage: "english",
        scDLSystem: "ease_web",
        scDLLOB: "360"
      });
    };

    /**
     * log link click event
     * @param eventName
     */


    function logClickEvent(eventName) {

      pubsubService.pubsubLinkClick({linkName:eventName});
    };



    /**
     * log  drawer event
     * @param eventName
     */

    function logDrawerOpenEvent(drawerOpenEvent) {

        pubsubService.pubsubDrawerOpen({drawerName:(PubSubTransactionDrawerEventMap[drawerOpenEvent]).eventName});


    };


    /**
     * log  drawer event
     * @param eventName
     */
    function logDrawerCloseEvent(drawerCloseEvent) {

     pubsubService.pubsubDrawerClose({drawerName:drawerCloseEvent});


    };

    /**
     * log button click event
     * @param event
     */
    function logButtonClickEvent(event) {

      //log sitecatalyst event for view more transaction
      pubsubService.pubsubButtonClick({buttonName:event});
    }

    /**
     * log Carousel click event
     * @param event
     */
    function logCarouselClickEvent(event) {

      //log sitecatalyst event for Carousel click event
      pubsubService.pubsubCarouselClicked({carouselStatus:event});
    }

  }


});

define(['angular'], function(angular) {

  'use strict';
  angular
    .module('BankModule')
    .factory('BankDisputeFactory', BankDisputeFactory);

  BankDisputeFactory.$inject = ['$q', 'BankTransactionsFactory', 'Restangular', 'EASEUtilsFactory', '$sanitize', 'BankFiles'];
  function BankDisputeFactory($q, BankTransactionsFactory, Restangular, EASEUtilsFactory, $sanitize, BankFiles) {

    var disputedTransaction = {};
    var dispute = {};
    var cardHolder = {
      type : 'single',
      firstName : 'I',
      thirdPerson: '',
      possessive : 'your'
    };

    var businessEventId = {
      CREATE_DISPUTE : '50065'
    };

    var pageProperties = {};

    return {
      createDisputeObject : createDisputeObject,
      getCardHolder : getCardHolder,
      getDisputedTransaction : getDisputedTransaction,
      getPageProperties : getPageProperties,
      resetFactory : resetFactory,
      initDisputeFactory : initDisputeFactory,
      pageProperties : pageProperties,
      sendDisputeRequest : sendDisputeRequest
    };

    function createDisputeObject(reason, extraProperties) {
      dispute = {
        "merchantName" : disputedTransaction.transactionOverview.transactionTitle,
        "disputeReason" : reason ? reason : pageProperties.cardAvailablePage.radioValue,
        "disputeType" : getDisputeType(disputedTransaction.transactionType.value),
        "transactionReferenceId": disputedTransaction.transactionReferenceId
      };
      for(var property in extraProperties) {
        if(extraProperties.hasOwnProperty(property)) {

          dispute[property] = extraProperties[property].toString();

        }
      }
    }

    function createDisputePayload() {
      return {
        disputeDetails : [dispute]
      }
    }

    function createDisputeUrl() {
      return 'Bank/accounts/' + encodeURIComponent(BankTransactionsFactory.getAccountReferenceId()) + '/transactions-dispute'
    }

    function getCardHolder() {
      return cardHolder;
    }

    function getDisputedTransaction() {
      return disputedTransaction;
    }

    function getPageProperties(packageName) {
      return pageProperties[packageName];
    }

    function getDisputeType(disputeType) {
      var supportedTypes = {
        '2' : 'CARDDISPUTEPIN',
        '4' : 'CARDDISPUTENONPIN',
        '22' : 'PAYPASSDISPUTEPIN',
        '24' : 'PAYPASSDISPUTENONPIN',
        '26' : 'DIGITALPAY'
      };

      return supportedTypes[disputeType];
    }

    function initDisputeFactory(index, i18nData) {
      if(_.isEmpty(disputedTransaction)) {
        setDisputedTransaction(index);
        setProperties(i18nData);
      }
    }

    function resetFactory() {
      dispute = {};
      disputedTransaction = {};
      cardHolder = {
        type : 'single',
        firstName : 'I',
        thirdPerson: '',
        possessive : 'your'
      };
    }

    function sendDisputeRequest(){
      var deferred = $q.defer();
      var payload = createDisputePayload();
      var url = createDisputeUrl();
      var disputesOl = Restangular.all(url);

      disputesOl.post(payload,{},{
          EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
          BUS_EVT_ID: businessEventId.CREATE_DISPUTE
        } ).then(
        function promiseSuccessfulResolver() {
          disputedTransaction.transactionDisputed = true;
          deferred.resolve();
        },
        function promiseRejectResolver() {
          deferred.reject();
        });

      return deferred.promise;
    }

    function setCardHolder(newCardHolder) {
      if(newCardHolder) {
        cardHolder.type = 'joint';
        cardHolder.firstName = newCardHolder.split(' ')[0];
        cardHolder.firstName = cardHolder.firstName[0].toUpperCase() + cardHolder.firstName.substring(1).toLowerCase();
        cardHolder.thirdPerson = cardHolder.firstName;
        cardHolder.possessive = cardHolder.firstName + "’s"
      }
    }

    function setDisputedTransaction(transactionIndex) {
      if(transactionIndex != null) {
        disputedTransaction = BankTransactionsFactory.getPostedTransactions()[transactionIndex];
        setCardHolder(disputedTransaction.purchasedBy)
      }
    }

    function setProperties(propertyData) {

      var i18nDispute = propertyData.dispute;
      var i18nFraud = propertyData.fraud;

      pageProperties = {
        disputeCheckList : {
          template: BankFiles.getFilePath('features/dispute/partials/Dispute-Checklist.html'),
          modalClass: 'dispute-modal megaphone',
          modalTitle: i18nDispute.title[i18nDispute.disputeType],
          modalSubTitle: i18nDispute.subtitle.dispute,
          checkList: i18nDispute.checkList,
          callUs: i18nDispute.callUs
        },
        fraudOrDisputePage : {
          template: BankFiles.getFilePath('features/dispute/partials/Debitcard-Dispute.html'),
          modalClass: 'dispute-modal megaphone',
          modalTitle: i18nDispute.title.default,
          modalSubTitle: i18nDispute.subtitle.reportAProblem,
          radioText: i18nDispute.radioButtons,
          radioValue:'',
          buttonText: i18nFraud.continueButtons.continue,
          nevermind: i18nDispute.nevermind
        },
        fraudCheckList : {
          template: BankFiles.getFilePath('features/dispute/partials/Fraud.html'),
          modalClass: 'dispute-modal fraud',
          modalTitle: i18nFraud.title.mightBeFraud,
          modalSubTitle: i18nFraud.subtitle.reportIf,
          checkList: i18nFraud.checkList,
          buttonText: i18nFraud.continueButtons.continue,
          nevermind: i18nDispute.nevermind
        },
        cardAvailablePage : {
          template: BankFiles.getFilePath('features/dispute/partials/Fraud-CardCheck.html'),
          modalClass: 'dispute-modal fraud',
          modalTitle: i18nFraud.title.mightBeFraud,
          modalSubTitle: i18nFraud.subtitle.cardCheck,
          radioText: i18nFraud.radioButtons,
          radioValue: '',
          buttonText: i18nFraud.continueButtons.continue
        },
        addressCheckPage : {
          template: BankFiles.getFilePath('features/dispute/partials/Fraud-AddressCheck.html'),
          modalClass: 'dispute-modal cardSwap',
          modalTitle: i18nFraud.title.confirmAddress,
          modalMessages : i18nFraud.messages.addressCheck,
          buttonText: i18nFraud.continueButtons.yesContinue,
          nevermind: i18nFraud.messages.differentAddress
        },
        cardLockedPage : {
          template: BankFiles.getFilePath('features/dispute/partials/Fraud-WhatsNext.html'),
          modalClass: 'dispute-modal cardLock-whats-next',
          modalTitle: i18nFraud.title.whatsNext,
          modalSubTitle: i18nFraud.subtitle.fraudTeamChecking,
          modalMessages : i18nFraud.messages.lockYourCard,
          callUs : i18nFraud.callUs.haveQuestions,
          buttonText: i18nFraud.continueButtons.toDetails
        },
        callToComplete : {
          template: BankFiles.getFilePath('features/dispute/partials/Fraud-CallToComplete.html'),
          modalClass: 'dispute-modal cardLock-call',
          modalTitle: i18nFraud.title.newCard,
          callUs : i18nFraud.callUs.followUp,
          buttonText: i18nFraud.continueButtons.toDetails
        },
        disputeForm : {
          template: BankFiles.getFilePath('features/dispute/partials/Dispute-Form.html'),
          modalClass: 'dispute-modal megaphone',
          modalTitle: 'Report a Problem',
          modalSubTitle: i18nDispute.subtitle.cardDispute,
          remainingCharacters: i18nDispute.remainingCharacters,
          buttonText: i18nDispute.submitButtonText
        },
        disputeSubmitted : {
          template: BankFiles.getFilePath('features/dispute/partials/Dispute-WhatsNext.html'),
          modalClass: 'dispute-modal megaphone',
          modalTitle: i18nDispute.title.whatsNext,
          modalSubTitle: i18nDispute.subtitle.claimsTeamChecking,
          modalMessages : i18nDispute.ifFraud,
          callUs : i18nDispute.callUs.haveQuestions,
          buttonText: i18nDispute.toDetailsButtonText
        }
      }
    }
  }
});

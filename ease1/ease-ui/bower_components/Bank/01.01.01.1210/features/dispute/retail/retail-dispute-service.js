/**
 * Created by axc017 on 9/9/16.
 */
define(['angular'], function(angular) {

  'use strict';
  angular
    .module('BankModule')
    .factory('RetailDisputeFactory', RetailDisputeFactory);

  RetailDisputeFactory.$inject = ['$q','BankTransactionsFactory', '$sanitize', 'BankFiles', 'Restangular', 'EASEUtilsFactory'];
  function RetailDisputeFactory($q, BankTransactionsFactory, $sanitize, BankFiles, Restangular, EASEUtilsFactory) {

    var disputedTransaction = {};
    var dispute = {
      disputeReason : ''
    };
    var pageProperties = {};

    return {
      createRetailDisputeObject : createRetailDisputeObject,
      getDispute : getDispute,
      getDisputedTransaction : getDisputedTransaction,
      getPageProperties : getPageProperties,
      resetFactory : resetFactory,
      initDisputeFactory : initDisputeFactory,
      pageProperties : pageProperties,
      setDisputeReason : setDisputeReason,
      sendRetailDisputeRequest:sendRetailDisputeRequest
    };

    function createRetailDisputeObject(formlyModels) {
      dispute.merchantName = disputedTransaction.transactionOverview.transactionTitle;
      dispute.transactionAmount = disputedTransaction.transactionOverview.transactionAmount;
      dispute.disputedAmount = disputedTransaction.transactionOverview.transactionAmount;
      dispute.sorTransactionDate = disputedTransaction.transactionOverview.transactionDate;
      dispute.disputeType = getDisputeType(disputedTransaction.transactionType.value);
      dispute.transactionReferenceId = disputedTransaction.transactionReferenceId;
      dispute.customerContactDetails = getCustomerContactDetailsFromForm(formlyModels.CUSTOMERINFO);
      appendFraudOrNonFraudQuestions(formlyModels);
    }

    function getCustomerContactDetailsFromForm(contactForm) {
      return {
        "phoneNumber": contactForm.phoneNumber,
        "emailAddress": contactForm.emailAddress
      }
    }

    function appendFraudOrNonFraudQuestions(formlyModels){
      if (dispute.disputeReason ==='FRAUD') {
        appendFraudFormQuestions(formlyModels);
      } else {
        appendNonFraudFormQuestions(formlyModels);
      }
    }

    function appendFraudFormQuestions(formlyModels) {
      populateQuestionsProperties(formlyModels.fraudGeneralQuestions);
      populateQuestionsProperties(formlyModels.fraudDetailQuestions);
    }

    function appendNonFraudFormQuestions(formlyModels) {
      populateQuestionsProperties(formlyModels.billPayGeneral);
      populateQuestionsProperties(formlyModels[dispute.disputeReason]);
    }

    function populateQuestionsProperties(questionProperties) {
      for(var property in questionProperties) {
        if(questionProperties.hasOwnProperty(property)) {
          dispute[property] = $sanitize(questionProperties[property]);
        }
      }
    }

    function getDispute() {
      return dispute;
    }

    function getDisputedTransaction() {
      return disputedTransaction;
    }

    function getPageProperties(packageName) {
      return pageProperties[packageName];
    }

    function getDisputeType(disputeType) {
      var supportedTypes = {
        '1051' : 'BILLPAYMENT',
        '1055_BP' : 'BILLPAYMENT',
        '3022' : 'BILLPAYMENT'
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
      dispute = {
        disputeReason : ''
      };
      disputedTransaction = {};
    }

     function sendRetailDisputeRequest(){
      var deferred = $q.defer();
      var payload = createRetailDisputePayload();
      var url = createRetailDisputeUrl();
      var disputesOl = Restangular.all(url);

      //audit business evnt id for dispute audit call
      EASEUtilsFactory.setCustomerActivityHeader('50065');

      disputesOl.post(payload).then(
        function promiseSuccessfulResolver() {
          disputedTransaction.transactionRetailDisputedIndicator = true;
          deferred.resolve();
        },
        function promiseRejectResolver() {
          deferred.reject();
        });

      return deferred.promise;
    }

    function setDisputeReason(newReason) {
      dispute.disputeReason = newReason;
      pageProperties.billPayDetailedQuestions.formlyFormId = newReason;
    }

    function createRetailDisputePayload() {
        return {
          disputeDetails : [dispute]
        }
      }

    function createRetailDisputeUrl() {
      return 'Bank/accounts/' + encodeURIComponent(BankTransactionsFactory.getAccountReferenceId()) + '/transactions-dispute'
    }

    function setDisputedTransaction(transactionIndex) {
      if(transactionIndex != null) {
        disputedTransaction = BankTransactionsFactory.getPostedTransactions()[transactionIndex];
      }
    }

    function setProperties(propertyData) {

      var i18nDispute = propertyData.dispute;
      var i18nFraud = propertyData.fraud;

      pageProperties = {
        fraudOrDisputePage : {
          template: BankFiles.getFilePath('features/dispute/retail/partials/Retail-Fraud-Or-Dispute.html'),
          modalClass: 'dispute-modal megaphone',
          modalTitle: i18nDispute.title.default,
          modalSubtitle: i18nDispute.subtitle.reportAProblem,
          radioText: i18nDispute.radioButtons,
          radioValue:'',
          buttonText: i18nFraud.continueButtons.continue,
          nevermind: i18nDispute.nevermind
        },
        billPayDisputeSelection : {
          template: BankFiles.getFilePath('features/dispute/retail/partials/Retail-Dispute-Reason.html'),
          modalClass: 'dispute-modal megaphone',
          modalTitle: i18nDispute.title.selectAReason,
          modalSubtitle: '',
          buttonText: i18nDispute.modalButtonText,
          radioButtons: [
            {id : 'not-received-radio', label: i18nDispute.radioButtons.retail.PYMTNOTRECEIVED, value : 'PYMTNOTRECEIVED'},
            {id : 'late-radio', label: i18nDispute.radioButtons.retail.PYMTLATE, value : 'PYMTLATE'},
            {id : 'wrong-radio', label: i18nDispute.radioButtons.retail.PYMTINCORRECT, value : 'PYMTINCORRECT'},
            {id : 'cancel-radio', label: i18nDispute.radioButtons.retail.PYMTCANCEL, value : 'PYMTCANCEL'},
            {id : 'error-radio', label: i18nDispute.radioButtons.retail.PYMTERROR, value : 'PYMTERROR'}
          ]
        },
        customerInfo : {
          template: BankFiles.getFilePath('features/dispute/retail/partials/Retail-Dispute-Form.html'),
          modalClass: 'dispute-modal megaphone',
          modalTitle: i18nDispute.title.customerInformation,
          modalSubtitle: '',
          formlyFormId : 'CUSTOMERINFO',
          buttonText: i18nDispute.modalButtonText,
          isButtonDisabled: isCustomerInfoButtonDisabled,
          previousPage:'billPayDisputeSelection',
          nextPage:'billPayGeneral'
        },
        customerInfoFraud : {
          template: BankFiles.getFilePath('features/dispute/retail/partials/Retail-Dispute-Form.html'),
          modalClass: 'dispute-modal megaphone',
          modalTitle: i18nDispute.title.customerInformation,
          modalSubtitle: '',
          formlyFormId : 'CUSTOMERINFO',
          isButtonDisabled: isCustomerInfoButtonDisabled,
          buttonText: i18nDispute.modalButtonText,
          previousPage:'fraudOrDisputePage',
          nextPage:'fraudGeneralQuestions'
        },
        billPayGeneral : {
          template: BankFiles.getFilePath('features/dispute/retail/partials/Retail-Dispute-Form.html'),
          modalClass: 'dispute-modal megaphone',
          modalTitle: i18nDispute.title.tellUsMore,
          modalSubtitle: i18nDispute.subtitle.retailDispute.disputeQuestions,
          formlyFormId : 'billPayGeneral',
          buttonText: i18nDispute.modalButtonText,
          previousPage:'customerInfo',
          nextPage:'billPayDetailedQuestions'
        },
        billPayDetailedQuestions : {
          template: BankFiles.getFilePath('features/dispute/retail/partials/Retail-Dispute-Form-Submission.html'),
          modalClass: 'dispute-modal megaphone',
          modalTitle: i18nDispute.title.tellUsMore,
          modalSubtitle: '',
          formlyFormId : getDispute(),
          buttonText: i18nDispute.submitButtonText,
          previousPage:'billPayGeneral',
          nextPage:'retailDisputeConfirmation',
          submissionEvent: 'retailDisputeConfirmation'
        },
        fraudGeneralQuestions : {
          template: BankFiles.getFilePath('features/dispute/retail/partials/Retail-Dispute-Form.html'),
          modalClass: 'dispute-modal megaphone',
          modalTitle: i18nDispute.title.tellUsMore,
          modalSubtitle: i18nDispute.subtitle.retailDispute.disputeQuestions,
          formlyFormId : 'fraudGeneralQuestions',
          buttonText: i18nDispute.modalButtonText,
          previousPage:'customerInfoFraud',
          nextPage:'fraudDetailQuestions'
        },
        fraudDetailQuestions : {
          template: BankFiles.getFilePath('features/dispute/retail/partials/Retail-Dispute-Form-Submission.html'),
          modalClass: 'dispute-modal megaphone',
          modalTitle: i18nDispute.title.tellUsMore,
          modalSubtitle: '',
          formlyFormId : 'fraudDetailQuestions',
          buttonText: i18nDispute.submitButtonText,
          previousPage:'fraudGeneralQuestions',
          nextPage:'retailDisputeConfirmation',
          submissionEvent: 'retailFraudDisputeConfirmation'
        },
        retailDisputeConfirmation : {
          template: BankFiles.getFilePath('features/dispute/retail/partials/Retail-Dispute-Confirmation.html'),
          modalClass: 'dispute-modal confirmation',
          modalTitle: i18nFraud.title.thanks,
          modalSubtitle: i18nDispute.subtitle.retailDispute.disputeSubmitted,
          modalMessage : i18nDispute.retailConfirmation,
          callUs : i18nDispute.callUs.retail
        }
      }
    }


    function isCustomerInfoButtonDisabled(isFormInvalid, formlyForm) {
      return isFormInvalid
        || formlyForm.fields['CUSTOMERINFO'][0].templateOptions.hasComponentErrors
        || formlyForm.fields['CUSTOMERINFO'][2].templateOptions.hasComponentErrors
    }

  }

});

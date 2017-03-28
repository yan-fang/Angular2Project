define(['angular'], function (angular) {
  'use strict';
  angular
      .module('BankModule')
      .factory('RetailDisputeFormlyFactory', RetailDisputeFormlyFactory);

  RetailDisputeFormlyFactory.$inject = ['$locale', 'DisputeFormlyUtil', 'RetailDisputeFactory'];
  function RetailDisputeFormlyFactory($locale, DisputeFormlyUtil, RetailDisputeFactory) {

    var RETAIL_TEXTAREA_CHAR_LIMIT = 250;
    var retailFormly = {
      options : {
      },
      models: {
        CUSTOMERINFO : {},
        fraudGeneralQuestions : {},
        fraudDetailQuestions : {},
        billPayGeneral : {},
        PYMTNOTRECEIVED : {},
        PYMTLATE : {},
        PYMTERROR : {},
        PYMTCANCEL : {},
        PYMTINCORRECT : {}
      },
      fields: {
        "fraudGeneralQuestions": [
          {
            "type": "radioInput",
            "key": "customerContacted",
            "id" : "customerContacted",
            "wrapper" : 'requiredField',
            "templateOptions": {
              "required" : true
            }
          },
          {
            "type": "radioInput",
            "key": "transactionPerformerKnown",
            "id" : "transactionPerformerKnown",
            "wrapper" : 'requiredField',
            "templateOptions": {
              "required" : true
            }
          },
          {
            "type": "textareaWithCountdown",
            "key": "transactionPerformerDetails",
            "id" : "transactionPerformerDetails",
            "wrapper" : 'requiredField',
            "templateOptions": {
              countdownOptions : {
                assistiveText : " characters remaining.",
                displayCounter : true,
                maxCharacterCount : RETAIL_TEXTAREA_CHAR_LIMIT,
                isCountNegative : false
              },
              "required" : true,
              rows: 4
            },
            "hideExpression": function hide() {
              return hideIfFalsey("fraudGeneralQuestions", "transactionPerformerKnown");
            }
          },
          {
            "type": "radioInput",
            "key": "policeReport",
            "id" : "policeReport",
            "wrapper" : 'requiredField',
            "templateOptions": {
              "required" : true
            }
          },
          {
            "type": "textareaWithCountdown",
            "key": "policeReportDetails",
            "id" : "policeReportDetails",
            "wrapper" : 'requiredField',
            "templateOptions": {
              countdownOptions : {
                assistiveText : " characters remaining.",
                displayCounter : true,
                maxCharacterCount : RETAIL_TEXTAREA_CHAR_LIMIT,
                isCountNegative : false
              },
              "required" : true,
              rows: 4
            },
            "hideExpression": function hide() {
              return hideIfFalsey("fraudGeneralQuestions", "policeReport");
            }
          }
        ],
        "fraudDetailQuestions" : [
          {
            "type": "radioInput",
            "key": "jointAccount",
            "id" : "jointAccount",
            "wrapper" : 'requiredField',
            "templateOptions": {
              "required" : true
            }
          },

          {
            "type": "radioInput",
            "key": "stopPayment",
            "id" : "stopPayment",
            "wrapper" : 'requiredField',
            "templateOptions": {
              "required" : true
            }
          },
          {
            "type": "radioInput",
            "key": "stopPaymentType",
            "id" : "stopPaymentType",
            "wrapper" : 'requiredField',
            "templateOptions": {
              "required" : true
            },
            "hideExpression": function hide() {
              return hideIfFalsey("fraudDetailQuestions", "stopPayment");
            }
          },
          {
            "type": "textareaWithCountdown",
            "key": "otherComments",
            "templateOptions": {
              countdownOptions : {
                assistiveText : " characters remaining.",
                displayCounter : true,
                maxCharacterCount : RETAIL_TEXTAREA_CHAR_LIMIT,
                isCountNegative : false
              },
              rows: 4
            }
          }
        ],
        "CUSTOMERINFO": [
          {
            "type": "phoneInput",
            "key": "phoneNumber",
            "id" : "phoneNumber",
            "wrapper" : 'requiredField',
            "templateOptions": {
              required: true,
              requiredValidationMessage: 'This field is required.',
              "hasComponentErrors" : true
            }
          },
          {
            "type": "radioInput",
            "key": "sendEmail",
            "id" : "sendEmail",
            "wrapper" : 'tooltipLabel'

        ,"templateOptions": {
               required: true
            }
          },
          {
            "type": "emailInput",
            "key": "emailAddress",
            "id" : "customerEmail",
            "wrapper" : 'requiredField',
            "templateOptions": {
              required: true,
              "rows": 1,
              "hasComponentErrors" : false
            },
            "hideExpression": function hide() {
              var isHidden = hideIfFalsey("CUSTOMERINFO", "sendEmail");
              if(isHidden) {
                DisputeFormlyUtil.getFormlyConfig().models.CUSTOMERINFO.emailAddress = '';
                DisputeFormlyUtil.getFormlyConfig().fields.CUSTOMERINFO[2].templateOptions.hasComponentErrors = false;
              }
              return isHidden;
            }
          }
        ],
        "billPayGeneral": [
          {
            "type": "radioInput",
            "key": "payeeContacted",
            "id" : "payeeContacted",
            "wrapper" : "requiredField",
            "templateOptions": {
              required: true
            }
          },
          {
            "type": "moneyInput",
            "key": "disputedAmount",
            "id" : "disputedAmount",
            validators: {
              amountInvalid: function($viewValue, $modelValue, scope) {
                     var disputedAmountValue = $modelValue || $viewValue;
                     return (disputedAmountValue <= RetailDisputeFactory.getDisputedTransaction().transactionOverview.transactionAmount);
              }
          },
            "wrapper" : "requiredField",
            "templateOptions": {
            required: true
          },
            hideExpression : function hide() {
               return RetailDisputeFactory.getDispute().disputeReason !== 'PYMTINCORRECT';
            }
          },
          {
            "type": "radioInput",
            "key": "feeAssessed",
            "id" : "feeAssessed",
            "wrapper" : "requiredField",
            "templateOptions": {
              required: true
            }
          },
          {
            "type": "moneyInput",
            "key": "feeAmount",
            "id" : "feeAmount",
            "wrapper" : 'requiredField',
            "templateOptions": {
              required: true
            },
            "hideExpression": function hide() {
              return hideIfFalsey("billPayGeneral", "feeAssessed");
            }
          },
          {
            "type": "radioInput",
            "key": "stopPayment",
            "id" : "stopPayment",
            "wrapper" : "requiredField",
            "templateOptions": {
              required: true
            }
          },
          {
            "type": "radioInput",
            "key": "stopPaymentType",
            "id" : "stopPaymentType",
            "wrapper" : "requiredField",
            "hideExpression": function hide() {
              return hideIfFalsey("billPayGeneral", "stopPayment");
            },
            "templateOptions": {
              required: true
            }
          }
        ],
        "PYMTNOTRECEIVED": [
          {
            "type": "radioInput",
            "key": "payeeAccountCorrect",
            "id" : "payeeAccountCorrect",
            "wrapper" : 'requiredField',
            "templateOptions": {
              "required": true
            }
          },
          {
            "type": "radioInput",
            "key": "payeeNameCorrect",
            "id" : "payeeNameCorrect",
            "wrapper" : 'requiredField',
            "templateOptions": {
              "required": true
            }
          },
          {
            "type": "radioInput",
            "key": "payeeAddressCorrect",
            "id" : "payeeAddressCorrect",
            "wrapper" : 'requiredField',
            "templateOptions": {
              "required": true
            }
          },
          {
            "type": "textareaWithCountdown",
            "key": "otherComments",
            "id" : "otherComments",
            "templateOptions": {
              countdownOptions : {
                assistiveText : " characters remaining.",
                displayCounter : true,
                maxCharacterCount : RETAIL_TEXTAREA_CHAR_LIMIT,
                isCountNegative : false
              },
              rows: 4
            }
          }
        ],
        "PYMTLATE": [
          {
            "type": "radioInput",
            "key": "payeeAccountCorrect",
            "id" : "payeeAccountCorrect",
            "wrapper" : 'requiredField',
            "templateOptions": {
              "required": true
            }
          },
          {
            "type": "radioInput",
            "key": "payeeNameCorrect",
            "id" : "payeeNameCorrect",
            "wrapper" : 'requiredField',
            "templateOptions": {
              "required": true
            }
          },
          {
            "type": "radioInput",
            "key": "payeeAddressCorrect",
            "id" : "payeeAddressCorrect",
            "wrapper" : 'requiredField',
            "templateOptions": {
              "required": true
            }
          },
          {
            "type": "textareaWithCountdown",
            "key": "otherComments",
            "id" : "otherComments",
            "templateOptions": {
              countdownOptions : {
                assistiveText : " characters remaining.",
                displayCounter : true,
                maxCharacterCount : RETAIL_TEXTAREA_CHAR_LIMIT,
                isCountNegative : false
              },
              rows: 4
            }
          }
        ],
        "PYMTERROR": [
          {
            "type": "radioInput",
            "key": "submissionError",
            "id" : "submissionError",
            "wrapper" : 'requiredField',
            "templateOptions": {
              required: true
            }
          },
          {
            "type": "textareaWithCountdown",
            "key": "otherComments",
            "id" : "otherComments",
            "templateOptions": {
              countdownOptions : {
                assistiveText : " characters remaining.",
                displayCounter : true,
                maxCharacterCount : RETAIL_TEXTAREA_CHAR_LIMIT,
                isCountNegative : false
              },
              rows: 4
            }
          }
        ],
        "PYMTCANCEL": [
          {
            "type": "radioInput",
            "key": "submissionError",
            "id" : "submissionError",
            "wrapper" : 'requiredField',
            "templateOptions": {
              required: true
            }
          },
          {
            "type": "textareaWithCountdown",
            "key": "otherComments",
            "id" : "otherComments",
            "templateOptions": {
              countdownOptions : {
                assistiveText : " characters remaining.",
                displayCounter : true,
                maxCharacterCount : RETAIL_TEXTAREA_CHAR_LIMIT,
                isCountNegative : false
              },
              rows: 4
            }
          }
        ],
        "PYMTINCORRECT": [
          {
            "type": "radioInput",
            "key": "paymentAmountCorrect",
            "id" : "paymentAmountCorrect",
            "wrapper" : 'requiredField',
            "templateOptions": {
              required: true
            }
          },
          {
            "type": "textareaWithCountdown",
            "key": "otherComments",
            "id" : "otherComments",
            "templateOptions": {
              countdownOptions : {
                assistiveText : " characters remaining.",
                displayCounter : true,
                maxCharacterCount : RETAIL_TEXTAREA_CHAR_LIMIT,
                isCountNegative : false
              },
              rows: 4
            }
          }
        ]
      }
    };

    return {
      getFormlyConfig: DisputeFormlyUtil.getFormlyConfig,
      clearFormModel: clearFormModel,
      initFormlyConfiguration: initFormlyConfiguration,
      resetModels: DisputeFormlyUtil.resetModels
    };

    function clearFormModel(formId) {
      DisputeFormlyUtil.getFormlyConfig().models[formId] = {};
    }

    function hideIfFalsey(form, property) {
      return (DisputeFormlyUtil.getFormlyConfig().models[form][property] == false ||
      DisputeFormlyUtil.getFormlyConfig().models[form][property] == null);
    }

    function initFormlyConfiguration() {
      return DisputeFormlyUtil.initFormlyConfiguration('utils/i18n/formly/retail-disputes-locale_en-us.json').then(function (data) {
        DisputeFormlyUtil.setFormlyConfig(_.merge(data, retailFormly));
      });
    }
  }
});

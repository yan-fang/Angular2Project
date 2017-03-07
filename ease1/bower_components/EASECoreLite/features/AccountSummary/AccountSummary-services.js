define(['angular'], function(angular) {
  'use strict';

  var summaryModule = angular.module('summaryModule');
  summaryModule.factory('TemplateSelectionFactory', templateSelectionFactory);

  function templateSelectionFactory(EaseConstant, ContentConstant, $state) {

    return {
      contentData: {},
      contentDataAccountSummary: {},
      setContentData: function(contentOne) {
        this.contentDataAccountSummary = contentOne;
      },
      getContentData: function() {
        this.contentData =
          this.contentDataAccountSummary[ContentConstant.kCoreAccountSummary + ContentConstant.kLanguagePreferences] || {};
        this.contentData['ease.core.acctsummary.alert.image'] =
          'https://content.capitalone.com' + this.contentDataAccountSummary[ContentConstant.kAlertIconYellow] || {};
        this.contentData['ease.core.acctsummary.checking.image'] =
          'https://content.capitalone.com' + this.contentDataAccountSummary[ContentConstant.k360Checking] || {};
        this.contentData['ease.core.acctsummary.savings.image'] =
          'https://content.capitalone.com' + this.contentDataAccountSummary[ContentConstant.k360Savings] || {};
        this.contentData['ease.core.acctsummary.bg.coaf'] =
          'https://content.capitalone.com' + this.contentDataAccountSummary[ContentConstant.kCoaf] || {};
        this.contentData['ease.core.acctsummary.bg.360'] =
          'https://content.capitalone.com' + this.contentDataAccountSummary[ContentConstant.k360] || {};
        this.contentData['ease.core.acctsummary.bg.venture'] =
          'https://content.capitalone.com' + this.contentDataAccountSummary[ContentConstant.kVenture] || {};
        this.contentData['ease.core.acctsummary.bg.homeloan'] =
          'https://content.capitalone.com' + this.contentDataAccountSummary[ContentConstant.kHomeLoan] || {};
        this.contentData['ease.core.acctsummary.bg.bank'] =
          'https://content.capitalone.com' + this.contentDataAccountSummary[ContentConstant.kBank] || {};
        this.contentData["ease.core.acctsummary.bg.cofi"] =
          'https://content.capitalone.com' + this.contentDataAccountSummary[ContentConstant.kCofi] || {};
        return this.contentData;
      },
      payNow: function(paymentParam) {
        this.paymentParam = paymentParam || this.paymentParam;
        $state.go('accountSummary.paymentSummary', this.paymentParam);
      },
      getSummaryTypeTemplate: function(type) {
        switch (type) {
          case 'SA':
            {
              return EaseConstant.kPathSummaryTemplate +
                'saving/' +
                'saving.html';
            }
          case 'DDA':
          case 'ILA':
            {
              return EaseConstant.kPathSummaryTemplate +
                'checking/' +
                'checking.html';
            }
          case 'MMA':
            {
              return EaseConstant.kPathSummaryTemplate +
                'mma/' +
                'mma.html';
            }
          case 'AL':
            {
              return EaseConstant.kPathSummaryTemplate +
                'AutoLoan/' +
                'AutoLoan.html';
            }
          case 'MLA':
            {
              return EaseConstant.kPathSummaryTemplate +
                'HomeLoans/' +
                'HomeLoans.html';
            }
          case 'HLC':
          case 'HIL':
            {
              return EaseConstant.kPathSummaryTemplate +
                'HomeLoans/' +
                'HomeLoansHlc.html';
            }
          case 'CC':
            {
              return EaseConstant.kPathSummaryTemplate +
                'CreditCard/' +
                'CreditCard.html';
            }
          case 'CD':
            {
              return EaseConstant.kPathSummaryTemplate +
                'cd/' +
                'cd.html';
            }
          case 'COI':
            {
              return EaseConstant.kPathSummaryTemplate +
                'Investing/' +
                'Investing.html';
            }
          case 'unavailable':
            {
              return EaseConstant.kPathSummaryTemplate +
                'html/partials/details/' +
                'accountSummary-unavailable-partial.html';
            }
          case 'restricted':
            {
              return EaseConstant.kPathSummaryTemplate +
                'html/partials/details/' +
                'accountSummary-restricted-partial.html';
            }
          case 'closed':
            {
              return EaseConstant.kPathSummaryTemplate +
                'html/partials/details/' +
                'accountSummary-closed-partial.html';
            }
          case 'togglerestricted':
            {
              return EaseConstant.kPathSummaryTemplate +
                'html/partials/details/' +
                'accountSummary-toggle-partial.html';
            }
          default:
            {
              return EaseConstant.kPathSummaryTemplate + 'default/' + 'default.html';
            }
        }
      },
      getSecondaryDataForLob: function(message, displayMessage, nbrOfAccount) {
        var type = message.category;
        if (message.accountMessage && message.accountMessage.length > 0) {
          message.accountMessage.forEach(function(msg, i) {
            if (msg.messageId === displayMessage.messageId) {
              message.accountMessage.splice(i, 1);
            }
          });
          //message.accountMessage.shift();
          if (message.accountMessage.length > 0) {
            return message.accountMessage[0];
          }
        }
        if (nbrOfAccount > 1) {
          switch (type) {
            case 'CC':
              {
                return typeof(message.availableCredit) !== 'undefined' ? {
                  message: 'Available Credit: ',
                  attrVal: null
                } : {};
              }
            case 'MMA':
            case 'DDA':
            case 'DDA360':
            case 'SA':
            case 'SA360':
              {
                if (message.hasOwnProperty('secondaryBalance')) {
                  return {
                    message: 'Current Balance: ',
                    attrVal: 'secondaryBalance'
                  };
                } else {
                  return {
                    message: '',
                    attrVal: ''
                  };
                }
              }
            case 'AL':
              {
                if (message.hasOwnProperty('todayPayoffAmount')) {
                  return {
                    message: 'TODAYS\'S PAYOFF: ',
                    attrVal: 'todayPayoffAmount'
                  };
                } else {
                  return {
                    message: '',
                    attrVal: ''
                  };
                }
              }
            case 'MLA':
              {
                if (message.hasOwnProperty('rateOfInterest')) {
                  return {
                    message: 'INTEREST RATE: ',
                    attrVal: 'rateOfInterest'
                  };
                } else {
                  return {
                    message: '',
                    attrVal: ''
                  };
                }
              }
            default:
              {
                return {
                  message: '',
                  attrVal: ''
                };
              }
          }
        } else {
          return {
            message: '',
            attrVal: ''
          };
        }
      },
      getModalTemplate: function(type) {
        switch (type) {
          case 'SA':
            {
              return EaseConstant.kPathUMMPaymentemplate +
                '/html/UMMPayment-index.html';
            }
          case 'CD':
            {
              return EaseConstant.kPathTransactiontemplate +
                '/html/Transfer-index.html';
            }
          default:
            {
              return EaseConstant.kPathUMMPaymentemplate +
                '/html/UMMPayment-index.html';
            }
        }
      },
      showSecondaryData: function(secondaryData) {
        if (secondaryData.secValue === 0 || (secondaryData.secValue && secondaryData.secValue.toString().trim())) {
          return true;
        } else {
          return false;
        }
      },
      formatSecondaryData: function(accountSummaryData, accDet, i18n) {
        var secondary = {};
        var self = this;
        switch (accountSummaryData.category) {
          case 'CC':
            {
              if (accountSummaryData.availableBalance === 0 || accountSummaryData.availableBalance) {
                secondary.secLabel = self.contentData["ease.core.acctsummary.availcred.label"];
                secondary.secValue = accountSummaryData.availableBalance;
              } else {
                secondary.secLabel = self.contentData["ease.core.acctsummary.availcred.label"];
                secondary.secValue = '';
              }
              return secondary;
            }
          case 'MMA':
          case 'DDA':
          case 'DDA360':
          case 'SA':
          case 'CD':
          case 'SA360':
            {
              if (accountSummaryData.secondaryBalance === 0 || accountSummaryData.secondaryBalance) {
                secondary.secLabel = self.contentData["ease.core.acctsummary.currbal.label"];
                secondary.secValue = accountSummaryData.secondaryBalance;
              } else {
                secondary.secLabel = self.contentData["ease.core.acctsummary.currbal.label"];
                secondary.secValue = '';
              }
              return secondary;
            }
          case 'AL':
            {
              if (accountSummaryData.secondaryBalance === 0 || accountSummaryData.secondaryBalance) {
                secondary.secLabel = self.contentData["ease.core.acctsummary.payoff.label"];
                secondary.secValue = accountSummaryData.secondaryBalance;
              } else {
                secondary.secLabel = self.contentData["ease.core.acctsummary.payoff.label"];
                secondary.secValue = '';
              }
              return secondary;
            }
          case 'MLA':
            {
              secondary.secLabel = i18n.interestRate;
              secondary.secValue = '';
              // rateOfInterest is accountSummaryData.secondaryBalance
              if (accountSummaryData.secondaryBalance === 0 ||
                accountSummaryData.secondaryBalance) {
                secondary.secLabel = i18n.interestRate;
                secondary.secValue = accountSummaryData.secondaryBalance;
              }
              return secondary;
            }
          case 'HIL':
          case 'HLC':
            {
              if (parseFloat(accountSummaryData.availableBalance) > 0) {
                secondary.isInterest = false;
                if ((accountSummaryData.displayBalance &&
                    accountSummaryData.displayBalance.toString().trim() !== '') || (accountSummaryData.displayBalance ===
                    0)) {
                  secondary.secLabel = self.contentData["ease.core.acctsummary.principal.label"];
                  secondary.secValue = accountSummaryData.displayBalance;
                } else {
                  secondary.secLabel = self.contentData["ease.core.acctsummary.principal.label"];
                }
              } else if (accDet && accDet.homeEquityLoanAccount) {
                secondary.isInterest = true;
                if (accDet.homeEquityLoanAccount.rateOfInterest) {
                  secondary.secLabel = i18n.interestRate;
                  secondary.secValue = accDet.homeEquityLoanAccount.rateOfInterest;
                }
              } else {
                secondary.secLabel = i18n.interestRate;
                secondary.secValue = '';
                secondary.isInterest = false;
              }
              return secondary;
            }
          default:
            {
              secondary.secLabel = '';
              secondary.secValue = '';
              secondary.isInterest = false;
              return secondary;
            }
        }
      }
    };
  }
  templateSelectionFactory.$inject = ["EaseConstant", "ContentConstant", "$state"];


  return summaryModule;
});

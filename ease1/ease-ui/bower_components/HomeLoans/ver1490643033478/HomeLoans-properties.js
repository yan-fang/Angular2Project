define(['angular'], function(angular) {
  'use strict';

  angular.module('UMMPaymentModule')
    .factory('HomeLoansProperties', function(EaseConstant, HomeLoansUtils) {

      //properties var is here so that other modules can access it.
      var properties = {};
      var yearShown = new Date().getFullYear();
      var paymentOptions = {
        amountDue: "amountDue",
        amountDuePrincipal: "amountDuePrincipal",
        principalOnly:  "principal_Only",
        //TODO: Remove underscore hack to override core functionality (easedropdown.js line 296)
        partialPayment: "other"
      };
      var paymentFailureStrings = {
        apiFailure: "Looks like we need to fix something, so we're working on it. Try again in a bit or give us a " +
        "call at 1-877-933-9100 (8:00 AM - 8:00 PM ET).",
        partialSuccess: "We ran into a snag retrieving your accounts. Give us a call at 1-877-535-1212 " +
        "(8:00 AM - 8:00 PM ET), and we'll help you make your payment."
      };
      var paymentType = {
        oneTime: "one time",
        recurring: "recurring"
      };

      return {
        productSplit: function(productCategory, accountDetails) {
          switch(productCategory){
            case EaseConstant.lineOfBusiness.HomeLoans: //MLA
            {
              properties = {
                loanDetailsModalState: 'HomeLoansDetails.transactions.mortgageLoanDetailsL2',
                paymentDetailsModalState: 'HomeLoansDetails.transactions.mtgPaymentDetailsL1',
                loanTermDurationFriendlyFormat:
                  HomeLoansUtils.getMonths(accountDetails.mortgageAccount.loanTermDuration),
                remainingTermDurationFriendlyFormat:
                  HomeLoansUtils.getMonths(accountDetails.mortgageAccount.remainingTermDuration),
                showAmountPastDue:
                  HomeLoansUtils.showPaymentField(accountDetails.mortgageAccount.loanAccountBalanceInfo.amountPastDue),
                showFeeAccrued:
                  HomeLoansUtils.showPaymentField(accountDetails.mortgageAccount.loanAccountBalanceInfo.feeBalance)
              };
              break;
            }
            case EaseConstant.lineOfBusiness.HomeLoansHil:
            case EaseConstant.lineOfBusiness.HomeLoansHlc:
            {
              properties = {
                loanDetailsModalState: 'HomeLoansDetails.transactions.homeEquityLoanDetailsL2',
                paymentDetailsModalState: 'HomeLoansDetails.transactions.hePaymentDetailsL1',
                loanTermDurationFriendlyFormat:
                  HomeLoansUtils.getMonths(accountDetails.homeEquityLoanAccount.loanTermDuration),
                remainingTermDurationFriendlyFormat:
                  HomeLoansUtils.getMonths(accountDetails.homeEquityLoanAccount.remainingTermDuration),
                originalAmountLabel: HomeLoansUtils.getOriginalAmountLabel(productCategory),
                originalAmountValue: HomeLoansUtils.getOriginalAmountValue(productCategory,accountDetails.homeEquityLoanAccount),
                showAmountPastDue:
                  HomeLoansUtils.showPaymentField(accountDetails.homeEquityLoanAccount.loanAccountBalanceInformation.amountPastDue),
                showFeeAccrued:
                  HomeLoansUtils.showPaymentField(accountDetails.homeEquityLoanAccount.loanAccountBalanceInformation.feeBalance)
              };
              break;
            }
          }

          if(productCategory == EaseConstant.lineOfBusiness.HomeLoansHlc){
            properties.remainingTermDurationFriendlyFormat = HomeLoansUtils.getMonths(accountDetails.homeEquityLoanAccount.loanAccountBalanceInformation.drawPeriodRemainingTerm);
          }
        },
        getProperties: function() {
          return properties;
        },
        getPaymentOptions: function() {
          return paymentOptions;
        },
        getPaymentType: function() {
          return paymentType;
        },
        getPaymentFailureStrings: function() {
          return paymentFailureStrings;
        },
        getShownYear: function(){
          return yearShown;
        },
        updateShownYear: function(year){
          yearShown = year;
        }
      };
    })

});

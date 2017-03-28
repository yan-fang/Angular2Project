define(['angular'], function (angular) {
  'use strict';

  angular
    .module('BankModule')
    .controller('UpcomingCardDetailsController', UpcomingCardDetailsController);

  UpcomingCardDetailsController.$inject = ['$q', '$scope','i18nBank', '$state', '$stateParams', 'BankPubSubFactory', '$timeout', 'EaseConstant', 'BankUpcomingConstants', 'BankUpcomingTransactionsFactory', 'UpcomingHelpersFactory', 'checkImageFactory', 'BankFiles'];
  function UpcomingCardDetailsController($q, $scope, i18nBank, $state, $stateParams, BankPubSubFactory, $timeout, EaseConstant, BankUpcomingConstants, BankUpcomingTransactionsFactory, UpcomingHelpersFactory, checkImageFactory, BankFiles) {
      var levels = {
      "level3":"transaction details tile"
    };
    BankPubSubFactory.logPageViewEvent(levels);

    var i18nUpcomingTransactions = i18nBank.upcomingTransactions;
    UpcomingHelpersFactory.initTransactionSourceOperationMap(i18nUpcomingTransactions);
    var selectedCardIndex = $state.params.cardIndex;
    var upcomingTransactions = [];
    var transactions = BankUpcomingTransactionsFactory.getUpComingTransactions();
    var transactionSourceOperationMap = UpcomingHelpersFactory.getTransactionSourceOperationMap();
    upcomingTransactions = transactions.upComingTransactions;
    var actionModalPayeeNameLength = BankUpcomingConstants.actionModalPayeeNameLength;
    var totalCards = upcomingTransactions.length;
    var loadingWrapper = 'loadingWrapperHide';
    var cardDetailsTemplateUrl = BankFiles.getFilePath('features/upcomingTransactions/partials/upcomingTransactions-cardDetailsTemplate.html');

    var tooltipOptions = {
        position: 'top-right',
        size: 'medium'
    };

    UpcomingHelpersFactory.setPartentTarget(selectedCardIndex);
    angular.forEach(upcomingTransactions, function (upcomingTransaction, index) {
      isCheckDepositTransaction(upcomingTransaction);
      upcomingTransaction.showTransactionDetails = true;
      upcomingTransaction.cardNumber = index + 1;
    });

    window.scrollTo(0,0);

    function isCheckDepositTransaction(upcomingTransaction) {
      if(upcomingTransaction.transactionType == "CHECKDEPOSIT_ATM" ||
        upcomingTransaction.transactionType == "CHECKDEPOSIT" || upcomingTransaction.transactionType == "CHECKDEPOSIT_ATM" ||
        upcomingTransaction.transactionType == "CHECKDEPOSIT_BRANCH") {
        upcomingTransaction.isCheckDepositTransaction = true;
        if(upcomingTransaction.frontImageReferenceId) {
            upcomingTransaction.hasCheckFrontImage = true;
        }
      }
    }

    function viewCheckImage(upcomingTransaction) {
        upcomingTransaction.showTransactionDetails = false;
        upcomingTransaction.loadCheckImage = true;
        setCheckImageData(upcomingTransaction);
    }

    function showTransactionDetails(upcomingTransaction) {
        upcomingTransaction.showTransactionDetails = true;
    }

    function setCheckImageData(upcomingTransaction) {
      if (upcomingTransaction.isCheckDepositTransaction && upcomingTransaction.availableFundsDate != 'Received') {
        if (upcomingTransaction.frontImageReferenceId && !upcomingTransaction.frontCheckImageData) {
          getCheckImageData(upcomingTransaction, upcomingTransaction.frontImageReferenceId, true);
        }
        else if(upcomingTransaction.frontCheckImageData) {
          upcomingTransaction.loadCheckImage = false;
        }
        if (upcomingTransaction.backImageReferenceId && !upcomingTransaction.backCheckImageData) {
          getCheckImageData(upcomingTransaction, upcomingTransaction.backImageReferenceId, false);
        }
      }
    }


    function getCheckImageData(upcomingTransaction, checkImageReferenceId, isFrontCheck) {
        var deferred = $q.defer();
        // make the check image OL call
        checkImageFactory.getCheckImageRestCall($stateParams.accountReferenceId, checkImageReferenceId).then(function (data) {
        deferred.resolve(data);
         if(isFrontCheck) {
            upcomingTransaction.frontCheckImageData =  'data:image/jpeg;base64,' + data;
            upcomingTransaction.loadCheckImage = false;
         }
         else {
            upcomingTransaction.backCheckImageData = 'data:image/jpeg;base64,' + data;
         }
        });
    }

    function getMemoTextCategory(memoText) {
      return memoText ? memoText : '' ;
    }

    /**
     * xxxx6437 -> xxxx6 4 3 7
     * @param memoText
     * @returns {*}
     */
    function getScreenReaderMemoText(memoText) {
      var accountNumberRegEx = /(x{3,4}\d{4})/ ;
      return memoText ? memoText.replace(accountNumberRegEx,function(match,param){return param.replace(/\d/g,"$& ");}):'';
    }

    function isCardLastFour(cardLastFour) {
      return cardLastFour;
    }
    /**
     * The Function returns class name of button for upcoming card action
     * @param transactions
     * @returns {*}
     */

    function getOperationBasedOnSourceKey(transaction,key) {
      if (transactionSourceOperationMap[transaction.transactionSource][transaction.transactionType]) {
        return (transactionSourceOperationMap[transaction.transactionSource][transaction.transactionType][key]);
      }
      return (transactionSourceOperationMap[transaction.transactionSource]['default'][key]);
    }

    function getTransactionCategoryValue(transaction, key, concatCheckNumber){
      return (getOperationBasedOnSourceKey(transaction,key) + (concatCheckNumber || ''));
    }

    function getPayeeName(transactions){
      var payeeName = transactions.payeeName;
      if(transactions.availableFundsDate === 'Received'
        && transactions.checkDepositType){
        payeeName = transactions.checkDepositType;
      }
      return payeeName;
    }


    function upcomingTxnFeatureToggleValue(key) {
      return transactions.upcomingTxnFeatureToggle[key] ? true : false;
    }

    function enableUpcomingTxnEditTransfer(editIndicator, recurringIndicator) {
      return recurringIndicator ? (transactions.upcomingTxnFeatureToggle.editRecurringTransfer && editIndicator) : (transactions.upcomingTxnFeatureToggle.editOneTimeTransfer && editIndicator);
    }

    function enableUpcomingTxnCancelTransfer(cancelIndicator, recurringIndicator) {
      return recurringIndicator ? (transactions.upcomingTxnFeatureToggle.cancelRecurringTransfer && cancelIndicator) : (transactions.upcomingTxnFeatureToggle.cancelOneTimeTransfer && cancelIndicator);
    }

    function cancelTransfer (evt, transactionReferenceId){
        var levels = {
          "level3": "cancel transfer"
        };
        BankPubSubFactory.logClickEvent("Bank Cancel Transfer Action Modal");
        BankPubSubFactory.logPageViewEvent(levels);
        manageLinkSpinner('BankDetails.transferCancel', {
          'moneyTransferReferenceId': transactionReferenceId
        });
    }

    function cancelBillPayment(transactionReferenceId, planReferenceId) {
      manageLinkSpinner('BankDetails.cancelPayment', {
        'subCategory': $stateParams.accountDetails.subCategory,
        'transactionReferenceId': transactionReferenceId,
        'paymentPlanReferenceId': planReferenceId,
        'upcomingFocusId': 'upcoming-card-container-' + selectedCardIndex
      });
    }

    function manageLinkSpinner(stateName, stateParameter) {
      loadingWrapper = 'loadingWrapper';
      $state.go(stateName, stateParameter).finally(function() {
        loadingWrapper = 'loadingWrapperHide';
    });
    }

    angular.extend(this, {
      modalClass: 'icon-info',
      cardDetailsTemplateUrl: cardDetailsTemplateUrl,
      initClose: false,
      modalType: 'bank-view-details-modal bank-card-details-modal',
      close: function () {
        levels = {"level3": ""};
        BankPubSubFactory.logPageViewEvent(levels);
        $state.go('BankDetails.transactions');

        // return focus to the element that triggered the modal
        UpcomingHelpersFactory.bringFocusBack();

      },
      selectedCardIndex: selectedCardIndex,
      upcomingTransactions: upcomingTransactions,
      viewCheckImage:viewCheckImage,
      showTransactionDetails:showTransactionDetails,
      loadingWrapper: function (){
        return loadingWrapper;
      },
      i18nBank: i18nBank,
      i18nUpcomingTransactions: i18nUpcomingTransactions,
      UpcomingHelpers: UpcomingHelpersFactory,
      upcomingTxnFeatureToggleValue: upcomingTxnFeatureToggleValue,
      enableUpcomingTxnEditTransfer: enableUpcomingTxnEditTransfer,
      enableUpcomingTxnCancelTransfer: enableUpcomingTxnCancelTransfer,
      cancelTransfers : cancelTransfer,
      cancelBillPayment: cancelBillPayment,
      isCardLastFour: isCardLastFour,
      getMemoTextCategory : getMemoTextCategory,
      getScreenReaderMemoText: getScreenReaderMemoText,
      getOperationBasedOnSourceKey : getOperationBasedOnSourceKey,
      getPayeeName: getPayeeName,
      tooltipOptions: tooltipOptions,
      totalCards: totalCards,
      getTransactionCategoryValue: getTransactionCategoryValue,
      actionModalPayeeNameLength: actionModalPayeeNameLength
    });
  }
});

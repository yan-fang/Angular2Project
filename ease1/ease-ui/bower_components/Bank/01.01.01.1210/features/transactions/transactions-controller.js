define(['angular'], function (angular) {
  'use strict';

  angular
      .module('BankModule')
      .controller('BankTransactionController', BankTransactionController);

  //------------------------------------- Bank Transaction Controller --------------------------------------------------

  BankTransactionController.$inject = [
    'accountDetailsData',
    'BankTransactionsFactory',
    'BankConstants',
    'BankPubSubFactory',
    'i18nBank',
    'BankEnvironmentConstants',
    '$filter',
    '$document',
    'BankAccountUtilities',
    '$state',
    'BankFiles'
  ];
  function BankTransactionController(accountDetailsData, BankTransactionsFactory, BankConstants, BankPubSubFactory,
                                     i18nBank, BankEnvironmentConstants, $filter, $document, BankAccountUtilities,
                                     $state, BankFiles) {

    var levels = {};
    var isRetailAccount = BankAccountUtilities.isRetailAccount();
    //log page view event
    BankPubSubFactory.logPageViewEvent(levels);

    var moreTransactionsProperties = {
      displayedPages: {},
      maxVisibleTransactions: {},
      moreTransactionsEnabled: {}
    };

    var longTailUrls = {
      billPay: BankEnvironmentConstants.billPayOverview
    };

    var i18nAccountDetails = i18nBank.accountDetails;
    var i18nPastTransactions = i18nBank.pastTransactions;
    var i18nUpcomingTransactions = i18nBank.upcomingTransactions;

    var pendingTransactions = [];
    var postedTransactions = [];

    var transactionValueToTemplateMap = {
      '2'  : BankFiles.getFilePath('features/transactions/partials/ETS-debitCard.html'),
      '3'  : BankFiles.getFilePath('features/transactions/partials/ETS-ATM-withdrawal.html'),
      '4'  : BankFiles.getFilePath('features/transactions/partials/ETS-debitCard.html'),
      '7'  : BankFiles.getFilePath('features/transactions/partials/ETS-P2P.html'),
      '8'  : BankFiles.getFilePath('features/transactions/partials/ETS-BillPay.html'),
      '9'  : BankFiles.getFilePath('features/transactions/partials/ETS-BillPay.html'),
      '11' : BankFiles.getFilePath('features/transactions/partials/ETS-PaperPayment.html'),
      '12' : BankFiles.getFilePath('features/transactions/partials/ETS-Checks.html'),
      '22' : BankFiles.getFilePath('features/transactions/partials/ETS-debitCard.html'),
      '24' : BankFiles.getFilePath('features/transactions/partials/ETS-debitCard.html'),
      '26' : BankFiles.getFilePath('features/transactions/partials/ETS-debitCard.html'),
      '31' : BankFiles.getFilePath('features/transactions/partials/ETS-ATM-Check.html'),
      '32' : BankFiles.getFilePath('features/transactions/partials/ETS-ATM-deposit.html'),
      '46' : BankFiles.getFilePath('features/transactions/partials/ETS-ACH.html'),
      '47' : BankFiles.getFilePath('features/transactions/partials/ETS-ACH.html'),
      '54' : BankFiles.getFilePath('features/transactions/partials/ETS-PaperPayment.html'),
      '57' : BankFiles.getFilePath('features/transactions/partials/ETS-Overdraft.html'),
      '91' : BankFiles.getFilePath('features/transactions/partials/ETS-debitCard.html'),
      '1051': BankFiles.getFilePath('features/transactions/partials/ETS-Retail-Billpay-ACH.html'),
      '1055_ACH': BankFiles.getFilePath('features/transactions/partials/ETS-Retail-ACH.html'),
      '1055_BP' : BankFiles.getFilePath('features/transactions/partials/ETS-Retail-BillPay.html'),
      '3022': BankFiles.getFilePath('features/transactions/partials/ETS-Retail-BillPay.html')
    };

    var tooltipOptions = {
      header: {
        position: {desktop: 'top-left', phone: 'top'},
        size: 'medium'
      },
      entry: {
        position: {desktop: 'top-left', phone: 'top'},
        size: 'large'
      }
    };

    //------------------------------------------- Data Setup -----------------------------------------------------------

    BankTransactionsFactory.setTransactionsData(accountDetailsData);

    pendingTransactions = BankTransactionsFactory.getPendingTransactions();
    postedTransactions = BankTransactionsFactory.getPostedTransactions();

    moreTransactionsProperties.displayedPages = BankConstants.defaultDisplayedPages;
    moreTransactionsProperties.maxVisibleTransactions = calculateMaxVisibleTransactions();
    moreTransactionsProperties.moreTransactionsEnabled = (moreTransactionsProperties.maxVisibleTransactions < postedTransactions.length);

    angular.extend(this, {
      getDepositDate: getDepositDate,
      getTabIndex : getTabIndex,
      getTemplate: getTemplate,
      getTransactionAmountClass: getTransactionAmountClass,
      getTransactionDetails: getTransactionDetails,
      goToDisputeModal: goToDisputeModal,
      goToRetailDisputeModal: goToRetailDisputeModal,
      i18nAccountDetails: i18nAccountDetails,
      i18nPastTransactions: i18nPastTransactions,
      i18nUpcomingTransactions: i18nUpcomingTransactions,
      getPendingClass: getPendingClass,
      logClickEvent: BankPubSubFactory.logTrackAnalyticsClick,
      logDrawerOpenEvent: BankPubSubFactory.logTrackAnalyticsDrawerOpen,
      logDrawerCloseEvent: BankPubSubFactory.logTrackAnalyticsDrawerClose,
      longTailUrls: longTailUrls,
      moreTransactionsProperties: moreTransactionsProperties,
      openPending: openPending,
      pendingTransactions: pendingTransactions,
      postedTransactions: postedTransactions,
      sendFocusToLastTransaction: sendFocusToLastTransaction,
      showMemo: showMemo,
      showMoreTransactions: showMoreTransactions,
      tooltipOptions: tooltipOptions,
      hideReportProblemFlag : hideReportProblemFlag,
      hideRetailReportProblemFlag : hideRetailReportProblemFlag,
      isRetailAccount: isRetailAccount,
      isRetailDisputesEnabled : BankTransactionsFactory.getFeatureToggles().retailDisputesEnabled,
      getTransactionCategory:getTransactionCategory,
      pendingTemplate: BankFiles.getFilePath('features/transactions/partials/pendingTransactions.html'),
      postedTemplate: BankFiles.getFilePath('features/transactions/partials/postedTransactions.html')
    });

    //---------------------------------------- Controller Functions ----------------------------------------------------
    function getTransactionCategory(transaction) {
      return (isRetailAccount)? '': transaction.transactionOverview.category;
    }

    function calculateMaxVisibleTransactions() {
      return (BankConstants.entriesPerPage * moreTransactionsProperties.displayedPages) - pendingTransactions.length;
    }

    function getDepositDate(transaction) {
      if (!transaction.depositDate) {
        return false;
      }

      var returnDate = $filter('date')(transaction.depositDate, 'EEE, MMM d, y');

      if (transaction.transactionType === 'ATM deposit') {
        var depositTime = $filter('date')(transaction.depositDate, 'h:mm a');
        returnDate = returnDate + ' at ' + depositTime + i18nPastTransactions.estStamp;
      }

      return returnDate;
    }

    function getTabIndex(condition) {
      if(condition){
        return 0;
      } else {
        return -1;
      }
    }

    function getTemplate(transaction) {
	  return transaction.transactionType && transactionValueToTemplateMap[transaction.transactionType.value] ? 
		transactionValueToTemplateMap[transaction.transactionType.value] : 
		BankFiles.getFilePath('features/transactions/partials/ETS-Default.html');
    }

    function getTransactionAmountClass(transaction) {
      var returnClass = '';
      if (!transaction.transactionOverview.transactionAmount) {
        return returnClass;
      }
      if (transaction.debitCardType) {
        return transaction.debitCardType;
      }

      return returnClass;
    }

    function getTransactionDetails(transaction, isOpen) {
      if (isOpen && !transaction.messageApiCalled) {
        BankTransactionsFactory.getTransactionDetailsFromApi(transaction);
      }
    }

    function getPendingClass(transactionType) {
      if (transactionType === 'Debit card purchase') {
        return 'pending-clickable';
      } else {
        return 'pending';
      }
    }

    function openPending(transactionType, index, callback) {
      if (transactionType === 'Debit card purchase') {
        callback.setOpenIndex(index);
      }
    }

    function showMemo(transaction) {
      return (transaction.transactionDescriptionDetail.activityDescription && transaction.transactionType !== 'ATM deposit');
    }

    function showMoreTransactions() {
      //log view more transaction button click event
      BankPubSubFactory.logButtonClickEvent("view more transactions");

      moreTransactionsProperties.displayedPages++;
      moreTransactionsProperties.maxVisibleTransactions = calculateMaxVisibleTransactions();

      if (moreTransactionsProperties.maxVisibleTransactions > postedTransactions.length) {
        moreTransactionsProperties.moreTransactionsEnabled = false;
      }
      if (moreTransactionsProperties.displayedPages % BankConstants.pagesPerCall === 0) {
        makeMoreTransactionsCall();
      }
    }

    function makeMoreTransactionsCall() {
      var transactionsPromise = BankTransactionsFactory.getMoreTransactionsFromApi(accountDetailsData.accountDetails.productId);
      moreTransactionsProperties.moreTransactionsEnabled = false;

      transactionsPromise.then(function successfulResponse() {
        postedTransactions = BankTransactionsFactory.getPostedTransactions();
        moreTransactionsProperties.moreTransactionsEnabled = true;
      }, function rejectedResponse() {
        moreTransactionsProperties.moreTransactionsEnabled = true;
      });
    }

    function sendFocusToLastTransaction(){

      var lastVisibleTransactionIndex = postedTransactions.length - 1;

      if ( postedTransactions.length > moreTransactionsProperties.maxVisibleTransactions) {
        lastVisibleTransactionIndex = moreTransactionsProperties.maxVisibleTransactions - 1;
      }
      var lastTransactionNumber = postedTransactions[lastVisibleTransactionIndex].transactionId;
      var lastTransactionId = 'transaction-' + lastTransactionNumber;

      $document[0].getElementById(lastTransactionId).focus();
    }

    function hideReportProblemFlag(transaction) {

      return (typeof transaction.transactionDisputed === 'undefined' || transaction.transactionDisputed
        || transaction.reportProblemExpiryIndicator || transaction.debitCardType === 'Credit'
        || transaction.internalTransferIndicator || transaction.transactionStatus === 'pending');

    }

    function hideRetailReportProblemFlag(transaction) {

      return (!BankTransactionsFactory.getFeatureToggles().retailDisputesEnabled|| typeof transaction.transactionRetailDisputedIndicator === 'undefined' || transaction.transactionRetailDisputedIndicator
      || transaction.debitCardType === 'Credit'
      || transaction.internalTransferIndicator || transaction.transactionStatus === 'pending');

    }

    function goToDisputeModal(type, index, propertyPackage) {
      if(BankTransactionsFactory.getFeatureToggles().disputesEnabled) {
        $state.go('disputeModel', {disputeType: type, transactionIndex: index, propertyPackage: propertyPackage});
      } else {
        $state.go('disputeModel', {disputeType: type, transactionIndex: index, propertyPackage: 'disputeCheckList'})
      }
    }

    function goToRetailDisputeModal(txnId, index, propertyPackage) {
      $state.go('BankDetails.transactions.retailDisputeModel', {transactionId: txnId, disputeType: 'retail', transactionIndex: index, propertyPackage: propertyPackage})
    }
  }

});

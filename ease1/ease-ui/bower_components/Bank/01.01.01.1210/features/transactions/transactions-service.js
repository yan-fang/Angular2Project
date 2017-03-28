define(['angular'], function(angular) {
'use strict';
  angular
      .module('BankModule')
      .factory('BankTransactionsFactory', BankTransactionFactory);

  //----------------------------------- Transactions Factory -----------------------------------------------------------

  BankTransactionFactory.$inject = ['$q', 'Restangular', 'EASEUtilsFactory', 'checkImageFactory', 'easeHttpInterceptor', 'BankAccountUtilities'];
  function BankTransactionFactory($q, Restangular, EASEUtilsFactory, checkImageFactory, easeHttpInterceptor, BankAccountUtilities) {

    var accountReferenceId = '';
    var transactionDetails = {};

    var pendingTransactions = [];
    var postedTransactions = [];

    var businessEventId = {
      GET_TRANSACTION_DETAILS: '50012'
    };

    var TransactionFactory = {
      callCheckImageApi : callCheckImageApi,
      getAccountReferenceId : getAccountReferenceId,
      getMoreTransactionsFromApi: getMoreTransactionsFromApi,
      getPendingTransactions: getPendingTransactions,
      getPostedTransactions: getPostedTransactions,
      setTransactionsData: setTransactionsData,
      getTransactionDetailsFromApi: getTransactionDetailsFromApi,
      getFeatureToggles: getFeatureToggles
    };

    return TransactionFactory;

    //----------------------------------- "Public" Functions -------------------------------------------------------------

    function callCheckImageApi(frontImageId, backImageId, transaction) {
      easeHttpInterceptor.setBroadCastEventOnce('checkImageError');


      var frontPromise = checkImageFactory.getCheckImageRestCall(accountReferenceId, frontImageId);

      frontPromise.then(function success(data) {
        transaction.checkFront = 'data:image/jpeg;base64,' + data;

        var backPromise = checkImageFactory.getCheckImageRestCall(accountReferenceId, backImageId);
        backPromise.then(function success(data) {
          transaction.checkBack = 'data:image/jpeg;base64,' + data;
        }, function reject() {
          easeHttpInterceptor.resetBroadCastEvent();
        })

      }, function reject() {
        easeHttpInterceptor.resetBroadCastEvent();
      })
    }

    function getAccountReferenceId() {
      return accountReferenceId;
    }

    function getPendingTransactions() {
      return pendingTransactions;
    }

    function getPostedTransactions() {
      return postedTransactions;
    }

    function getFeatureToggles() {
      return transactionDetails.transactionsFeatureToggles ? transactionDetails.transactionsFeatureToggles : {};
    }

    function setTransactionsData(accountDetailsData) {

      clearData();

      accountReferenceId = BankAccountUtilities.getAccountReferenceId();

      if (accountDetailsData.transactions) {
        transactionDetails = accountDetailsData.transactions;

        if (accountDetailsData.transactions.pending) {
          pendingTransactions = accountDetailsData.transactions.pending;
        }
        if (accountDetailsData.transactions.posted) {
          postedTransactions = accountDetailsData.transactions.posted;
        }
      }
    }

    function getMoreTransactionsFromApi(productId) {

      if(!transactionDetails.nextURL) {
        return;
      }

      var deferred = $q.defer();
      var transactionUri = buildMoreTransactionsUri();
      var transactionApi = Restangular.all(transactionUri);

      var queryParams = {
        'productId': productId
      };

      transactionApi.get('', queryParams).then(
          function promiseSuccessfulResolver(data) {
            addMorePostedTransactions(data);
            deferred.resolve();
          },
          function promiseRejectResolver() {
            deferred.reject();
          });

      return deferred.promise;

    }

    function getTransactionDetailsFromApi(transaction) {

      easeHttpInterceptor.setBroadCastEventOnce('transactionDetailsError');
      var deferred = $q.defer();
      var transactionUri = buildTransactionDetailsUri(transaction);

      var transactionApi = Restangular.all(transactionUri);

      transactionApi.get('', {}, {
          EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
          BUS_EVT_ID: businessEventId.GET_TRANSACTION_DETAILS
        }).then(
          function promiseSuccessfulResolver(data) {
            easeHttpInterceptor.resetBroadCastEvent();
            addPostedTransactionDetails(data, transaction);
            deferred.resolve();
          },
          function promiseRejectResolver() {
            deferred.resolve();
          });

      return deferred.promise;

    }

    //----------------------------------- "Private" Functions ------------------------------------------------------------

    function addMorePostedTransactions(newTransactions) {
      postedTransactions.push.apply(postedTransactions, newTransactions.transactions.posted);
      transactionDetails.nextURL = newTransactions.transactions.nextURL;
    }

    function addPostedTransactionDetails(postedTransactionDetails, transaction) {

      transaction.messageApiCalled = true;

      addCommonDetails(postedTransactionDetails, transaction);
      addBillPayDetail(postedTransactionDetails.billPayDetail, transaction);
      addP2PDetails(postedTransactionDetails.p2PTransferDetail, transaction);
      addCheckDetails(postedTransactionDetails.checkDetails, transaction);
      addDebitCardDetails(postedTransactionDetails.debitCardTransactionDetail, transaction);

    }

    function addCommonDetails(details, transaction) {
      if (details.depositDate) {
        transaction.depositDate = details.depositDate;
      }
      if(details.amount) {
        transaction.withdrawalAmount = details.amount;
      }
      transaction.transactionRetailDisputedIndicator = details.transactionDisputedIndicator;

    }

    function addBillPayDetail(billPayDetail, transaction) {

      if (!billPayDetail) {
        return false;
      }

      if (billPayDetail.stopPaymentRequestIndicator) {
        transaction.transactionStopRequested = billPayDetail.stopPaymentRequestIndicator;
      }
      if (billPayDetail.paymentExpiredIndicator) {
        transaction.checkCleared = billPayDetail.paymentExpiredIndicator;
      }

      if (transaction.transactionDescriptionDetail.activityDescription === 'Electronic Payment') {
        transaction.checkCleared = false;
      }
    }

    function addP2PDetails(p2PDetails, transaction) {

      if (!p2PDetails) {
        return false;
      }

      if (p2PDetails.memoText) {
        transaction.transactionDescriptionDetail.memoText = p2PDetails.memoText;
      }
      if (p2PDetails.p2PTransactionStatus) {
        transaction.p2PTransactionStatus = p2PDetails.p2PTransactionStatus;
      }
      if (p2PDetails.payee.emailAddress) {
        transaction.p2PEmailAddress = p2PDetails.payee.emailAddress;
      }

    }

    function addCheckDetails(checkDetails, transaction) {
      if (!checkDetails) {
        return false;
      }

      if (checkDetails.frontImageReferenceId) {
        callCheckImageApi(checkDetails.frontImageReferenceId, checkDetails.backImageReferenceId, transaction);
      }
    }

    function addDebitCardDetails(debitCardDetails, transaction) {

      if (!debitCardDetails) {
        return false;
      }

      if (typeof debitCardDetails.transactionFeeDisputedIndicator !== 'undefined') {
        transaction.transactionFeeDisputed = debitCardDetails.transactionFeeDisputedIndicator;
        transaction.atmDisputeType = 'feeDisputed';
      }

      if (typeof debitCardDetails.transactionDisputedIndicator !=='undefined') {
        transaction.transactionDisputed = debitCardDetails.transactionDisputedIndicator;
        transaction.atmDisputeType = 'transactionDisputed';
      }

      transaction.surchargeFee = debitCardDetails.surchargeFeeAmount > 0 ? debitCardDetails.surchargeFeeAmount : 0;
      transaction.atmDisputeType = debitCardDetails.transactionDisputedIndicator ? 'transactionDisputed' :
        debitCardDetails.transactionFeeDisputedIndicator ? 'feeDisputed' : '';
    }

    function buildMoreTransactionsUri() {

      var encodedId = encodeURIComponent(accountReferenceId);
      var uri = "Bank/getAccountById/" + encodedId + "/pagingKey/" + transactionDetails.nextURL;

      return uri;

    }

    function buildTransactionDetailsUri(transaction) {

      var encodedId = encodeURIComponent(accountReferenceId);
      var encodedTransactionRefId = encodeURIComponent(transaction.transactionReferenceId);
      var uri = "Bank/accounts/" + encodedId + "/transactions/" + encodedTransactionRefId;

      return uri;

    }

    function clearData() {
      angular.copy({}, transactionDetails);
      pendingTransactions.length = 0;
      postedTransactions.length = 0;
    }

  }
});


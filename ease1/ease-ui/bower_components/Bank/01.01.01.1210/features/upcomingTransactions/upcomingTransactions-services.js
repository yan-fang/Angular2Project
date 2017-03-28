define(['angular'], function(angular) {
'use strict';
  angular
      .module('BankModule')
      .factory('BankUpcomingTransactionsFactory',BankUpcomingTransactionFactory)
      .constant('BankUpcomingConstants', {
        bankUpComingTransactionsUrl : 'Bank/upcoming-transactions/',
        bankUpcomingAddMoreTxnUrl: "features/upcomingTransactions/partials/upcoming-addMoreTransactions.html",
        bankUpComingTransactionsProjectedDays : 31,
        defaultNoOfCardsDisplayedInWebView : 5,
        actionModalPayeeNameLength : 35,
        maxNoOfUpcomingTransCardsToDisplay : 10,
        tabletBreakpoint : 1000,
        mobileBreakpoint: 480,
        slidesToShowDesktop: 10,
        slidesToShowTab: 3,
        slidesToShowMobile: 2
      });

  //----------------------------------- Upcoming Transactions Factory ------------------------------------------------------------

  BankUpcomingTransactionFactory.$inject = ['$q', 'Restangular', 'BankUpcomingConstants', 'EASEUtilsFactory', 'EaseConstant', 'easeHttpInterceptor', 'BankAccountUtilities'];

  function BankUpcomingTransactionFactory($q, Restangular, BankUpcomingConstants, EASEUtilsFactory, EaseConstant, easeHttpInterceptor, BankAccountUtilities) {

    var upComingTransactions = [];
    var upcomingErrorResponse = {
      "upcomingTransactionsCount": -1,
      "upcomingTxnFeatureToggle.viewActionModal": true
    };
    var UpcomingTransactionsFactory = {
      getUpComingTransactionsRestCall : getUpComingTransactionsRestCall,
      getUpComingTransactions : getUpComingTransactions
    };


    var businessEventId = {
      GET_UPCOMING_TRANSACTION: '50008'
    };

    return UpcomingTransactionsFactory;

    //----------------------------------- "Public" Functions -------------------------------------------------------------

    function initializeUpComingTransactions(upComingTransactionData){
      upComingTransactions = upComingTransactionData;
    }

    function getUpComingTransactions() {
      console.log("getUpComingTransactions...");
      return upComingTransactions;
    }

    function getUpComingTransactionsRestCall(accountReferenceId, projectedDays, accountDetails){

      easeHttpInterceptor.setBroadCastEventOnce('upcomingTransactionsError');
      var deferred = $q.defer();

      var upcomingTransactionUri = buildUpComingTransactionsUri(accountReferenceId, accountDetails);
      var queryParams = {
        'subCategory': accountDetails.subCategory,
        'projectedDays': projectedDays,
        'productId': accountDetails.productId,
        'lineOfBusiness': accountDetails.lineOfBusiness
      };

      console.log("Getting Up-Coming transaction data from OL");

      var transactionApi = Restangular.all(upcomingTransactionUri, queryParams);
      transactionApi.get('', queryParams, {
          EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
          BUS_EVT_ID: businessEventId.GET_UPCOMING_TRANSACTION
        }).then(
        function upComingPromiseSuccessfulResolver(data) {
          easeHttpInterceptor.resetBroadCastEvent();
          initializeUpComingTransactions(data);
          deferred.resolve(upComingTransactions);
        },
        function upComingPromiseRejectResolver(ex) {
          initializeUpComingTransactions(upcomingErrorResponse);
          deferred.resolve(upcomingErrorResponse);
        });
      return deferred.promise;
    }

    //----------------------------------- "Private" Functions ------------------------------------------------------------
    function buildUpComingTransactionsUri(accountReferenceId) {
      var encodedId = encodeURIComponent(accountReferenceId);
      var uri = BankUpcomingConstants.bankUpComingTransactionsUrl + encodedId;
      return uri;
    }

  }
});

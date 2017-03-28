define(['angular'], function(angular) {
'use strict';
  angular
      .module('BankModule')
      .factory('BankAccountDetailsFactory', BankAccountDetailsFactory)
      .factory('BankLocalization', BankLocalization)
      .factory('BankFiles', BankFilesFactory)
      .constant('BankConstants', {
        BankTransactionsUrl : 'Bank/transactions/',
        defaultDisplayedPages : 1,
        pagesPerCall : 4,
        entriesPerApiCall : 100,
        entriesPerPage : 25,
        checking:4000,
        saving:3000,
        tcc:4600,
        csa:3400,
        directMoney:3300,
        money:4300,
        ksa:3010,
        cd:3500
      })
      .constant('BankUrlMappings', {
        Activate : 'transactions.debitActivation',
        Details : 'transactions.viewDetails',
        Disclosures : 'disclosures',
        LockCard: 'transactions.debitLock',
        Redirect : 'redirect',
        Statements : 'statementOpen',
        Services: 'moreServices',
        Transfer: 'transfer',
        UnlockCard : 'transactions.debitUnlock',
        ChangePin : 'transactions.debitChangePin',
        OrderCard : 'transactions.debitOrder',
        feedback: 'feedback'
      });

  //----------------------------------- Account Details Factory --------------------------------------------------------

  BankAccountDetailsFactory.$inject = ['EaseConstant', 'EaseConstantFactory', 'EASEUtilsFactory', '$q', 'Restangular', '$state', '$rootScope'];
  function BankAccountDetailsFactory(EaseConstant, EaseConstantFactory, EASEUtilsFactory, $q, Restangular, $state, $rootScope) {

    $rootScope.$on('$viewContentLoading', function(){
      if(!$state.$current.locals)
        $state.$current.locals = {};
    });

    var accountDetails = {};
    var displayName = '';
    var DetailsFactory = {
      getAccountDetails: getAccountDetails,
      getAvailableCardActions: getAvailableCardActions,
      getBankAccountDetailsFromOL: getBankAccountDetailsFromOL,
      getDisplayName: getDisplayName,
      getActionableDebitCards: getActionableDebitCards
    };

    var businessEventId = {
      AVAILABLE_CARDS: '50037',
      ACCOUNT_DETAILS: '50008'
    };

    return DetailsFactory;

    //----------------------------------- Getters and Setters ----------------------------------------------------------

    function getAccountDetails() {
      return accountDetails;
    }

    function getAvailableCardActions(accountDetailsRefId) {
      var url = 'Bank/accounts/' + encodeURIComponent(accountDetailsRefId) + '/features';
      var deferred = $q.defer();

      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      var availableCardActions = Restangular.all(url);
      availableCardActions.get('',{}, {
          EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
          BUS_EVT_ID: businessEventId.AVAILABLE_CARDS
        }).then(function (data) {
        deferred.resolve(data);
      }).catch(function(error){
        deferred.reject(error);
      });
      return deferred.promise;
    }

    function getBankAccountDetailsFromOL(accountDetailsRefId, productType, productId) {
      var deferred = $q.defer();
      var accountDetails;
      var encodedAccountRefId = encodeURIComponent(accountDetailsRefId);

      var queryParams = {
        'productId': productId
      };

      var urlPrefix = (productType === EaseConstant.lineOfBusiness.cd)?
        EaseConstant.urlPrefixerCDDeposits : EaseConstant.urlPrefixerDeposits;
      var url = urlPrefix + encodedAccountRefId;

      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());

      accountDetails = Restangular.all(url);
      accountDetails.get('', queryParams, {
            EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
            BUS_EVT_ID: businessEventId.ACCOUNT_DETAILS
          }
   ).then(function (data) {
        EASEUtilsFactory.IsFooterDisplaySet(false);
        data['accountRefId'] = accountDetailsRefId;
        initializeAccountDetails(data);
        deferred.resolve(data);
      }, function (ex) {
        deferred.reject(ex);
      });
      return deferred.promise;
    }

    function getDisplayName() {
      return displayName;
    }

    function getActionableDebitCards(cardList){
      var filteredCardList = [];
      var cardsToAccept =['ACTIVE','NOT ACTIVATED', 'FROZEN'];
      for (var card in cardList){
          if(cardsToAccept.indexOf(cardList[card].cardStatus.toUpperCase()) > -1){
              filteredCardList.push(cardList[card]);
          }
      }
      return filteredCardList;
    }
    //----------------------------------- "Private" Functions ------------------------------------------------------------

    function initializeAccountDetails(newAccountDetailsData) {

      clearAccountDetailData();

      if (newAccountDetailsData.accountDetails) {
        accountDetails = newAccountDetailsData.accountDetails;
        setDisplayName(newAccountDetailsData);
      }
    }

    function clearAccountDetailData() {
      angular.copy({}, accountDetails);
      displayName = '';
    }

    function setDisplayName() {
      if (accountDetails.accountNickname) {
        displayName = accountDetails.accountNickname;
      }
      else if (accountDetails.productName) {
        displayName = accountDetails.productName
      }
    }

  }

  BankLocalization.$inject = ['BankFiles', '$q', '$locale', '$http'];
  function BankLocalization(BankFiles, $q, $locale, $http) {

    return {
      getBundle : getBundle
    };

    function getBundle() {
      var deferred = $q.defer();
      var endpoint = BankFiles.getFilePath('utils/i18n/resources-locale_en-us.json');
      var callForResourceBundle = $http.get(endpoint);

      callForResourceBundle.then(function success(response) {
        deferred.resolve(response.data.bank);
      }, function failure() {
        deferred.reject();
      });
      return deferred.promise;
    }
  }

  function BankFilesFactory() {
    var basePath = '/ease-ui/bower_components/Bank/01.01.01.1210/';

    var bankFiles = {
      getFilePath : getFilePath
    };

    return bankFiles;

    function getFilePath(inputPath) {
      return require.toUrl(basePath + inputPath);
    }
  }
});

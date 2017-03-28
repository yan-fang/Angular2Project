define(['angular'], function (angular) {
  'use strict';

  angular
      .module('BankModule')
      .controller('BankController', BankController)
      .controller('BankViewDetailsController', BankViewDetailsController)
      .controller('BankDisclosuresController', BankDisclosuresController);

  BankController.$inject = ['$scope',
    '$location',
    '$window',
    'i18nBank',
    'accountDetailsData',
    '$controller',
    '$state',
    'BankAccountDetailsFactory',
    'BankExtensibilityBarService',
    '$stateParams',
    'transferState',
    'BankPubSubFactory',
    'BankMoreServicesConstants',
    'BankConstants',
    'BankEnvironmentConstants',
    'EaseConstant',
    'BankUrlMappings',
    'BankAccountUtilities',
    'accountDetailService',
    'EASEUtilsFactory',
    'BankFiles'];
  function BankController($scope, $location, $window, i18nBank, accountDetailsData, $controller, $state,
                          BankAccountDetailsFactory, BankExtensibilityBarService, $stateParams, transferState,
                          BankPubSubFactory, BankMoreServicesConstants, BankConstants, BankEnvironmentConstants, EaseConstant, BankUrlMappings,
                          BankAccountUtilities, accountDetailService, EASEUtilsFactory, BankFiles) {

    $controller('AccountDetailsParentController', {$scope: $scope, accountDetailsData: accountDetailsData});

    $scope.InitilizeTemplate();
    BankAccountUtilities.resetUtils();
    var bankAccountData = BankAccountDetailsFactory.getAccountDetails();

    var onRouteChangeOff = $scope.$on('$stateChangeSuccess', onLocationChange);
    function onLocationChange() {
      if($stateParams.accountDetails.url) {
        var action = $stateParams.accountDetails.url.split('/')[3];
        if(action == 'feedback') {
          $state.go('BankDetails.transactions.' + BankUrlMappings[action]);
          onRouteChangeOff();
        } else if(action==='ViewPayees' || action === 'Pay' || action === 'ConfirmPayment') {
          $state.go('BillPay.PayeeList',{
            productName: $stateParams.ProductName,
            accountReferenceId: $stateParams.accountReferenceId,
            subCategory: $stateParams.accountDetails.subCategory
          });
          onRouteChangeOff();
        } else if(action) {
          $state.go('BankDetails.' + BankUrlMappings[action], {
            'category': $stateParams.accountDetails.lineOfBusiness,
            'referenceId': accountDetailsData.accountRefId,
            'subCategory': $stateParams.accountDetails.subCategory
          });
          onRouteChangeOff();
        }
      }
    }

    var vm = this;
    var displayName = BankAccountDetailsFactory.getDisplayName();
    var focusId = null;
    var showExtensibilityBar = BankExtensibilityBarService.isEligibleForExtensibility(bankAccountData);
    var i18nAccountDetails = i18nBank.accountDetails;
    var i18nUpcomingTransactions = i18nBank.upcomingTransactions;
    var i18nExtBar = i18nBank.extensibilityBar;
    var isRetailAccount = BankAccountUtilities.isRetailAccount(bankAccountData.subCategory);
    var isCheckingAccount = BankAccountUtilities.isCheckingAccount(bankAccountData.productId);
    var isHybridAccount = BankAccountUtilities.isHybridAccount(bankAccountData.productId);
    var isRetirementAccount = bankAccountData.retirementAccountIndicator;
    var isUpcomingFeatureEnabled = bankAccountData.upcomingTransactionsEnabled;
    var bankAccountDetail = {
      primaryContent: {
        accountName: getNicknameOrAccountName(),
        primary: getPrimaryAccountDetail(),
        secondary: getSecondaryAccountDetail(),
        tertiary: getTertiaryAccountDetail()
      },
      navigationLinks: getNavigation()
    };

    var goToNextAccount = function(){
      accountDetailService.getAccountPosition(accountDetailsData.accountRefId).then(function(data){
          var nextAccount = data.showRightArrow.account;
          var stateObject = EASEUtilsFactory.getStateDetailsObject(nextAccount);
          $state.go(EASEUtilsFactory.SelectDetailsTransaction(nextAccount).lobType + 'Details.transactions', stateObject);
      });
    };
    var goToPreviousAccount = function(){
      accountDetailService.getAccountPosition(accountDetailsData.accountRefId).then(function(data){
          var prevAccount = data.showLeftArrow.account;
          var stateObject = EASEUtilsFactory.getStateDetailsObject(prevAccount);
          $state.go(EASEUtilsFactory.SelectDetailsTransaction(prevAccount).lobType + 'Details.transactions', stateObject);
      });
    };

    var triggerAlert = function(action, link, isToggledOn){
      BankPubSubFactory.logButtonClickEvent(bankAccountData.subCategory + " L2 Debit Alert:" + action);
      if (isToggledOn) {
        var actionableDebitCardList = BankAccountDetailsFactory.getActionableDebitCards(bankAccountData.bankCardDetails);
        $state.go(link,{actionableDebitCards: actionableDebitCardList})
      } else {
        $window.open(link, '_self');
      }
    };

    var getAlertFromAction = function(action, alert){
      var link = alert.isToggledOn ? alert.easeFeatureState : alert.transiteClickoutUrl;
      return {
        headline: i18nAccountDetails['ease.bank.accountDetails.alerts.' + action +'.headline'],
        icon:"icon-info-circle",
        action:{
          text: i18nAccountDetails['ease.bank.accountDetails.alerts.' + action +'.action'],
          link:{
            type:"ng-click",
            url: "BankDetails.triggerAlert('"+ action + "','" + link + "', " + alert.isToggledOn + ")"
          },
          attrs: {
            key: "id",
            val: "debit-" + action + "-alert-action"
          }
        },
        attrs: {
          key: "id",
          val: "debit-" + action + "-alert"
        }
      }
    }

    /* getCardActions(postAction)
     * returns available debit card actions after
     * a successful debit action. If no action is passed
     * it will send defaultCardActions where everything
     * is available to the customer
     *
     * @param postAction String   type of debit action that was successful
     * @return {Object}
     */
    var getCardActions = function(postAction) {
     return {
       activate : !postAction ,
       lock : !postAction || postAction!='lock' ,
       unlock : !postAction || postAction=='lock' ,
       updatePin : !postAction || postAction!='lock' ,
       travelNotify : !postAction ||postAction!='lock',
     }
    };

    var availableAlerts = {
      activate : {
        isToggledOn: bankAccountData.debitActivationEnabled,
        easeFeatureState: 'BankDetails.transactions.debitActivation',
        transiteClickoutUrl: BankMoreServicesConstants.activationDefaultUrl
      },
      unlock : {
        isToggledOn: bankAccountData.debitLockUnlockEnabled,
        easeFeatureState: 'BankDetails.transactions.debitUnlock',
        transiteClickoutUrl: BankMoreServicesConstants.unlockDefaultUrl
      }
    };

    if(!isRetailAccount && isCheckingAccount){
      BankAccountDetailsFactory.getAvailableCardActions(accountDetailsData.accountRefId)
                               .then(function(data) {
                                 var availableCardActions = data.cardActions.reduce(function (prev, action) {
                                   if( Object.keys(availableAlerts).indexOf(action) > -1 ) {
                                     vm.heroAlerts.push( getAlertFromAction(action, availableAlerts[action]) );
                                   }
                                   prev[action] = true;
                                   return prev;
                                 }, {});
                                 vm.availableCardActions = availableCardActions;
                               });
    }

    /* When a successful debit action occurs, it will emit an
     * an event named 'debitCardChange' with the name of the
     * operation that was successfully completed. As a result,
     * we want to get what the availableCardActions are based
     * on this new state. If this successfully action had any
     * alerts, remove that in the case of lock, show alerts
     * for the current state.
     *
     */
    $scope.$on('debitCardChange', function(e, changedState) {
      vm.availableCardActions = getCardActions(changedState);
      vm.heroAlerts = [];
      var validCardActions = _.keys(_.pick(vm.availableCardActions, _.identity));
      if( Object.keys(availableAlerts).indexOf(changedState) > -1 ){
        $window.document.getElementById('debit-' + changedState + '-alert').remove();
      }
      validCardActions.forEach(function(action){
        if( Object.keys(availableAlerts).indexOf(action) > -1 ) {
          vm.heroAlerts.push( getAlertFromAction(action, availableAlerts[action]) );
        }
      });
    });

    //set TransferMoney Account ReferenceId
    BankExtensibilityBarService.setTransferMoneyOptions($stateParams.lineOfBusiness, accountDetailsData.accountRefId);

    angular.extend(vm, {
      bankAccountData: bankAccountData,
      availableCardActions: getCardActions(),
      loader: false,
      displayName: displayName,
      focusId: focusId,
      viewDetails: viewDetails,
      showExtensibilityBar: showExtensibilityBar,
      openStatement: openStatement,
      i18nAccountDetails: i18nAccountDetails,
      i18nUpcomingTransactions : i18nUpcomingTransactions,
      i18nExtBar: i18nExtBar,
      getHeroAreaBackgroundClass: getHeroAreaBackgroundClass,
      heroButtonAction: _.debounce(heroButtonAction, 250, { 'maxWait': 1000 }),
      triggerAlert: _.debounce(triggerAlert, 250, { 'maxWait': 1000 }),
      styleLink: BankFiles.getFilePath('styles/bank-override.css'),
      bankDetailsHero: bankAccountDetail,
        isUpcomingFeatureEnabled: isUpcomingFeatureEnabled,
      heroAlerts: [],
      goToNextAccount: goToNextAccount,
      goToPreviousAccount: goToPreviousAccount
    });

    function transfers(evt) {
      focusId = evt.target.id;
      transferState.setCurrentLOB('BankDetails.transactions');
      vm.loader = true;
      $state.go('BankDetails.transfer', {
        'category': $stateParams.lineOfBusiness,
        'referenceId': accountDetailsData.accountRefId,
        'subCategory': $stateParams.subCategory
      }).then(function onSuccess() {
          vm.loader = false;
        })
        .catch(function err() {
          vm.loader = false;
        });
    }

    function directbankDefaulLanding(evt, level) {
      // fire site catalyst event if level is present
      if(level) {
        var levels = {
          "level2": level
        };
        BankPubSubFactory.logPageViewEvent(levels);
      }
      $window.location.href = BankEnvironmentConstants.directbankDefaultUrl;
    }

    function retailIraLanding(evt) {
      $window.open(BankEnvironmentConstants.retailIraTransferMoneyUrl, '_blank');
    }

    function viewDetails(evt) {
      focusId = evt.target.id;
      evt.preventDefault();
      $state.go('BankDetails.transactions.viewDetails');
    }


    function openStatement(evt) {
      focusId = evt.target.id;
      $state.go('BankDetails.transactions.statementOpen');
    }

    /**
     * get the logo for respective product type
     * @returns {*}
     *
     * NOTE: PRODUCT ID'S SUPPORTED AS OF NOW:
     *    CHECKING : 4000
     *    MONEY   : 4300
     *    SA     : 3000
     *    KSA   : 3010
     */
    function getLogoUrl() {

      var productLogoUrl = {};
      productLogoUrl[BankConstants.checking] = BankFiles.getFilePath('images/360_checking_logo.png');
      productLogoUrl[BankConstants.saving] = BankFiles.getFilePath('images/360_savings_logo.png');
      productLogoUrl[BankConstants.ksa] = BankFiles.getFilePath('images/kids_savings_logo.png');
      productLogoUrl[BankConstants.money] = BankFiles.getFilePath('images/money_logo.png');

      return productLogoUrl[isRetirementAccount ? "IRA" + bankAccountData.productId : bankAccountData.productId];
    }

    /**
     * getNicknameOrAccountName()
     * If user has set a nickname for their account,
     * prioritize nickname and return that, if not
     * check if this product has a logo and return
     * that, else return product name.
     *
     * @returns  {string} Nickname or Logo image as HTML or default product name
     *
     */
    function getNicknameOrAccountName() {
      var accountLogoUrl = getLogoUrl();
      var logoHTML = '<img alt="' + bankAccountData.productName + '" class="account-logo" src="' + accountLogoUrl+ '">' ;
      return  bankAccountData.accountNickname ? bankAccountData.accountNickname :
                                                accountLogoUrl ? logoHTML :
                                                bankAccountData.productName;
    }

    function getBalanceLabel(productId) {
      var label;
      if (productId == BankConstants.cd) {
        label = i18nAccountDetails['ease.bank.accountDetails.cd.availableBal'];
      } else {
        label = i18nAccountDetails['ease.bank.accountDetails.availableBal'];
      }
      return label;
    }

    function hasHeroButton(productId) {
      var buttonAvailable = false;
     if(isRetailAccount) {
       // Do not show the button for Retail CD and Retail IRA Savings
       if((bankAccountData.retailCategory == 'RTLCD') || (bankAccountData.retailCategory == 'RTLSA' && bankAccountData.retirementAccountIndicator)) {
         buttonAvailable = false;
       } else {
         buttonAvailable = true;
       }
     } else {
       // For 360 products
       switch (parseInt(productId)) {
         case BankConstants.checking:
         case BankConstants.saving:
         case BankConstants.tcc:
         case BankConstants.csa:
         case BankConstants.ksa:
         case BankConstants.money:
         case BankConstants.directMoney:
         case BankConstants.cd:
           buttonAvailable = true;
           break;
       }
     }

      return buttonAvailable;
    }

    function heroButtonAction(productId, $event) {
      BankPubSubFactory.logButtonClickEvent(bankAccountData.subCategory + " L2 Hero button");
      if(isRetailAccount) {
        BankPubSubFactory.logPageViewEvent({level2: "transferMoney"});
        isRetirementAccount ? retailIraLanding($event) : transfers($event);
      }
      switch(parseInt(productId)) {
        case BankConstants.checking:
        case BankConstants.tcc:
        case BankConstants.csa:
        case BankConstants.ksa:
        case BankConstants.money:
        case BankConstants.directMoney:
          transfers($event);
          break;
        case BankConstants.saving:
          isRetirementAccount ? directbankDefaulLanding($event, "transferMoney") : transfers($event);
          break;
        case BankConstants.cd:
          directbankDefaulLanding($event, "maturityOptions");
          break;
      }
    }

    function heroButtonDetail(productId, type) {
      var heroButton = null;
      if(isRetailAccount) {
        heroButton = {id : "transferMoney", label: (isRetirementAccount ? i18nAccountDetails['ease.bank.accountDetails.iraTransferMoney'] : i18nAccountDetails['ease.bank.accountDetails.transferMoney'])};
      }

      switch (parseInt(productId)) {
        case BankConstants.checking:
        case BankConstants.tcc:
        case BankConstants.csa:
        case BankConstants.ksa:
        case BankConstants.money:
        case BankConstants.directMoney:
          heroButton = {id: "transferMoney", label: i18nAccountDetails['ease.bank.accountDetails.transferMoney']};
          break;
        case BankConstants.saving:
          heroButton = {id: "transferMoney", label: (isRetirementAccount ? i18nAccountDetails['ease.bank.accountDetails.iraTransferMoney'] : i18nAccountDetails['ease.bank.accountDetails.transferMoney'])}
          break;
        case BankConstants.cd:
          heroButton = {id: "maturityOptions", label: i18nAccountDetails['ease.bank.accountDetails.maturityOptions']};
          break;
      }

      switch (type) {
        case "id":
          return heroButton.id;
          break;
        case "label":
          return heroButton.label;
          break;
      }
    }
    function getHeroAreaBackgroundClass() {
      return isRetailAccount || isHybridAccount ? '_retail' : '_360';
    }
    function getMaskedAccountNumber() {
      return bankAccountData.accountNumberTLNPI.substring(bankAccountData.accountNumberTLNPI.length-4, bankAccountData.accountNumberTLNPI.length);
    }

    function getPrimaryAccountDetail() {
      var bankAccountName = {
        key: bankAccountData.productName,
        val: '...' + getMaskedAccountNumber()
      };
      var viewDetails = {
        key:'<i id="past-due-icon" class="icon-info-circle"></i>',
        val:'View Details',
        attrs:[ {key:'ng-click', val:'BankDetails.viewDetails($event)'},
                {key:'id', val:'viewDetailLink'},
                {key:'title', val:i18nAccountDetails['ease.bank.accountDetails.viewDetailsTitle']} ]
      };
      return [bankAccountName, viewDetails];
    }

    function getSecondaryAccountDetail(){
      return {
        key: getBalanceLabel(bankAccountData.productId),
        val: bankAccountData.availableBalance,
        format: 'Money'
      };
    }

    function getTertiaryAccountDetail(){
      return bankAccountData.category === 'CD' && isRetailAccount ? {
        attrs: [{key:'id', val:'retail-cd-account-detail-cta'}]
      } : {
        val: heroButtonDetail(bankAccountData.productId, 'label'),
        attrs: [{key:'id', val:'account-detail-cta'},
                {key:'data-ng-class', val:'{ loader : BankDetails.loader }'},
                {key:'data-ng-click', val:'BankDetails.heroButtonAction(BankDetails.bankAccountData.productId, $event)'}]
      };
    }

    function getNavigation(){
      // don't show navigation if customer has only one account
      if (EASEUtilsFactory.summaryData.accounts.length <= 1){
        return {};
      } else {
        return {
          previous:{
            type: 'ng-click',
            value: 'BankDetails.goToPreviousAccount()',
            title: i18nAccountDetails['ease.bank.accountDetails.prevAccount']
          },
          next: {
            type: 'ng-click',
            value: 'BankDetails.goToNextAccount()',
            title: i18nAccountDetails['ease.bank.accountDetails.nextAccount']
          }
        };
      }
    }
  }

  /**
   * Check Account NickName Length and concat (ellipse) its length more than 19 character
   * @returns {*}
   */
  function getAccountNickName(accountNickName) {
    if (accountNickName && accountNickName.length > 19) {
      accountNickName = accountNickName.substr(0, 18) + "...";
    }
    return accountNickName;
  }

  //------------------------------------- Bank View Details Controller -------------------------------------------------

  BankViewDetailsController.$inject = [
    'accountDetailsData',
    '$state',
    '$filter',
    'BankAccountDetailsFactory',
    'BankPubSubFactory',
    'i18nBank',
    'BankViewDetailsFactory',
    'BankAccountUtilities'];
  function BankViewDetailsController(accountDetailsData, $state, $filter, BankAccountDetailsFactory, BankPubSubFactory,
                                     i18nBank, BankViewDetailsFactory, BankAccountUtilities) {

    var levels = {
      "level3": "more account details"
    };

    BankPubSubFactory.logPageViewEvent(levels);
    var i18nBankAccountDetails = i18nBank.accountDetails;
    BankViewDetailsFactory.postConstruct(accountDetailsData, i18nBankAccountDetails);

    var focusId = null;
    var bankAccountData = accountDetailsData.accountDetails;
    var isRetailAccount = BankAccountUtilities.isRetailAccount(accountDetailsData.accountDetails.subCategory);
    var isHybridAccount = BankAccountUtilities.isHybridAccount(bankAccountData.productId);
    var viewDetailsModalClass = (function(){
      return isRetailAccount || isHybridAccount ? 'bank-view-details-modal product-retail' : 'bank-view-details-modal product-360';
    })();

    angular.extend(this, {
      initClose: false,
      modalType: viewDetailsModalClass,
      modalClass: '',
      close: function () {
        levels = {"level3": ""};
        BankPubSubFactory.logPageViewEvent(levels);
        $state.go('BankDetails.transactions');
      },
      bankAccountData: bankAccountData,
      displayName: BankAccountDetailsFactory.getDisplayName(),
      viewDetailsHelper: BankViewDetailsFactory,
      focusId: focusId,
      isJointAccount: BankViewDetailsFactory.isJointAccount(),
      isCDAccount: BankViewDetailsFactory.isCDAccount(),
      isTrustAccount: BankViewDetailsFactory.isTrustAccount(),
      isRetailAccount: isRetailAccount,
      isHybridAccount: isHybridAccount,
      accountHolderLabel: BankViewDetailsFactory.accountHolderLabel(),
      debitCardLabel: BankViewDetailsFactory.debitCardLabel(),
      primaryAccountHolderCardNumber: BankViewDetailsFactory.primaryAccountHolderCardNumber(),
      secondaryAccountHolderCardNumber: BankViewDetailsFactory.secondaryAccountHolderCardNumber(),
      primaryAccountHolder: BankViewDetailsFactory.getPrimaryAccountHolder(),
      secondaryAccountHolder: BankViewDetailsFactory.getSecondaryAccountHolder(),
      isRoutingNumberActivated: BankViewDetailsFactory.isRoutingNumberActivated(),
      hideOwnershipType: BankViewDetailsFactory.hideOwnershipType(),
      getOwnerShipType: BankViewDetailsFactory.getOwnerShipType(),
      truthInSavingDisclosure: BankViewDetailsFactory.truthInSavingDisclosure,
      showTruthInSavingsDisclosure : BankViewDetailsFactory.showTruthInSavingsDisclosure(),
      viewDisclosures: function (evt) {
        focusId = evt.target.id;
        pageRedirect(evt);
      },
      lastYear: $filter('date')(new Date(), 'yyyy') - 1,
      currentYear: $filter('date')(new Date(), 'yyyy'),
      currentMonth: $filter('date')(new Date(), 'MMMM')
    });

    function pageRedirect(evt) {
      evt.preventDefault();
      if (accountDetailsData.accountDetails.showTCInModal) {
        $state.go("BankDetails.transactions.disclosures");
      }
      else {
        BankViewDetailsFactory.viewDisclosures(evt);
      }
    }
  }

//------------------------------------- Bank View Disclosures Controller -------------------------------------------------

  BankDisclosuresController.$inject = ['$state', 'accountDetailsData', 'BankConstants', 'BankDisclosuresFactory', '$location', '$anchorScroll', 'i18nBank'];
  function BankDisclosuresController($state, accountDetailsData, BankConstants, BankDisclosuresFactory, $location, $anchorScroll, i18nBank) {
    var i18nTermsAndConditions = i18nBank.termsandconditions;
    angular.extend(this, {
      initClose: false,
      modalType: 'bank-disclosures-modal',
      modalClass: 'icon-info',
      close: function () {
        $state.go('BankDetails.transactions.viewDetails');
      },
      headerContentClass: accountDetailsData.accountDetails.productId == BankConstants.checking ? "disclosureCheckingHeaderContent" : "disclosureHeaderContent",
      i18nTermsAndConditions: i18nTermsAndConditions,
      isCheckingTermsAndConditions: accountDetailsData.accountDetails.productId == BankConstants.checking,
      isMoneyTC: accountDetailsData.accountDetails.productId == BankConstants.money,
      scrollTo: scrollTo,
      viewDisclosures: BankDisclosuresFactory.viewDisclosures()
    });

    function scrollTo(bookMarkHashId) {
      $location.hash(bookMarkHashId);
      $anchorScroll();
    }
  }
});

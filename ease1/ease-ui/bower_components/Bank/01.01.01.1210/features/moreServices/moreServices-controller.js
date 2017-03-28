define(['angular'], function (angular) {
  'use strict';

  angular
    .module('BankModule')
    .controller('BankMoreServicesController', BankMoreServicesController);

  BankMoreServicesController.$inject = ['$state',
                                        '$location',
                                        '$window',
                                        'i18nBank',
                                        'RetailAccountLinks',
                                        'BankUrlMappings',
                                        'BankAccountUtilities',
                                        'BankMoreServicesService',
                                        'BankPubSubFactory',
                                        'BankAccountDetailsFactory',
                                        'EaseConstant',
                                        'easeHttpInterceptor',
                                        '$stateParams',
                                        'transferState',
                                        'BankEnvironmentConstants'];

  function BankMoreServicesController($state,
                                      $location,
                                      $window,
                                      i18nBank,
                                      RetailAccountLinks,
                                      BankUrlMappings,
                                      BankAccountUtilities,
                                      BankMoreServicesService,
                                      BankPubSubFactory,
                                      BankAccountDetailsFactory,
                                      EaseConstant,
                                      easeHttpInterceptor,
                                      $stateParams,
                                      transferState,
                                      BankEnvironmentConstants) {

    var i18nMoreServices = i18nBank.moreServices;

    var accountData = BankAccountDetailsFactory.getAccountDetails();
    var accountType = BankAccountUtilities.isRetailAccount(accountData.subCategory) ? accountData.retailCategory :
      accountData.productId;
    var isDebitActivationEnabled = accountData.debitActivationEnabled;
    var isRetailDebitActivationEnabled = accountData.retailDebitActivationEnabled;
    var isDebitLockUnlockEnabled = accountData.debitLockUnlockEnabled;
    var isDebitChangePinEnabled = accountData.debitChangePinEnabled;
    var isDebitOrderCardEnabled = accountData.debitOrderCardEnabled;
    var isBillPayLandingEnabled = accountData.billPayLandingEnabled;
    var accountReferenceId = $stateParams.accountReferenceId;
    var subCategory = $stateParams.accountDetails.subCategory;
    var productName = $stateParams.ProductName;
    var isRetail = BankAccountUtilities.isRetailAccount(subCategory);
    var isEligibleFor;

    var isUserCardActivated = true; // TODO: get this from a service call

    var currentFullState = encodeURIComponent($location.path());

    var moreServiceConstant = BankMoreServicesService.getMoreServicesConstant(accountData);
    if(isRetail){
      i18nMoreServices = i18nBank.retailMoreServices;
    }

    var modalTypeClass = 'bank-more-services-modal';
    if(isRetail){
      modalTypeClass = 'bank-more-retail-services-modal';
    }

    easeHttpInterceptor.setBroadCastEventOnce('no');

    isEligibleFor = isRetail ? false : BankMoreServicesService.getEligibilityOptions(accountType);

    function getRetailProductType() {
      if (isRetail) {
        return accountData.retailCategory;
      }
    }

    function showTransferMoneyLinkForRetail() {
      var linkAvailable = true;
      if(isRetail) {
        if ((accountData.retailCategory == 'RTLCD') || (accountData.retailCategory == 'RTLSA' && accountData.retirementAccountIndicator)) {
          linkAvailable = false;
        }
      }
      return linkAvailable;
    }

    function onClickTransfer() {
      if (isRetail && accountData.retirementAccountIndicator)
        $window.open(BankEnvironmentConstants.retailIraTransferMoneyUrl, '_blank');
      else {
        transferState.setCurrentLOB('BankDetails.transactions');
        $state.go('BankDetails.transfer', {
          'category': $stateParams.lineOfBusiness,
          'referenceId': accountData.accountRefId,
          'subCategory': $stateParams.subCategory
        })
      }
    }

    BankPubSubFactory.logTrackAnalyticsPageView({
      level2: 'account details',
      level3: 'more account services' // BANK-4.01
    });

    angular.extend(this, {
      modalType: modalTypeClass,
      modalClass: 'icon-more-services',
      close: function() {
      /*
       * returnFocusTo is a param in BankDetails.MoreServices state that is by
       * default null and will only be populated with an id string in the
       * clickhandler of buttons in the easeExtensibilityBar component.
       * This ensures that focus is only returned to the button in more
       * services when a customer has arrived at the more services by way of
       * triggering a click on a button in the extensibility bar and not if
       * they are deeplinked to this state.
       */
        if($stateParams.returnFocusTo){
          $window.document.getElementById($stateParams.returnFocusTo).focus();
        }
        BankPubSubFactory.logPageViewEvent({ level3: '' });
        $state.go('BankDetails.transactions');
      },
      trackLink: function(name) { // BANK-3.00, BANK-5.00
        BankPubSubFactory.logTrackAnalyticsClick(name);
      },
      transitiontoDebitFeature: function(action){
        var logText = {
           'Activate': '360:debit card activation:link',
           'LockCard': 'lock or unlock my debit card:link',
           'UnlockCard': 'lock or unlock my debit card:link',
           'ChangePin': 'debit card change pin:link',
           'OrderCard': 'report a missing or damaged card:link'
        }
        this.trackLink(logText[action]);
        var actionableDebitCardList = BankAccountDetailsFactory.getActionableDebitCards(accountData.bankCardDetails);
        $state.go('BankDetails.' + BankUrlMappings[action],{  
          'category': $stateParams.accountDetails.lineOfBusiness,
          'referenceId': accountReferenceId,
          'subCategory': $stateParams.accountDetails.subCategory,
          'actionableDebitCards': actionableDebitCardList
        });
      },
      openBillPay: function() {
        if (isBillPayLandingEnabled) {
          $state.go('BillPay.PayeeList',{
            productName: productName,
            accountReferenceId: accountReferenceId,
            subCategory: subCategory
          })
        } else {
          $window.open(this.moreServicesUrls.billPayUrl, '_blank');
        }
      },
      accountType: accountType,
      isUserCardActivated: isUserCardActivated,
      i18nMoreServices: i18nMoreServices,
      moreServicesUrls: moreServiceConstant,
      isDebitActivationEnabled: isDebitActivationEnabled,
      isRetailDebitActivationEnabled: isRetailDebitActivationEnabled,
      isDebitLockUnlockEnabled: isDebitLockUnlockEnabled,
      isDebitChangePinEnabled: isDebitChangePinEnabled,
      isDebitOrderCardEnabled: isDebitOrderCardEnabled,
      RetailAccountLinks: RetailAccountLinks,
      getRetailProductType: getRetailProductType,
      onClickTransfer: onClickTransfer,
      showTransferMoneyLinkForRetail: showTransferMoneyLinkForRetail,
      isEligibleFor: isEligibleFor
    });
  }

} //end define module function
); //end define

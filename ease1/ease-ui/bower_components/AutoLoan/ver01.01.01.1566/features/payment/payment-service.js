define(['angular'], function(angular) {
  'use strict';

  function isStateOf(stateName,$state) {
    return ($state.current.name === stateName ||
    ($state.current.parent && $state.current.parent.name === stateName));
  }


  autoLoanPaymentService.$inject = ['$state', '$injector', 'autoLoanModuleService'];
  function autoLoanPaymentService($state,
                                  $injector,
                                  autoLoanModuleService
  ) {
    var self = this;

    self.payNow = function(targetTab, areTabsHidden, paymentAccount) {

      var paymentParams = {
        'lineOfBusiness': $state.params.lineOfBusiness ? $state.params.lineOfBusiness : 'AL',
        'accountReferenceId': autoLoanModuleService.getAccountDetailsData()
          .accountDetails.accountReferenceId,
        'payment': {
          'lineOfBusiness': $state.params.lineOfBusiness ? $state.params.lineOfBusiness : 'AL',
          'isAccountDataAvailable': true,
          'tab': targetTab,
          'areTabsHidden': areTabsHidden,
          'defaultPaymentAccountData': paymentAccount
        }
      };

      if (isStateOf('AutoLoanDetails.transactions',$state)) {
        $state.go('AutoLoanPayment', paymentParams);
      } else if (isStateOf('autoLoanTracker',$state)) {
        $state.go('AutoLoanTrackerPayment', paymentParams);
      } else if (isStateOf('carPayCatchUp',$state)) {
        if ($state.current.name === 'selectPaymentAccount.AddExtAccount') {
          var carPayCatchUpService = $injector.get('carPayCatchUpService');
          carPayCatchUpService.showSelectPaymentAccount(paymentParams);
        } else {
          $state.go('CarPayCatchUpPayment', paymentParams);
        }
      }else if (isStateOf('accountSummary',$state)) {
        angular.extend(paymentParams, {
          'category': paymentParams.lineOfBusiness,
          'subCategory': 'coaf',
          'focusId': autoLoanModuleService.getFocusId()
        });

        $injector.get('TemplateSelectionFactory').payNow(paymentParams);
      }
    };

    self.isPaymentPlanEligible = function(paymentPlan) {
      if (paymentPlan && paymentPlan.notificationMessage) {
        return paymentPlan.notificationMessage.id !== '200403';
      }
      return true;
    };

    self.validateAmountInput = function(amount) {
      var formattedAmount = amount.replace(/[^.0-9]/g, '').replace(/^[.]+/g, '').replace(/[.]{2,}/g, '.');
      var decimalFormatAmt = formattedAmount.match(/\d*\.\d{0,2}/);
      return decimalFormatAmt ? decimalFormatAmt[0] : formattedAmount;
    };

    self.truncateAmountInput = function(inputAmount, maxAmount) {
      if (inputAmount > maxAmount * 10) {
        if (typeof inputAmount === 'number') {
          inputAmount += '';
        }
        inputAmount = inputAmount.substring(0, inputAmount.length - 1);

      }
      return inputAmount;
    };

    self.formatPayFrom = function(payFrom, payFromAccount) {
      if (payFrom && payFromAccount) {
        var accountNumber = payFromAccount;
        if (accountNumber.length > 4) {
          accountNumber = payFromAccount.substring(payFromAccount.length - 4, payFromAccount.length);
        }
        return payFrom + ' ...' + accountNumber;
      } else {
        return payFrom;
      }
    }
  }

  autoLoanPaymentAddAccountService.$inject = ['$rootScope', '$state', '$filter', 'autoLoanModuleService',
    'autoLoanPaymentService'];

  function autoLoanPaymentAddAccountService($rootScope, $state, $filter, autoLoanModuleService,
                                            autoLoanPaymentService) {
    var registered = false;
    var selectedTab;
    var areTabsHidden = false;

    this.registerPaymentAccountListeners = function() {
      if (!registered) {
        var addAccountLabel = autoLoanModuleService.getI18n().coaf.payment.paymentModal.addPaymentAccount.label.v1;
        if (autoLoanModuleService.isFeatureEnabled('ease.coaf.addexternalpaymentaccount')) {
          $rootScope.$on('EASE_DD_ITEM_SELECTED', function(scope, data) {
            if (!data.init && data.item && data.item.displayName === addAccountLabel) {
              if ($state.current.parent.name === 'accountSummary') {
                $state.go('SummAccPrefAddExtAccount');
              } else if ($state.current.name === 'selectPaymentAccount') {
                var targetState = $state.current.name + '.AddExtAccount';
                $state.go(targetState);
              } else {
                var targetState = $state.current.parent.name + '.AddExtAccount';
                $state.go(targetState);
              }
            }
          });

          $rootScope.$on('EXT_ACCOUNT_ADDED', function(event, paymentAccount) {
            autoLoanPaymentService.payNow(selectedTab, areTabsHidden, paymentAccount);
          });
        }

        registered = true;
      }
    };

    this.getDefaultPaymentAccountData = function(UMMPaymentFactory) {
      if ($state.params.payment
        && $state.params.payment.defaultPaymentAccountData
        && UMMPaymentFactory.getUmmData().availableAccounts) {
        var paymentAccounts = UMMPaymentFactory.getUmmData().availableAccounts;
        var defaultAccountList
          = $filter('filter')(paymentAccounts, $state.params.payment.defaultPaymentAccountData.accountNumber);

        $state.params.payment.defaultPaymentAccountData = defaultAccountList ?
          defaultAccountList[0] : null;
        return $state.params.payment.defaultPaymentAccountData;
      } else {
        return null;
      }
    };

    this.selectTab = function(tab) {
      selectedTab = tab;
      return selectedTab;
    };
    this.hideTabs = function(hide) {
      areTabsHidden = hide;
      return areTabsHidden;
    };
  }

  refreshTransactionsService.$inject = ['$state', 'autoLoanModuleService'];

  function refreshTransactionsService($state, autoLoanModuleService) {
    this.refreshTransactions = function() {
      autoLoanModuleService.setDisableMakeAPayment(true);
      var refresh = true;
      var targetState;
      if (isStateOf('AutoLoanDetails.transactions',$state)) {
        targetState = 'AutoLoanDetails.transactions';
      } else if (isStateOf('accountSummary',$state)) {
        targetState = 'accountSummary';
      } else if (isStateOf('autoLoanTracker',$state)) {
        targetState = 'autoLoanTracker';
        refresh = false;
      } else if (isStateOf('carPayCatchUp',$state)) {
        targetState = 'carPayCatchUp';
        refresh = false;
      }

      if (targetState) {
        $state.go(targetState, {}, {reload: refresh});
      }
    }
  }

  return {
    'autoLoanPaymentService': autoLoanPaymentService,
    'autoLoanPaymentAddAccountService': autoLoanPaymentAddAccountService,
    'refreshTransactionsService': refreshTransactionsService
  };
});

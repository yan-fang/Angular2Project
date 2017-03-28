define(['angular'],
  function(angular) {
    'use strict';
    var MAX_NO_OF_ACCOUNTS = 5;
    var selectAccountsCpCuPubSub = {
      level2: 'account details',
      level3: 'past due',
      level4: 'cpcu',
      level5: 'select accounts'
    };
    function SelectPaymentAccountController($state,autoLoanModuleService, carPayCatchUpService,
                                            UmmPaymentFactory,AutoLoanPubsubService) {
      var vm = this;
      vm.i18n = autoLoanModuleService.getI18n();
      AutoLoanPubsubService.trackPageView(selectAccountsCpCuPubSub);

      vm.i18nCore = autoLoanModuleService.getI18Core();
      vm.modalType = 'car-pay-catch-up-modal';
      vm.ummData = UmmPaymentFactory.getUmmData();
      var addAccountLabel = vm.i18n.coaf.payment.paymentModal.addPaymentAccount.label.v1;
      if (autoLoanModuleService.isFeatureEnabled('ease.coaf.addexternalpaymentaccount')) {
        if (vm.ummData && vm.ummData.availableAccounts) {
          var accounts = UmmPaymentFactory.getData('accountDd');
          var addAccountExists = false;
          angular.forEach(accounts,function(account) {
            if (!addAccountExists) {
              if (account.displayName === addAccountLabel) {
                addAccountExists = true;
              }
            }
          });
          if (!addAccountExists && accounts.length < MAX_NO_OF_ACCOUNTS) {
            accounts.push({
              'displayName': addAccountLabel
            });
          }
        } else {
          var accounts = [];
          accounts.push({
            'displayName': addAccountLabel
          });
          var ummData = {};
          ummData.availableAccounts = accounts;
          UmmPaymentFactory.setUmmData(ummData);
        }
      }

      vm.placeHolderFrom = UmmPaymentFactory.getUmmData().defaultBlankAccount;
      vm.from = null;
      if ($state.params.defaultAccount) {
        vm.from = $state.params.defaultAccount;
      }
      angular.extend(vm, {
        isValidDirective: {
          from: true
        },
        service: UmmPaymentFactory,
        item: null,
        initClose: false,
        modalType: 'paymentALModal',
        modalClass: 'icon-modal-dollar',
        modalRole: 'region',
        paymentFailureReason: null,
        errorMessage: null,
        ummData: UmmPaymentFactory.getUmmData(),
        getController: function() {
          return 'SelectPaymentAccountController as selectPaymentAccountController';
        }
      });

      vm.close = function() {
        carPayCatchUpService.exitSelectPaymentAccountModal();
      };

      vm.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.opened = true;
      };

      // AFTER ACCOUNTS HAS BEEN CHOSEN
      // TAKES USER TO 'REVIEW PLAN'
      vm.proceed = function() {
        // ENABLES LOADING SPINNER
        // DISABLES BUTTON
        vm.spinnerEnable = true;
        vm.disabled = true;

        carPayCatchUpService.setSelectedPaymentAccount(vm.from);

        carPayCatchUpService.setFinalCatchupPaymentsData
        (carPayCatchUpService.setPaymentAccountInfo
          (carPayCatchUpService.getFinalCatchupPaymentsData(),
            vm.from.paymentAccountReferenceId));
        $state.go('reviewPlan')

      };


      vm.verifyAccountSelection = function() {
        var accounts = UmmPaymentFactory.getData('accountDd');
        var breakLoop = false;
        var disableButton = false;
        if (!vm.from) {
          disableButton = true;
        }

        for (var i = 0; i < accounts.length && !breakLoop; i++) {
          var account = accounts[i];
          if (!breakLoop) {
            if (account.displayName === addAccountLabel && accounts.length === 1
              && vm.from.displayName === addAccountLabel) {
              disableButton = true;
              breakLoop = true;
            }
          }
        }
        return disableButton;
      }
    }
    return SelectPaymentAccountController;
  });

define(['angular'], function(angular) {
  'use strict';

  var PATH = '/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/payment/partials/';
  var MAX_NO_OF_ACCOUNTS = 5;

  AutoLoanPaymentController.$inject = ['$scope', '$state', '$timeout', 'UmmPaymentFactory', 'autoLoanModuleService',
    'autoLoanPaymentAddAccountService', 'AutoLoanPubsubService', 'autoLoanPaymentService'];

  function AutoLoanPaymentController($scope, $state, $timeout, UmmPaymentFactory, autoLoanModuleService,
                                     autoLoanPaymentAddAccountService, AutoLoanPubsubService,
                                     autoLoanPaymentService) {
    var vm = this;
    $scope.accountDetailsData = autoLoanModuleService.getAccountDetailsData();
    vm.i18n = autoLoanModuleService.getI18n();

    var paymentPlan = autoLoanModuleService.getPaymentPlan();
    var hasPaymentPlan = paymentPlan && paymentPlan.planStatus;

    var tabs = [];
    if (autoLoanModuleService.isFeatureEnabled('ease.coaf.onetimepayment')) {
      tabs.push({
        title: vm.i18n.coaf.payment.paymentModal.oneTime.label.v1,
        url: PATH + 'payment-oneTime.html',
        selection: 'OneTime',
        id: 'tab.onetime',
        ariaPressedState: true
      });
    }

    if (autoLoanModuleService.isFeatureEnabled('ease.coaf.paymentplan') &&
      autoLoanPaymentService.isPaymentPlanEligible(paymentPlan)) {
      tabs.push({
        title: vm.i18n.coaf.payment.paymentModal.recurring.label.v1,
        url: hasPaymentPlan ? PATH + 'payment-paymentPlanDetails.html'
          : PATH + 'payment-paymentPlan.html',
        selection: hasPaymentPlan ? 'RecurringDetails' : 'Recurring',
        id: 'tab.paymentplan',
        ariaPressedState: false
      });
    }

    if (autoLoanModuleService.isFeatureEnabled('ease.coaf.payoff')) {
      tabs.push({
        title: vm.i18n.coaf.payment.paymentModal.payoff.label.v1,
        url: PATH + 'payment-payoff.html',
        selection: 'Payoff',
        id: 'tab.payoff',
        ariaPressedState: false
      });
    }


    if (autoLoanModuleService.isFeatureEnabled('ease.coaf.addexternalpaymentaccount')) {
      var accounts = UmmPaymentFactory.getData('accountDd');
      var addAccountLabel = vm.i18n.coaf.payment.paymentModal.addPaymentAccount.label.v1;

      if (!accounts) {
        accounts = [];
        UmmPaymentFactory.getUmmData().availableAccounts = accounts;
      }
      if (accounts.length < MAX_NO_OF_ACCOUNTS) {
        accounts.push({
          'displayName': addAccountLabel
        });
      }
    }

    var isLoanMatured = function() {
      return new Date($scope.accountDetailsData.accountDetails.maturityDate) <
        new Date(autoLoanModuleService.getCurrentDate())
    };

    var getSelectedTab = function() {
      var selection;
      if (isLoanMatured()) {
        selection = 'Payoff';
      } else if ($state.params.payment) {
        selection = (hasPaymentPlan && $state.params.payment.tab === 'Recurring')
          ? 'RecurringDetails' : $state.params.payment.tab;
      }

      var selectedTab = tabs[0];
      if (selection) {
        for (var index in tabs) {
          if (tabs[index].selection === selection) {
            selectedTab = tabs[index];
            break;
          }
        }
      }
      autoLoanPaymentAddAccountService.selectTab(selection);
      return selectedTab;
    };

    var areTabsHidden = function() {

      if (isLoanMatured()) {
        return true;
      }

      var hidden = false;
      if ($state.params.payment) {
        hidden = $state.params.payment.areTabsHidden === true;
      }
      autoLoanPaymentAddAccountService.hideTabs(hidden);
      return hidden;
    };

    var selectedTab = getSelectedTab();

    $scope.selection = selectedTab.selection;

    angular.extend(vm, {
      close: function() {

        var isStateOf = function(stateName) {
          return ($state.current.name === stateName ||
          ($state.current.parent && $state.current.parent.name === stateName));
        };

        if (isStateOf('autoLoanTracker')) {
          AutoLoanPubsubService.trackPageView({
            level2: 'account details',
            level3: 'loan tracker'
          });

        } else if (isStateOf('AutoLoanDetails.transactions')) {
          AutoLoanPubsubService.trackPageView({
            level2: 'account details'
          });


        } else if (isStateOf('accountSummary')) {
          AutoLoanPubsubService.trackPageView({
            level2: 'account summary'
          });

        }


        vm.focusId = autoLoanModuleService.getFocusId();
        autoLoanModuleService.setDisableMakeAPayment(false);
        autoLoanModuleService.enableSpinner(false);

        $state.go($state.current.parent, {}, {location: 'replace'});
      },

      initClose: false,
      modalType: 'paymentALModal',
      modalClass: 'icon-modal-dollar',
      modalRole: 'region',
      paymentFailureReason: null,
      errorMessage: null,
      ummData: UmmPaymentFactory.getUmmData(),
      tabs: tabs,
      selection: selectedTab.selection,
      currentTab: selectedTab.url,
      areTabsHidden: areTabsHidden(),
      onClickTab: function(tab) {
        vm.currentTab = tab.url;
        vm.selection = tab.selection;
        autoLoanPaymentAddAccountService.selectTab(tab.selection);

        for (var i = 0; i < vm.tabs.length; i++) {
          vm.tabs[i].ariaPressedState = 'false';
        }
        tab.ariaPressedState = 'true';

        switch (vm.selection) {
          case 'recurringDetails':
          case 'recurring':
            vm.modalClass = 'icon-cycle';
            break;
          default:
            vm.modalClass = 'icon-modal-dollar';
        }
      },
      isActiveTab: function(tabUrl) {
        return tabUrl === vm.currentTab;
      },
      getController: function() {
        return 'AutoLoanOneTimePaymentController as alOneTime';
      }
    });

    //pubsub event

    AutoLoanPubsubService.trackPageView({
      level2: 'pay bill'
    });

    vm.clickOnElement = function(id) {
      var element = document.getElementById(id);
      if (element) {
        $timeout(function() {
          element.click();
        }, 0, false);
      }
    };


  }

  function showPastDueDisclaimer($state) {
    $state.params.fromState = $state.current.name;
    $state.go('pastDueDisclaimer', $state.params);
  }

  AutoLoanOneTimePaymentController.$inject = ['$rootScope', '$scope', '$filter', '$state', '$window',
    'UmmPaymentFactory', 'autoLoanModuleService', 'autoLoanPaymentAddAccountService', 'autoLoanPaymentService',
    'AutoLoanCalendarFactory', 'refreshTransactionsService'];

  function AutoLoanOneTimePaymentController($rootScope, $scope, $filter, $state, $window, UmmPaymentFactory,
                                            autoLoanModuleService, autoLoanPaymentAddAccountService,
                                            autoLoanPaymentService, AutoLoanCalendarFactory,
                                            refreshTransactionsService) {
    var COAF_CREATE_ONE_TIME_PAYMENT = '50006';
    var vm = this;
    var accountDetailsData = autoLoanModuleService.getAccountDetailsData();
    vm.i18n = autoLoanModuleService.getI18n();

    //THIS IS REQUIRED FOR NOW AS THIS LOCALIZATION DATA IS STILL USED IN THE EASEDROPDOWN CORE DIRECTIVE.
    // THIS CAN BE REMOVED WHEN CORE CHANGES THE USAGE.
    vm.i18nCore = autoLoanModuleService.getI18Core();

    $scope.alPay.headerText = vm.i18n.coaf.payment.paymentModal.paymentHeader.label.v1;

    vm.accountSelected = false;
    vm.dateSelected = false;


    /* Sending info to Service */
    vm.showDisclaimer = function() {
      showPastDueDisclaimer($state);
    };


    $scope.$watch(function() {
      return vm.amount;
    }, function() {
      if (!vm.amount) {
        return;
      }
      vm.hasAdditionalPrincipal = false;
      vm.hasAdditionalPrincipalVerbiage = vm.amount.type === 'totalDue' || vm.amount.type === 'currentDue';

      vm.showAmountInput = vm.amount.type === 'principalOnly' || vm.amount.type === 'otherAmnt';
      if (vm.showAmountInput && $state.current.name !== 'AutoLoanTrackerPayment') {
        vm.amount.value = '';
      }

      vm.totalPayment = 0;
      vm.additionalPrincipal = '';
      vm.amountErrorMessage = '';
    });

    $scope.$watch(function() {
      return vm.additionalPrincipal;
    }, function() {
      if (vm.hasAdditionalPrincipal) {
        vm.totalPayment = Number(vm.amount.value) + Number(vm.additionalPrincipal);
      }
    });

    angular.extend(vm, {
      isValidDirective: {
        from: true,
        amount: true,
        date: true
      },
      isAccountSelected: function() {
        return (vm.from && vm.from !== null);
      },
      isFormInvalid: function() {
        if (vm.date === null) {
          return true;

        } else if (vm.from === '' || vm.from === null || !vm.from.accountType) {
          return true;

        } else if (vm.amount === null || vm.amount === '' || vm.amount.value === null || vm.amount.value === '' ||
          vm.amount.value <= 0 || vm.isDisplayError()) {
          return true;
        }
        return false;
      },
      service: UmmPaymentFactory,
      from: autoLoanPaymentAddAccountService.getDefaultPaymentAccountData(UmmPaymentFactory),
      amount: null,
      date: null,
      ummData: null,
      item: null
    });

    var initializePayment = function() {
      vm.ummData = UmmPaymentFactory.getUmmData();
      if (vm.ummData) {
        vm.item = UmmPaymentFactory.getAccItem();
        vm.placeHolderFrom = vm.ummData.defaultBlankAccount;

        vm.placeHolderAmount = true;

        for (var i = 0; vm.ummData.availableAmounts && i < vm.ummData.availableAmounts.length; i++) {
          var item = vm.ummData.availableAmounts[i];
          vm[item.type] = item.value;
        }
        var dueDate = vm.ummData.duePaymentDate;
        vm.ummData.duePaymentDate = $filter('date')(new Date(dueDate), 'MMMM dd');
      }

      if ($state.params.payment && $state.params.payment.defaultOneTimeData) {
        vm.accountSelected = true;
        vm.dateSelected = true;
        var searchValue = {'type': 'principalOnly', 'value': ''};
        if (vm.ummData.availableAmounts) {
          vm.defaultAmountIndex = _.findIndex(vm.ummData.availableAmounts, searchValue);
          if (vm.defaultAmountIndex > 0) {
            vm.ummData.availableAmounts[vm.defaultAmountIndex].value = $state.params.payment.defaultOneTimeData.value;
          }
        }

        vm.showAmountInput = true;
        vm.hasAdditionalPrincipalVerbiage = false;
        vm.placeHolderAmount = false;
        if (vm.ummData.availableDates) {
          vm.date = $filter('date')(vm.ummData.availableDates.entries[0].paymentDate, 'MMM dd, yyyy');
        }
      }
    };

    initializePayment();

    vm.validateAmount = function() {
      vm.amountErrorMessage = '';
      vm.amount.value = autoLoanPaymentService.validateAmountInput(vm.amount.value);
      if (vm.amount.type === 'principalOnly' && vm.amount.value > accountDetailsData.accountDetails.loanBalance) {
        var errorPrincipalOnlyAmount = $filter('currency')(accountDetailsData.accountDetails.loanBalance);
        vm.amount.value = autoLoanPaymentService.truncateAmountInput(vm.amount.value,
          accountDetailsData.accountDetails.loanBalance);
        vm.amountErrorMessage = 'Amount exceeds Principal Balance. (' + errorPrincipalOnlyAmount + ')';
      } else if (vm.amount.type === 'otherAmnt') {
        var selectedDate = $filter('date')(new Date(vm.date), 'yyyy-MM-dd');
        for (var index = 0; index < vm.ummData.availableDates.entries.length; index++) {
          var item = vm.ummData.availableDates.entries[index];
          if (selectedDate === item.paymentDate && vm.amount.value > item.payOffAmount) {
            vm.amount.value = autoLoanPaymentService.truncateAmountInput(vm.amount.value, item.payOffAmount);
            var errorAmount = $filter('currency')(item.payOffAmount);
            vm.amountErrorMessage = 'Amount exceeds Payoff Amount. (' + errorAmount + ')';
            break;
          }
        }
      }
    };

    vm.checkAdditionalPrincipalAmount = function() {
      vm.amountErrorMessage = '';
      vm.additionalPrincipal = autoLoanPaymentService.validateAmountInput(vm.additionalPrincipal);
      if (Number(vm.additionalPrincipal) > accountDetailsData.accountDetails.loanBalance) {
        vm.additionalPrincipal = autoLoanPaymentService.truncateAmountInput(vm.additionalPrincipal,
          accountDetailsData.accountDetails.loanBalance);
        var errorAmount = $filter('currency')(accountDetailsData.accountDetails.loanBalance);
        vm.amountErrorMessage = 'Amount exceeds Principal Balance. (' + errorAmount + ')';
      }
    };

    vm.isDisplayError = function() {
      return (vm.amountErrorMessage && vm.amountErrorMessage.length > 0) ? true : false;
    };

    vm.showAdditionalPrincipalPaymentInput = function() {
      vm.hasAdditionalPrincipal = true;
      vm.hasAdditionalPrincipalVerbiage = false;
      vm.amountErrorMessage = '';
    };

    // popup calendar config
    vm.opened = false;


    var selectDate = function(scheduleDate) {
      var refreshAmounts = function() {
        vm.ummData.availableAmounts = $window.data.availableAmounts;
        vm.amount = null;
        UmmPaymentFactory.setUmmData(vm.ummData);
      };

      var paymentScheduleDate = $filter('date')(new Date(scheduleDate), 'yyyy-MM-dd');

      autoLoanModuleService.getNewAvailableAmounts(paymentScheduleDate, vm.item.accountRefId, refreshAmounts);

      if (vm.showAmountInput) {
        vm.showAmountInput = false;
        vm.amount.value = '';
      }
      if (vm.totalPayment > 0) {
        vm.totalPayment = 0;
      }
      if (vm.hasAdditionalPrincipal) {
        vm.hasAdditionalPrincipal = false;
      }

      vm.dateSelected = vm.date !== null;
    };

    $scope.$watch(function() {
      return vm.date;
    }, function(newValue, oldValue) {
      if (oldValue !== newValue) {
        selectDate(newValue);
      }
    });
    vm.openByKeyPress = function($event) {
      var charCode = ($event.which) ? $event.which : $event.keyCode;
      if (charCode === 32 || charCode === 13) {
        vm.open($event);
      }
    };

    vm.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.opened = true;
    };

    var availableDates = [];
    if (vm.ummData.availableDates) {
      var availableDates = vm.ummData.availableDates;
    }

    vm.calendarInlineOptions = AutoLoanCalendarFactory.getInlineOptions({
      currentDate: autoLoanModuleService.getCurrentDate(),
      dueDate: accountDetailsData.accountDetails.dueDate,
      enabledDates: _.map(availableDates.entries, function(availableDate) {
        return availableDate.paymentDate;
      })
    });

    vm.disabled = false;

    vm.makePayment = function() {
      vm.disabled = true;
      vm.ariaMakeAPaymentButtonPressed = true;
      vm.spinnerEnable = true;

      var paymentInstruction = {
        'scheduleDate': $filter('date')(new Date(vm.date), 'yyyy-MM-dd'),
        'paymentAmount': [
          {
            'paymentAmount': vm.amount.value,
            'paymentTerm': vm.amount.paymentTerm
          }
        ]
      };

      if (vm.from.paymentAccountReferenceId) {
        paymentInstruction.paymentAccountReferenceId = vm.from.paymentAccountReferenceId;
      } else {
        paymentInstruction.bankDetail = {
          'accountType': vm.from.accountType,
          'bankAccountNumber_TLNPI': vm.from.accountNumber_TLNPI,
          'abaNumber': vm.from.abaNumber,
          'accountName': vm.from.displayName
        }
      }

      if (vm.hasAdditionalPrincipal && (vm.additionalPrincipal > 0)) {
        var additionalPrincipal = {
          paymentAmount: vm.additionalPrincipal,
          paymentTerm: 'Additional_Principal'
        };
        paymentInstruction.paymentAmount.push(additionalPrincipal);
      }

      try {
        var promise = autoLoanModuleService.postPaymentInstruction(paymentInstruction, vm.item.accountRefId,
          COAF_CREATE_ONE_TIME_PAYMENT);

        promise.then(function(data) {
          if (data.notificationMessage != null) {
            $scope.alOneTime.errorMessage = data.notificationMessage.text;
            vm.disabled = false;
            vm.spinnerEnable = false;
            vm.ariaMakeAPaymentButtonPressed = '';
          } else {
            var confirmationMessage = {
              'payFrom': vm.from.displayName,
              'payFromAccount': vm.from.accountNumber,
              'payAmount': (vm.totalPayment > 0) ? vm.totalPayment : vm.amount.value,
              'payDate': $filter('date')(new Date(vm.date), 'MMMM dd yyyy'),
              'confirmCode': data.paymentInstructionId ? data.paymentInstructionId : data.paymentInstructionID
            };

            UmmPaymentFactory.setSuccessData(confirmationMessage);

            autoLoanModuleService.fetchAccountDetailData($state.params.accountReferenceId).then(function() {
              refreshTransactionsService.refreshTransactions();
              autoLoanModuleService.makePaymentSuccess();
              $scope.$modalCancel();

            });
          }
        }, function(failureReason) {
          $scope.alOneTime.errorMessage = failureReason.message;
          vm.disabled = false;
          vm.spinnerEnable = false;
          vm.ariaMakeAPaymentButtonPressed = '';

        });

      } catch (error) {
        vm.disabled = false;
        vm.spinnerEnable = false;
        vm.ariaMakeAPaymentButtonPressed = '';

      }
      return false;

    };

  }

  AutoLoanOneTimePaymentCancel.$inject = ['$scope', '$filter', '$state', 'autoLoanModuleService',
    'easeExceptionsService', 'AutoLoanPubsubService', 'refreshTransactionsService', 'autoLoanPaymentService'];

  function AutoLoanOneTimePaymentCancel($scope, $filter, $state, autoLoanModuleService,
                                        easeExceptionsService, AutoLoanPubsubService,
                                        refreshTransactionsService, autoLoanPaymentService) {
    var vm = this;
    vm.disableButton = false;
    var oneTimePaymentToCancel = autoLoanModuleService.getOneTimePaymentObjToCancel();
    vm.oneTimePaymentToCancelDetails = {
      'oneTimePaymentToCancelDate': $filter('date')(oneTimePaymentToCancel.date, 'MMMM d, yyyy'),
      'oneTimePaymentToCancelBankName': autoLoanPaymentService.formatPayFrom(oneTimePaymentToCancel.bankName,
        oneTimePaymentToCancel.fromAccountNumber),
      'transactionAmount': oneTimePaymentToCancel.transactionAmount
    };
    vm.i18n = autoLoanModuleService.getI18n();

    vm.cancelOneTimePayment = function() {
      vm.disableButton = true;
      try {
        var promise = autoLoanModuleService.deletePaymentInstruction(vm.oneTimePaymentToCancelDetails,
          autoLoanModuleService.getAccountDetailsData().accountRefId, oneTimePaymentToCancel.paymentId);

        promise.then(function(data) {
          if (data) {
            $scope.oneTimePaymentCancel.errorMessage = data.notificationMessage.text;
            vm.disableButton = false;
            $scope.$modalCancel();
            easeExceptionsService.displayErrorHadler(
              vm.i18n.coaf.payment.oneTimePaymentCancelError.errorHeader.label.v1,
              vm.i18n.coaf.payment.oneTimePaymentCancelError.errorMessage.label.v1);
          } else {
            var confirmationMessage = {
              'oneTimePaymentToCancelTransactionAmount': vm.oneTimePaymentToCancelDetails.transactionAmount,
              'oneTimePaymentToCancelDate': vm.oneTimePaymentToCancelDetails.oneTimePaymentToCancelDate
            };

            autoLoanModuleService.setOneTimePaymentObjToCancel(confirmationMessage);

            autoLoanModuleService.fetchAccountDetailData($state.params.accountReferenceId).then(function() {
              refreshTransactionsService.refreshTransactions();
              autoLoanModuleService.cancelPaymentSuccess();
              $scope.$modalCancel();
            });
          }
        }).catch(function(error) {
          $scope.oneTimePaymentCancel.errorMessage = error.message;
          vm.disableButton = false;
          $scope.$modalCancel();
          easeExceptionsService.displayErrorHadler(
            vm.i18n.coaf.payment.oneTimePaymentCancelError.errorHeader.label.v1,
            vm.i18n.coaf.payment.oneTimePaymentCancelError.errorMessage.label.v1);
        });
      } catch (error) {
        $scope.oneTimePaymentCancel.errorMessage = error.message;
        vm.disableButton = false;
        $scope.$modalCancel();
        easeExceptionsService.displayErrorHadler(
          vm.i18n.coaf.payment.oneTimePaymentCancelError.errorHeader.label.v1,
          vm.i18n.coaf.payment.oneTimePaymentCancelError.errorMessage.label.v1);
      }
    };

    vm.isButtonDisabled = function() {
      return vm.disableButton;
    };

    angular.extend(vm, {
      modalType: 'cancelModal',
      modalClass: 'icon-modal-dollar',
      modalRole: 'region',
      confirm: function() {
        //$state.go('AutoLoanDetails.transactions.cancelConfirm', {}, {location: 'replace'});
      }
    });

    AutoLoanPubsubService.trackPageView({
      level2: 'cancel payment',
      level3: 'one time'
    });

  }

  AutoLoanPaymentCancelSuccess.$inject = ['autoLoanModuleService', 'AutoLoanPubsubService'];

  function AutoLoanPaymentCancelSuccess(autoLoanModuleService, AutoLoanPubsubService) {
    var vm = this;
    vm.i18n = autoLoanModuleService.getI18n();

    angular.extend(vm, {
      modalType: 'successModal',
      modalClass: 'icon-check',
      modalRole: 'region',
      close: function() {
      }
    });
    vm.cancelOneTimePaymentSuccessDetails = autoLoanModuleService.getOneTimePaymentObjToCancel();
    vm.makeAPaymentEnabled = autoLoanModuleService.isFeatureEnabled('ease.coaf.makeapayment');


    AutoLoanPubsubService.trackPageView({
      level2: 'cancel payment',
      level3: 'one time',
      level4: 'confirmation'
    });

  }

  AutoLoanPaymentDetails.$inject = ['$state', 'i18nData', 'AutoLoanPubsubService', 'autoLoanModuleService',
    'autoLoanPaymentService'];

  function AutoLoanPaymentDetails($state, i18nData, AutoLoanPubsubService, autoLoanModuleService,
                                  autoLoanPaymentService) {

    var vm = this;
    vm.i18n = i18nData;

    /* Sending info to Service */
    vm.showDisclaimer = function() {
      showPastDueDisclaimer($state);
    };


    angular.extend(vm, {
      close: function() {

        AutoLoanPubsubService.trackPageView({
          level2: 'account details',
          level3: 'payment details'
        });

        $state.go('AutoLoanDetails.transactions', {}, {location: 'replace'});
      },
      makeAPaymentLink: function() {
        autoLoanModuleService.setDisableMakeAPayment(true);
        autoLoanPaymentService.payNow();
      }
      ,
      modalType: 'alPaymentDetailsModal',
      modalClass: 'icon-modal-dollar',
      modalRole: 'region',
      cancel: function() {
        $state.go('AutoLoanDetails.transactions', {}, {location: 'replace'});
      }
    });

    AutoLoanPubsubService.trackPageView({
      level2: 'account details',
      level3: 'payment details'
    });
  }

  AutoLoanPaymentSuccessController.$inject = ['$scope', '$filter', 'autoLoanModuleService', 'UmmPaymentFactory',
    'AutoLoanPubsubService', 'autoLoanPaymentService'];

  function AutoLoanPaymentSuccessController($scope, $filter, autoLoanModuleService, UmmPaymentFactory,
                                            AutoLoanPubsubService, autoLoanPaymentService) {
    var vm = this;
    vm.i18n = autoLoanModuleService.getI18n();
    $scope.accountDetailsData = autoLoanModuleService.getAccountDetailsData();

    vm.isCancelPayoffLinkEnabled = autoLoanModuleService.isFeatureEnabled('ease.coaf.cancelonetimepayment');


    vm.cancelPayoffPayment = function() {
      $scope.$modalCancel();
      var payoffDetailsToCancel = UmmPaymentFactory.getSuccessData();
      payoffDetailsToCancel.date = payoffDetailsToCancel.paymentDate;
      payoffDetailsToCancel.fromAccountNumber = payoffDetailsToCancel.displayAccountNumber;
      payoffDetailsToCancel.transactionAmount = payoffDetailsToCancel.payoffAmount;
      autoLoanModuleService.setOneTimePaymentObjToCancel(payoffDetailsToCancel);
      autoLoanModuleService.oneTimePaymentCancel();
    };


    angular.extend(vm, {

      close: function() {
        autoLoanModuleService.setDisableMakeAPayment(false);
        autoLoanModuleService.enableSpinner(false);
      },

      modalType: 'successModal',
      modalClass: 'icon-check',
      modalRole: 'region',
      successMsg: UmmPaymentFactory.getSuccessData()
    });


    vm.successMsg.payDate = $filter('date')(new Date(vm.successMsg.payDate), 'yyyy-MM-dd');
    var successMsg = UmmPaymentFactory.getSuccessData();
    successMsg.payFromTxt = autoLoanPaymentService.formatPayFrom(successMsg.payFrom, successMsg.payFromAccount);
    var paymentOption = 'payoff';
    if (!successMsg.payoffAmount) {
      paymentOption = 'one time';
    }

    AutoLoanPubsubService.trackPageView({
      level2: 'pay bill',
      level3: paymentOption,
      level4: 'confirmation'
    });
  }

  return {
    'AutoLoanPaymentController': AutoLoanPaymentController,
    'AutoLoanOneTimePaymentController': AutoLoanOneTimePaymentController,
    'AutoLoanOneTimePaymentCancel': AutoLoanOneTimePaymentCancel,
    'AutoLoanPaymentCancelSuccess': AutoLoanPaymentCancelSuccess,
    'AutoLoanPaymentDetails': AutoLoanPaymentDetails,
    'AutoLoanPaymentSuccessController': AutoLoanPaymentSuccessController
  };
});

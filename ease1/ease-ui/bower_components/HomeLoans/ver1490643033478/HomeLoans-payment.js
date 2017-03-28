define(['angular'], function (angular) {
  'use strict';
  var HomeLoansPaymentModule = angular.module('UMMPaymentModule');
  HomeLoansPaymentModule.controller('HomeLoansPaymentController',
    function (
      $scope, $controller, $filter, $state, EaseLocalizeService, UmmPaymentFactory,
      HomeLoansUtils, homeLoansAccountDetailsService, easeExceptionsService, HomeLoansProperties,$rootScope,TemplateSelectionFactory) {
      var vm = this;
      var accountDetailsData = homeLoansAccountDetailsService.getAccountDetailsData();
      $scope.accountDetailsData = accountDetailsData;
      var data = UmmPaymentFactory.getUmmData();
      data.availableAmounts = accountDetailsData.accountDetails.paymentOptions;
      UmmPaymentFactory.setUmmData(data);
      vm.i18n = homeLoansAccountDetailsService.getI18n();
      var payOptions = HomeLoansProperties.getPaymentOptions();
      var failStrings = HomeLoansProperties.getPaymentFailureStrings();
      var productProperties = HomeLoansProperties.getProperties();
      var paymentType = HomeLoansProperties.getPaymentType();
      var invalidPaymentInput = false;
      var initialAmountLoad = true;
      var productCategory = homeLoansAccountDetailsService.getProductCategory();
      var inProgress = false;
      var amountArray = [];
      HomeLoansUtils.analyticsTracking('pay bill', '', '');
      var i18n = homeLoansAccountDetailsService.getI18n();
      vm.i18nCore = {};
      vm.i18nCore[payOptions.amountDuePrincipal] = i18n.payment.totalDueAndPrincipal;
      vm.i18nCore[payOptions.amountDue] = i18n.payment.totalDue;
      vm.i18nCore[payOptions.partialPayment] = i18n.payment.partial;
      vm.i18nCore[payOptions.principalOnly] = i18n.payment.principalOnly;
      vm.i18nCore.amountSymbol = i18n.payment.amountSymbol;
      //Variables/functions from the parent controller can be added and overridden here
      angular.extend(vm, {
        showDynamicPaymentLabel        : false,
        dynamicPaymentLabel            : '',
        loadingMakePayment             : '',
        disablePayment                 : '',
        ariaLabelMakePaymentButton     : i18n.payment.ariaLabelMakePaymentButtonEnabled,
        paymentFailureReason           : '',
        previousPayFromAccount         : '',
        previousPaymentOption          : '',
        defaultPayFrom                 : 0,
        defaultAmount                  : 0,
        additionalAmountInput          : '',
        modalType                      : 'paymentModal',
        modalClass                     : 'icon-modal-dollar',
        service                        : UmmPaymentFactory,
        lineOfBusiness                 : $state.params.lineOfBusiness,
        day                            : {},
        dueDay                         : '',
        nextDateValue                  : '',
        startingDay                    : '',
        recurringScheduled             : '',
        scheduledAmount                : '',
        scheduledDate                  : '',
        scheduledFrequency             : '',
        scheduledAccno                 : '',
        scheduledDay                   : '',
        scheduledPrincipalAmount       : '',
        onetime                        : 'onetime',
        recurring                      : 'recurring',
        afterDate                      : false,
        paymentTypeOption              : '',
        recurringPaymentEnabled        : accountDetailsData.features.recurringPaymentEnabled,
        productType                    : productCategory,
        paymentFrequency               : '',
        amountHlc                      : {},
        ariaLabelRecurringPaymentButton: i18n.payment.ariaLabelStartRecurringPaymentButtonEnabled,
        productName                    : '',
        isBiweeklyFlag                 : false,
        isPushDateFlag                 : false,
        isPreviousRecurring            : false,
        isInterestOnlyOrInDraw         : false,
        isPastDueFlag                  : false,
        dueDateArray                   : [],
        paymentTypeTab                 : true,
        buttonDisabled                 : false,
        close                          : function () {
          homeLoansAccountDetailsService.setDisableMakeAPayment(false);
          HomeLoansUtils.landingPageEvent();
          $scope.inProgress = false;
          // if the payment was made, then refresh the page when closing the modal
          if (UmmPaymentFactory.getSuccessData() != null && UmmPaymentFactory.getSuccessData().reloadPage) {
            UmmPaymentFactory.setSuccessData(null);
              // reload the state as payment was success and clear out the successdata as modal is being closed.
              $state.go($state.current.parent.name, {}, {reload: 'true'});
          } else { // just load the page, there is no change in the data.
            UmmPaymentFactory.setSuccessData(null);
            $state.go($state.current.parent.name, {}, {location: 'replace'});
          }
        },
        getIndexFromAmountDD           : function (paymentOption) {
          var paymentOptions = vm.ummData.availableAmounts;
          for (var key in paymentOptions) {
            if (paymentOptions[key].type === paymentOption) {
              return key;
            }
          }
        },
        getIndexFromPayDD              : function (accountNumber) {
          var paymentOptions = vm.ummData.availableAccounts;
          for (var key in paymentOptions) {
            if (paymentOptions[key].accountNumber === accountNumber) {
              return key;
            }
          }
        },
        getRecurringPaymentTypeOption  : function () {
          var recurringOptions = [];
          var paymentOptionAmountRecur = {type: 'amountDue', value: vm.loanAccountPaymentInfo.basePaymentDueAmount};
          var paymentOptionAmountDuePrincRecur = {
            type : 'amountDuePrincipal',
            value: vm.loanAccountPaymentInfo.basePaymentDueAmount
          };
          recurringOptions.push(paymentOptionAmountRecur);
          recurringOptions.push(paymentOptionAmountDuePrincRecur);
          return recurringOptions;
        },
        initializePayment              : function () {
          //marking the make a payment button status as complete.
          homeLoansAccountDetailsService.setInProgress(false);
          if (productCategory == 'MLA') {
            vm.loanAccountPaymentInfo = accountDetailsData.accountDetails.mortgageAccount.loanAccountPaymentInfo;
            vm.loanAccountBalanceInfo = accountDetailsData.accountDetails.mortgageAccount.loanAccountBalanceInfo;
            vm.productName = accountDetailsData.accountDetails.mortgageAccount.productName;
            vm.isInterestOnlyOrInDraw = accountDetailsData.accountDetails.mortgageAccount.interestOnlyOrInDraw;
          }
          else {
            vm.loanAccountPaymentInfo = accountDetailsData.accountDetails.homeEquityLoanAccount.loanAccountPaymentInformation;
            vm.loanAccountBalanceInfo = accountDetailsData.accountDetails.homeEquityLoanAccount.loanAccountBalanceInformation;
            vm.productName = accountDetailsData.accountDetails.homeEquityLoanAccount.productName;
            vm.isInterestOnlyOrInDraw = accountDetailsData.accountDetails.homeEquityLoanAccount.interestOnlyOrInDraw;
          }
          vm.ummData = UmmPaymentFactory.getUmmData();
          vm.item = UmmPaymentFactory.getAccItem();
          vm.previousPaymentData = UmmPaymentFactory.getSuccessData();
          vm.paymentTypeOption = vm.onetime;
          vm.isPastDueFlag = vm.loanAccountPaymentInfo.pastDueFlag;
          if (vm.previousPaymentData != null) {
            var paymentOption = vm.previousPaymentData.editPaymentInfo.paymentTypeOption;
            vm.togglePaymentOptions(paymentOption);
            vm.defaultPayFrom = vm.getIndexFromPayDD(vm.previousPaymentData.editPaymentInfo.previousPayFromAccount);
            vm.defaultAmount = vm.getIndexFromAmountDD(vm.previousPaymentData.editPaymentInfo.previousPaymentOption);
            vm.additionalAmountInput = vm.previousPaymentData.editPaymentInfo.previousInputAmount;
            if (paymentOption == vm.recurring) {
              vm.isPreviousRecurring = true;
              vm.modelRecSubmitButton = i18n.payment.updateRecurringPayment;
            }
            else {
              vm.modelSubmitButton = i18n.payment.editAPaymentButton;
            }
            vm.modelTitle = i18n.payment.editAPaymentLabel;
          }
          else {
            vm.modelTitle = i18n.payment.makeAPaymentLabel;
            vm.modelSubmitButton = i18n.payment.makeAPaymentButton;
            vm.modelRecSubmitButton = i18n.payment.startRecurringPayment;
          }
          vm.validateInputData();
          vm.addExternalAccount();
          var recurringPaymentTransaction = vm.getRecurringPaymentTransaction();
          if (accountDetailsData.features.recurringPaymentEnabled) {
            vm.paymentFrequency = vm.loanAccountPaymentInfo.paymentFrequency;
            vm.startingDay = vm.getStartingDay();
            vm.checkScheduledTransaction(recurringPaymentTransaction);
            if (vm.previousPaymentData != null && vm.previousPaymentData.editPaymentInfo.editPayment != null) {
              vm.paymentTypeTab = !vm.previousPaymentData.editPaymentInfo.editPayment;//hide if coming from transactions
            }
          }
          else {
            vm.paymentTypeTab = false;
          }
          homeLoansAccountDetailsService.setLoadingPayment(false);
        },
        isFormValid                    : function () {
          for (var item in vm.isValidDirective) {
            if (!vm.isValidDirective[item]) {
              return false;
            }
          }
          return true;
        },
        isValidDirective               : {
          from  : true,
          amount: true,
          date  : true
        },
        paymentFailedState             : function (reason, disablePaymentButton) {
          vm.paymentFailureReason = reason;
          vm.disablePayment = disablePaymentButton;
        },
        validateInputData              : function () {
          //If effective dates is null/empty or availableAccounts is null/empty or payment options is null/empty...
          // fail with API failure
          vm.date = null;
          if (accountDetailsData.accountDetails.effectiveDates != null &&
            accountDetailsData.accountDetails.effectiveDates.entries != null &&
            accountDetailsData.accountDetails.effectiveDates.entries.length > 0 &&
            accountDetailsData.accountDetails.effectiveDates.entries[0].availablePaymentDate != null) {
            // there is no effective date.
            vm.date = accountDetailsData.accountDetails.effectiveDates.entries[0].availablePaymentDate;
          } else {
            vm.paymentFailedState(failStrings.apiFailure, 'disablePaymentButton');
          }
          // transfer accounts are unavailable. hence disabling the payment button.
          if (vm.ummData == null || vm.ummData.availableAccounts == null || vm.ummData.availableAccounts.length <= 0 ||
            vm.ummData.availableAmounts == null || vm.ummData.availableAmounts.length <= 0) {
            //API Failure
            vm.paymentFailedState(failStrings.apiFailure, 'disablePaymentButton');
          }
          else if (vm.ummData.partialResponse === true) {
            vm.paymentFailedState(failStrings.partialSuccess, '');
          }
          // disabling the make a payment button if the only options are principal and partial.
          if (accountDetailsData.accountDetails.paymentOptions == null ||
            accountDetailsData.accountDetails.paymentOptions.length == 0) {
            console.log("no payment options");
            vm.disablePayment = 'disablePaymentButton';
          }else if (accountDetailsData.accountDetails.paymentOptions[0].type == 'principal_Only'
            || accountDetailsData.accountDetails.paymentOptions[0].type == 'other') {
            console.log(accountDetailsData.accountDetails.paymentOptions[0]);
            vm.disablePayment = 'disablePaymentButton';
          }
        },
        addExternalAccount : function(){
          //this method is to add the add External account as one of the options into the payment accounts.
          if(!accountDetailsData.features.addAccountEnabled){
            // if not enabled, dont provide option to add account.
            return;
          }
          var accounts = UmmPaymentFactory.getData('accountDd');
          var addAccountLabel = vm.i18n.payment.addAccount;

          if (!accounts) {
            accounts = [];
            UmmPaymentFactory.getUmmData().availableAccounts = accounts;
          }
          if(accounts.length > 0 && (accounts[accounts.length -1].displayName === addAccountLabel)){
            //Add account was an option so skip adding the add account link
            console.log(accounts[accounts.length -1].displayName);
            return;
          }
          accounts.push({
            'displayName': addAccountLabel
          });
        },
        removeCurrencySign             : function (moneyAmount) {
          if (moneyAmount !== null) {
            if (moneyAmount.charAt(0) == "$") {
              return moneyAmount.slice(1);
            }
            else {
              return moneyAmount;
            }
          }
        },
        getPaymentAmounts              : function () {

          //Set the amounts for the request payload
          var paymentAmounts = {
            totalPaymentAmount    : 0,
            principalPaymentAmount: 0
          };
          switch (vm.amount.type) {
            case(payOptions.amountDue):
            {
              paymentAmounts.totalPaymentAmount = vm.amount.value;
              break;
            }
            case(payOptions.amountDuePrincipal):
            {
              paymentAmounts.totalPaymentAmount = vm.amount.value;
              paymentAmounts.principalPaymentAmount = vm.removeCurrencySign(vm.additionalAmountInput);
              break;
            }
            case(payOptions.principalOnly):
            {
              paymentAmounts.principalPaymentAmount = vm.removeCurrencySign(vm.additionalAmountInput);
              break;
            }
            case(payOptions.partialPayment):
            {
              //TODO: payments of amount 0 are permissible?
              paymentAmounts.totalPaymentAmount = vm.removeCurrencySign(vm.additionalAmountInput);
              break;
            }
          }
          return paymentAmounts;
        },
        isRecurringSelected            : function () {
          return (vm.paymentTypeOption == vm.recurring && vm.recurringPaymentEnabled)
        },
        selectAmountsArray             : function (type) {
          if (amountArray.length > 0) {
            for (var i = 0; i < amountArray.length; i++) {
              if (amountArray[i].type == type) {
                vm.amountHlc = amountArray[i];
              }
            }
          }
        },
        selectDueDateArray             : function (effectiveDate, fromTransactions, fromModelEdit, suffixDay) {
          if (vm.dueDateArray.length > 1) {
            if (fromTransactions || fromModelEdit) {
              suffixDay = vm.getSuffixDay(effectiveDate);
            }
            var selectedDays = [];
            for (var i = 0; i < vm.dueDateArray.length; i++) {
              if (vm.dueDateArray[i].suffix == suffixDay) {
                selectedDays.push(vm.dueDateArray[i]);
                vm.day = vm.dueDateArray[i];
                vm.dueDay = vm.dueDateArray[i].dayValue;
                break;
              }
            }
          }
          return selectedDays;
        },
        togglePaymentOptions           : function (paymentTypeOption) {
          if (accountDetailsData.features.recurringPaymentEnabled) {
            vm.paymentTypeOption = paymentTypeOption;
            //vm.recurringScheduled = '';
            vm.additionalAmountInput = "";
            var data = UmmPaymentFactory.getUmmData();
            if (vm.paymentTypeOption == vm.recurring) {
              //Site Catalyst analytics
              HomeLoansUtils.buttonClicked('recurring payment');
              data.availableAmounts = vm.getRecurringPaymentTypeOption();
              vm.checkScheduledTransaction(vm.getRecurringPaymentTransaction());
              vm.i18nCore[payOptions.amountDuePrincipal] = i18n.payment.amountDuePrinc;
              vm.i18nCore[payOptions.amountDue] = i18n.payment.amountDueOnly;
              if (vm.amountHlc.value == i18n.payment.amountDuePrinc && amountArray.length > 0) {
                vm.amountHlc = amountArray[0];
              }
            }
            else {
              data.availableAmounts = accountDetailsData.accountDetails.paymentOptions;
              vm.i18nCore[payOptions.amountDuePrincipal] = i18n.payment.totalDueAndPrincipal;
              vm.i18nCore[payOptions.amountDue] = i18n.payment.totalDue;
            }
            vm.validateInputData();
            UmmPaymentFactory.setUmmData(data);
          }
        },
        isBiWeekly                     : function () {
          if (vm.paymentFrequency == 'BiWeekly') {
            vm.isBiweeklyFlag = true;
          }
          return vm.isBiweeklyFlag;
        },
        isPushDate                     : function () {
          return vm.isPushDateFlag;
        },
        isBiWeeklyPushDate             : function () {
          return (vm.isBiWeekly() && vm.isPushDate());
        },
        isBiWeeklyTrueNotPushDate      : function () {
          return (vm.isBiWeekly() && !vm.isPushDate());
        },
        isNotBiWeeklyPushDateTrue      : function () {
          return (!vm.isBiWeekly() && vm.isPushDate());
        },
        isNotBiWeeklyNotPushDate       : function () {
          return (!vm.isBiWeekly() && !vm.isPushDate());
        },
        isShowSubmitOrEditPayment      : function () {
          var isShowSubmitOrEditPayment = false;
          if (vm.paymentTypeOption == vm.onetime) {
            isShowSubmitOrEditPayment = true;
          }
          else if (vm.isRecurringSelected() && !vm.isPastDueFlag && vm.recurringScheduled !== 'yes') {
            isShowSubmitOrEditPayment = true;
          }
          return isShowSubmitOrEditPayment;
        },
        isShowRecurringScheduled       : function () {
          return (vm.isRecurringSelected() && vm.recurringScheduled == 'yes' && !vm.isPastDueFlag);
        },
        isShowRecurringPastDue         : function () {
          return (vm.isRecurringSelected() && vm.recurringScheduled == '' && vm.isPastDueFlag);
        },
        getRecurringPaymentTransaction : function () {
          if (accountDetailsData.transactions.scheduled !== undefined &&
            (accountDetailsData.transactions.scheduled.length > 0) && (vm.previousPaymentData == null) && !vm.isPastDueFlag) {
            var scheduledTrx = accountDetailsData.transactions.scheduled;
            var scheduledRecurringTrx = null;
            for (var i = 0; i < scheduledTrx.length; i++) {
              if (scheduledTrx[i].recurringPaymentDraft) {
                vm.recurringScheduled = 'yes';
                scheduledRecurringTrx = scheduledTrx[i];
                vm.scheduledDate = scheduledRecurringTrx.effectiveDate;
                vm.scheduledAmount = scheduledRecurringTrx.transactionAmount;
                break;
              }
            }
          }
          return scheduledRecurringTrx;
        },
        // function to populate the UMMPayments.successData when there is an scheduled transaction for the account.
        checkScheduledTransaction      : function (scheduledRecurringTrx) {
          if (accountDetailsData.features.recurringPaymentEnabled) {
            if (scheduledRecurringTrx != null) {
              vm.paymentTypeOption = vm.recurring;
            }
            var previousPaymentOption = '';
            var previousInputAmount = null;
            if (vm.recurringScheduled == 'yes' && scheduledRecurringTrx !== null) {
              if (scheduledRecurringTrx.additionalPrincipalAmount == undefined ||
                scheduledRecurringTrx.additionalPrincipalAmount == null) {
                scheduledRecurringTrx.additionalPrincipalAmount = 0;
              }
              if (scheduledRecurringTrx.additionalPrincipalAmount > 0) {
                previousPaymentOption = 'amountDuePrincipal';
                previousInputAmount = '$' + scheduledRecurringTrx.additionalPrincipalAmount;
              }
              else {
                previousPaymentOption = 'amountDue';
                previousInputAmount = null;
              }
              vm.isPushDateFlag = scheduledRecurringTrx.pushedDateFlag;
              var confirmationMessage = {
                'payFromAccountNumber': scheduledRecurringTrx.fromAccountNumber,
                'payAmount'           : vm.scheduledAmount,
                'payDate'             : vm.scheduledDate,
                'principalOnly'       : scheduledRecurringTrx.additionalPrincipalAmount,
                'basePaymentDue'      : vm.loanAccountPaymentInfo.basePaymentDueAmount,
                'dueDay'              : HomeLoansUtils.getDateValue(i18n, accountDetailsData.features.recurringPaymentEnabled,
                    vm.loanAccountPaymentInfo.nextPaymentDate, vm.scheduledDate, vm.paymentFrequency,
                    accountDetailsData.accountDetails.datePushed),
                'nextDate'            : vm.nextDateValue,
                'frequency'           : vm.loanAccountPaymentInfo.paymentFrequency,
                'afterDate'           : false,
                'backPage'            : true,
                'isPushedDate'        : vm.isPushDateFlag,
                'editPaymentInfo'     : {
                  'accountReferenceId'    : homeLoansAccountDetailsService.getAccountRefId(),
                  'productType'           : productCategory,
                  'paymentTypeOption'     : vm.paymentTypeOption,
                  'transactionId'         : scheduledRecurringTrx.transactionId,
                  'isExternal'            : scheduledRecurringTrx.externalPayment,
                  'fromTransactions'      : false,
                  'fromModelEdit'         : false,
                  'previousPaymentOption' : previousPaymentOption,
                  'previousInputAmount'   : previousInputAmount,
                  'previousPayFromAccount': scheduledRecurringTrx.fromAccountNumber,
                  'suffix'                : '',
                  'editPayment'           : true
                }
              };
              UmmPaymentFactory.setSuccessData(confirmationMessage);
              homeLoansAccountDetailsService.setPaymentInfoData(confirmationMessage);
            }
          }
        },
        getStartingDay                 : function () {
          if (accountDetailsData.features.recurringPaymentEnabled) {
            var nextPaymentDateStr = vm.loanAccountPaymentInfo.nextPaymentDate;
            return vm.getSuffixDay(nextPaymentDateStr);
          }
        },
        getSuffixDay                   : function (nextPaymentDateStr) {
          if (accountDetailsData.features.recurringPaymentEnabled) {
            if (nextPaymentDateStr !== undefined && nextPaymentDateStr.length >= 10) {
              var nextday = HomeLoansUtils.subtractDay(nextPaymentDateStr);
              if (parseInt(nextday) < 10 && nextday.length > 1) {
                nextday = nextday.substring(1, nextday.length);
              }
              nextday = parseInt(nextday);
              return HomeLoansUtils.getSuffixNextDay(nextday, i18n);
            }
          }
        },
        populatedueDateValues          : function () {
          if (accountDetailsData.features.recurringPaymentEnabled) {
            if (vm.dueDateArray.length < 1) {
              var nextPaymentDateStr = vm.loanAccountPaymentInfo.nextPaymentDate;
              var nextday = HomeLoansUtils.subtractDay(nextPaymentDateStr);
              var displayVar = '';
              var dayValue = '';
              if (vm.paymentFrequency == 'BiWeekly') {
                var suffixDay = vm.getSuffixDay(vm.loanAccountPaymentInfo.nextPaymentDate);
                displayVar = i18n.payment.frequencyDueDate;
                day = {
                  'name': displayVar, 'value': 0, 'display': displayVar, 'dayValue': suffixDay,
                  'suffix'                                                         : suffixDay
                };
                vm.dueDateArray.push(day);
              }
              else {
                var graceDays = parseInt(vm.loanAccountPaymentInfo.gracePeriodDays) + 1;
                var day = {};
                vm.nextDateValue = nextday;
                if (nextday > 13) {
                  for (var i = 0; i < graceDays; i++) {
                    if (i != 0) {
                      nextday = parseInt(nextday) + 1;
                    }
                    if (i == 0) {
                      displayVar = i18n.payment.frequencyDueDate;
                    }
                    else {
                      displayVar = i + ' ' + i18n.payment.daysPastDue;
                    }
                    var suffixDay = HomeLoansUtils.getSuffixNextDay(nextday, i18n);
                    day = {
                      'name': displayVar, 'value': i, 'display': displayVar, 'dayValue': displayVar,
                      'suffix'                                                         : suffixDay
                    };
                    vm.dueDateArray.push(day);
                  }
                  vm.afterDate = true;
                }
                if (nextday <= 13) {
                  if (parseInt(nextday) < 10 && nextday.length > 1) {
                    nextday = nextday.substring(1, nextday.length);
                  }
                  for (var i = 0; i < graceDays; i++) {
                    if (i != 0) {
                      nextday = parseInt(nextday) + 1;
                    }
                    dayValue = HomeLoansUtils.getSuffixNextDay(nextday, i18n);
                    if (i == 0) {
                      displayVar = i18n.payment.frequencyDueDate + '(' + dayValue + ')';
                    }
                    else {
                      displayVar = i + ' ' + i18n.payment.daysPastDue + '(' + dayValue + ')';
                    }
                    day = {
                      'name': displayVar, 'value': i, 'display': displayVar, 'dayValue': dayValue,
                      'suffix'                                                         : dayValue
                    };
                    vm.dueDateArray.push(day);
                  }
                }
              }
              if (vm.dueDateArray != null && vm.dueDateArray.length > 0) {
                vm.day = vm.dueDateArray[0];
                vm.dueDay = vm.dueDateArray[0].dayValue;
              }
            }
            if (vm.dueDateArray.length > 1 && vm.isPreviousRecurring) {
              vm.selectDueDateArray(vm.previousPaymentData.payDate,
                vm.previousPaymentData.editPaymentInfo.fromTransactions, vm.previousPaymentData.editPaymentInfo.fromModelEdit,
                vm.previousPaymentData.editPaymentInfo.suffix);
            }
            return vm.dueDateArray;
          }
        },
        populatedueDateValuesSelected  : function (day) {
          if (accountDetailsData.features.recurringPaymentEnabled) {
            //Site Catalyst
            HomeLoansUtils.buttonAnalytics({
              name         : 'recurring date',
              accountAction: day.display
            });
            vm.day = day;
            var selectedDays = [];
            vm.dueDateArray.forEach(function (day) {
              if (vm.dueDateArray.indexOf(day.value) != -1) {
                selectedDays.push(day);
              }
            });
            vm.dueDay = day.display;
            return selectedDays;
          }
        },
        populateAmountshlc             : function () {
          if (amountArray.length < 1 && accountDetailsData.features.recurringPaymentEnabled) {
            var amountDue = {
              'type'   : payOptions.amountDue,
              'name'   : i18n.payment.amountDueOnly,
              'value'  : i18n.payment.amountDueOnly,
              'display': i18n.payment.amountDueOnly
            };
            var amountDuePrincipal = {
              'type'   : payOptions.amountDuePrincipal,
              'name'   : i18n.payment.amountDuePrinc,
              'value'  : i18n.payment.amountDuePrinc,
              'display': i18n.payment.amountDuePrinc
            };
            amountArray.push(amountDue);
            amountArray.push(amountDuePrincipal);
            vm.amountHlc = amountArray[0];
          }
          if (amountArray.length > 1 && accountDetailsData.features.recurringPaymentEnabled
            && vm.isPreviousRecurring) {
            vm.selectAmountsArray(vm.previousPaymentData.editPaymentInfo.previousPaymentOption);
          }
          return amountArray;
        },
        populateAmountshlcSelected     : function (amount) {
          vm.amountHlc = amount;
          vm.amount = amount;
          if (amount.value == i18n.payment.amountDuePrinc) {
            vm.dynamicPaymentLabel = i18n.payment.additionalPrincAmt;
            vm.ariaLabelRecurringPaymentButton = i18n.payment.ariaLabelStartRecurringPaymentButtonDisabled;
            // reseting principal amount to empty for recurring payment
            var numericAdditionalAmountInput = vm.removeCurrencySign(vm.additionalAmountInput);
            if (vm.paymentTypeOption != vm.onetime
              && (numericAdditionalAmountInput <= 0
              || !HomeLoansUtils.isANumber(numericAdditionalAmountInput))) {
              vm.disablePayment = 'disablePaymentButton';
              vm.additionalAmountInput = "";
            }
            else {
              vm.disablePayment = '';
            }
          }
          else {
            vm.dynamicPaymentLabel = '';
          }
          var selectedAmount = [];
          amountArray.forEach(function (amount) {
            if (amountArray.indexOf(amount.value) != -1) {
              selectedAmount.push(amount);
            }
          });
          return selectedAmount;
        },
        cancelScheduled                : function () {
          $scope.$modalCancel();
          homeLoansAccountDetailsService.paymentCancel();
        },
        editScheduled                  : function () {
          $scope.$modalCancel();
          var data = homeLoansAccountDetailsService.getPaymentInfoData();
          data.editPaymentInfo.fromModelEdit=true;
          UmmPaymentFactory.setSuccessData(data);
          homeLoansAccountDetailsService.paymentEditSetup();
        },
        disableDropDown                : function () {
          return false;
        },
        isProductHlcOrArm              : function () {
          return vm.isInterestOnlyOrInDraw;
        },
        getAriaLableForPaymentButton   : function () {
          if (vm.paymentTypeOption == vm.onetime) {
            return vm.ariaLabelMakePaymentButton;
          }
          else if (vm.paymentTypeOption == vm.recurring) {
            return vm.ariaLabelRecurringPaymentButton;
          }
        },
        isShowStartRecurring           : function () {
          return (!vm.isPreviousRecurring && vm.isRecurringSelected());
        },
        isShowUpdateRecurring          : function () {
          return (vm.isPreviousRecurring && vm.isRecurringSelected());
        },
        validatePaymentForm     : function () {
          vm.buttonDisabled = false; // enabling the button as user as entered data.
          vm.ariaLabelMakePaymentButton = i18n.payment.ariaLabelMakePaymentButtonEnabled;
          vm.ariaLabelRecurringPaymentButton = i18n.payment.ariaLabelStartRecurringPaymentButtonEnabled;
          var inputAmountField = document.getElementById('additionalPrincipal');
          if (inputAmountField != null) {
            inputAmountField.setAttribute("aria-invalid", "false");
          }
          vm.ariaDescribedByAdditionalPrincipal = null;
          vm.validationErrorMessage = null;
          vm.validationErrorMessagePrinc = null;
          vm.disablePayment = '';
          invalidPaymentInput = false;
          var numericAdditionalAmountInput = vm.removeCurrencySign(vm.additionalAmountInput);
          var paymentType = '';
          if (vm.amount !== undefined) {
            paymentType = vm.amount.type;
          }
          var principalBalance = null;
          var totalAmountDue = null;
          if (productCategory == 'MLA') {
            principalBalance = accountDetailsData.accountDetails.mortgageAccount.loanAccountBalanceInfo.principalBalance;
            totalAmountDue = accountDetailsData.accountDetails.mortgageAccount.loanAccountPaymentInfo.totalPaymentDueAmount;
          }
          else {
            principalBalance = accountDetailsData.accountDetails.homeEquityLoanAccount.loanAccountBalanceInformation.principalBalance;
            totalAmountDue = accountDetailsData.accountDetails.homeEquityLoanAccount.loanAccountPaymentInformation.totalPaymentDueAmount;
          }
          if (vm.paymentTypeOption != vm.onetime && vm.dynamicPaymentLabel != '' &&
            (vm.additionalAmountInput == null || vm.additionalAmountInput == '')) {
            vm.validationErrorMessage = i18n.payment.additionalPrincipalAmountMsgEmpty;
            invalidPaymentInput = true;
            return false;
          }
          if (vm.paymentTypeOption != vm.onetime && vm.dynamicPaymentLabel != '' && (numericAdditionalAmountInput <= 0 || !HomeLoansUtils.isANumber(numericAdditionalAmountInput))) {
            vm.disablePayment = 'disablePaymentButton';
            vm.ariaLabelRecurringPaymentButton = i18n.payment.ariaLabelStartRecurringPaymentButtonDisabled;
            if (inputAmountField != null) {
              inputAmountField.setAttribute("aria-invalid", "true");
            }
            vm.ariaDescribedByAdditionalPrincipal = 'formValidationErrorMessage';
          }
          if(vm.dynamicPaymentLabel != ''){
            if (vm.paymentTypeOption == vm.onetime && (numericAdditionalAmountInput <= 0 || !HomeLoansUtils.isANumber(numericAdditionalAmountInput))) {
              vm.disablePayment = 'disablePaymentButton';
              vm.ariaLabelMakePaymentButton = i18n.payment.ariaLabelMakePaymentButtonDisabled;
              if (inputAmountField != null) {
                inputAmountField.setAttribute("aria-invalid", "true");
              }
            }
            else if (paymentType == payOptions.amountDuePrincipal || paymentType == payOptions.principalOnly) {
              if (numericAdditionalAmountInput > principalBalance) {
                vm.disablePayment = 'disablePaymentButton';
                vm.ariaLabelMakePaymentButton = i18n.payment.ariaLabelMakePaymentButtonDisabled;
                if (inputAmountField != null) {
                  inputAmountField.setAttribute("aria-invalid", "true");
                }
                vm.ariaDescribedByAdditionalPrincipal = 'formValidationErrorMessage';
                invalidPaymentInput = true;
                vm.validationErrorMessage
                  = i18n.payment.principalMustBeLessMessage;
              }
            }
            else if (paymentType == payOptions.partialPayment) {
              if (numericAdditionalAmountInput >= totalAmountDue) {
                vm.disablePayment = 'disablePaymentButton';
                vm.ariaLabelMakePaymentButton = i18n.payment.ariaLabelMakePaymentButtonDisabled;
                if (inputAmountField != null) {
                  inputAmountField.setAttribute("aria-invalid", "true");
                }
                vm.ariaDescribedByAdditionalPrincipal = 'formValidationErrorMessage';
                invalidPaymentInput = true;
                vm.validationErrorMessage
                  = i18n.payment.partialPaymentMustBeLessMessage;
              }
            }
          }
          if(vm.disablePayment === 'disablePaymentButton'){
            // error validations have failed. disable the button.
            vm.buttonDisabled = true;
          }
          return true;
        },
        isInputInvalid          : function () {
          return invalidPaymentInput;
        },
        paymentOptionSelected   : function (paymentOptionData) {
          //The method runs when the payment option changes
          vm.validationErrorMessage = null;
          if (vm.paymentTypeOption == vm.recurring) {
            return;
          }
          if (document.getElementById('additionalPrincipal') != null) {
            document.getElementById('additionalPrincipal').setAttribute("aria-invalid", "false");
          }
          vm.ariaDescribedByAdditionalPrincipal = null;
          vm.ariaLabelMakePaymentButton = i18n.payment.ariaLabelMakePaymentButtonEnabled;
          invalidPaymentInput = false;
          //vm.validationErrorMessage = null;
          vm.additionalAmountInput = null;
          vm.disablePayment = '';
          vm.ariaDescribedByAdditionalPrincipal = '';
          vm.dynamicPaymentLabel = HomeLoansUtils.dynamicPaymentLabel(paymentOptionData.item.type, payOptions);
          if (vm.paymentTypeOption == vm.onetime && vm.dynamicPaymentLabel !== '') {
            vm.disablePayment = 'disablePaymentButton';
            vm.ariaLabelMakePaymentButton = i18n.payment.ariaLabelMakePaymentButtonDisabled;
          }
        },
        //function to populate the UmmPayment.successData after the payment has been successful.
        paymentSuccess          : function () {
          return function (data) {
            var paymentTypeOpt = vm.paymentTypeOption;
            var paymentOption = paymentType.oneTime;
            var payDate = data.paymentDate;
            var confirmCode = data.paymentConfirmationNumber;
            //Calculate the total payment Made
            var paymentTotal = data.totalPaymentReceivedAmount;
            var suffixDay = '';
            if (paymentTypeOpt == vm.recurring) {
              payDate = data.nextPaymentDate;
              confirmCode = data.recurringPaymentId;
              paymentTotal = data.basePaymentDueAmount;
              paymentOption = paymentType.recurring;
              if (vm.afterDate) {
                suffixDay = vm.day.suffix;
              } else {
                suffixDay = vm.getSuffixDay(payDate);
              }
              vm.dueDay = vm.day.display;
            }
            if (data.additionalPrincipalAmount !== undefined) {
              paymentTotal += data.additionalPrincipalAmount;
            }
            var confirmationMessage = {
              'paymentOption'       : paymentOption,
              'payFrom'             : vm.from.displayName,
              'payFromAccountNumber': vm.from.accountNumber,
              'payAmount'           : paymentTotal,
              'payDate'             : payDate,
              'confirmCode'         : confirmCode,
              'paymentDue'          : data.monthlyPaymentAmount,
              'lateCharges'         : data.lateChargeAmount,
              'principalOnly'       : data.additionalPrincipalAmount,
              'basePaymentDue'      : data.basePaymentDueAmount,
              'draftAmount'         : data.initialDraftPaymentAmount,
              'dueDay'              : vm.dueDay,
              'nextDate'            : vm.nextDateValue,
              'frequency'           : vm.loanAccountPaymentInfo.paymentFrequency,
              'afterDate'           : vm.afterDate,
              'isPushedDate'        : data.pushedDate,
              'reloadPage'      : true,
              'editPaymentInfo'     : {
                'accountReferenceId'    : homeLoansAccountDetailsService.getAccountRefId(),
                'productType'           : productCategory,
                'isExternal'            : !vm.from.isInternalAccount,
                'previousPaymentOption' : vm.previousPaymentOption,
                'previousPayFromAccount': vm.previousPayFromAccount,
                'previousInputAmount'   : vm.additionalAmountInput,
                'paymentTypeOption'     : paymentTypeOpt,
                'transactionId'         : data.transactionId,
                'sequenceNumber'        : data.transactionId,
                'fromTransactions'      : false,
                'fromModelEdit'         : false,
                'suffix'                : suffixDay,
                'editPayment'           : true
              }
            };
            UmmPaymentFactory.setSuccessData(confirmationMessage);
            homeLoansAccountDetailsService.setPaymentInfoData(confirmationMessage);
            $scope.$modalCancel();// closing the setup modal.
            homeLoansAccountDetailsService.paymentSetupSuccess($scope);
            vm.inProgress = false;
          };
        },
        paymentFailed           : function () {
          return function (data) {
            vm.inProgress = false;
            vm.loadingMakePayment = '';
            vm.disablePayment = '';
            console.log('failure status code' + data.cause.status);
            console.log('failure message' + data.cause.data.errorMessage);
            // closing the payment modal in case of error, hence preventing the user from sending same data again.
            var data = {
              reloadPage : true
            };
            UmmPaymentFactory.setSuccessData(data);
            vm.close();
          };
        },
        mortgagePaymentRequest  : function (selectedPaymentOption, paymentAmounts) {
          var paymentSetupRequest = {
            "paymentOption"         : selectedPaymentOption,
            "paymentDate"           : vm.date,
            "totalPaymentAmount"    : paymentAmounts.totalPaymentAmount,
            "principalPaymentAmount": paymentAmounts.principalPaymentAmount,
            "productType"           : productCategory,
            paymentType             : vm.paymentTypeOption,
            "paymentAccountInfo"    : {
              "abaNumber"            : vm.from.aba,
              "accountReferenceId"   : vm.from.referenceId,
              "accountNumber"        : vm.from.accountNumber,
              "accountHolderFullName": accountDetailsData.accountDetails.mortgageAccount.primaryBorrowerName,
              "accountType"          : vm.from.accountType,
              "accountName"          : vm.from.displayName,
              "isInternalAccount"    : vm.from.isInternalAccount
            },
            "paymentDueInfo"        : {
              "totalPaymentDueAmount"     : accountDetailsData.accountDetails.mortgageAccount.loanAccountPaymentInfo.totalPaymentDueAmount,
              "lateChargeBalance"         : accountDetailsData.accountDetails.mortgageAccount.loanAccountBalanceInfo.lateChargeBalance,
              "pastDueAmount"             : accountDetailsData.accountDetails.mortgageAccount.loanAccountBalanceInfo.pastDueAmount,
              "nextPaymentDate"           : accountDetailsData.accountDetails.mortgageAccount.loanAccountPaymentInfo.nextPaymentDate,
              "basePaymentDueAmount"      : accountDetailsData.accountDetails.mortgageAccount.loanAccountPaymentInfo.basePaymentDueAmount,
              "suspenseBalance"           : accountDetailsData.accountDetails.mortgageAccount.loanAccountBalanceInfo.suspenseBalance,
              "escrowDueAmount"           : accountDetailsData.accountDetails.mortgageAccount.loanAccountPaymentInfo.escrowDueAmount,
              "mortgageInsuranceDueAmount": accountDetailsData.accountDetails.mortgageAccount.loanAccountPaymentInfo.mortgageInsuranceDueAmount,
              "optionalInsuranceDueAmount": accountDetailsData.accountDetails.mortgageAccount.loanAccountPaymentInfo.optionalInsuranceDueAmount
            }
          };
          return paymentSetupRequest;
        },
        homeEquityPaymentRequest: function (selectedPaymentOption, paymentAmounts) {
          var paymentSetupRequest = {
            "paymentOption"         : selectedPaymentOption,
            "paymentDate"           : vm.date,
            "totalPaymentAmount"    : paymentAmounts.totalPaymentAmount,
            "principalPaymentAmount": paymentAmounts.principalPaymentAmount,
            "productType"           : productCategory,
            paymentType             : vm.paymentTypeOption,
            "paymentAccountInfo"    : {
              "abaNumber"            : vm.from.aba,
              "accountReferenceId"   : vm.from.referenceId,
              "accountNumber"        : vm.from.accountNumber,
              "accountHolderFullName": accountDetailsData.accountDetails.homeEquityLoanAccount.primaryBorrowerName,
              "accountType"          : vm.from.accountType,
              "accountName"          : vm.from.displayName,
              "isInternalAccount"    : vm.from.isInternalAccount
            },
            "paymentDueInfo"        : {
              "totalPaymentDueAmount"     : accountDetailsData.accountDetails.homeEquityLoanAccount.loanAccountPaymentInformation.totalPaymentDueAmount,
              "lateChargeBalance"         : accountDetailsData.accountDetails.homeEquityLoanAccount.loanAccountBalanceInformation.lateChargeBalance,
              "pastDueAmount"             : accountDetailsData.accountDetails.homeEquityLoanAccount.loanAccountBalanceInformation.pastDueAmount,
              "nextPaymentDate"           : accountDetailsData.accountDetails.homeEquityLoanAccount.loanAccountPaymentInformation.nextPaymentDate,
              "basePaymentDueAmount"      : accountDetailsData.accountDetails.homeEquityLoanAccount.loanAccountPaymentInformation.basePaymentDueAmount,
              "suspenseBalance"           : accountDetailsData.accountDetails.homeEquityLoanAccount.loanAccountBalanceInformation.suspenseBalance,
              "escrowDueAmount"           : accountDetailsData.accountDetails.homeEquityLoanAccount.loanAccountPaymentInformation.escrowDueAmount,
              "mortgageInsuranceDueAmount": accountDetailsData.accountDetails.homeEquityLoanAccount.loanAccountPaymentInformation.mortgageInsuranceDueAmount,
              "optionalInsuranceDueAmount": accountDetailsData.accountDetails.homeEquityLoanAccount.loanAccountPaymentInformation.optionalInsuranceDueAmount
            }
          };
          return paymentSetupRequest;
          //}
        },
        recurringPaymentRequest : function (paymentAmounts) {
          var accHoldername = '';
          if (productCategory == 'MLA') {
            accHoldername = accountDetailsData.accountDetails.mortgageAccount.primaryBorrowerName
          }
          else {
            accHoldername = accountDetailsData.accountDetails.homeEquityLoanAccount.primaryBorrowerName
          }
          var paymentPlanInfo = {
            "paymentAccountInfo"     : {
              "abaNumber"            : vm.from.aba,
              "accountReferenceId"   : vm.from.referenceId,
              "accountNumber"        : vm.from.accountNumber,
              "accountHolderFullName": accHoldername,
              "accountType"          : vm.from.accountType,
              "accountName"          : vm.from.displayName,
              "isInternalAccount"    : vm.from.isInternalAccount
            },
            "paymentDueInfo"         : {
              "nextPaymentDate": vm.loanAccountPaymentInfo.nextPaymentDate,
            },
            paymentDraftDelayDays    : vm.day.value,
            additionalPrincipalAmount: paymentAmounts.principalPaymentAmount,
            productTypeCode          : productCategory,
            paymentType              : vm.paymentTypeOption
          }
          return paymentPlanInfo;
        },
        makePayment             : function (evt) {
          console.log('makePayment: method call');
          console.log(vm.inProgress);
          if (vm.disablePayment !== 'disablePaymentButton' && !vm.inProgress) {
            console.log('makePayment: inside call' + vm.inProgress);
            if (vm.paymentTypeOption != vm.onetime && !vm.validatePaymentForm(evt)) {
              return false;
            }
            else {
              vm.validatePaymentForm(evt);
            }
            vm.loadingMakePayment = 'loading';
            var paymentAmounts = vm.getPaymentAmounts();
            var paymentSetup = null;
            var productCategory = homeLoansAccountDetailsService.getProductCategory();
            //TODO Hack to provide proper request data while overriding the core functionality (easedropdown.js line
            // 296)
            var selectedPaymentOption = vm.amount.type;
            if (vm.amount.type === payOptions.principalOnly) {
              selectedPaymentOption = 'principalOnly';
            }
            if (vm.paymentTypeOption == vm.onetime) {
              if (productCategory == 'MLA') {
                paymentSetup = vm.mortgagePaymentRequest(selectedPaymentOption, paymentAmounts);
              } else {
                paymentSetup = vm.homeEquityPaymentRequest(selectedPaymentOption, paymentAmounts);
              }
            }
            else {
              paymentSetup = vm.recurringPaymentRequest(paymentAmounts);
            }
            //If we are editing payment, then PUT... else simply POST the payment.
            if (vm.previousPaymentData != null) {
              //PUT
              homeLoansAccountDetailsService.editHomeLoansPayment(homeLoansAccountDetailsService.getAccountRefId(),
                vm.previousPaymentData.payDate,
                vm.previousPaymentData.editPaymentInfo.productType,
                vm.previousPaymentData.editPaymentInfo.isExternal, paymentSetup,
                vm.previousPaymentData.editPaymentInfo.sequenceNumber,
                vm.previousPaymentData.editPaymentInfo.transactionId).then(vm.paymentSuccess(vm.paymentTypeOption), vm.paymentFailed());
            }
            else {
              //POST
              homeLoansAccountDetailsService.postHomeLoansPayment(paymentSetup, homeLoansAccountDetailsService.getAccountRefId())
                .then(vm.paymentSuccess(), vm.paymentFailed());
            }
          }
          $scope.disabled = false;
          $scope.spinnerEnabled = false;
          return false;
        },
        setFromAccount          : function (transferAccount) {
          vm.from = transferAccount;
        },
        setPaymentOption        : function (option) {
          vm.amount = option;
        },
        isPaymentDisabled       : function () {
          if (vm.disablePayment == 'disablePaymentButton') {
            return true;
          }
        }
      });
      //Initialize the payment data
      vm.initializePayment();
      //Runs whenever either dropdown changes
      $rootScope.$on('EXT_ACCOUNT_ADDED', function (event, paymentAccount) {
        if($state.fromHL && $state.accountBeingAdded){
          // the above flags are to prevent the make a payment being kicked off on Auto's Event
          // and Once account is added, need not go thru flow again.
          $state.accountBeingAdded = false;
          //pop up the make a payment module.
          console.log('inside the completion of ext_account_added');
          var accounts = UmmPaymentFactory.getData('accountDd');
          var paymentParams = {
            'lineOfBusiness': productCategory,
            'accountReferenceId': accountDetailsData.accountReferenceId,
            'payment': {
              'isAccountDataAvailable': true,
              'defaultPaymentAccountData': paymentAccount
            }
          };

          if($state.current.name === 'accountSummary' ||
            ($state.current.parent && $state.current.parent.name === 'accountSummary')) {
            angular.extend(paymentParams, {
              'category'   : paymentParams.lineOfBusiness,
              'subCategory': productCategory,
            });
            TemplateSelectionFactory.payNow(paymentParams);
          }else {
            $state.go('HomeLoanPayment',
              {
                'lineOfBusiness'    : productCategory,
                'accountReferenceId': accountDetailsData.accountReferenceId,
                'payment'           : {isAccountDataAvailable: true}
              });
          }
        }
      });

      $scope.$on('EASE_DD_ITEM_SELECTED', function (e, data) {
        var addAccountLabel =  vm.i18n.payment.addAccount; //TODO
        console.log("type of check box selected"+data.type);
        console.log("data item value"+data.item.displayName);
        // navigating to the add external account.
        if(data.type === 'accountDd' && data.item.displayName === addAccountLabel){
          console.log("add external account flow");
          $state.fromHL = true;
          $state.accountBeingAdded = true;
          if ($state.current.parent.name === 'accountSummary') {
            $state.go('SummAccPrefAddExtAccount');
          }else {
            $state.go($state.current.parent.name + '.AddExtAccount');
          }
        }
        if (data.type === 'amountDd') {
          //This runs every time the payment option changes, including on initial load
          vm.previousPaymentOption = data.item.type;
          vm.dynamicPaymentLabel = HomeLoansUtils.dynamicPaymentLabel(data.item.type, payOptions);
          var numericAdditionalAmountInput = vm.removeCurrencySign(vm.additionalAmountInput);
          if (vm.paymentTypeOption != vm.onetime && vm.dynamicPaymentLabel != '' && (numericAdditionalAmountInput <= 0 || !HomeLoansUtils.isANumber(numericAdditionalAmountInput))) {
            vm.disablePayment = 'disablePaymentButton';
          }
          else {
            vm.disablePayment = '';
          }
          if(vm.dynamicPaymentLabel != ""){
            vm.buttonDisabled = true;
          }
          else {
            vm.buttonDisabled = false;
          }
          if (!initialAmountLoad) {
            //this runs every time after the initial load
            vm.paymentOptionSelected(data);
          }
          initialAmountLoad = false;
        }
        else if (data.type === 'accountDd') {
          //This runs every time the pay from account changes, including on initial load
          vm.previousPayFromAccount = data.item.accountNumber;
        }
        else if (data.type === 'graceDaysDd') {
          //This runs every time the pay from account changes, including on initial load
          vm.gracedays;
        }
      });
    });
  // Success controller. contains the modal states to edit and cancel a payment.
  HomeLoansPaymentModule.controller('SuccessHLPaymentCtrl',
    function ($scope, $state, EaseLocalizeService, UmmPaymentFactory, HomeLoansProperties, homeLoansAccountDetailsService, easeExceptionsService, HomeLoansUtils) {
      var vm = this;
      vm.i18n = homeLoansAccountDetailsService.getI18n();
      vm.accountDetailsData = homeLoansAccountDetailsService.getAccountDetailsData();
      vm.inProgress = false;//resetting the in progress after loading the success page.
      var productCategory = homeLoansAccountDetailsService.getProductCategory();
      angular.extend(vm, {
        "isRecurringFlag"          : false,
        "isOnetimeFlag"            : false,
        "isRecurringPushedDateFlag": false,
        "isBiweeklyFlag"           : false,
        close                      : function () {
          HomeLoansUtils.landingPageEvent();
          //Clear any payment information
          UmmPaymentFactory.setSuccessData(null);
          vm.inProgress = false;
          $state.go($state.current.parent.name, {}, {reload: 'true'});
        },
        modalType                  : 'successModal',
        modalClass                 : 'icon-check',
        successMsg                 : UmmPaymentFactory.getSuccessData(),
        cancel                     : function () {
          console.log(vm.inProgress);
          if (!vm.inProgress) {
            $scope.$modalCancel();
            homeLoansAccountDetailsService.paymentCancel();
          }
        },
        editPayment                : function () {
          if (!vm.inProgress) {
            $scope.$modalCancel();
            homeLoansAccountDetailsService.paymentEditSetup();
          }
        },
        isRecurringNotPushedDate   : function () {
          if (vm.successMsg.editPaymentInfo.paymentTypeOption == 'recurring' && !vm.successMsg.isPushedDate) {
            vm.isRecurringFlag = true;
          }
          return vm.isRecurringFlag;
        },
        isOnetime                  : function () {
          if (vm.successMsg.editPaymentInfo.paymentTypeOption == 'onetime') {
            vm.isOnetimeFlag = true;
          }
          return vm.isOnetimeFlag;
        },
        isRecurringPushedDate      : function () {
          if (vm.successMsg.editPaymentInfo.paymentTypeOption == 'recurring' && vm.successMsg.isPushedDate) {
            vm.isRecurringPushedDateFlag = true;
          }
          return vm.isRecurringPushedDateFlag;
        },
        isBiWeekly                 : function () {
          if (vm.successMsg.frequency == 'BiWeekly') {
            vm.isBiweeklyFlag = true;
          }
          return vm.isBiweeklyFlag;
        }
      });
      if (vm.successMsg != null && vm.successMsg.paymentOption == 'recurring') {
        HomeLoansUtils.analyticsTracking('pay bill', 'recurring', 'confirmation');
      }
      else {
        HomeLoansUtils.analyticsTracking('pay bill', 'confirmation', '');
      }
    });
  HomeLoansPaymentModule.controller('CancelHLPaymentCtrl', function (
    $scope, $state, homeLoansAccountDetailsService,
    UmmPaymentFactory, HomeLoansUtils) {
    var vm = this;
    //TODO refine it to factory method.
    vm.i18n = homeLoansAccountDetailsService.getI18n();
    homeLoansAccountDetailsService.setInProgress(false);
    angular.extend(vm, {
      close             : function () {
        HomeLoansUtils.landingPageEvent();
        homeLoansAccountDetailsService.setInProgress(false);
        // if the payment was made, then refresh the page when closing the modal
        if (UmmPaymentFactory.getSuccessData() != null && UmmPaymentFactory.getSuccessData().reloadPage) {
          UmmPaymentFactory.setSuccessData(null);
          // reload the state as payment was success and clear out the success data as modal is being closed.
          $state.go($state.current.parent.name, {}, {reload: 'true'});
        } else { // just load the page, there is no change in the data.
          UmmPaymentFactory.setSuccessData(null);
          $state.go($state.current.parent.name, {}, {location: 'replace'});
        }
      },
      loading           : '',
      modalType         : 'cancelModal',
      modalClass        : 'icon-warning',
      productCategory   : homeLoansAccountDetailsService.getProductCategory(),
      successMsg        : UmmPaymentFactory.getSuccessData(),
      paymentInfoMsg    : homeLoansAccountDetailsService.getPaymentInfoData(),
      accountDetailsData: homeLoansAccountDetailsService.getAccountDetailsData(),
      back              : function (paymentOption) {
        console.log(homeLoansAccountDetailsService.getProgress());
        if (!homeLoansAccountDetailsService.getProgress()) {
          $scope.$modalCancel();
          console.log(UmmPaymentFactory.getSuccessData());
          console.log(homeLoansAccountDetailsService.getPaymentInfoData());
          // either from transactions or from the recurring success.
          if ((UmmPaymentFactory.getSuccessData() != null &&
            !UmmPaymentFactory.getSuccessData().editPaymentInfo.fromTransactions) ||
            (homeLoansAccountDetailsService.getPaymentInfoData() != null &&
            !homeLoansAccountDetailsService.getPaymentInfoData().editPaymentInfo.fromTransactions)) {
            if (paymentOption != null && paymentOption) {
              UmmPaymentFactory.setSuccessData(null);
              var payment = {
                'category'   : homeLoansAccountDetailsService.getProductCategory(),
                'referenceId': vm.accountDetailsData.accountReferenceId
              };
              homeLoansAccountDetailsService.launchUmmPayment(payment, true);
            }
            else {
              homeLoansAccountDetailsService.paymentSetupSuccess();
            }
          }
          else {
            HomeLoansUtils.landingPageEvent();
            // if the payment was made, then refresh the page when closing the modal
            if (UmmPaymentFactory.getSuccessData() != null && UmmPaymentFactory.getSuccessData().reloadPage) {
              UmmPaymentFactory.setSuccessData(null);
              // reload the state as payment was success and clear out the successdata as modal is being closed.
              $state.go($state.current.parent.name, {}, {reload: 'true'});
            } else { // just load the page, there is no change in the data.
              UmmPaymentFactory.setSuccessData(null);
              $state.go($state.current.parent.name, {}, {location: 'replace'});
            }
          }
        }
      },
      confirm           : function () {
        if (!homeLoansAccountDetailsService.getProgress()) {
          vm.loading = 'loading';
          var payDate = null;
          var editPaymentInfo = null;
          var isSuccessMsg = false;
          if (vm.successMsg !== null && vm.successMsg !== undefined) {
            editPaymentInfo = vm.successMsg.editPaymentInfo;
            payDate = vm.successMsg.payDate;
            isSuccessMsg = true;
          }
          else if (vm.paymentInfoMsg !== null && vm.paymentInfoMsg !== undefined) {
            editPaymentInfo = vm.paymentInfoMsg.editPaymentInfo;
          }
          if (editPaymentInfo.paymentTypeOption == 'recurring') {
            var payDateRecur = '';
            if (vm.productCategory == 'MLA') {
              if (isSuccessMsg) {
                vm.successMsg.payDate = vm.accountDetailsData.accountDetails.mortgageAccount.loanAccountPaymentInfo.nextPaymentDate;
              }
              else {
                vm.paymentInfoMsg.payDate = vm.accountDetailsData.accountDetails.mortgageAccount.loanAccountPaymentInfo.nextPaymentDate;
              }
            }
            else {
              if (isSuccessMsg) {
                vm.successMsg.payDate = vm.accountDetailsData.accountDetails.homeEquityLoanAccount.loanAccountPaymentInformation.nextPaymentDate;
              }
              else {
                vm.paymentInfoMsg.payDate = vm.accountDetailsData.accountDetails.homeEquityLoanAccount.loanAccountPaymentInformation.nextPaymentDate;
              }
            }
          }
          homeLoansAccountDetailsService.deleteHomeLoansPayment(editPaymentInfo.accountReferenceId, payDate,
            editPaymentInfo.productType, editPaymentInfo.isExternal, editPaymentInfo.transactionId, editPaymentInfo.paymentTypeOption, editPaymentInfo.sequenceNumber)
            .then(function (data) {
              //Successfully deleted payment.
              $scope.$modalCancel();
              homeLoansAccountDetailsService.setInProgress(false);
              homeLoansAccountDetailsService.paymentCancelSuccess();
            }, function (data) {
              //Unsuccessful attempt to delete payment
              var toParams = '';
              homeLoansAccountDetailsService.setInProgress(false);
              $scope.$modalCancel();
              UmmPaymentFactory.setSuccessData(null); // reset the data entered by user. 
              if($state.current.parent.name == 'HomeLoansDetails'){
                // for the homloansdetails state the refresh state should be transactions.
                $state.go('HomeLoansDetails.transactions', {}, {reload: 'true'});
              }else {
                $state.go($state.current.parent.name, {}, {reload: 'true'});
              }
            });
        }
      },
      paymentInProgress : function () {
        return homeLoansAccountDetailsService.setInProgress(true);
      }
    });
    if (vm.paymentInfoMsg && vm.paymentInfoMsg.editPaymentInfo.paymentTypeOption === 'recurring') {
      //recurring
      HomeLoansUtils.analyticsTracking('pay bill', 'recurring', 'cancel');
    }
    else {
      HomeLoansUtils.analyticsTracking('pay bill', 'cancel', '');
    }
  });
  HomeLoansPaymentModule.controller('CancelConfirmHLPaymentCtrl', function (
    $scope, $state,
    UmmPaymentFactory,
    homeLoansAccountDetailsService,
    HomeLoansUtils) {
    var vm = this;
    vm.i18n = homeLoansAccountDetailsService.getI18n();
    var successData = null;
    if (UmmPaymentFactory.getSuccessData() != null) {
      successData = UmmPaymentFactory.getSuccessData();
    }
    else {
      successData = homeLoansAccountDetailsService.getPaymentInfoData();
    }
    if (successData.editPaymentInfo.paymentTypeOption === 'recurring') {
      //recurring
      HomeLoansUtils.analyticsTracking('pay bill', 'recurring', 'cancel confirmation');
    }
    else {
      HomeLoansUtils.analyticsTracking('pay bill', 'cancel confirmation', '');
    }
    angular.extend(vm, {
      close     : function () {
        //TODO refine it to factory method.
        HomeLoansUtils.landingPageEvent();
        //Clear any payment information
        UmmPaymentFactory.setSuccessData(null);
        homeLoansAccountDetailsService.setInProgress(false);
        if($state.current.parent.name == 'HomeLoansDetails'){
          // for the homloansdetails state the refresh state should be transactions.
          $state.go('HomeLoansDetails.transactions', {}, {reload: 'true'});
        }else {
          $state.go($state.current.parent.name, {}, {reload: 'true'});
        }

      },
      modalType : 'successModal',
      modalClass: 'icon-check',
      successMsg: successData
    });
  });
  HomeLoansPaymentModule.controller('HomeLoansRecurringInfoCtrl', function (
    $scope, $state, homeLoansAccountDetailsService,
    UmmPaymentFactory, HomeLoansUtils) {
    var vm = this;
    //TODO refine it to factory method.
    vm.accountDetailsData = homeLoansAccountDetailsService.getAccountDetailsData();
    vm.i18n = homeLoansAccountDetailsService.getI18n();
    angular.extend(vm, {
      close     : function () {
        HomeLoansUtils.landingPageEvent();
        UmmPaymentFactory.setSuccessData(null);
        HomeLoansUtils.setPaymentInfoData(null);
      },
      loading   : '',
      modalType : 'cancelModal',
      modalClass: 'icon-warning',
      successMsg: homeLoansAccountDetailsService.getPaymentInfoData(),
      recurringPmtFrequency: homeLoansAccountDetailsService.getRecurringPmtFrequency()
    });
  });
  return HomeLoansPaymentModule;
});

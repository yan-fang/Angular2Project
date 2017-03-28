define(['angular', 'dropdown', 'lodash'], function(angular) {
  'use strict';

  AutoLoanPaymentPlanController.$inject = ['$scope', '$filter', 'UmmPaymentFactory',
    'autoLoanPaymentService', 'autoLoanPaymentPlanUtil', 'createAutoLoanPaymentService', 'autoLoanModuleService',
    'autoLoanPaymentAddAccountService', 'AutoLoanCalendarFactory'];

  function AutoLoanPaymentPlanController($scope, $filter, UmmPaymentFactory,
                                         autoLoanPaymentService, autoLoanPaymentPlanUtil, createAutoLoanPaymentService,
                                         autoLoanModuleService, autoLoanPaymentAddAccountService,
                                         AutoLoanCalendarFactory) {

    var vm = this;
    var accountDetailsData = autoLoanModuleService.getAccountDetailsData();

    vm.calendarInlineOptions = {
      'calendar_format': AutoLoanCalendarFactory.defaultCalendarFormat
    };

    var setupCalendarInlineOptions = function() {
      var calendarInlineOptions = AutoLoanCalendarFactory.getInlineOptions({
        currentDate: autoLoanModuleService.getCurrentDate(),
        dueDate: accountDetailsData.accountDetails.dueDate,
        enabledDates: autoLoanPaymentPlanUtil.getWeeklyOrBiWeeklyDates()
      });
      angular.extend(vm.calendarInlineOptions, calendarInlineOptions);
    };

    autoLoanPaymentPlanUtil.getPaymentPlanOptions(accountDetailsData.accountRefId, this, setupCalendarInlineOptions);

    $scope.accountDetailsData = autoLoanModuleService.getAccountDetailsData();
    $scope.i18n = autoLoanModuleService.getI18n();

    vm.paymentAccountService = UmmPaymentFactory;
    vm.placeHolderFrom = UmmPaymentFactory.getUmmData().defaultBlankAccount;
    vm.opened = false;

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

    var removeCurrencySymbol = function(amount) {
      var value;
      if (String(amount).charAt(0) === '$') {
        value = amount.substr(1, amount.length);
      } else {
        value = amount;
      }
      return value;
    };

    vm.populateFrequencyTypes = function() {
      return autoLoanPaymentPlanUtil.getPaymentFrequencyWithAmount();
    };

    var paymentMonthlyFrequencyValues;
    vm.populateMonthlyFrequencyValues = function() {
      paymentMonthlyFrequencyValues = autoLoanPaymentPlanUtil.getMonthlyFrequencyList();
      return paymentMonthlyFrequencyValues;
    };

    var paymentFrequencyMonthly2Values = [];
    vm.populateMonthlyFrequency2Values = function() {
      return paymentFrequencyMonthly2Values;
    };

    vm.date = null;
    vm.amount = null;

    var defaultAccount = autoLoanPaymentAddAccountService.getDefaultPaymentAccountData(UmmPaymentFactory);
    if (defaultAccount) {
      vm.from = defaultAccount;
    } else {
      vm.from = null;
    }

    vm.disableButton = false;

    vm.paymentDay1Changed = function(item) {
      vm.frequencyValue1 = item;
      vm.setPaymentDate();
      vm.frequencyValue2 = null;
      autoLoanPaymentPlanUtil.getMonthlyFrequency2Values(paymentMonthlyFrequencyValues,
        paymentFrequencyMonthly2Values, vm.frequencyValue1);
    };

    vm.paymentDay2Changed = function(item) {
      vm.frequencyValue2 = item;
      vm.setPaymentDate();
    };

    vm.setPaymentDate = function() {
      if (vm.frequencyType.name.toUpperCase() === 'MONTHLY') {
        vm.date = vm.frequencyValue1.date;
      } else if (vm.frequencyType.name.toUpperCase() === 'TWICEMONTHLY' && vm.frequencyValue1 && vm.frequencyValue2) {
        if (vm.frequencyValue1.date < vm.frequencyValue2.date) {
          vm.date = vm.frequencyValue1.date;
        } else {
          vm.date = vm.frequencyValue2.date;
        }
      }
    };

    vm.frequencyTypeChanged = function(frequencyType) {
      vm.frequencyValue1 = null;
      vm.frequencyValue2 = null;
      vm.date = null;

      vm.showweekly = false;
      vm.showmonthly = false;
      vm.showtwiceamonth = false;

      vm.totalPayment = 0;
      vm.additionalPrincipal = null;

      vm.amount = frequencyType.amount;
      vm.showmonthly = frequencyType.name.toUpperCase() === 'MONTHLY';
      vm.showweekly = frequencyType.name.toUpperCase() === 'WEEKLY' ||
        frequencyType.name.toUpperCase() === 'BIWEEKLY';
      vm.showtwiceamonth = frequencyType.name.toUpperCase() === 'TWICEMONTHLY';

      vm.hasAdditionalPrincipalVerbiage = accountDetailsData.accountDetails.accountPastDueDaysCount === 0;

      vm.hasAdditionalPrincipal = false;
      vm.additionalPrincipal = null;
    };

    vm.showAdditionalPrincipalPaymentInput = function() {
      vm.hasAdditionalPrincipal = true;
      vm.hasAdditionalPrincipalVerbiage = false;
      vm.amountErrorMessage = '';
    };

    vm.totalPayment = 0;

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

    $scope.$watch(function() {
      return vm.additionalPrincipal;
    }, function() {
      if (vm.hasAdditionalPrincipal) {
        vm.totalPayment = Number(vm.amount) + Number(vm.additionalPrincipal);
      }
    });

    vm.isFormInvalid = function() {
      if (vm.date === null) {
        return true;

      } else if (vm.from === '' || vm.from === null || !vm.from.accountType) {
        return true;

      } else if (vm.amount === null || vm.amount === '' || vm.amount <= 0 || vm.isDisplayError()) {
        return true;
      }

      return false;
    };


    vm.createPaymentPlan = function() {
      $scope.$root.$broadcast('CREATE_PAYMENT_PLAN');

      vm.ariaSchedulePlanPressed = true;
      var daysOfTheMonth = [];
      var dayOfTheWeek;

      var planStartDate = $filter('date')(new Date(vm.date), 'yyyy-MM-dd');

      if (vm.frequencyType.name.toUpperCase() === 'TWICEMONTHLY') {
        daysOfTheMonth[0] = vm.frequencyValue1.value;
        daysOfTheMonth[1] = vm.frequencyValue2.value;
      } else if (vm.frequencyType.name.toUpperCase() === 'MONTHLY') {
        daysOfTheMonth[0] = vm.frequencyValue1.value;
      } else if (vm.frequencyType.name.toUpperCase() === 'WEEKLY') {
        dayOfTheWeek = autoLoanPaymentPlanUtil.getDayOfTheWeek(planStartDate);
      } else if (vm.frequencyType.name.toUpperCase() === 'BIWEEKLY') {
        dayOfTheWeek = autoLoanPaymentPlanUtil.getDayOfTheWeek(planStartDate);
      }


      var paymentPlan = {
        'paymentFrequency': vm.frequencyType.name,
        'planStartDate': planStartDate,
        'daysOfTheMonth': daysOfTheMonth,
        'dayOfTheWeek': dayOfTheWeek,
        'paymentAmount': vm.amount,
        'totalAmount': vm.totalPayment ? vm.totalPayment : vm.amount
      };

      if (vm.from.paymentAccountReferenceId) {
        paymentPlan.paymentAccountReferenceId = vm.from.paymentAccountReferenceId;
      } else {
        paymentPlan.bankDetail = {
          'abaNumber': vm.from.abaNumber,
          'bankAccountNumber_TLNPI': vm.from.accountNumber_TLNPI,
          'accountType': vm.from.accountType.toUpperCase(),
          'bankName': vm.from.displayName
        }
      }

      if (vm.additionalPrincipal) {
        paymentPlan.additionalPrincipalAmount = removeCurrencySymbol(vm.additionalPrincipal);
      }

      vm.spinning = true;
      createAutoLoanPaymentService.createPaymentPlan($scope, vm, paymentPlan, accountDetailsData.accountRefId);

    };
  }

  AutoLoanPaymentPlanSuccessController.$inject = ['$scope', 'UmmPaymentFactory', 'autoLoanModuleService',
    'AutoLoanPubsubService'];

  function AutoLoanPaymentPlanSuccessController($scope, UmmPaymentFactory, autoLoanModuleService,
                                                AutoLoanPubsubService) {

    $scope.i18n = autoLoanModuleService.getI18n();

    var vm = this;

    angular.extend(vm, {
      modalType: 'successModal',
      modalClass: 'icon-check',
      modalRole: 'region',
      successMsg: UmmPaymentFactory.getSuccessData(),
      close: function() {
        vm.focusId = autoLoanModuleService.getFocusId();
        autoLoanModuleService.setDisableMakeAPayment(false);
      }
    });

    AutoLoanPubsubService.trackPageView({
      level2: 'pay bill',
      level3: 'recurring',
      level4: 'confirmation'
    });


  }

  AutoLoanPaymentPlanDetailsController.$inject = ['$scope', 'autoLoanPaymentPlanUtil', 'autoLoanModuleService',
    'AutoLoanPubsubService'];

  function AutoLoanPaymentPlanDetailsController($scope, autoLoanPaymentPlanUtil, autoLoanModuleService,
                                                AutoLoanPubsubService) {

    $scope.i18n = autoLoanModuleService.getI18n();
    $scope.accountDetailsData = autoLoanModuleService.getAccountDetailsData();

    var vm = this;
    vm.modalRole = 'region';
    var paymentPlan = autoLoanModuleService.getPaymentPlan();

    vm.showCancelLink = false;
    if (autoLoanModuleService.isFeatureEnabled('ease.coaf.paymentplandelete')) {
      vm.showCancelLink = true;
    }

    vm.paymentPlan = autoLoanPaymentPlanUtil.formatPaymentPlan(paymentPlan);

    if (vm.paymentPlan.additionalPrincipalAmount) {
      vm.paymentPlan.totalAmount = autoLoanPaymentPlanUtil.roundUp(
        parseFloat(vm.paymentPlan.paymentAmount) + parseFloat(vm.paymentPlan.additionalPrincipalAmount));
    }

    vm.cancelPaymentPlan = function() {
      $scope.$root.$broadcast('CANCEL_PAYMENT_PLAN');
      autoLoanModuleService.setDisableMakeAPayment(true);
      $scope.$modalCancel();
      autoLoanModuleService.deletePaymentPlanConfirm();
    };
    vm.paymentPlanDetails = paymentPlan;

    AutoLoanPubsubService.trackPageView({
      level2: 'manage payment'
    });
  }

  autoLoanPaymentPlanUtil.$inject = ['$filter', '$state', 'autoLoanModuleService', 'autoLoanPaymentService'];

  function autoLoanPaymentPlanUtil($filter, $state, autoLoanModuleService, autoLoanPaymentService) {

    var self = this;

    var formatDaysOfTheMonth = function(dayOfTheMonth) {
      switch (dayOfTheMonth) {
        case 1:
        case 21:
        case 31:
          return dayOfTheMonth + 'st';
        case 2:
        case 22:
          return dayOfTheMonth + 'nd';
        case 3:
        case 23:
          return dayOfTheMonth + 'rd';
        default:
          return dayOfTheMonth + 'th';
      }
    };

    var paymentFrequencies = [
      {'name': 'MONTHLY', 'display': 'Monthly'},
      {'name': 'WEEKLY', 'display': 'Weekly'},
      {'name': 'BIWEEKLY', 'display': 'Bi-Weekly'},
      {'name': 'TWICEMONTHLY', 'display': 'Twice a month'}
    ];

    var paymentPlanOptions;

    var weeklyOrBiWeeklyDates = [];

    var monthlyFrequencyList = [];

    var populateWeeklyOrBiWeeklyDates = function() {
      paymentPlanOptions.paymentOptions.forEach(function(paymentOption) {
        if (paymentOption.paymentFrequency === 'WEEKLY') {
          var paymentDates = paymentOption.paymentDates;
          paymentDates.forEach(function(eachPaymentDate) {
            var effectiveDate = eachPaymentDate.effectiveDate;
            weeklyOrBiWeeklyDates.push((effectiveDate));
          });
        }
      });
    };

    var populateFrequencyTypesAndAmounts = function() {
      paymentFrequencies.forEach(function(frequency) {
        paymentPlanOptions.paymentOptions.forEach(function(paymentOption) {
          if (paymentOption.paymentFrequency === frequency.name) {
            frequency.amount = paymentOption.paymentAmount;
          }
        });
        frequency.displayText = frequency.display + ' (' + $filter('currency')(frequency.amount) + ')';
      });
    };

    var populateMonthlyFrequencyList = function() {
      paymentPlanOptions.paymentOptions.forEach(function(paymentOption) {

        if (paymentOption.paymentFrequency === 'MONTHLY') {
          monthlyFrequencyList.length = 0;
          var paymentDates = paymentOption.paymentDates;
          paymentDates.forEach(function(eachPaymentDate) {

            var selectedDayOfMonth = eachPaymentDate.selectedDayOfMonth;
            var effectiveDate = eachPaymentDate.effectiveDate;
            var day = formatDaysOfTheMonth(selectedDayOfMonth);
            var display = 'Every ' + day + ' - Starting ' + $filter('date')(effectiveDate, 'MM/dd/yyyy');
            monthlyFrequencyList.push({
              'name': day,
              'value': selectedDayOfMonth,
              'display': display,
              'date': $filter('date')(effectiveDate, 'yyyy-MM-dd')
            });
          });
        }
      });
    };

    var populateDefaultPaymentPlanData = function(controller) {
      if (self.defaultPaymentPlanData && self.defaultPaymentPlanData.frequency === 'MONTHLY') {
        controller.frequencyType = paymentFrequencies[0];
        controller.amount = controller.frequencyType.amount;
        controller.showmonthly = true;
        controller.hasAdditionalPrincipalVerbiage = false;
        controller.hasAdditionalPrincipal = true;
        controller.additionalPrincipal = self.defaultPaymentPlanData.additionalPrincipal;
        controller.checkAdditionalPrincipalAmount();
      }
    };

    this.getPaymentPlanOptions = function(accountRefId, controller, callback) {
      autoLoanModuleService.getPaymentPlanOptions(accountRefId).then(function(optionsData) {
        if (!optionsData) {
          controller.errorMessage = autoLoanModuleService.getI18n()
            .coaf.payment.paymentModal.paymentError.label.v1;
        } else if (optionsData.notificationMessage) {
          controller.errorMessage = optionsData.notificationMessage.text;
        } else {
          self.setPaymentPlanOptions(optionsData);
          populateFrequencyTypesAndAmounts();
          populateMonthlyFrequencyList();
          populateWeeklyOrBiWeeklyDates();
          if ($state.current && $state.current.parent && $state.current.parent.name === 'autoLoanTracker') {
            populateDefaultPaymentPlanData(controller);
          }

          callback();
        }
      });

      return paymentPlanOptions;
    };

    this.getDefaultPaymentPlanData = function() {
      return self.defaultPaymentPlanData;
    };

    this.setDefaultPaymentPlanData = function(defaultPaymentPlanData) {
      self.defaultPaymentPlanData = defaultPaymentPlanData;
    };

    this.setPaymentPlanOptions = function(options) {
      paymentPlanOptions = options;
    };

    this.getWeeklyOrBiWeeklyDates = function() {
      return weeklyOrBiWeeklyDates;
    };

    this.getMonthlyFrequencyList = function() {
      return monthlyFrequencyList;
    };

    this.getMonthlyFrequency2Values = function(days,
                                               paymentFrequencyMonthly2Values,
                                               selectedItem) {
      var ineligibleDates = [];

      var minimumDaysAPart = paymentPlanOptions.twiceMonthlyMinimumDaysApart;

      for (var dayOfMonth = 1; dayOfMonth <= 31; dayOfMonth++) {
        if ((dayOfMonth > selectedItem.value - minimumDaysAPart && dayOfMonth < selectedItem.value) ||
          (dayOfMonth >= selectedItem.value && dayOfMonth < selectedItem.value + minimumDaysAPart)) {
          ineligibleDates.push(dayOfMonth);
        }
      }

      var overLapDaysCnt;
      if ((selectedItem.value + minimumDaysAPart) > 31) {
        overLapDaysCnt = (selectedItem.value + minimumDaysAPart) - 31;
      }

      for (var i = 1; i < overLapDaysCnt; i++) {
        ineligibleDates.push(i);
      }

      if (selectedItem.value < minimumDaysAPart) {
        var cnt = 31;
        for (var sixDaysCount = 1; sixDaysCount <= minimumDaysAPart - selectedItem.value; sixDaysCount++) {
          ineligibleDates.push(cnt);
          cnt--;
        }
      }

      var newDays = [];
      days.forEach(function(day) {
        if (ineligibleDates.indexOf(day.value) === -1) {
          newDays.push(day);
        }
      });

      paymentFrequencyMonthly2Values.splice(0, paymentFrequencyMonthly2Values.length);

      newDays.forEach(function(item) {
        paymentFrequencyMonthly2Values.push(item);
      });

      return newDays;
    };

    this.getPaymentFrequencyWithAmount = function() {
      return paymentFrequencies;
    };

    this.getDayOfTheWeek = function(date) {
      return $filter('date')(date, 'EEEE');
    };

    this.getCurrentDate = function() {
      return new Date(autoLoanModuleService.getCurrentDate() + 'T12:00:00');
    };

    this.formatPaymentPlan = function(paymentPlan, paymentAccount) {
      var frequencyTypeText1 = paymentFrequencies.filter(function(obj) {
        return obj.name === paymentPlan.paymentFrequency.toUpperCase();
      })[0].display;

      var frequencyTypeText2;
      switch (paymentPlan.paymentFrequency.toUpperCase()) {
        case 'MONTHLY' :
          frequencyTypeText2 = ' ( Every ' + formatDaysOfTheMonth(paymentPlan.daysOfTheMonth[0]) + ' )';
          break;
        case 'TWICEMONTHLY' :
          frequencyTypeText2 = ' ( Every ' + formatDaysOfTheMonth(paymentPlan.daysOfTheMonth[0]) + ' and ' +
            formatDaysOfTheMonth(paymentPlan.daysOfTheMonth[1]) + ' )';
          break;
        case 'WEEKLY' :
          frequencyTypeText2 = ' ( Every ' + paymentPlan.dayOfTheWeek + ' )';
          break;
        case 'BIWEEKLY' :
          frequencyTypeText2 = ' ( Every other ' + paymentPlan.dayOfTheWeek + ' )';
          break;
      }

      paymentPlan.frequencyTypeText = frequencyTypeText1 + frequencyTypeText2;

      var bankDetail = paymentPlan.bankDetail;

      if (!bankDetail) {
        bankDetail = {
          bankAccountNumber: paymentAccount.displayAccountNumber,
          bankName: paymentAccount.displayName
        }
      }

      if (bankDetail.bankAccountNumber_TLNPI) {
        bankDetail.bankAccountNumber = bankDetail.bankAccountNumber_TLNPI;
      }
      bankDetail.bankAccountNumber = bankDetail.bankAccountNumber.trim();
      paymentPlan.payFromText = autoLoanPaymentService.formatPayFrom(bankDetail.bankName, bankDetail.bankAccountNumber);
      return paymentPlan;
    };


    this.roundUp = function(number) {
      number = parseFloat((number * 100).toFixed(2));
      number = Math.ceil(number) / 100;
      return parseFloat(number.toFixed(2));
    };

  }

  createAutoLoanPaymentService.$inject = ['$state','autoLoanModuleService', 'UmmPaymentFactory',
    'autoLoanPaymentPlanUtil', 'refreshTransactionsService'];

  function createAutoLoanPaymentService($state, autoLoanModuleService, UmmPaymentFactory,
                                        autoLoanPaymentPlanUtil, refreshTransactionsService) {

    this.createPaymentPlan = function($scope, controller, paymentPlan, accountRefId) {

      var resetControllerFlags = function() {
        controller.disabled = false;
        controller.spinning = false;
      };

      try {
        var promise = autoLoanModuleService.postPaymentPlan(paymentPlan, accountRefId);

        promise.then(function(data) {
          if (data.notificationMessage) {
            $scope.alPlan.errorMessage = data.notificationMessage.text;
            resetControllerFlags();
          } else {
            paymentPlan = autoLoanPaymentPlanUtil.formatPaymentPlan(paymentPlan, controller.from);
            paymentPlan.scheduledTransferDate = data.scheduledPaymentDate;

            UmmPaymentFactory.setSuccessData(paymentPlan);
            $scope.$modalCancel();

            autoLoanModuleService.fetchAccountDetailData($state.params.accountReferenceId).then(function() {
              refreshTransactionsService.refreshTransactions();
              $scope.$modalCancel();
              autoLoanModuleService.createPaymentPlanSuccess($scope);
            });
          }
        }).catch(function(error) {
          $scope.alPlan.errorMessage = error.message;
          resetControllerFlags();
        });
      } catch (error) {
        $scope.alPlan.errorMessage = error.message;
        resetControllerFlags();
      }
    };

  }

  AutoLoanPaymentPlanDeleteController.$inject = ['$scope', '$state', '$filter', 'deleteAutoLoanPaymentService',
    'autoLoanModuleService', 'AutoLoanPubsubService'];

  function AutoLoanPaymentPlanDeleteController($scope, $state, $filter, deleteAutoLoanPaymentService,
                                               autoLoanModuleService,
                                               AutoLoanPubsubService) {
    var vm = this;
    vm.i18n = autoLoanModuleService.getI18n();


    vm.disableButton = false;
    var accountDetailsData = autoLoanModuleService.getAccountDetailsData();
    vm.paymentPlanDetails = autoLoanModuleService.getPaymentPlan();
    vm.cancelMessage = vm.i18n.coaf.payment.recurringPaymentCancelConfirm.cancelMessage.label.v1;
    vm.scheduledDate = $filter('date')(vm.paymentPlanDetails.nextPaymentDate, 'MMMM d, yyyy ');
    vm.cancelMessageAfterScheduledDate =
      vm.i18n.coaf.payment.recurringPaymentCancelConfirm.cancelMessageAfterScheduledDate.label.v1;

    angular.extend(vm, {
      modalType: 'paymentALModal',
      modalClass: 'icon-cycle',
      modalRole: 'region',
      close: function() {

        AutoLoanPubsubService.trackPageView({
          level2: 'account Details'
        });

        vm.focusId = autoLoanModuleService.getFocusId();
        autoLoanModuleService.setDisableMakeAPayment(false);
        $state.go('^', {}, {location: 'replace'});
      }
    });

    vm.ariaCancelPaymentPlanPressed = false;

    vm.cancelPaymentPlan = function() {
      vm.disableButton = true;
      vm.ariaCancelPaymentPlanPressed = true;
      deleteAutoLoanPaymentService.deletePaymentPlan($scope, vm, accountDetailsData.accountRefId);
    };

    vm.isDisableButton = function() {
      return vm.disableButton;
    };

    AutoLoanPubsubService.trackPageView({
      level2: 'cancel payment',
      level3: 'recurring'
    });

  }

  AutoLoanPaymentPlanDeleteSuccessController.$inject = ['$scope','UmmPaymentFactory', 'autoLoanPaymentPlanUtil',
    'autoLoanModuleService', 'AutoLoanPubsubService'];

  function AutoLoanPaymentPlanDeleteSuccessController($scope, UmmPaymentFactory, autoLoanPaymentPlanUtil,
                                                      autoLoanModuleService, AutoLoanPubsubService) {

    $scope.i18n = autoLoanModuleService.getI18n();

    var vm = this;
    vm.paymentPlan = autoLoanModuleService.getPaymentPlan();

    vm.paymentPlan.totalAmount = parseFloat(vm.paymentPlan.paymentAmount);
    if (vm.paymentPlan.additionalPrincipalAmount) {
      vm.paymentPlan.totalAmount = autoLoanPaymentPlanUtil.roundUp(
        parseFloat(vm.paymentPlan.paymentAmount) + parseFloat(vm.paymentPlan.additionalPrincipalAmount));
    }

    angular.extend(vm, {
      modalType: 'successModal',
      modalClass: 'icon-check',
      modalRole: 'region',
      successMsg: UmmPaymentFactory.getSuccessData(),

      close: function() {
        vm.focusId = autoLoanModuleService.getFocusId();
        autoLoanModuleService.setDisableMakeAPayment(false);
      }
    });

    AutoLoanPubsubService.trackPageView({
      level2: 'cancel payment',
      level3: 'recurring',
      level4: 'confirmation'

    });

  }

  deleteAutoLoanPaymentService.$inject = ['$state', 'autoLoanModuleService', 'refreshTransactionsService'];

  function deleteAutoLoanPaymentService($state, autoLoanModuleService, refreshTransactionsService) {
    this.deletePaymentPlan = function($scope, controller, accountRefId) {
      try {
        var promise = autoLoanModuleService.deletePaymentPlan(accountRefId);

        promise.then(function(data) {
          if (data) {
            $scope.deletePlan.errorMessage = data.notificationMessage.text;
            controller.disabled = false;
          } else {
            autoLoanModuleService.fetchAccountDetailData($state.params.accountReferenceId).then(function() {
              refreshTransactionsService.refreshTransactions();
              autoLoanModuleService.deletePaymentPlanSuccess($scope);
              autoLoanModuleService.setDisableMakeAPayment(true);
              $scope.$modalCancel();
            });
          }
        }).catch(function(error) {
          $scope.deletePlan.errorMessage = error.message;
          controller.disabled = false;
        });
      } catch (error) {
        $scope.deletePlan.errorMessage = error.message;
        controller.disabled = false;
      }
    };
  }

  return {
    'AutoLoanPaymentPlanController': AutoLoanPaymentPlanController,
    'AutoLoanPaymentPlanSuccessController': AutoLoanPaymentPlanSuccessController,
    'AutoLoanPaymentPlanDetailsController': AutoLoanPaymentPlanDetailsController,
    'AutoLoanPaymentPlanDeleteController': AutoLoanPaymentPlanDeleteController,
    'AutoLoanPaymentPlanDeleteSuccessController': AutoLoanPaymentPlanDeleteSuccessController,
    'autoLoanPaymentPlanUtil': autoLoanPaymentPlanUtil,
    'createAutoLoanPaymentService': createAutoLoanPaymentService,
    'deleteAutoLoanPaymentService': deleteAutoLoanPaymentService
  };
});

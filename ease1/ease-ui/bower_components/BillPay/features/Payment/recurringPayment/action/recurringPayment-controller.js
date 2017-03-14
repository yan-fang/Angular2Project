define(['angular'], function(angular) {
  'use strict';

  angular
    .module('BillPayModule')
    .controller('RecurringPaymentController', RecurringPaymentController);

  RecurringPaymentController.$inject = [
    '$state',
    '$stateParams',
    '$filter',
    '$timeout',
    'RecurringPaymentService',
    'PayeeDetailService',
    'DatePickerService',
    'AccountsService',
    'PaymentDateService',
    'PaymentDetailService',
    'BillPayPubSubFactory'
  ];

  function RecurringPaymentController(
    $state,
    $stateParams,
    $filter,
    $timeout,
    PaymentService,
    PayeeDetailService,
    DatePickerService,
    AccountsService,
    PaymentDateService,
    PaymentDetailService,
    BillPayPubSubFactory
  ) {

    var vm = this;

    angular.extend(this, {
      // ease modal configuration
      modalClass: 'billPay-payment-modal',
      pageTitle: 'Recurring Payment',
      accountSubCategory: $stateParams.subCategory,
      isPaymentProcessing: false,
      uiSwitch: {
        page: 'main',
        datepickerMode: 'firstPaymentDate'
      },
      calendarConfig: {},
      calendarOutPut: {},
      paymentInformation: getPaymentInformation(),
      durationOptions: PaymentService.getDurationOptions(),
      frequencyOptions: PaymentService.getFrequencyOptions(),
      notificationOptions: PaymentService.getNotificationOptions(),
      eligibleAccounts: AccountsService.getEligibleAccounts(),

      close: closeModal,
      pickPaymentDate: pickPaymentDate,
      pickDateDone: pickDateDone,
      getAmountSubLabel: getAmountSubLabel,
      getStartDateSubLabel: getStartDateSubLabel,
      clearStopPaymentInfo: clearStopPaymentInfo,
      changeStopPaymentDate: changeStopPaymentDate,
      changeNumberOfPayment: changeNumberOfPayment,
      goToMainPage: goToMainPage,
      accountOnChange: accountOnChange,
      goToOnetimeFn: goToOnetimeFn,
      schedulePayment: schedulePayment
    });

    logSitecatalystEvent('recurringOnLoad');

    function getPaymentInformation() {
      var payee = PayeeDetailService.getPayeeDetail();
      var eligibleAccounts = AccountsService.getEligibleAccounts();
      var earliestPaymentDate = PaymentDateService.getEarliestPaymentDate(payee);

      PaymentService.initPaymentInfo(
        payee,
        eligibleAccounts,
        earliestPaymentDate
      );

      return PaymentService.getPaymentInfo();
    }

    function closeModal() {
      logSitecatalystEvent('billPayCenter');
      $state.go($state.current.parent);
      returnFocus($stateParams.returnFocusId);
    }

    function returnFocus(id) {
      if (!id) return;

      $timeout(function() {
        try {
          document
            .getElementById(id)
            .focus();
        /*eslint-disable */
        } catch (err) {
        }
        /*eslint-enable */
      }, 100);
    }

    function pickPaymentDate(mode) {
      var datepickerType = 'paymentDate';
      var maxDate;
      var minDate;
      vm.uiSwitch.page = 'datepicker';
      vm.uiSwitch.datepickerMode = mode;
      vm.pageTitle = getPageTitle();

      if (mode === 'finalPaymentDate') {
        maxDate = new Date(8640000000000000);
        minDate = new Date(vm.paymentInformation.firstPaymentDate);
        datepickerType = 'finalPaymentDate';
        vm.paymentInformation.duration = 'FinalPaymentDate';
        if (!vm.paymentInformation.finalPaymentDate) {
          vm.paymentInformation.finalPaymentDate = PaymentService.getDefaultEndPaymentDate(
            vm.paymentInformation.firstPaymentDate,
            vm.paymentInformation.frequency
          );
        }
        logSitecatalystEvent('recurringEndCalendar');
      }

      DatePickerService.initDatePicker(
        datepickerType,
        vm.accountSubCategory,
        vm.paymentInformation.payee,
        vm.paymentInformation[mode],
        maxDate,
        minDate
      );
      vm.calendarConfig = DatePickerService.getConfiguration();
      vm.calendarOutPut = DatePickerService.getCalenderOutPutObj();
    }

    function pickDateDone() {
      if (vm.uiSwitch.datepickerMode === 'finalPaymentDate') {
        vm.uiSwitch.page = 'endPaymentByDate';
        vm.paymentInformation.finalPaymentDate = new Date(DatePickerService.getPaymentDate());
        vm.pageTitle = getPageTitle();
        logSitecatalystEvent('recurringEndPaymentsReview');
      } else {
        vm.uiSwitch.page = 'main';
        vm.paymentInformation.firstPaymentDate = new Date(DatePickerService.getPaymentDate());
        vm.pageTitle = getPageTitle();
        logSitecatalystEvent('recurringOnLoad');
      }
    }

    function getAmountSubLabel() {
      var payee = vm.paymentInformation.payee;

      if (PayeeDetailService.checkPayeeLatestScheduledTrx(payee)) {
        if (payee.totalSameDayScheduledPayments === 1) {
          return 'Scheduled ' + $filter('currency')(payee.latestScheduledTransactionAmount);
        }

        if (payee.totalSameDayScheduledPayments > 1) {
          return 'Totaling ' + $filter('currency')(payee.latestScheduledTransactionAmount);
        }
      }

      if (PayeeDetailService.checkPayeeLastPaymentInfo(payee)) {
        return 'Last Paid ' + $filter('currency')(payee.lastPaymentAmount);
      }

      return '';
    }

    function getStartDateSubLabel() {
      var payee = vm.paymentInformation.payee;

      if (PayeeDetailService.checkPayeeLatestScheduledTrx(payee)) {
        if (payee.totalSameDayScheduledPayments > 1) {
          return payee.totalSameDayScheduledPayments +
                 ' Scheduled ' +
                 $filter('date')(payee.latestScheduledTransactionDate, 'MMM dd');
        }
        if (payee.totalSameDayScheduledPayments === 1) {
          return 'Scheduled ' +
                 $filter('date')(payee.latestScheduledTransactionDate, 'MMM dd');
        }
      }

      if (PayeeDetailService.checkPayeeLastPaymentInfo(payee)) {
        var currentYear = new Date().getFullYear();
        var startDate =  $filter('date')(payee.lastPaymentDate, 'MMM dd, yyyy');
        var isCurrentYear = new RegExp(currentYear+'$').test(startDate);
        if (isCurrentYear) {
          startDate =  $filter('date')(payee.lastPaymentDate, 'MMM dd');
        }
        return 'Last Paid ' + startDate;
      }

      return '';
    }

    function clearStopPaymentInfo() {
      this.paymentInformation.finalPaymentDate = undefined;
      this.paymentInformation.numberOfPayments = 0;
      this.paymentInformation.finalPaymentAmount = 0;
    }

    function changeStopPaymentDate(eventFrom) {
      if (!vm.paymentInformation.finalPaymentDate) {
        vm.paymentInformation.finalPaymentAmount = 0;
      }
      vm.paymentInformation.numberOfPayments = 0;
      vm.paymentInformation.duration = 'FinalPaymentDate';
      if (eventFrom === 'radio' && vm.paymentInformation.finalPaymentDate) return;
      pickPaymentDate('finalPaymentDate');
    }

    function changeNumberOfPayment(eventFrom) {
      if (vm.paymentInformation.numberOfPayments === 0) {
        vm.paymentInformation.finalPaymentAmount = 0;
      }
      vm.paymentInformation.finalPaymentDate = undefined;
      vm.paymentInformation.duration = 'NumberOfPayments';
      if (eventFrom === 'radio' && vm.paymentInformation.numberOfPayments > 0) return;
      if (vm.paymentInformation.numberOfPayments < 2) vm.paymentInformation.numberOfPayments = 2;
      vm.uiSwitch.page = 'endPaymentByNumberOfPayments';
      vm.pageTitle = getPageTitle();
      logSitecatalystEvent('recurringEndAfterXPayment');
    }

    function goToMainPage() {
      vm.uiSwitch.page = 'main';
      vm.pageTitle = getPageTitle();
      logSitecatalystEvent('recurringOnLoad');
    }

    function schedulePayment() {
      vm.isPaymentProcessing = true;

      PaymentService.recurringPaymentRestCall()
        .then(function() {
          vm.isPaymentProcessing = false;
          $state.go('BillPay.ConfirmRecurringPayment', {
            subCategory: vm.accountSubCategory
            // actionType: vm.actionType
          });
        });
    }

    function getPageTitle() {
      var page = vm.uiSwitch.page;
      var datepickerMode = vm.uiSwitch.datepickerMode;
      returnFocusToTitle();

      switch (page) {
        case 'main':
          return 'Recurring Payment';
        case 'endPaymentByDate':
          return 'End Payments';
        case 'endPaymentByNumberOfPayments':
          return 'End Payments'
        case 'datepicker':
          return (datepickerMode === 'firstPaymentDate') ?
            'Start Payment' : 'End Payment';
        default:
          break;
      }

      return '';
    }

    function returnFocusToTitle() {
      document.getElementsByClassName('ease-modal-title')[0].focus()
    }

    function accountOnChange() {
      BillPayPubSubFactory.logChangeEvent('pay from account:dropdown');
    }

    function goToOnetimeFn() {
      // 1. set up payment detail
      var paymentDetail = {
        payerDetail: {
          accountReferenceId: vm.paymentInformation.account.referenceId
        },
        transactionInfo: {
          paymentAmount: vm.paymentInformation.paymentAmount,
          paymentDetailDates: {
            paymentDate: vm.paymentInformation.firstPaymentDate
          }
        }
      }
      PaymentDetailService.setPaymentDetail(paymentDetail);

      // 2. go to one time payment
      $state.go('BillPay.MakePayment', {
        reloadData: false
      });
    }

    function logSitecatalystEvent(viewName) {
      BillPayPubSubFactory.logTrackAnalyticsPageView(
        '360',
        viewName
      );
    }

    /* test-code */
    vm.__testonly__ = {};
    vm.__testonly__.getPageTitle = getPageTitle;
    vm.__testonly__.accountOnChange = accountOnChange;
    vm.__testonly__.returnFocus = returnFocus;
    /* end-test-code */
  }
});

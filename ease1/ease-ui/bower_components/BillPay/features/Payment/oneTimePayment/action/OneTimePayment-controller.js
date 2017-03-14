define(['angular'], function(angular) {
  'use strict';

  angular
    .module('BillPayModule')
    .controller('OneTimePaymentController', OneTimePaymentController);

  OneTimePaymentController.$inject = [
    '$scope',
    '$filter',
    '$state',
    '$stateParams',
    '$timeout',
    'AccountsService',
    'PayeeDetailService',
    'StringUtils',
    'OneTimePaymentService',
    'PaymentDetailService',
    'PaymentDateService',
    'DatePickerService',
    'BillPayPubSubFactory'
  ];

  function OneTimePaymentController(
    $scope,
    $filter,
    $state,
    $stateParams,
    $timeout,
    AccountsService,
    PayeeDetailService,
    StringUtils,
    OneTimePaymentService,
    PaymentDetailService,
    PaymentDateService,
    DatePickerService,
    BillPayPubSubFactory
  ) {

    var vm = this;

    angular.extend(this, {
      // ease modal configuration
      modalClass: 'billPay-payment-modal',
      actionType: getActionType($stateParams.transactionReferenceId),
      modalTitle: getActionType($stateParams.transactioNReferenceId) + ' a Payment',
      // view switch
      showDatePicker: false,
      showMemo: false,
      isPaymentProcessing: false,
      // directive configuration object
      calendarConfig: {},
      calendarOutPut: {},
      // view object
      accountSubCategory: $stateParams.subCategory,
      paymentInformation: getPaymentInformation(),
      eligibleAccounts: AccountsService.getEligibleAccounts(),

      close: closeModal,
      getAmountSubLabel: getAmountSubLabel,
      pickPaymentDate: pickPaymentDate,
      pickDateDone: pickDateDone,
      getArriveDate: getArriveDate,
      addMemo: addMemo,
      schedulePayment: schedulePayment,
      checkLastPaymentInfo: PayeeDetailService.checkPayeeLastPaymentInfo,
      checkScheduledPaymentInfo: PayeeDetailService.checkPayeeLatestScheduledTrx,
      accountOnChange: accountOnChange
    });

    // init controller
    vm.showMemo = isShowMemo();
    logSitecatalystEvent(
      'oneTimeEditPaymentLanding',
      'oneTimePaymentLanding'
    );

    // methods
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
    
    function isShowMemo() {
      if (!vm.paymentInformation.memoText) return false;
      return true;
    }

    function getActionType(transactionReferenceId) {
      return StringUtils.isEmpty(transactionReferenceId) ? 'Make' : 'Edit';
    }

    function getPaymentInformation() {
      var payee = PayeeDetailService.getPayeeDetail();
      var eligibleAccounts = AccountsService.getEligibleAccounts();
      var paymentDetail = PaymentDetailService.getPaymentInfo();
      var earliestPaymentDate = PaymentDateService.getEarliestPaymentDate(payee);
      var eBillReferenceId = $stateParams.unscheduledeBillReferenceId;
      var transactionReferenceId = $stateParams.transactionReferenceId;

      OneTimePaymentService.initPaymentInfo(
        payee,
        eligibleAccounts,
        paymentDetail,
        earliestPaymentDate,
        eBillReferenceId,
        transactionReferenceId
      );

      return OneTimePaymentService.getPaymentInfo();
    }

    function closeModal() {
      logSitecatalystEvent('bankAccountDetail', 'billPayCenter');
      $state.go($state.current.parent);
      returnFocus($stateParams.upcomingFocusId||$stateParams.returnFocusId);
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

    function pickPaymentDate() {
      // 1. Turn on the data picker switch to show data picker
      vm.showDatePicker = true;

      // 2. initilize date picker
      DatePickerService.initDatePicker(
        'paymentDate',
        vm.accountSubCategory,
        vm.paymentInformation.payee,
        vm.paymentInformation.paymentDate
      );
      vm.calendarConfig = DatePickerService.getConfiguration();
      vm.calendarOutPut = DatePickerService.getCalenderOutPutObj();

      // 3. brocast site catalyst event
      logSitecatalystEvent(
        'oneTimeEditPaymentDateSelection',
        'oneTimePaymentDateSelection'
      );

      // 4. focus on close button when data picker is showing
      document.getElementById('closeModalWindow_billPay-make-payment-modal').focus();
    }

    function pickDateDone() {
      vm.showDatePicker = false;
      vm.paymentInformation.paymentDate = new Date(DatePickerService.getPaymentDate());
      BillPayPubSubFactory.logChangeEvent(vm.accountSubCategory + ':payment date change:button');
    }

    function getArriveDate() {
      return PaymentDateService.getArriveDate(
        vm.paymentInformation.paymentDate,
        vm.paymentInformation.payee.paymentDeliveryLeadDaysCount,
        $stateParams.subCategory
      );
    }

    function addMemo() {
      vm.showMemo=true;
      $timeout(function() {
        document.getElementById('PaymentMemo').focus();
      }, 100);
    }

    function schedulePayment() {
      // 1. start loading indicator
      vm.isPaymentProcessing = true;

      // 2. send a rest call to server
      OneTimePaymentService.paymentRestCall().then(function() {
        // 3. stop loading indicator
        vm.isPaymentProcessing = false;

        // 4. go to payment confirmation modal
        $state.go($state.current.parent.split('.')[0] + '.ConfirmPayment', {
          returnFocusId: $stateParams.returnFocusId || null,
          subCategory: vm.accountSubCategory,
          actionType: vm.actionType
        });
      });
    }

    function logSitecatalystEvent(editPaymentView, makePaymentView) {
      var viewName = (vm.actionType === 'Edit') ? editPaymentView : makePaymentView;

      BillPayPubSubFactory.logTrackAnalyticsPageView(
        $stateParams.subCategory,
        viewName
      );
    }

    function accountOnChange() {
      BillPayPubSubFactory.logChangeEvent(vm.accountSubCategory + ':pay from change:dropdown');
    }

    /* test-code */
    vm.__testonly__ = {};
    vm.__testonly__.getActionType = getActionType;
    vm.__testonly__.logSitecatalystEvent = logSitecatalystEvent;
    vm.__testonly__.isShowMemo = isShowMemo;
    vm.__testonly__.returnFocus = returnFocus;
    /* end-test-code */
  }
});

define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .controller('AddPayeeAcctInfoController', AddPayeeAcctInfoController);

  AddPayeeAcctInfoController.$inject = [
    'PayeeService',
    '$state',
    'BillPayErrorHandlerService',
    '$location',
    'BillPayPubSubFactory',
    'BillPayConstants'
  ];

  function AddPayeeAcctInfoController(
    PayeeService,
    $state,
    BillPayErrorHandlerService,
    $location,
    BillPayPubSubFactory,
    BillPayConstants
  ) {
    var vm = this;

    angular.extend(this, {
      inputMatch: true,
      accountMismatchErrorMessage: '',
      requestInProgress: false,
      alphaNumericRegex: /^[A-z0-9 .']+$/,
      zipRegex: BillPayConstants.zipcodeNineRegex,
      fixableErrors: PayeeService.getErrorFields('accountInfo'),

      submitAcctInfo: submitAcctInfo,
      goToAcctNumberAsk: goToAcctNumberAsk,
      compareAccountNumbers: compareAccountNumbers,
      trackEvents: trackEvents,
      clearError: clearError
    });

    trackEvents(PayeeService.getManualAdd());

    /**
     * Sends page load events to the Sitecatalyst service. Page name being sent is dependent on
     * whether user is in an add registered payee flow or add from manual flow
     *
     * @param {bool} isManualAdd - True for add from manual flow, false for registered payee
     */
    function trackEvents(isManualAdd) {
      if (isManualAdd) {
        logSitecatalystEvent('manualAddPayeeInfo');
      } else {
        logSitecatalystEvent('searchPayeeAddPayeeInfo');
      }
    }

    /**
     * Used in an ng-change event to remove the field in question from the recoverable
     * error list
     *
     * @param {string} fieldName - error array key to remove
     */
    function clearError(fieldName) {
      var idx = vm.fixableErrors.indexOf(fieldName);

      if (idx !== -1) {
        vm.fixableErrors.splice(idx, 1);
      }
    }

    /**
     * Submits given information to the payee service / OL. This is only used in the
     * registered payee flow. When called will trigger a loading indicator while the XHR
     * request is in progress. On success will move user to the success view, on error will
     * determine whether a recoverable error has occured and act appropriately. Unrecoverable
     * errors will take user to the 'hit a snag' modal :'‑(
     *
     * @param {object} payeeInfo - Collected form data to send to the OL
     */
    function submitAcctInfo(payeeInfo) {
      if (vm.requestInProgress) {
        return;
      }

      // Show loading animation
      vm.requestInProgress = true;

      PayeeService.supplementPayee(payeeInfo);

      PayeeService.addPayee().then(function success(res) {
        payeeInfo.payeeReferenceId = res.payeeReferenceId;
        $state.go('BillPay.addPayee.success');
      }, function error(err) {
        vm.requestInProgress = false;

        if (err.recoverable) {
          vm.fixableErrors = PayeeService.getErrorFields('accountInfo');
          $state.go(err.nextStep);
        } else {
          BillPayErrorHandlerService.handleError(err);
        }
      });
    }

    /**
     * Method to take users to the previous step in the flow (is account number required view)
     */
    function goToAcctNumberAsk() {
      $state.go('BillPay.addPayee.acctNumberAsk');
    }

    /**
     * When given two account numbers as input, sets a property on the controller to indicate a
     * success or unsuccessful match. This is used to show errors and enable/disable the submit
     * button
     *
     * @param {string} accountNumberOne - Account number
     * @param {string} accountNumberTwo - Account number confirmation
     */
    function compareAccountNumbers(accountNumberOne, accountNumberTwo) {
      vm.inputMatch = accountNumberOne === accountNumberTwo;
    }

    function logSitecatalystEvent(viewName) {
      BillPayPubSubFactory.logTrackAnalyticsPageView(
        $location.search().subCategory,
        viewName
      );
    }
  }
});

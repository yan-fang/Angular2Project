define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .controller('AddPayeeSuccessController', AddPayeeSuccessController);

  AddPayeeSuccessController.$inject = [
    '$state',
    'PayeeDetailService',
    '$location',
    'BillPayPubSubFactory',
    'PayeeService',
    'SearchPayeeService',
    '$timeout'
  ];

  function AddPayeeSuccessController(
    $state,
    PayeeDetailService,
    $location,
    BillPayPubSubFactory,
    PayeeService,
    SearchPayeeService,
    $timeout
  ) {
    var vm = this;

    angular.extend(this, {
      modalClass: ['add-payee-flow', 'bill-pay-add-payee', 'add-payee-success'],
      loading: false,

      close: close,
      goToAddAnotherPayee: goToAddAnotherPayee,
      goToSchedulePayment: goToSchedulePayment,
      trackEvents: trackEvents
    });

    trackEvents(PayeeService.getManualAdd());

    function trackEvents(isManualAdd) {
      if (isManualAdd) {
        logSitecatalystEvent('manualAddPayeeConfirmation');
      } else {
        logSitecatalystEvent('searchPayeeConfirmation');
      }
    }

    function close() {
      SearchPayeeService.resetSearchData();
      PayeeService.setErrorStatus(null);
      $state.go('BillPay.PayeeList', {
        returnFocusId: 'btn-add-payee'
      });
    }

    function goToAddAnotherPayee() {
      SearchPayeeService.resetSearchData();
      PayeeService.setErrorStatus(null);
      $state.go('BillPay.searchPayee', {}, {
        reload: true
      });
    }

    function goToSchedulePayment(payeeInfo) {
      if (vm.loading) {
        return;
      }

      vm.loading = true;

      PayeeDetailService.initializePayeeDetail(
        payeeInfo.payeeReferenceId,
        $state.params.accountReferenceId
      ).then(function() {
        SearchPayeeService.resetSearchData();
        PayeeService.setErrorStatus(null);
        $state.go('BillPay.MakePayment', {
          returnFocusId: 'btn-add-payee'
        }, {
          reload: true
        });
      });
    }

    function logSitecatalystEvent(viewName) {
      BillPayPubSubFactory.logTrackAnalyticsPageView(
        $location.search().subCategory,
        viewName
      );
    }

    function returnFocus(id) {
      if (!id) {
        return;
      }

      $timeout(function() {
        try {
          document.getElementById(id).focus();
          /*eslint-disable */
        } catch (err) {}
        /*eslint-enable */
      }, 100);
    }

    /* test-code */
    vm.__testonly__ = {};
    vm.__testonly__.returnFocus = returnFocus;
    /* end-test-code */
  }
});

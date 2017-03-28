define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .controller('AddPayeeController', AddPayeeController);

  AddPayeeController.$inject = [
    'PayeeService',
    'SearchPayeeService',
    '$state',
    '$location',
    'BillPayPubSubFactory',
    '$timeout'
  ];

  function AddPayeeController(
    PayeeService,
    SearchPayeeService,
    $state,
    $location,
    BillPayPubSubFactory,
    $timeout
  ) {

    var vm = this;
    
    angular.extend(this, {
      modalClass: ['bill-pay-add-payee', 'add-payee-flow'],
      payeeInfo: PayeeService.getPayee(),
      manualAdd: PayeeService.getManualAdd(),

      close: close,
      goToSearch: goToSearch,
      goToAcctNumberAsk: goToAcctNumberAsk,
      goToAccountInfo: goToAccountInfo
    });

    function close() {
      logSitecatalystEvent('billPayCenter');
      SearchPayeeService.resetSearchData();
      PayeeService.setErrorStatus(null);
      $state.go('BillPay.PayeeList').then(returnFocus('btn-add-payee'));
    }

    function goToSearch() {
      PayeeService.setErrorStatus(null);
      $state.go('BillPay.searchPayee');
    }

    function goToAcctNumberAsk() {
      $state.go('BillPay.addPayee.acctNumberAsk');
    }

    function goToAccountInfo() {
      $state.go('BillPay.addPayee.accountInfo');
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

  }
});

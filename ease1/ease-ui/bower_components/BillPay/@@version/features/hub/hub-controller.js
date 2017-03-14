define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .controller('BillPayHubController', BillPayHubController);

  BillPayHubController.$inject = [
    '$state',
    '$location',
    'BillPayEnvironmentConstants',
    'PayeeListService',
    'BillPayPubSubFactory'
  ];
  function BillPayHubController(
    $state,
    $location,
    BillPayEnvironmentConstants,
    PayeeListService,
    BillPayPubSubFactory
  ) {
    var vm = this;

    angular.extend(this, {
      loading: PayeeListService.getLoading(),
      payeeList: PayeeListService.getPayeeList(),
      accountSubCategory: $location.search().subCategory,
      billPayUrl: BillPayEnvironmentConstants.payBillsUrl,
      retailBillPayUrl: BillPayEnvironmentConstants.retailBillpayUrl
    });

    init();

    function init() {
      getPayeeList();

      BillPayPubSubFactory.logTrackAnalyticsPageView(
        $location.search().subCategory,
        'billPayCenter'
      );
    }

    function getPayeeList() {
      PayeeListService.updatePayeeList($state.params.accountReferenceId).then(function(res) {
        vm.payeeList = res;
      });
    }
  }
});

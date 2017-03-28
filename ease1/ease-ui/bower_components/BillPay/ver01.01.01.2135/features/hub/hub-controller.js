define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .controller('BillPayHubController', BillPayHubController);

  BillPayHubController.$inject = [
    '$state',
    '$location',
    'BillPayEnvironmentConstants',
    'PayeeListService',
    'BillPayPubSubFactory',
    'HubService',
    'BillPayConstants',
    '$sce',
    'FeatureToggleService'
  ];

  function BillPayHubController(
    $state,
    $location,
    BillPayEnvironmentConstants,
    PayeeListService,
    BillPayPubSubFactory,
    HubService,
    BillPayConstants,
    $sce,
    FeatureToggleService
  ) {
    var vm = this;

    angular.extend(this, {
      isMobile: !window.matchMedia(BillPayConstants.desktopMediaQuery).matches,
      rxpUrl: null,
      rxpLoading: false,
      rxpError: false,
      loading: PayeeListService.getLoading(),
      payeeList: PayeeListService.getPayeeList(),
      accountSubCategory: $location.search().subCategory,
      billPayUrl: BillPayEnvironmentConstants.payBillsUrl,
      retailBillPayUrl: BillPayEnvironmentConstants.retailBillpayUrl,
      rxpExperience: (window.matchMedia(BillPayConstants.desktopMediaQuery).matches
                      && $location.search().subCategory !== '360'
                      && FeatureToggleService.getFeatureToggleData()['ease.billpay.olbr.rxp']),
      features: {
        addPayee: FeatureToggleService.getFeatureToggleData()['ease.billpay.addpayee']
      }
    });

    init();

    function init() {
      // Load the payee list if the user is on mobile or 360
      if (!vm.rxpExperience) {
        getPayeeList();
      } else {
        vm.rxpLoading = true;

        HubService.getRxpUrl().then(function(res) {
          vm.rxpLoading = false;
          vm.rxpUrl = $sce.trustAsResourceUrl(res.url);
        }, function(err) {
          vm.rxpLoading = false;
          vm.rxpError = true;
          vm.rxpErrorMessage = err.msg;
        });
      }

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

define(['angular', 'AutoLoanPubSub'], function(angular) {
  'use strict';

  AutoLoanPayOffPaymentController.$inject = ['$scope', 'UmmPaymentFactory',
    'autoLoanModuleService', 'autoLoanPaymentAddAccountService', 'autoLoanPaymentPayoffUtil'];

  function AutoLoanPayOffPaymentController($scope, UmmPaymentFactory,
                                           autoLoanModuleService, autoLoanPaymentAddAccountService,
                                           autoLoanPaymentPayoffUtil) {

    $scope.accountDetailsData = autoLoanModuleService.getAccountDetailsData();
    $scope.i18n = autoLoanModuleService.getI18n();

    var vm = this;
    vm.selectPayoffDetails = null;

    var defaultAccount = autoLoanPaymentAddAccountService.getDefaultPaymentAccountData(UmmPaymentFactory);
    if (defaultAccount) {
      vm.from = defaultAccount;
    } else {
      vm.from = null;
    }

    vm.paymentAccountService = UmmPaymentFactory;
    vm.placeHolderFrom = UmmPaymentFactory.getUmmData().defaultBlankAccount;

    vm.populatePayoffAmountAndDateValues = function() {
      return autoLoanPaymentPayoffUtil.populatePayoffAmountAndDateList();
    };

    vm.showPayoffConfirm = function() {
      vm.ariaPayOffPressed = true;
      autoLoanPaymentPayoffUtil.verifyPayoff($scope, vm);
    };

    vm.isFormInvalid = function() {
      if (vm.selectPayoffDetails === null) {
        return true;

      } else if (vm.from === '' || vm.from === null || !vm.from.accountType) {
        return true;

      } else if (vm.isDisplayError) {
        return true;
      }
      return false;
    };

  }

  AutoLoanPayOffSummaryController.$inject = ['$scope', '$state',
    'autoLoanModuleService', 'autoLoanPaymentPayoffUtil', 'autoLoanPaymentService', 'AutoLoanPubsubService'];

  function AutoLoanPayOffSummaryController($scope, $state,
                                           autoLoanModuleService, autoLoanPaymentPayoffUtil, autoLoanPaymentService,
                                           AutoLoanPubsubService) {

    $scope.accountDetailsData = autoLoanModuleService.getAccountDetailsData();
    $scope.i18n = autoLoanModuleService.getI18n();

    var vm = this;
    vm.from = null;

    vm.payoffDetail = autoLoanModuleService.getPayoffDetails();
    angular.extend(vm, {
      modalType: 'paymentALModal',
      modalClass: 'icon-cycle',
      modalRole: 'region',
      initClose: false,
      errorMessage: null,
      close: function() {
        AutoLoanPubsubService.trackPageView({
          level2: 'account details'
        });


        vm.focusId = autoLoanModuleService.getFocusId();
        if ($state.current.parent) {
          $state.go($state.current.parent.name);
        }
      }
    });


    vm.makePayoffPayment = function() {
      vm.ariaPayOffPressed = true;
      autoLoanPaymentPayoffUtil.submitPayoffPayment($scope, vm);
    };

    vm.editPayoff = function() {
      var areTagsHidden = $state.params.payment !== undefined && $state.params.payment.areTabsHidden === true;
      $scope.$modalCancel();
      autoLoanPaymentService.payNow('Payoff', areTagsHidden);
    };

    AutoLoanPubsubService.trackPageView({
      level2: 'pay bill',
      level3: 'payoff',
      level4: 'summary'
    });
  }

  return {
    'AutoLoanPayOffPaymentController': AutoLoanPayOffPaymentController,
    'AutoLoanPayOffSummaryController': AutoLoanPayOffSummaryController
  };
});

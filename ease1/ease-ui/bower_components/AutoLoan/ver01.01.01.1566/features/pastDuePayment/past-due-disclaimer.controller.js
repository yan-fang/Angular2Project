define(['angular'],
  function() {
    'use strict';

    function PastDueDisclaimerController($scope, $state, autoLoanModuleService, autoLoanPaymentService) {
      var vm = this;
      vm.i18n = autoLoanModuleService.getI18n();
      vm.modalType = 'past-due-disclaimer-modal';

      vm.close = function() {
        if ($state.params.fromState === 'AutoLoanPayment') {
          autoLoanPaymentService.payNow();
          autoLoanModuleService.setDisableMakeAPayment(true);
        }else if ($state.params.fromState === 'AutoLoanDetails.transactions.pastDuePayment') {
          $state.go('AutoLoanDetails.transactions.pastDuePayment');
        }else if ($state.params.fromState === 'carPayCatchUp') {
          $state.go('carPayCatchUp');
        }else {
          $state.go('AutoLoanDetails.transactions.paymentDetails');
        }
      };
    }

    return {
      'PastDueDisclaimerController': PastDueDisclaimerController
    }
  });

define(['angular'],
  function(angular) {
    'use strict';

    function AutoLoanCarPayCatchupErrorController($scope, $state, autoLoanModuleService, carPayCatchUpService) {
      var vm = this;
      vm.i18n = autoLoanModuleService.getI18n();

      vm.returnToAccount = function(evt) {
        vm.focusId = evt.target.id;
        $state.go('^');
      };

      vm.tryAgain = function(evt) {
        vm.focusId = evt.target.id;
        carPayCatchUpService.tryAgain();
      };

      angular.extend(vm, {
        modalType: 'car-pay-catch-up-modal',
        modalClass: 'icon-tiles',
        close: function() {
          $state.go('^');
        }
      });
    }
    return AutoLoanCarPayCatchupErrorController;
  });

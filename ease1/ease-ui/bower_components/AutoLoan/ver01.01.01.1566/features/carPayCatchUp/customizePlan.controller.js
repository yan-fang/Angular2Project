define(['angular'],
  function() {
    'use strict';

    function CustomizePlanController($state, autoLoanModuleService) {

      var vm = this;
      vm.i18n = autoLoanModuleService.getI18n();
      vm.modalType = 'car-pay-catch-up-modal';


      vm.close = function() {
        $state.go('^');
      };
    }

    return CustomizePlanController;
  });

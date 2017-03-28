define(['angular'],
  function() {
    'use strict';
    var areYouSureCpCuPubSub = {
      level2: 'account details',
      level3: 'past due',
      level4: 'cpcu',
      level5: 'exit'
    };
    function AreYouSureController($state, autoLoanModuleService, carPayCatchUpService,AutoLoanPubsubService) {


      AutoLoanPubsubService.trackPageView(areYouSureCpCuPubSub);

      var vm = this;
      vm.i18n = autoLoanModuleService.getI18n();
      vm.modalType = 'car-pay-catch-up-modal';


      vm.close = function() {
        var accountTypePubSub = {accountType: 'create a payment'};
        areYouSureCpCuPubSub.level4 = '';
        areYouSureCpCuPubSub.level5= '';
        AutoLoanPubsubService.trackPageViewTrackAccountType(accountTypePubSub,areYouSureCpCuPubSub);
        $state.go('^');
      };

      vm.goBack = function() {
        AutoLoanPubsubService.trackClickEvent({name : 'go back:button'});
        carPayCatchUpService.goBackFromAreYouSure();
      }
    }

    return AreYouSureController;
  });

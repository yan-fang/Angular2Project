define(['angular'],
  function() {
    'use strict';
    var contactUsCpCuPubSub = {
      level2: 'account details',
      level3: 'past due',
      level4: 'cpcu',
      level5: 'no first payment'
    };
    function CPCUContactUsController($state, autoLoanModuleService,AutoLoanPubsubService) {

      var vm = this;
      AutoLoanPubsubService.trackPageView(contactUsCpCuPubSub);
      vm.i18n = autoLoanModuleService.getI18n();
      vm.modalType = 'car-pay-catch-up-modal';


      vm.close = function() {
        var accountTypePubSub = {accountType: 'create a payment'};
        contactUsCpCuPubSub.level4 = '';
        contactUsCpCuPubSub.level5= '';
        AutoLoanPubsubService.trackPageViewTrackAccountType(accountTypePubSub,contactUsCpCuPubSub);
        $state.go('^');
      };
    }

    return CPCUContactUsController;
  });

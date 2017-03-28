define(['angular'],
  function() {
    'use strict';
    var helpIsOnTheWayPubSub = {
      level2: 'account details',
      level3: 'past due',
      level4: '',
      level5: ''
    };
    function HelpIsOnTheWayController($state, autoLoanModuleService,AutoLoanPubsubService) {

      helpIsOnTheWayPubSub.level4='help';
      AutoLoanPubsubService.trackPageView(helpIsOnTheWayPubSub);
      var vm = this;
      vm.i18n = autoLoanModuleService.getI18n();
      vm.modalType = 'help-is-on-the-way-modal';


      vm.close = function() {
        helpIsOnTheWayPubSub.level4='';
        AutoLoanPubsubService.trackPageView(helpIsOnTheWayPubSub);
        $state.go('^');
      };
    }

    return HelpIsOnTheWayController;
  });

define(['angular'],
  function(angular) {
    'use strict';
    var AutoLoanDueDateChangeErrorModule = angular.module('AutoLoanDueDateChangeErrorModule', ['ui.router']);

    var dueDateChangePubSub = {
      level2: '',
      level3: '',
      level4: '',
      level5: ''
    };

    AutoLoanDueDateChangeErrorModule.controller('AutoLoanDueDateChangeErrorController',
      function($scope, $state, autoLoanModuleService, autoLoanDueDateChangeService,AutoLoanPubsubService) {
        var vm = this;
        vm.i18n = autoLoanModuleService.getI18n();
        var accountReferenceId = autoLoanModuleService.getAccountDetailsData().accountDetails.accountReferenceId;

        dueDateChangePubSub.level2='error';
        AutoLoanPubsubService.trackPageView(dueDateChangePubSub);

        vm.returnToAccount = function(evt) {
          vm.focusId = evt.target.id;
          $state.go('^');
        };

        vm.tryAgain = function(evt) {
          vm.focusId = evt.target.id;
          autoLoanDueDateChangeService.tryAgain(accountReferenceId);
        };

        angular.extend(vm, {
          modalType: 'due-date-change-error-modal',
          modalClass: 'icon-tiles',
          close: function() {
            dueDateChangePubSub.level2='account details';
            AutoLoanPubsubService.trackPageView(dueDateChangePubSub);
            $state.go('^');
          }
        });
      });
    return AutoLoanDueDateChangeErrorModule;
  });

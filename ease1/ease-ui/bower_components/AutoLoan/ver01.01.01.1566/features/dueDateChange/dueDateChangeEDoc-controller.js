define(['angular'],
  function(angular) {
    'use strict';
    var AutoLoanDueDateChangeEDocModule = angular.module('AutoLoanDueDateChangeEDocModule', ['ui.router']);

    var dueDateChangePubSub = {
      level2: 'account details',
      level3: 'change due date',
      level4: '',
      level5: ''
    };

    AutoLoanDueDateChangeEDocModule.controller('AutoLoanDueDateChangeEDocController',
      function($scope, $state, $window, autoLoanModuleService, autoLoanDueDateChangeService,AutoLoanPubsubService) {
        var vm = this;
        vm.i18n = autoLoanModuleService.getI18n();
        var accountReferenceId = autoLoanModuleService.getAccountDetailsData().accountDetails.accountReferenceId;
        vm.emailAddress = autoLoanDueDateChangeService.getEmailAddress();

        dueDateChangePubSub.level4='review';
        AutoLoanPubsubService.trackPageView(dueDateChangePubSub);

        vm.showDueDateChangeSuccess = function(evt) {
          vm.focusId = evt.target.id;
          $state.go('AutoLoanDetails.transactions.dueDateChangeSuccess');
        };

        vm.submitDueDateChangeRequest = function(evt) {
          vm.focusId = evt.target.id;
          autoLoanDueDateChangeService.submitDueDateChangeRequest(accountReferenceId);
        };

        vm.changeEmailAddress = function(evt) {
          vm.focusId = evt.target.id;
          autoLoanDueDateChangeService.setIsAddEmailAddress(false);
          $state.go('AutoLoanDetails.transactions.emailModal');
        };

        vm.addEmailAddress = function(evt) {
          vm.focusId = evt.target.id;
          autoLoanDueDateChangeService.setIsAddEmailAddress(true);
          $state.go('AutoLoanDetails.transactions.emailModal');
        };

        vm.showEddN = function(evt) {
          vm.focusId = evt.target.id;
          $state.go('AutoLoanDetails.transactions.electronicDeliveryDisclosureNotice');
        };

        vm.openLetter = function() {
          var ddcLetter = autoLoanDueDateChangeService.getDueDateChangeLetter();
          var blob = new Blob([ddcLetter], {type: 'application/pdf'});
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, 'dueDateChangeLetter.pdf');
          } else {
            var fileURL = URL.createObjectURL(blob)
            $window.open(fileURL);
          }
        };

        angular.extend(vm, {
          modalType: 'due-date-change-eDoc-modal',
          modalClass: 'icon-tiles',
          close: function() {
            dueDateChangePubSub.level3='';
            dueDateChangePubSub.level4='';
            AutoLoanPubsubService.trackPageView(dueDateChangePubSub);
            $state.go('^');
          }
        });
      });
    return AutoLoanDueDateChangeEDocModule;
  });

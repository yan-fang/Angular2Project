define(['angular'],
  function(angular) {
    'use strict';
    var AutoLoanDueDateChangeSuccessModule = angular.module('AutoLoanDueDateChangeSuccessModule', ['ui.router']);
    var dueDateChangePubSub = {
      level2: 'account details',
      level3: '',
      level4: '',
      level5: ''
    };

    function checkSuccessRequirements(accountDetails,vm,autoLoanDueDateChangeService) {
      if (accountDetails.coBorrowerName) {
        vm.hasCoBorrower = true;
      }
      if (autoLoanDueDateChangeService.getHasCoborrowerSigned()) {
        vm.hasCoBorrowerSigned = true;
      }
      if (vm.successResponse.dueDateChangeRequiredPaymentAmount > 0) {
        vm.hasPaymentRequirement = true;
      }
      vm.dueDayTextOld = vm.getDisplayDayOfMonth(accountDetails.dueDate);
      vm.dueDateTextNew = vm.getDisplayDayOfMonth(autoLoanDueDateChangeService.getNewDueDate());
      vm.pleaseNoteText = setPleaseNoteText(vm);
    }

    function setPleaseNoteText(vm) {

      if (!vm.hasPaymentRequirement) {
        if (!vm.isLastPersonSigning && vm.hasCoBorrower && vm.successResponse.isLetterRequired) {
          return vm.i18n.coaf.dueDateChange.dueDateChangeSuccess.pleaseNoteText.label.v1;
        } else {
          return '';
        }
      } else {
        if (vm.hasCoBorrower && vm.successResponse.isLetterRequired) {
          return vm.i18n.coaf.dueDateChange.dueDateChangeSuccess.pleaseNoteText.label.v1
            +vm.i18n.coaf.dueDateChange.dueDateChangeSuccess.pleaseNoteTextWithRequirements.label.v1
              .replace(/{day}/, vm.dueDateTextNew.toLowerCase());
        } else {
          return vm.i18n.coaf.dueDateChange.dueDateChangeSuccess.pleaseNoteTextWithRequirements.label.v1
            .replace(/{day}/, vm.dueDateTextNew.toLowerCase());

        }
      }
    }



    AutoLoanDueDateChangeSuccessModule.controller('AutoLoanDueDateChangeSuccessController',
      function($scope, $state, autoLoanModuleService, autoLoanDueDateChangeService,AutoLoanPubsubService) {
        var vm = this;
        vm.i18n = autoLoanModuleService.getI18n();
        vm.successResponse = autoLoanDueDateChangeService.getSuccessResponse();
        vm.isLastPersonSigning = autoLoanDueDateChangeService.getIsLastPersonSigning();
        var accountDetails = autoLoanModuleService.getAccountDetailsData().accountDetails;
        dueDateChangePubSub.level3='change due date';
        dueDateChangePubSub.level4='confirm';
        AutoLoanPubsubService.trackPageView(dueDateChangePubSub);
        vm.getDisplayDayOfMonth = function(dateString) {
          var suffix;
          if (dateString) {
            var day = new Date(dateString).getUTCDate();

            if (day === 1 || day === 21) {
              suffix = 'st';
            } else if (day === 2 || day === 22) {
              suffix = 'nd';
            } else if (day === 3 || day === 23) {
              suffix = 'rd';
            } else if (day === 31) {
              suffix = 'Last Day';
              return suffix;
            } else {
              suffix = 'th';
            }
            return day + suffix;
          }
        };

        checkSuccessRequirements(accountDetails,vm,autoLoanDueDateChangeService);

        angular.extend(vm, {
          modalType: 'due-date-change-success-modal',
          modalClass: 'icon-tiles',
          close: function() {
            dueDateChangePubSub.level3='';
            dueDateChangePubSub.level4='';
            AutoLoanPubsubService.trackPageView(dueDateChangePubSub);
            $state.go('^',{},{reload: true});
          }
        });
      });
    return AutoLoanDueDateChangeSuccessModule;
  });

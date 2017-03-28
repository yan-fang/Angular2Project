define(['angular'],
  function(angular) {
    'use strict';
    var EmailModule = angular.module('EmailModule', ['ui.router']);

    var emailPubSub = {
      level2: 'account details',
      level3: '',
      level4: '',
      level5: ''
    };

    function isValidEmail(email) {
      var pattern = /^(?!.*[._@]{2})[a-z0-9\u00C0-\u00D6\u00D9-\u00F6\u00F9-\u00FC][a-z0-9_.\u00C0-\u00D6\u00D9-\u00F6\u00F9-\u00FC]*@\w+(\.\w+)?(\.[a-z]{2,3})?\.[a-z]{2,3}$/i;
      return pattern.test(email.trim());
    }

    EmailModule.controller('EmailController',
      function($scope, $state, autoLoanModuleService, AutoLoanPubsubService, autoLoanDueDateChangeService) {
        var vm = this;
        vm.i18n = autoLoanModuleService.getI18n();
        vm.emailId = 'email';
        vm.retypeEmail= 'retypeEmail';
        emailPubSub.level3='edit email';
        AutoLoanPubsubService.trackPageView(emailPubSub);
        vm.maxLength='55';
        var isAddEmailAddress = autoLoanDueDateChangeService.getIsAddEmailAddress();
        if (isAddEmailAddress) {
          vm.modalTitle = vm.i18n.coaf.dueDateChange.addEmail.headline.label.v1;
          vm.helpText = vm.i18n.coaf.dueDateChange.addEmail.helpText.label.v1;
        } else {
          vm.modalTitle = vm.i18n.coaf.dueDateChange.changeEmail.headline.label.v1;
          vm.helpText = vm.i18n.coaf.dueDateChange.changeEmail.helpText.label.v1;
        }

        vm.saveAndContinue = function(evt) {
          vm.focusId = evt.target.id;
          autoLoanDueDateChangeService.setNewEmailAddress(vm.email);
          if (isAddEmailAddress) {
            autoLoanDueDateChangeService.addContactPoint();
          } else {
            autoLoanDueDateChangeService.changeContactPoint();
          }
        };

        vm.enableSaveBtn = function() {
          if (vm.emailAgain &&
          vm.email &&
          isValidEmail(vm.email) &&
          isValidEmail(vm.emailAgain)) {
            if (vm.email === vm.emailAgain) {
              vm.emailValidationErrorMessage='';
              return true;
            } else {
              vm.emailValidationErrorMessage=
                vm.i18n.coaf.dueDateChange.changeEmail.nomatchError.label.v1;
              return false;
            }
          } else {
            vm.emailValidationErrorMessage='';
            return false;
          }
        };

        angular.extend(vm, {
          modalType: 'due-date-change change-email-modal',
          modalClass: 'icon-tiles',
          close: function() {
            emailPubSub.level3='';
            AutoLoanPubsubService.trackPageView(emailPubSub);
            $state.go('AutoLoanDetails.transactions.dueDateChangeEDoc');
          }
        });
      });
    return EmailModule;
  });

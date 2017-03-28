define(['angular', 'moment'],
	function(angular, moment) {
  'use strict';
  var AutoLoanDueDateChangeModule = angular.module('AutoLoanDueDateChangeModule', ['ui.router']);

  var dueDateChangePubSub = {
    level2: 'account details',
    level3: '',
    level4: '',
    level5: ''
  };

  AutoLoanDueDateChangeModule.controller('AutoLoanDueDateChangeController',
    function($scope, $state, autoLoanModuleService, autoLoanDueDateChangeService,AutoLoanPubsubService,
             AutoLoanCalendarFactory) {
      var vm = this;
      vm.i18n = autoLoanModuleService.getI18n();
      vm.showPayNowPayLater = true;
      var ddcChanged = false;
      var DATE_FORMAT = 'YYYY-MM-DD';
      var accountReferenceId = autoLoanModuleService.getAccountDetailsData().accountDetails.accountReferenceId;
      vm.dueDate = autoLoanModuleService.getAccountDetailsData().accountDetails.dueDate;
      dueDateChangePubSub.level3='change due date';
      AutoLoanPubsubService.trackPageView(dueDateChangePubSub);
      $scope.$watch(function() {
        return vm.newDueDate;
      }, function() {
        if (vm.balloonPaymentAmountsList && vm.newDueDate && vm.dueDate) {
          vm.setPayNowPayLaterAmount(vm.calculateOffset(
            vm.newDueDate,moment(vm.minDate,'YYYY-MM-DD').subtract(1, 'days')));
        }
        if (vm.newDueDate) {
          ddcChanged = true;
        } else {
          return;
        }
      });

      vm.eligibleDatesList = autoLoanDueDateChangeService.getEligibleDates();
      vm.balloonPaymentAmountsList = autoLoanDueDateChangeService.getBalloonPaymentData();
      vm.minDate =  vm.eligibleDatesList[0];
      vm.maxDate= vm.eligibleDatesList[vm.eligibleDatesList.length - 1];


      var dayDecorators = [
        {
          date: moment(vm.dueDate, DATE_FORMAT).toDate().setHours(0, 0, 0, 0),
          decorator: {
            cssClass: 'due-day',
            subLabel: 'DUE'
          }
        },
        {
          date: new Date().setHours(0, 0, 0, 0),
          decorator: {
            cssClass: '',
            subLabel: 'TODAY'
          }
        }


      ];

      vm.inlineOptions = AutoLoanCalendarFactory.getInlineOptions({
        dueDate: vm.dueDate,
        minDate : vm.dueDate,
        startingDate: vm.dueDate,
        enabledDates: vm.eligibleDatesList,
        getDayDecorator: function(dateObject) {
          var decorator = {cssClass: '', subLabel: ''};
          var dateToCheck = new Date(dateObject.date).setHours(0, 0, 0, 0);
          if (dateObject.selected && dateObject.date.getTime() === vm.newDueDate.getTime()) {
            decorator = {cssClass: '', subLabel: 'DUE'};
          }
          for (var i = 0; i < dayDecorators.length; i++) {
            if (dateToCheck === dayDecorators[i].date) {
              decorator = dayDecorators[i].decorator;
              break;
            }
          }
          if (ddcChanged && dateObject.date.getTime() === (moment(vm.dueDate,'YYYY-MM-DD').toDate()).getTime()) {
            decorator = {cssClass: 'due-day-old', subLabel: 'DUE'};
          }
          return decorator;
        }
      });

      var modalConfig = {
        modalType: 'due-date-change-modal',
        modalClass: 'icon-tiles',
        modalRole: 'region'
      };

      vm.close = function() {
        dueDateChangePubSub.level3='';
        AutoLoanPubsubService.trackPageView(dueDateChangePubSub);
        $state.go('^');
      };

      angular.extend(vm, modalConfig);

      vm.payNowPayLater={
        'payNowAmount': 0.00,
        'payLaterAmount': 0.00
      };

      vm.calculateOffset = function(newDueDate,oldDueDate) {
        return vm.diffDays = moment(newDueDate,'dddd MMMM Do YYYY, h:mm:ss a')
          .diff(moment(oldDueDate,'YYYY-MM-DD'), 'days');
      };


      vm.setPayNowPayLaterAmount = function() {
        for (var i = 0; i < vm.balloonPaymentAmountsList.length; i++) {
          if (vm.balloonPaymentAmountsList[i].offsetDays===vm.diffDays) {
            vm.payNowPayLater.payNowAmount = vm.balloonPaymentAmountsList[i].payNowAmount;
            vm.payNowPayLater.payLaterAmount = vm.balloonPaymentAmountsList[i].payLaterAmount;
            autoLoanDueDateChangeService.setOffsetDays(vm.balloonPaymentAmountsList[i].offsetDays);
            break;
          }
        }

      };

      vm.showDueDateChangeEDoc = function(evt) {
        vm.focusId = evt.target.id;
        $state.go('AutoLoanDetails.transactions.dueDateChangeEDoc');
      };

      vm.continueToSign = function(evt) {
        vm.focusId = evt.target.id;
        var accountDetails =autoLoanModuleService.getAccountDetailsData().accountDetails;
        autoLoanDueDateChangeService.setAppnId(accountDetails.loanApplicationId);
        autoLoanDueDateChangeService.setNewDueDate(vm.newDueDate);
        autoLoanDueDateChangeService.setIsBorrowerRequested(accountDetails.isPrimaryBorrower);
        autoLoanDueDateChangeService.continueToSign(accountReferenceId);
      };
    });
  return AutoLoanDueDateChangeModule;
});

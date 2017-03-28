define(['angular'],
  function() {
    'use strict';

    function PastDuePaymentController($scope, $state, $stateParams, autoLoanModuleService,
                                       autoLoanPaymentService, AutoLoanPubsubService, autoLoanPayDownViewUtil,
                                       easeExceptionsService) {

      var vm = this;
      if (autoLoanModuleService.isMakeAPaymentButtonVisible()) {
        this.isPaymentButtonVisible  = true;
      }

      var accountReferenceId = autoLoanModuleService.getAccountDetailsData().accountDetails.accountReferenceId;

      AutoLoanPubsubService.trackPageView({
        level3: 'loan tracker',
        level4: 'status'
      });

      vm.i18n = autoLoanModuleService.getI18n();


      vm.continueToLoanTracker = function() {
        var stateObject = {
          ProductName: $stateParams.ProductName,
          accountReferenceId: accountReferenceId,
          'payment': {}
        };
        var defaultMonthlyData = autoLoanPayDownViewUtil.getPaymentAmountWithDefaultSchedule();
        if (defaultMonthlyData.isBalanceAtMaturity) {
          var requestParamsMap = {'payoffDate': defaultMonthlyData.originalPayoffDate};
          autoLoanPayDownViewUtil.getProgressBarUpdates(accountReferenceId, requestParamsMap)
            .then(function(monthlyData) {
              if (monthlyData.loanOriginationDate != null) {
                autoLoanPayDownViewUtil.setIncreasedMonthlyPaymentAmount(monthlyData.monthlyPaymentAmount);
                $state.go('autoLoanTracker', stateObject);
              } else {
                easeExceptionsService.displayErrorHadler(
                  vm.i18N.coaf.payDownView.calculatedPaymentError.errorHeader.label.v1,
                  vm.i18N.coaf.payDownView.calculatedPaymentError.errorMessage.label.v1);
              }
            });
        }else {
          $state.go('autoLoanTracker', stateObject);
        }

      };
      // Utilizes the Make a Payment Service
      vm.makeAPayment = autoLoanPaymentService.payNow;

      function showPastDueDisclaimer($state) {
        $state.params.fromState = $state.current.name;
        $state.go('pastDueDisclaimer', $state.params);
      }

      vm.showDisclaimer = function() {
        showPastDueDisclaimer($state);
      };

      angular.extend(vm, {
        modalType: 'past-due-payment-modal',
        modalClass: 'icon-tiles',
        close: function() {

          AutoLoanPubsubService.trackPageView({
            level3: '',
            level4: ''
          });

          $state.go('^');
        }
      });
    }

    return {
      'PastDuePaymentController': PastDuePaymentController
    }
  });

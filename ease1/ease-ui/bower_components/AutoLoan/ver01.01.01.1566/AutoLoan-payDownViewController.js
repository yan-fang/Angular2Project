define(['angular','moment'], function(angular,moment) {
  'use strict';

  var AutoLoanController = angular.module('AutoLoanPayDownViewModule',[]);

  var autoLoanTrackerPubSub = {
    level2: 'account details',
    level3: 'loan tracker',
    level4: '',
    level5: ''
  };

  AutoLoanController.controller('AutoLoanPayDownViewController',
    function($scope,$state,$filter,$stateParams,$rootScope,EaseModalService,autoLoanModuleService,
             autoLoanPayDownViewUtil, autoLoanPaymentPlanUtil, AutoLoanPubsubService,
             easeExceptionsService,AutoLoanStateService,ALTUsabillaConstants) {
      AutoLoanStateService.overrideBackButton($scope,autoLoanModuleService.getAccountDetailsData());
      var vm = this;
      vm.oneTimeAmount = '';
      vm.additionalMonthlyPaymentAmount='';
      vm.isDpayMoreThanZero = false;
      vm.isOneTimeMoreThanZero = false;
      $scope.autoLoanEventsList=[];
      $scope.showEventsLink = false;
      vm.i18N = autoLoanModuleService.getI18n();

      var accountReferenceId = autoLoanModuleService.getAccountDetailsData().accountDetails.accountReferenceId;
      var accountNumber = autoLoanModuleService.getAccountDetailsData().accountDetails.displayAccountNumber;
      var accountDetails = {
        accountNumber :accountNumber,
        lineOfBusiness :'AL'
      };
      autoLoanPayDownViewUtil.getProgressBarUpdates(accountReferenceId).then(function(data) {
        $scope.autoLoanAccountNickname = autoLoanModuleService.getAccountDetailsData().accountDetails.accountNickname;

        angular.extend(vm, data);
        if (vm.payoffStatus === 'paid off') {
          autoLoanTrackerPubSub.level4 = vm.payoffStatus;
          vm.isPayoff = true;
          vm.progressBarPercentage = 100;
          vm.isProgressBarTruncated = false;
          vm.progressBarClass = 'paid-off-progress-bar';
          pubsubTrackAnalytics();
        } else {
          vm.progressBarClass = 'progress-bar';
          vm.isProgressBarTruncated = true;
          var checkForCalculationAllowed;
          if (vm.payoffStatus === 'on time') {
            vm.isOnTime = true;
            checkForCalculationAllowed = true;
            autoLoanTrackerPubSub.level4 = vm.payoffStatus;
            vm.isProgressBarTruncated = false;
          } else if (vm.isEarlyPayoff) {
            checkForCalculationAllowed = true;
            autoLoanTrackerPubSub.level4 = 'early';
          } else if (!vm.payoffStatus) {
            autoLoanTrackerPubSub.level4 = 'matured';
          } else if (vm.isBalanceAtMaturity) {
            autoLoanTrackerPubSub.level4 = 'balance';
          }

          if (checkForCalculationAllowed) {
            vm.payDownViewDetialsContainerClass = 'fullpanel';
            if (vm.isOneTimePaymentCalculationAllowed || vm.isRecurringPaymentAllowed) {
              vm.isPaymentCalculationAllowed = true;
            }
          }
          if (vm.loanOriginationDate) {
            pubsubTrackAnalytics();
          }
        }



        if ($state.current && $state.current.name === 'autoLoanTracker'
          && (vm.isBalanceAtMaturity || vm.isPastDue)) {
          vm.callCalculatorForBalanceAtMaturity(true);
        }
        // Animates the progress bar
        setTimeout(function() {
          var theProgressbar = document.getElementById('progressBarFilled');
          if (theProgressbar) {
            theProgressbar.style.width = vm.progressBarPercentage + '%';
          }
        }, 500);

      });

      function pubsubTrackAnalytics() {
        if ($state.current && $state.current.name === 'autoLoanTracker') {
          autoLoanPayDownViewUtil.setPayOffStatusForSiteCatalyst(autoLoanTrackerPubSub.level4);
          AutoLoanPubsubService.trackPageView(autoLoanTrackerPubSub);
        } else {
          AutoLoanPubsubService.trackClickEvent({name : 'progress bar:loan tracker '
          + autoLoanTrackerPubSub.level4});
        }
      }

      if ($state.current && $state.current.name === 'autoLoanTracker'
          || $state.current.parent==='autoLoanTracker') {
        vm.WidgetId = ALTUsabillaConstants.WidgetId;
        vm.isOneTimePaymentEnabled = autoLoanModuleService.isFeatureEnabled('ease.coaf.onetimepayment');
        vm.isPayOffEnabled = autoLoanModuleService.isFeatureEnabled('ease.coaf.payoff');
        vm.isDpayEnabled = autoLoanModuleService.isFeatureEnabled('ease.coaf.paymentplan');

        var isEventsEnabled = autoLoanModuleService.isFeatureEnabled('ease.coaf.events');
        if (isEventsEnabled && autoLoanPayDownViewUtil.getFinancialEvents()
              && autoLoanPayDownViewUtil.getFinancialEvents().length>0
              && autoLoanPayDownViewUtil.getFinancialEvents().accountNumber === accountNumber) {
          $scope.showEventsLink = true;
        }else if (isEventsEnabled) {
          autoLoanPayDownViewUtil.getEventsDetails(accountReferenceId).then(function(data) {
            autoLoanPayDownViewUtil.setFinancialEvents(data);
            if (autoLoanPayDownViewUtil.getFinancialEvents() && autoLoanPayDownViewUtil.getFinancialEvents().length>0) {
              $scope.showEventsLink = true;
            }
          })
        }
      }

      $scope.$watch(function() {

        return vm.oneTimeAmount;
      }, function() {
        if (vm.oneTimeAmount) {
          vm.additionalMonthlyPaymentAmount='';
          vm.amountValidationErrorMessage='';
          vm.isDpayDisplayError=false;
          vm.isDpayMoreThanZero = false;
          vm.newPayOffDateDPay = '';
          vm.interestSavedAmountDpay = $filter('nonNegativeAmount')(0);
          vm.newPayOffDateOneTime = '';
          vm.interestSavedAmountOneTime = $filter('nonNegativeAmount')(0);

        }else if (!vm.oneTimeAmount) {
          vm.isOneTimeMoreThanZero = false;
          return;
        }
      });

      $scope.$watch(function() {
        return vm.additionalMonthlyPaymentAmount;
      }, function() {
        if (vm.additionalMonthlyPaymentAmount) {
          vm.oneTimeAmount='';
          vm.amountValidationErrorMessage='';
          vm.newPayOffDateOneTime = '';
          vm.isOneTimeDisplayError=false;
          vm.isOneTimeMoreThanZero = false;
          vm.interestSavedAmountOneTime = $filter('nonNegativeAmount')(0);
          vm.newPayOffDateDPay = '';
          vm.interestSavedAmountDpay = $filter('nonNegativeAmount')(0);
        }else if (!vm.additionalMonthlyPaymentAmount) {
          vm.isDpayMoreThanZero = false;
          return;
        }
      });

      vm.interestSavedAmountOneTime = $filter('nonNegativeAmount')(0);
      vm.calculateOneTime = function() {
        AutoLoanPubsubService.trackClickEvent({name : 'calculate one-time:button'});
        validateAmountBeforeCalculate(vm.oneTimeAmount,'oneTime');
        var requestParamsMap = {'oneTimePaymentAmount': vm.oneTimeAmount};
        autoLoanPayDownViewUtil.getProgressBarUpdates(accountReferenceId, requestParamsMap)
          .then(function(monthlyData) {
            if (monthlyData.loanOriginationDate!=null) {
              vm.totalPrincipalBalanceAmount=monthlyData.totalPrincipalBalanceAmount;
              vm.monthlyPaymentAmount=monthlyData.monthlyPaymentAmount;
              if (monthlyData.payoffDate !== vm.payoffDate) {
                vm.newPayOffDateOneTime = monthlyData.payoffDate;
              }
              vm.interestSavedAmountOneTime = $filter('nonNegativeAmount')(monthlyData.interestSavedAmount);
            }else {
              easeExceptionsService.displayErrorHadler(
                  vm.i18N.coaf.payDownView.calculatedPaymentError.errorHeader.label.v1,
                  vm.i18N.coaf.payDownView.calculatedPaymentError.errorMessageCalculator.label.v1);
            }

          });
      };

      vm.interestSavedAmountDpay = $filter('nonNegativeAmount')(0);
      vm.calculateRecurring = function() {
        AutoLoanPubsubService.trackClickEvent({name : 'calculate recurring:button'});
        validateAmountBeforeCalculate(vm.additionalMonthlyPaymentAmount,'dPay');
        var requestParamsMap = {'totalMonthlyPaymentAmount':
        parseFloat(vm.monthlyPaymentAmount) + parseFloat(vm.additionalMonthlyPaymentAmount) };
        autoLoanPayDownViewUtil.getProgressBarUpdates(accountReferenceId, requestParamsMap)
          .then(function(monthlyData) {
            if (monthlyData.loanOriginationDate!=null) {
              if (monthlyData.payoffDate !== vm.payoffDate) {
                vm.newPayOffDateDPay = monthlyData.payoffDate;
              }
              vm.interestSavedAmountDpay = $filter('nonNegativeAmount')(monthlyData.interestSavedAmount);
            }else {
              easeExceptionsService.displayErrorHadler(
                  vm.i18N.coaf.payDownView.calculatedPaymentError.errorHeader.label.v1,
                  vm.i18N.coaf.payDownView.calculatedPaymentError.errorMessageCalculator.label.v1);

            }

          });
      };

      vm.checkDpayAmount= function() {
        var charCode = vm.additionalMonthlyPaymentAmount.charCodeAt(vm.additionalMonthlyPaymentAmount.length - 1);
        var validateUserInputResult = validateUserInput(charCode, vm.additionalMonthlyPaymentAmount);
        if (validateUserInputResult !== false) {
          vm.additionalMonthlyPaymentAmount = validateUserInputResult;
          if (Number(vm.additionalMonthlyPaymentAmount) > vm.totalPrincipalBalanceAmount) {
            vm.isDpayDisplayError = true;
            var errorAmount = $filter('currency')(vm.totalPrincipalBalanceAmount);
            vm.amountValidationErrorMessage =
              vm.i18N.coaf.payDownView.autoLoanTracker.paymentExceedsPrincipal.label.v1+' (' + errorAmount + ')';
          } else {
            vm.isDpayDisplayError = false;
          }
          vm.isDpayMoreThanZero = Number(vm.additionalMonthlyPaymentAmount) > 0;
        } else {
          vm.additionalMonthlyPaymentAmount = vm.additionalMonthlyPaymentAmount
            .substring(0, vm.additionalMonthlyPaymentAmount.length - 1);
        }
      };

      function validateAmountBeforeCalculate(amount,amountType) {
        if (isNaN(amount) && !(amount<0)) {
          if (amountType==='oneTime') {
            vm.isOneTimeDisplayError = true;
          }else if (amountType==='dPay') {
            vm.isDpayDisplayError = true;
          }
          vm.amountValidationErrorMessage =vm.i18N.coaf.payDownView.amountValidation.label.v1;

          return;
        }
      }

      vm.checkOneTimePaymentAmount= function() {
        var charCode = vm.oneTimeAmount.charCodeAt(vm.oneTimeAmount.length - 1);
        var validateUserInputResult = validateUserInput(charCode, vm.oneTimeAmount);
        if (validateUserInputResult !== false) {
          vm.oneTimeAmount = validateUserInputResult;
          if (Number(vm.oneTimeAmount) > vm.totalPrincipalBalanceAmount) {
            vm.isOneTimeDisplayError = true;
            var errorAmount = $filter('currency')(vm.totalPrincipalBalanceAmount);
            vm.amountValidationErrorMessage =
              vm.i18N.coaf.payDownView.autoLoanTracker.paymentExceedsPrincipal.label.v1+' (' + errorAmount + ')';
          } else {
            vm.isOneTimeDisplayError = false;
          }
          vm.isOneTimeMoreThanZero = Number(vm.oneTimeAmount) > 0;
        } else {
          vm.oneTimeAmount = vm.oneTimeAmount.substring(0, vm.oneTimeAmount.length - 1);
        }
      };

      function validateUserInput(charCode, amount) {
        if (((charCode === 46 || charCode === 8) && this.value.indexOf('.') === -1)
          || (charCode >= 48 && charCode <= 57)) {

          if (String(amount).match(/\d*\.\d{1,3}/)) {
            if (amount.indexOf('.') !== -1) {
              var nonDecimal = amount.split('.')[0];
              var decimal = amount.split('.')[1];
              var res = decimal.substring(0, 2);
              amount = nonDecimal + '.' + res;
              return amount;
            }
          }
        } else {
          return false;
        }
        return amount;
      }

      vm.showAutoLoanTrackerDetails = function(evt) {
        if ($state.current.name !== 'autoLoanTracker') {
          var stateObject = {
            ProductName: $stateParams.ProductName,
            accountReferenceId: accountReferenceId,
            'payment': {}
          };
          $scope.focusId = evt.target.id;
          if (vm.isBalanceAtMaturity && !vm.isPastDue) {
            vm.callCalculatorForBalanceAtMaturity(false);
          } else {
            if (vm.payoffStatus && vm.isPastDue) {
              $state.go('AutoLoanDetails.transactions.pastDuePayment');
            } else {
              $state.go('autoLoanTracker', stateObject);
            }
          }
        }
      };

      vm.callCalculatorForBalanceAtMaturity = function(bypassNavigationToALT) {
        var requestParamsMap = {'payoffDate': vm.originalPayoffDate};
        var stateObject = {
          ProductName: $stateParams.ProductName,
          accountReferenceId: accountReferenceId,
          'payment': {}
        };
        autoLoanPayDownViewUtil.getProgressBarUpdates(accountReferenceId, requestParamsMap)
          .then(function(monthlyData) {
            if (monthlyData.loanOriginationDate != null) {
              autoLoanPayDownViewUtil.setIncreasedMonthlyPaymentAmount(monthlyData.monthlyPaymentAmount);
              if (monthlyData.monthlyPaymentAmount) {
                vm.increasedMonthlyPaymentAmount = monthlyData.monthlyPaymentAmount;
                vm.additionalMonthlyPaymentAmount = (vm.increasedMonthlyPaymentAmount - vm.monthlyPaymentAmount)
                  .toFixed(2);
              }
              if (!bypassNavigationToALT) {
                $state.go('autoLoanTracker', stateObject);
              }

            } else {
              easeExceptionsService.displayErrorHadler(
                vm.i18N.coaf.payDownView.calculatedPaymentError.errorHeader.label.v1,
                vm.i18N.coaf.payDownView.calculatedPaymentError.errorMessage.label.v1);
            }
          });
      };

      vm.scheduleRecurringPayments = function() {
        var additionalMonthlyPaymentAmount = vm.isDpayDisplayError === true ? 0 : vm.additionalMonthlyPaymentAmount;
        var defaultPaymentPlanData = {
          'frequency': 'MONTHLY',
          'additionalPrincipal': additionalMonthlyPaymentAmount
        };
        autoLoanPaymentPlanUtil.setDefaultPaymentPlanData(defaultPaymentPlanData);
        $state.go('AutoLoanTrackerPayment',
          {
            ProductName: $stateParams.ProductName,
            'accountReferenceId': autoLoanModuleService.getAccountDetailsData()
              .accountDetails.accountReferenceId,
            'payment': {isAccountDataAvailable: true, tab: 'Recurring', areTabsHidden: true,
              defaultPaymentPlanData: defaultPaymentPlanData,
              lineOfBusiness: accountDetails.lineOfBusiness
            }
          });
      };

      vm.makeOneTimePayment= function() {
        $state.go('AutoLoanTrackerPayment',
          {
            ProductName: $stateParams.ProductName,
            accountReferenceId: accountReferenceId,
            'payment': {isAccountDataAvailable: true, tab: 'OneTime', areTabsHidden: true,
            lineOfBusiness: accountDetails.lineOfBusiness,
              defaultOneTimeData: {
                'value' : vm.oneTimeAmount,
                'type': 'principalOnly'
              }}
          });
      };

      vm.makePayoff= function() {
        $state.go('AutoLoanTrackerPayment',
          {
            ProductName: $stateParams.ProductName,
            'accountReferenceId': autoLoanModuleService.getAccountDetailsData()
                .accountDetails.accountReferenceId,
            'payment': {isAccountDataAvailable: true, tab: 'Payoff', areTabsHidden: true,
              lineOfBusiness: accountDetails.lineOfBusiness}
          });
      };

      vm.loadEventsModal = function() {
        if (!autoLoanPayDownViewUtil.getDisableFinancialEventsLink()) {
          autoLoanPayDownViewUtil.setDisableFinancialEventsLink(true);
          autoLoanTrackerPubSub.level4 = 'events history';
          AutoLoanPubsubService.trackPageView(autoLoanTrackerPubSub);
          $state.go('autoLoanTracker.eventsHistory');
        }
      };

      var carouselModel = {
        title: vm.i18N.coaf.carousel.container.title.label.v1,
        previousLabel: vm.i18N.coaf.carousel.controls.previousButton.label.v1,
        nextLabel: vm.i18N.coaf.carousel.controls.nextButton.label.v1,
        items: [
          {
            title: vm.i18N.coaf.carousel.slideOne.title.label.v1,
            htmlContent: '<p>' +  vm.i18N.coaf.carousel.slideOne.content.label.v1 + '</p>'
          },
          {
            title: vm.i18N.coaf.carousel.slideTwo.title.label.v1,
            htmlContent: '<p>' +  vm.i18N.coaf.carousel.slideTwo.content.label.v1 + '</p>'
          },
          {
            title: vm.i18N.coaf.carousel.slideThree.title.label.v1,
            htmlContent: '<p>' +  vm.i18N.coaf.carousel.slideThree.content.label.v1 + '</p>'
          },
          {
            title: vm.i18N.coaf.carousel.slideFour.title.label.v1,
            htmlContent: '<p>' +  vm.i18N.coaf.carousel.slideFour.content.label.v1 + '</p>'
          },
          {
            title: vm.i18N.coaf.carousel.slideFive.title.label.v1,
            htmlContent: '<p>' +  vm.i18N.coaf.carousel.slideFive.content.label.v1 + '</p>'
          }
        ]
      };

      vm.getCarouselModel = function() {
        return carouselModel;
      }
    });


  AutoLoanController.controller('AutoLoanEventsController',
    function($scope,$state,autoLoanModuleService, autoLoanPayDownViewUtil,AutoLoanPubsubService) {
      var vm = this;
      vm.i18N = autoLoanModuleService.getI18n();
      $scope.autoLoanEventsList=autoLoanPayDownViewUtil.getFinancialEvents();
      vm.closeEventsModal= function() {
        $scope.currentPage = 1;
        $scope.numOfPages=0;
        autoLoanPayDownViewUtil.setDisableFinancialEventsLink(false);
        $state.go('autoLoanTracker', {}, {location: 'replace'});
        autoLoanTrackerPubSub.level4 = autoLoanPayDownViewUtil.getPayOffStatusForSiteCatalyst();
        AutoLoanPubsubService.trackPageView(autoLoanTrackerPubSub);
      };

      angular.extend(vm, {
        close: function() {
          autoLoanPayDownViewUtil.setDisableFinancialEventsLink(false);
          $scope.currentPage = 1;
          $state.go('autoLoanTracker', {}, {location: 'replace'});
          autoLoanTrackerPubSub.level4 = autoLoanPayDownViewUtil.getPayOffStatusForSiteCatalyst();
          AutoLoanPubsubService.trackPageView(autoLoanTrackerPubSub);
        },
        modalType: 'events-modal',
        modalClass: 'icon-help',
        modalRole: 'region',
        cancel: function() {
          $state.go('autoLoanTracker', {}, {location: 'replace'});
        }
      });

      vm.getNumberOfPages = function(eventsList) {
        if (eventsList && eventsList.length>0) {
          return eventsList.length/4;
        }
      };

      $scope.numPerPage = 4;
      $scope.numOfPages = Math.ceil(vm.getNumberOfPages($scope.autoLoanEventsList));
      $scope.currentPage = 1;
      $scope.isLastPage = false;

      if ($scope.numOfPages<=1) {
        $scope.isLastPage = true;
      }

      var calculateIncrement=function() {
        if ($scope.autoLoanEventsList.length>($scope.currentPage*4)) {
          if (($scope.autoLoanEventsList.length - ($scope.currentPage*4))>4) {
            $scope.currentPage+=1;
            return $scope.numPerPage+=4;
          } else {
            $scope.currentPage+=1;
            $scope.isLastPage=true;
            return $scope.numPerPage = $scope.autoLoanEventsList.length;
          }
        }else {
          $scope.currentPage+=1;
          $scope.isLastPage=true;
          return $scope.numPerPage = $scope.autoLoanEventsList.length;
        }
      };

      vm.loadMoreEvents= function() {
        AutoLoanPubsubService.trackClickEvent({name : 'load more:link'});
        if ($scope.numOfPages>1) {
          $scope.numPerPage = calculateIncrement();
        }
      }


    });
  return AutoLoanController;
});

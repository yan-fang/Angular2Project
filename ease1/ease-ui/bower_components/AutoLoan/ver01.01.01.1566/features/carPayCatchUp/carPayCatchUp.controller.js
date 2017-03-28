define(['angular','moment'],
  function(angular,moment) {
    'use strict';
    var pastDueCpCuPubSub = {
      level2: 'account details',
      level3: '',
      level4: '',
      level5: ''
    };
    var accountTypePubSub = {accountType: 'create a payment'};

    function CarPayCatchUpController($state,$scope, autoLoanModuleService,$filter,autoLoanPaymentService,
                                     carPayCatchUpService, AutoLoanStateService,AutoLoanPubsubService) {

      AutoLoanStateService.overrideBackButton($scope,autoLoanModuleService.getAccountDetailsData());
      pastDueCpCuPubSub.level3='past due';
      var vm = this;

      vm.i18n = autoLoanModuleService.getI18n();
      vm.lableVerbiage=vm.i18n.coaf.carPayCatchUp.pastDuePaymentOptions;
      vm.isPaymentCatchupPlanFeatureEnabled = false;
      vm.catchupEligibilityInProgress = false;
      if (autoLoanModuleService.isFeatureEnabled('ease.coaf.paymentcatchupplan')) {
        vm.isPaymentCatchupPlanFeatureEnabled = true;
        vm.catchupEligibilityInProgress = true;
        carPayCatchUpService.getPaymentCatchupEligibility(autoLoanModuleService
          .getAccountDetailsData().accountDetails.autoLoanAccountReferenceId).then(function(data) {
            carPayCatchUpService.setPaymentCatchupElgiiblity(data);
            vm.catchupEligibilityInProgress = false;
            if (carPayCatchUpService.getPaymentCatchupElgiiblity()) {
              vm.showPaymentPlanLink = true;
              vm.isClickableClass = 'clickable';
              vm.optionThreeDescLink=vm.lableVerbiage.optionsThreeLinkCreatePlan.label.v1;
              AutoLoanPubsubService.trackPageViewTrackAccountType(accountTypePubSub,pastDueCpCuPubSub);

            } else {
              vm.showPaymentPlanLink = false;
              accountTypePubSub.accountType='more information';
              AutoLoanPubsubService.trackPageViewTrackAccountType(accountTypePubSub,pastDueCpCuPubSub);

              vm.optionThreeDescLink = vm.lableVerbiage.optionsThreeLinkCallForHelp.label.v1;
              vm.showHelpIsOnTheWay = function() {
                $state.go('helpIsOnTheWay');
              }
            }
          });
      } else {
        vm.showPaymentPlanLink = false;
        vm.optionThreeDescLink=vm.i18n.coaf.carPayCatchUp.pastDuePaymentOptions.optionsThreeLinkCallForHelp.label.v1;
        vm.showHelpIsOnTheWay = function() {
          $state.go('helpIsOnTheWay');
        };
      }

      vm.pastDueDaysCount = autoLoanModuleService.getAccountDetailsData().accountDetails.accountPastDueDaysCount;
      vm.nickName = autoLoanModuleService.getAccountDetailsData().accountDetails.accountNickname;

      vm.dueDateText = (moment(autoLoanModuleService.getAccountDetailsData()
        .accountDetails.dueDate, 'YYYY-MM-DD').format('MMMM Do'));
      vm.totalAmountDue = $filter('currency')(autoLoanModuleService.getAccountDetailsData()
        .accountDetails.totalAmountDue);
      vm.unpaidPastDueAmount = $filter('currency')(autoLoanModuleService.getAccountDetailsData()
        .accountDetails.unpaidPastDueAmount);

      if (vm.pastDueDaysCount === 1) {
        vm.pastDueDaysMessage = vm.i18n.coaf.carPayCatchUp.pastDuePaymentOptions.accountDueHeadingSingular.label.v1
          .replace(/{pasDueDays}/, vm.pastDueDaysCount);
      } else {
        vm.pastDueDaysMessage = vm.i18n.coaf.carPayCatchUp.pastDuePaymentOptions.accountDueHeading.label.v1
          .replace(/{pasDueDays}/, vm.pastDueDaysCount);
      }

      if (vm.pastDueDaysCount === 1) {
        vm.pastDueDaysMessage = vm.i18n.coaf.carPayCatchUp.pastDuePaymentOptions.accountDueHeadingSingular.label.v1
          .replace(/{pasDueDays}/, vm.pastDueDaysCount);
      } else {
        vm.pastDueDaysMessage = vm.i18n.coaf.carPayCatchUp.pastDuePaymentOptions.accountDueHeading.label.v1
          .replace(/{pasDueDays}/, vm.pastDueDaysCount);
      }

      vm.pastDueAmountMessage = vm.i18n.coaf.carPayCatchUp.pastDuePaymentOptions.pastDueAmountMessage.label.v1
        .replace(/{pastDueAmount}/, vm.unpaidPastDueAmount);

      vm.pastDueDaysLabel = vm.i18n.coaf.carPayCatchUp.pastDuePaymentOptions.sliderTooltipLabel.label.v1
        .replace(/{pasDueDays}/, vm.pastDueDaysCount);

      vm.optionsOneDesc1 = vm.i18n.coaf.carPayCatchUp.pastDuePaymentOptions.optionsOneDesc1.label.v1
        .replace(/{dueDate}/, vm.dueDateText);

      vm.optionsTwoDesc1 = vm.i18n.coaf.carPayCatchUp.pastDuePaymentOptions.optionsTwoDesc1.label.v1
        .replace(/{dueDate}/, vm.dueDateText);

      vm.makeAPaymentLink = function() {
        autoLoanPaymentService.payNow('OneTime',true);
      };

      setTimeout(function() {
        var statusTicker = document.getElementById('currentPositionOnBar'),
          statusWidth = parseInt(document.getElementById('visualScale').offsetWidth),
          tickerPaddingOffset = (statusWidth/(100/12.5)),
          statusFullWidth = statusWidth - tickerPaddingOffset,
          percentOfBar = (100/(90/(100/vm.pastDueDaysCount))).toFixed(1),
          positionOfTicker = statusFullWidth / percentOfBar + tickerPaddingOffset;


        if (statusTicker) {
          if (vm.pastDueDaysCount >= 90) {
            statusTicker.style.left = statusWidth - tickerPaddingOffset + 'px';
          } else {
            statusTicker.style.left = positionOfTicker +'px';
          }
        }
      }, 500);

      /* PAST DUE DISCLAIMER */
      vm.showDisclaimer = function() {
        showPastDueDisclaimer($state);
      };

      function showPastDueDisclaimer($state) {
        $state.params.fromState = $state.current.name;
        $state.go('pastDueDisclaimerCPCU', $state.params);
      }

      vm.trackSiteCatalystForToolTips = function(tooltipName) {
        AutoLoanPubsubService.trackClickEvent({name : tooltipName+':tooltip'});
      };


      /* GO STATE */
      vm.showMonthlyPayment = function() {
        if (carPayCatchUpService.getPaymentCatchupElgiiblity()) {
          $state.go('monthlyPayment');
        } else {
          $state.go('helpIsOnTheWay');
        }
      };
      vm.showHalfMonthlyPayment = function() {
        $state.go('halfMonthlyPayment');
      };
      vm.showContactUs = function() {
        $state.go('cpcuContactUs');
      };
      vm.showPlanSummary = function() {
        $state.go('planSummary');
      };
      vm.showCustomizePlan = function() {
        $state.go('customizePlan');
      };
      vm.showSelectPaymentAccount = function() {
        $state.go('selectPaymentAccount');
      };
      vm.showAreYouSure = function() {
        $state.go('areYouSure');
      };
      vm.showCancelPayment = function() {
        $state.go('cpcuCancelPayment');
      };
    }

    return CarPayCatchUpController;
  });

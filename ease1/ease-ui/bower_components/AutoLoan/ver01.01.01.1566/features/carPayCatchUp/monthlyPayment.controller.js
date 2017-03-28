define(['angular','moment'],
  function(angular,moment) {
    'use strict';
    var monthlyPaymentCpCuPubSub = {
      level2: 'account details',
      level3: 'past due',
      level4: 'cpcu',
      level5: 'first payment today'
    };

    function MonthlyPaymentController($state, autoLoanModuleService, carPayCatchUpService,
                                      cpcuPaymentDates,AutoLoanPubsubService) {

      var vm = this;
      vm.i18n = autoLoanModuleService.getI18n();
      vm.modalType = 'car-pay-catch-up-modal';
      AutoLoanPubsubService.trackPageView(monthlyPaymentCpCuPubSub);
      carPayCatchUpService.setPaymentDates(cpcuPaymentDates);

      vm.setHeaderText = function() {
        var firstDate = vm.paymentDates[0].paymentDate;
        if (firstDate === moment(autoLoanModuleService.getCurrentDate(),'YYYY-M-DD').format('YYYY-MM-DD')) {
          var dateText=  vm.i18n.coaf.carPayCatchUp.monthlyPayment.todayText.label.v1;
        } else {
          var dateText = vm.i18n.coaf.carPayCatchUp.monthlyPayment.onText.label.v1
            +moment(firstDate,'YYYY-MM-DD').format('MMMM Do');
        }
        vm.headerText = vm.i18n.coaf.carPayCatchUp.monthlyPayment.descriptionOne.label.v1
          .replace(/{monthlyPaymentAmount}/,vm.rollAmount)
          .replace(/{dayDateDescription}/,dateText);
      };

      vm.paymentDates = carPayCatchUpService.getPaymentDatesList();
      var accountRefId = autoLoanModuleService.getAccountDetailsData().accountDetails.autoLoanAccountReferenceId;

      carPayCatchUpService.getPaymentAmountsWithRollAmount(accountRefId,vm.paymentDates[0].paymentDate)
        .then(function(data) {
          carPayCatchUpService.setRollAmount(data);
          vm.rollAmount = carPayCatchUpService.getRollAmount();
          vm.setHeaderText();
        });
      vm.close = function() {
        var accountTypePubSub = {accountType: 'create a payment'};
        monthlyPaymentCpCuPubSub.level4 = '';
        monthlyPaymentCpCuPubSub.level5= '';
        AutoLoanPubsubService.trackPageViewTrackAccountType(accountTypePubSub,monthlyPaymentCpCuPubSub);
        $state.go('^');
      };



      // TAKES USER TO 'PLAN SUMMARY' MODAL
      vm.showPlanSummary = function() {
        // DISABLES BUTTON
        // ENABLES LOADING SPINNER
        vm.disabled = true;
        vm.spinnerEnable = true;

        carPayCatchUpService.setFirstPaymentDate(vm.paymentDates[0].paymentDate);
        carPayCatchUpService.showPlanSummary();
      };

      // USER CHOOSES'NO'
      // TAKES USER TO TO 'WHAT ABOUT BY {THIS} DATE' MODAL OR 'CONTACT US' MODAL
      vm.chooseNo = function() {
        if (carPayCatchUpService.getPaymentDatesList() && carPayCatchUpService.getPaymentDatesList().length > 1) {
          $state.go('whatAboutByDate');
        } else {
          $state.go('cpcuContactUs');
        }
      };

    }
    return MonthlyPaymentController;
  });

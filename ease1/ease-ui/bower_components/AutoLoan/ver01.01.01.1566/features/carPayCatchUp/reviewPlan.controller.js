define(['angular','moment'],
  function(angular,moment) {
    'use strict';
    var reviewPlanCpCuPubSub = {
      level2: 'account details',
      level3: 'past due',
      level4: 'cpcu',
      level5: 'plan review'
    };
    function ReviewPlanController($state, autoLoanModuleService, carPayCatchUpService,
    AutoLoanPubsubService) {
      var vm = this;
      AutoLoanPubsubService.trackPageView(reviewPlanCpCuPubSub);
      vm.i18n = autoLoanModuleService.getI18n();
      vm.modalType = 'car-pay-catch-up-modal double-wide';

      vm.close = function() {
        carPayCatchUpService.exitReviewPlanModal();
      };


      // USER REVIEW PURPOSED PLAN
      // CREATES PLAN
      vm.createPlan = function() {
        // DISABLES BUTTON
        // ENABLES LOADING SPINNER
        vm.disabled = true;
        vm.spinnerEnable = true;

        carPayCatchUpService.submitCarPayCatchup();
      };




      var paymentsData = carPayCatchUpService.getFinalCatchupPaymentsData();
      vm.firstPayment = paymentsData[0];
      vm.paymentsExcludingFirstPaymentList = paymentsData.slice(1, paymentsData.length);

      for (var count = 0; count < vm.paymentsExcludingFirstPaymentList.length; count++) {
        var payment = vm.paymentsExcludingFirstPaymentList[count];
        payment.paymentDateFormatted = moment(payment.paymentDate,'YYYY-M-DD').format('MMMM Do');
      }

      var firstPaymentDateLabelText = vm.i18n.coaf.carPayCatchUp.labels.todayLabel.label.v1;
      var initialPaymentDate = carPayCatchUpService.getFirstPaymentDate();

      if (initialPaymentDate !== moment(autoLoanModuleService.getCurrentDate(),'YYYY-M-DD').format('YYYY-MM-DD')) {
        firstPaymentDateLabelText = moment(initialPaymentDate,'YYYY-M-DD').format('MMMM Do');
        vm.firstPaymentIsNotToday = true;
      }

      vm.firstPaymentDateLabel = vm.i18n.coaf.carPayCatchUp.labels.todaysPayment.label.v1;
      vm.firstPaymentDateLabel = vm.firstPaymentDateLabel.replace('{firstPaymentDate}', firstPaymentDateLabelText);
      vm.paymentAccount = carPayCatchUpService.getSelectedPaymentAccountLabel();
    }

    return ReviewPlanController;
  });

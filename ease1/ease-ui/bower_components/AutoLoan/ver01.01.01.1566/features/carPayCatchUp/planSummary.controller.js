define(['angular','moment'],
  function(angular,moment) {
    'use strict';
    var planSummaryCpCuPubSub = {
      level2: 'account details',
      level3: 'past due',
      level4: 'cpcu',
      level5: 'plan summary'
    };
    function PlanSummaryController($state, autoLoanModuleService, carPayCatchUpService,AutoLoanPubsubService) {
      var vm = this;
      vm.i18n = autoLoanModuleService.getI18n();
      vm.modalType = 'car-pay-catch-up-modal';
      AutoLoanPubsubService.trackPageView(planSummaryCpCuPubSub);
      vm.initialPaymentAmount = carPayCatchUpService.getRollAmount();
      var initalPaymentDate = carPayCatchUpService.getFirstPaymentDate();
      var firstPaymentDateReplacement = vm.i18n.coaf.carPayCatchUp.labels.todayLabel.label.v1;
      var firstPaymentDateLabelText = vm.i18n.coaf.carPayCatchUp.labels.todayLabel.label.v1;
      vm.numberOfRemainingPaymentsMessage = vm.i18n.coaf.carPayCatchUp.planSummary.description.label.v1;
      if (initalPaymentDate === moment(autoLoanModuleService.getCurrentDate(),'YYYY-M-DD').format('YYYY-MM-DD')) {
        vm.numberOfRemainingPaymentsMessage = vm.numberOfRemainingPaymentsMessage.replace('{firstPaymentDate}',
          vm.i18n.coaf.carPayCatchUp.labels.todayTextWithQuote.label.v1);
      } else {
        firstPaymentDateReplacement = vm.i18n.coaf.carPayCatchUp.labels.yourLabel.label.v1
          + moment(initalPaymentDate,'YYYY-MM-DD').format('MMMM Do');
        firstPaymentDateLabelText = moment(initalPaymentDate,'YYYY-MM-DD').format('MMM DD');
        vm.numberOfRemainingPaymentsMessage = vm.numberOfRemainingPaymentsMessage.replace('{firstPaymentDate}',
          firstPaymentDateReplacement);
      }

      vm.firstPaymentDateLabel = vm.i18n.coaf.carPayCatchUp.labels.todaysPayment.label.v1;
      vm.firstPaymentDateLabel = vm.firstPaymentDateLabel.replace('{firstPaymentDate}', firstPaymentDateLabelText);

      var numberOfRemainingCatchupPayments = 3;
      var paymentCatchupDefaultOptionsList = carPayCatchUpService.getPaymentCatchupDefaultOptionsData();

      if (paymentCatchupDefaultOptionsList) {
        vm.paymentsExcludingFirstPaymentList = paymentCatchupDefaultOptionsList.slice(
          1, paymentCatchupDefaultOptionsList.length);
        numberOfRemainingCatchupPayments = vm.paymentsExcludingFirstPaymentList.length;
      }

      vm.numberOfRemainingPaymentsMessage =
        vm.numberOfRemainingPaymentsMessage.replace('{numberOfRemainingCatchupPayments}',
          numberOfRemainingCatchupPayments);

      vm.close = function() {
        carPayCatchUpService.exitPlanSummaryModal();
      };


      // SOFT CONFIRMATION
      // TAKES USER TO 'SELECT PAYMENT ACCOUNT'
      vm.selectPaymentAccount = function() {
        // DISABLES BUTTON
        // SHOWS LOADER
        vm.disabled = true;
        vm.spinnerEnable = true;

        carPayCatchUpService.setFinalCatchupPaymentsData(paymentCatchupDefaultOptionsList);
        carPayCatchUpService.showSelectPaymentAccount();
      };




    }

    return PlanSummaryController;
  });

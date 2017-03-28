define(['angular','moment'],
    function(angular,moment) {
      'use strict';
      var confirmationCpCuPubSub = {
        level2: 'account details',
        level3: 'past due',
        level4: 'cpcu',
        level5: 'confirmation'
      };
      CarPayCatchupConfirmationController.$inject = ['$state','autoLoanModuleService',
        'carPayCatchUpService','AutoLoanPubsubService','AutoLoanStateService'];

      function CarPayCatchupConfirmationController($state, autoLoanModuleService,
                                                   carPayCatchUpService,AutoLoanPubsubService,AutoLoanStateService) {
        var vm = this;
        AutoLoanPubsubService.trackPageView(confirmationCpCuPubSub);

        vm.i18n = autoLoanModuleService.getI18n();
        vm.modalType = 'car-pay-catch-up-modal';
        var paymentConfirmationData = carPayCatchUpService.getPaymentConfirmationData();
        vm.firstPaymentConfirmationCode = paymentConfirmationData[0].paymentInstructionId;
        var paymentsData = carPayCatchUpService.getFinalCatchupPaymentsData();
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

        if (vm.firstPaymentIsNotToday) {
          vm.formattedConfirmationHeaderMessage =
            vm.i18n.coaf.carPayCatchUp.cpcuConfirmation.confirmationModalTextNotToday.label.v1;
        } else {
          var confirmationHeaderMessage = vm.i18n.coaf.carPayCatchUp.cpcuConfirmation.confirmationModalText.label.v1;
          vm.formattedConfirmationHeaderMessage = confirmationHeaderMessage
            .replace('{paymentDay}',vm.i18n.coaf.carPayCatchUp.cpcuConfirmation.todayText.label.v1)
        }

        vm.close = function() {
          AutoLoanStateService.goToLoanDetails(autoLoanModuleService.getAccountDetailsData());
        };
      }
      return CarPayCatchupConfirmationController;
    });

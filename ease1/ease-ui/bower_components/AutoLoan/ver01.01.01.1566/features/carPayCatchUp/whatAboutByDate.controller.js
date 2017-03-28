define(['angular','moment'],
  function(angular, moment) {
    'use strict';
    var paymentOptionsCpCuPubSub = {
      level2: 'account details',
      level3: 'past due',
      level4: 'cpcu',
      level5: 'first payment options'
    };
    function WhatAboutByDateController($scope, $state, autoLoanModuleService,
                                       AutoLoanCalendarFactory, carPayCatchUpService,AutoLoanPubsubService) {

      var vm = this;
      vm.i18n = autoLoanModuleService.getI18n();
      AutoLoanPubsubService.trackPageView(paymentOptionsCpCuPubSub);
      vm.header = vm.i18n.coaf.carPayCatchUp.beforeBy.modalTitle.label.v1;
      vm.amountAndDateText = vm.i18n.coaf.carPayCatchUp.beforeBy.descriptionOne.label.v1;
      vm.whatDateQuestion = vm.i18n.coaf.carPayCatchUp.beforeBy.descriptionTwo.label.v1;
      var byText = vm.i18n.coaf.carPayCatchUp.beforeBy.by.label.v1;
      vm.modalType = 'car-pay-catch-up-modal';


      var availableDates = carPayCatchUpService.getPaymentDatesList();
      var rollAmount = carPayCatchUpService.getRollAmount();


      vm.isOpen = false;
      vm.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.isOpen = true;
      };
      vm.doNotProceed = function() {
        return !vm.dt;
      };

      vm.header = vm.header + ' ' +
        moment(availableDates[availableDates.length - 1].paymentDate,'YYYY-MM-DD')
          .format('MMMM Do') +'?';
      vm.amountAndDateText = vm.amountAndDateText + ' $' + rollAmount + ' ' + byText
        + ' '  + moment(availableDates[availableDates.length - 1].paymentDate,'YYYY-MM-DD').format('MMMM Do') + '?';


      vm.inlineOptions = AutoLoanCalendarFactory.getInlineOptions({
        currentDate: autoLoanModuleService.getCurrentDate(),
        enabledDates: _.map(availableDates, function(availableDate) {
          return availableDate.paymentDate;
        })
      });

      vm.inlineOptions.placement =  'bottom-center';

      vm.close = function() {
        carPayCatchUpService.exitWhatAboutByModal();
      };

      vm.chooseNo = function() {
        $state.go('cpcuContactUs');
      };

      // AFTER DATE IS CHOSEN
      // TAKES USER TO 'PLAN SUMMARY'
      vm.showPlanSummary = function() {
        var firstPaymentDate = moment(vm.dt,'MMM DD, YYYY').format('YYYY-MM-DD');

        // DISABLES BUTTON
        // SHOWS LOADER
        vm.disabled = true;
        vm.spinnerEnable = true;

        carPayCatchUpService.setFirstPaymentDate(firstPaymentDate);
        carPayCatchUpService.showPlanSummary();
      };
    }

    return WhatAboutByDateController;
  });

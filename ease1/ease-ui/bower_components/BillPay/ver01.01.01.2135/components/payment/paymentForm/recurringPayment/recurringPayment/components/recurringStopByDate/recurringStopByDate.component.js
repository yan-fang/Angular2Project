define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('recurringStopByDate', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/payment/paymentForm/recurringPayment/recurringPayment/components/recurringStopByDate/recurringStopByDate.component.html',
      controller: controller,
      scope: {
        id: '@',
        recurringForm: '=',
        switchFn: '&'
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  controller.$inject = [
    'RecurringPaymentUtilService',
    'PayeeDetailService',
    'BillPayPubSubFactory'
  ]

  function controller(
    PaymentService, 
    PayeeDetailService,
    BillPayPubSubFactory
  ) {
    var vm = this;

    // Bindable properties
    angular.extend(this, {
      pageName: getPageName(),
      payee: PayeeDetailService.getPayeeDetail(),
      datepickerConfig: getDatePickerConfig(),

      switchPage: switchPage,
      done: done
    });

    sitecatalyst(); 
    
    function done() {
      vm.switchFn({name: 'MAIN'});
    }

    function switchPage(name) {
      vm.pageName = name;
      sitecatalyst(); 
    }

    function getPageName() {
      var finalPaymentDate = vm.recurringForm.finalPaymentDate;
      var firstPaymentDate = vm.recurringForm.firstPaymentDate;

      if (finalPaymentDate && firstPaymentDate < finalPaymentDate) {
        return 'ENHANCE_FINAL_INFO'
      }

      return 'PICK_FINAL_DATE';
    }

    function getDatePickerConfig() {
      initFinalPaymentDate();
      return {
        minDate: vm.recurringForm.firstPaymentDate,
        maxDate: new Date(8640000000000000),
        selectedDatelabel: 'FINAL',
        arrivedDatelabel: '',
        nextPage: 'ENHANCE_FINAL_INFO'
      }
    }

    function initFinalPaymentDate() {
      var finalPaymentDate = vm.recurringForm.finalPaymentDate;
      var firstPaymentDate = vm.recurringForm.firstPaymentDate;

      if (!finalPaymentDate || firstPaymentDate > finalPaymentDate) {
        vm.recurringForm.finalPaymentDate = PaymentService.getDefaultEndPaymentDate(
          vm.recurringForm.firstPaymentDate,
          vm.recurringForm.frequency
        );
      }
    };

    function sitecatalyst() {
      if (vm.pageName === 'PICK_FINAL_DATE') logSitecatalystEvent('recurringEndCalendar');
      if (vm.pageName === 'ENHANCE_FINAL_INFO') logSitecatalystEvent('recurringEndPaymentsReview');
    }

    // broadcast sitecatalyst event when user in recurring payment modal  
    function logSitecatalystEvent(viewName) {
      BillPayPubSubFactory.logTrackAnalyticsPageView(
        '360',
        viewName
      );
    }
  }
});

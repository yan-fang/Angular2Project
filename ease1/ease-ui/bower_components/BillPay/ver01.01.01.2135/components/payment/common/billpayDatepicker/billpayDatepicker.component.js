define(['angular', 'moment'], function(angular, moment) {
  'use strict';

  angular.module('BillPayModule').directive('billpayDatepicker', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/payment/common/billpayDatepicker/billpayDatepicker.component.html',
      controller: controller,
      scope: {
        id: '@',
        date: '=',
        minDate: '@',
        maxDate: '@',
        leadDays: '@',
        selectedDateLabel: '@',
        arrivedDateLabel: '@',
        nextPage: '@',
        switchFn: '&'
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  controller.$inject = [
    '$stateParams',
    'PaymentDateService',
    'EASEUtilsFactory',
    'BillPayPubSubFactory'
  ]

  function controller(
    $stateParams,
    PaymentDateService,
    EASEUtilsFactory,
    BillPayPubSubFactory
  ) {
    var vm = this;

    // Bindable properties
    angular.extend(this, {
      calendarConfig: getCalendarConfig(),

      done: done
    });

    function done() {
      vm.switchFn({name: vm.nextPage});

      BillPayPubSubFactory.logChangeEvent($stateParams.subCategory + ':payment date change:button');
    }

    function getCalendarConfig() { 
      return {
        customClass: getDayClass,
        isDateDisabled: checkDate,
        format_day_title: 'MMMM YYYY',
        min_date: new Date(vm.minDate.replace(/\"/g, '')),
        max_date: new Date(vm.maxDate.replace(/\"/g, ''))
      }
    }

    function getDayClass(data) {
      var date = data.date;

      // 1. the date is user selected date
      if (data.selected) {
        return { cssClass: '', subLabel: vm.selectedDateLabel }
      }

      // 2. the date is today
      if (moment(date).isSame(Date.now(), 'day')) {
        return { cssClass: '', subLabel: 'TODAY' };
      }

      // 3. the date is arrived by date
      if (vm.arrivedDateLabel) {
        var arrivedDate = PaymentDateService.getArriveDate(vm.date, vm.leadDays, '360')
        if(moment(date).isSame(arrivedDate, 'day')) {
          return { cssClass: '', subLabel: vm.arrivedDateLabel };
        }
      }

      // 4. the date is the first day of a month
      if (date.getDate() === 1) {
        var month = date.getMonth();
        switch (month) {
          case 0  : return { cssClass: '', subLabel: 'JAN' };
          case 1  : return { cssClass: '', subLabel: 'FEB' };
          case 2  : return { cssClass: '', subLabel: 'MAR' };
          case 3  : return { cssClass: '', subLabel: 'APR' };
          case 4  : return { cssClass: '', subLabel: 'MAY' };
          case 5  : return { cssClass: '', subLabel: 'JUN' };
          case 6  : return { cssClass: '', subLabel: 'JUL' };
          case 7  : return { cssClass: '', subLabel: 'AUG' };
          case 8  : return { cssClass: '', subLabel: 'SEP' };
          case 9  : return { cssClass: '', subLabel: 'OCT' };
          case 10 : return { cssClass: '', subLabel: 'NOV' };
          case 11 : return { cssClass: '', subLabel: 'DEC' };
        }
      }
      
      return { cssClass: '', subLabel: '' }
    }

    function checkDate(date) {
      return EASEUtilsFactory.validateBankDayOffs(new Date(date));
    }

  }
});

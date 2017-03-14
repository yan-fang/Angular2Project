define(['angular', 'moment'], function(angular, moment) {
  'use strict';

  angular.module('BillPayModule')
    .service('DatePickerService', DatePickerService)

  DatePickerService.$inject = [
    'EASEUtilsFactory',
    'PaymentDateService'
  ];

  function DatePickerService(
    EASEUtilsFactory,
    PaymentDateService
  ) { 

    var configuration;
    var calenderOutput = {
      paymentDate: {},
      arrivedByDate: {}
    }
    var accountSubCategory;
    var earliestPaymentDate;
    var deliveryLeadDays;

    var api = {
      initDatePicker: initDatePicker,
      getConfiguration: getConfiguration,
      getPaymentDate: getPaymentDate,
      getCalenderOutPutObj: getCalenderOutPutObj
    };

    function initDatePicker(datepickerType, subCategory, payee, paymentDateInput, maxDate, minDate) {
      // 1. set local value
      accountSubCategory = subCategory;
      earliestPaymentDate = payee.earliestPaymentDate;
      deliveryLeadDays = payee.paymentDeliveryLeadDaysCount;
      calenderOutput.paymentDate = paymentDateInput;
      calenderOutput.arrivedByDate = getArrivedByDate();

      // 2. build date picker configuration
      configuration = {
        customClass: getClass,
        isDateDisabled: dateDisabled,
        /*eslint-disable */
        format_day_title: 'MMMM YYYY',
        min_date: getMinDate(minDate),
        max_date: getMaxDate(maxDate),
        /*eslint-enable */
        datepickerType: datepickerType
      }
    }

    function getCalenderOutPutObj() {
      return calenderOutput;
    }

    function getConfiguration() {
      return configuration;
    }

    function getPaymentDate() {
      return calenderOutput.paymentDate;
    }

    function getArrivedByDate() {
      return PaymentDateService.getArriveDate(
        calenderOutput.paymentDate,
        deliveryLeadDays,
        accountSubCategory
      );
    }

    // date picker functions
    function dateDisabled(date) {
      return EASEUtilsFactory.validateBankDayOffs(new Date(date));
    }

    function getMinDate(minDate) {
      if (typeof minDate === 'object') return minDate;
      var minDate = new Date(earliestPaymentDate);
      var utcTime = new Date(minDate.getTime() + minDate.getTimezoneOffset() * 60000);
      return utcTime;
    }

    function getMaxDate(maxDate) {
      if (typeof maxDate === 'object') return maxDate;
      var maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);
      return maxDate;
    }

    function getClass(data) {
      var date = data.date;
      var selected = data.selected;

      // 1. the date is user selected date
      if (selected) {

        if (this.datepickerType === 'paymentDate') {
          var label = (accountSubCategory === '360') ? 'SEND' : 'PAY';
        }

        if (this.datepickerType === 'finalPaymentDate') {
          var label = 'FINAL';
        }
        
        return { cssClass: '', subLabel: label };
      }

      // 2. the date is today
      if (moment(date).isSame(Date.now(), 'day')) {
        return { cssClass: '', subLabel: 'TODAY' };
      }

      // 3. the date is arrived by date
      if (moment(date).isSame(getArrivedByDate(), 'day') && this.datepickerType !== 'finalPaymentDate') {
        return { cssClass: '', subLabel: 'ARRIVE' };
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

      // 5. normal date
      return { cssClass: '', subLabel: '' };
    }

    /* test-code */
    api.__testonly__ = {};
    api.__testonly__.setConfiguration = function(input) {
      configuration = input;
    };
    api.__testonly__.setCalenderOutput = function(paymentDate, arrivedByDate) {
      calenderOutput.paymentDate = paymentDate;
      calenderOutput.arrivedByDate = arrivedByDate;
    };
    api.__testonly__.setAccountSubCategory = function(input) {
      accountSubCategory = input;
    };
    api.__testonly__.setArrivedByDate = function(input) {
      calenderOutput.arrivedByDate = input;
    };
    api.__testonly__.setEarliestPaymentDate = function(input) {
      earliestPaymentDate = input;
    };
    api.__testonly__.getArrivedByDate = getArrivedByDate;
    api.__testonly__.dateDisabled = dateDisabled;
    api.__testonly__.getMinDate = getMinDate;
    api.__testonly__.getMaxDate = getMaxDate;
    api.__testonly__.getClass = getClass;
    /* end-test-code */

    return api;
  }

});
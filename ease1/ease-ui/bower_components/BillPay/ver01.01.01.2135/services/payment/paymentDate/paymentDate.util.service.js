define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .service('PaymentDateService', PaymentDateService)

  PaymentDateService.$inject = [
    'EASEUtilsFactory'
  ];

  function PaymentDateService(
    EASEUtilsFactory
  ) {
    var api = {
      getFirstAvailableDate: getFirstAvailableDate,
      getNextAvailableDate: getNextAvailableDate,
      getEarliestPaymentDate: getEarliestPaymentDate,
      getArriveDate: getArriveDate
    };

    function getFirstAvailableDate(date) {
      var availableDate = new Date(date);
      while (EASEUtilsFactory.validateBankDayOffs(availableDate)) {
        availableDate.setDate(availableDate.getDate() +1);
      }
      return availableDate;
    }

    function getNextAvailableDate(date) {
      var nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() +1);
      return getFirstAvailableDate(nextDate)
    }

    function getEarliestPaymentDate(selectedPayee) {
      var minDate = new Date(selectedPayee.earliestPaymentDate);
      var utcTime = new Date(minDate.getTime() + minDate.getTimezoneOffset() * 60000);

      return utcTime;
    }

    function getArriveDate(paymentDate, leadDays, accountSubCategory) {
      if (!paymentDate) return;
      if (accountSubCategory !== '360') return;

      return getNextNthAvailableDate(paymentDate, leadDays);
    }

    function getNextNthAvailableDate(startDay, leadDays) {
      var nextNthDay = new Date(startDay);

      for (var i = leadDays - 1; i > 0; i--) {
        nextNthDay = getNextAvailableDate(nextNthDay);
      }
      return nextNthDay;
    }

    return api;
  }

});

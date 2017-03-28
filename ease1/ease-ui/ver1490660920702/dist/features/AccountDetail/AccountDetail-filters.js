define(['angular', 'c1Date'], function(angular) {
  'use strict';

  angular.module('AccountDetailsModule')
    .filter('filterTransactions', ['$locale', function($locale) {
      return function(items, filterText, searchProps, dateRange) {
        var output = [];
        if (items) {
          if (dateRange && dateRange.start && dateRange.end) { // filter by date range
            var date1 = c1Date(dateRange.start);
            var date2 = c1Date(dateRange.end);
            var transDate;
            for (var i = 0; i < items.length; i++) {
              if (items[i].displayDate) {
                transDate = c1Date(items[i].displayDate);
              } else {
                transDate = c1Date(items[i].paymentDate);
              }
              // does not matter which date is earlier
              if (transDate.isBetween(date1, date2) || transDate.isBetween(date2, date1)) {
                output.push(items[i]);
              }
            }
          } else {
            output = items;
          }
        }
        var searchArr = (searchProps && searchProps.length > 0) ?
          searchProps : ['transactionDate', 'merchantName', 'category', 'transactionAmount', 'accountBalance'];
        if (output.length > 0 && filterText) {
          output = output.filter(function(element) {
            if (filterText.substr(0, 3) === '...') { // remove '...' from start of search string, per card request
              filterText = filterText.substr(3);
            }
            var returnValue = true;
            var expected = filterText.toLowerCase();
            var searchArray = searchArr;
            returnValue = returnValue && searchArray.some(function(actual) {
              // TO-DO: if data contracts updated, revisit this code
              var elementVal = element;
              var actualFields = actual.split('.'); // for searches on nested objects, i.e. transaction.merchant.name
              for (var i = 0; i < actualFields.length; i++) {
                elementVal = elementVal[actualFields[i]]; // value of field/object
                if (!elementVal) { // trying to search on invalid field/object
                  return false;
                }
              }
              if (actual.toLowerCase().indexOf('date') !== -1) { // only want to check the date, not the time
                var date = new Date(elementVal);
                var month = date.getMonth();
                var day = date.getDate();
                var day2 = day < 10 ? '0' + day : day; // append 0 to dates 1-9 for consistency with mm/dd/yyyy search
                var year = date.getFullYear();
                var weekDay = date.getDay();
                var monthStr = $locale.DATETIME_FORMATS.MONTH[month].toLowerCase(); // month name
                var msStr = $locale.DATETIME_FORMATS.SHORTMONTH[month].toLowerCase(); // first three letters of month
                var weekDayStr = $locale.DATETIME_FORMATS.SHORTDAY[weekDay].toLowerCase(); // day of week name
                month = month < 9 ? '0' + (month + 1) : (month + 1); // add a 0 to months 1-9
                var dateStr = month + '/' + day + '/' + year;
                var dateStr2 = month + '/' + day2 + '/' + year;
                var mdShortStr = weekDayStr + ', ' + msStr + ' ' + day + ', ' + year; // eee, mmm dd, yyyy
                var mdShortStr2 = weekDayStr + ', ' + msStr + ' ' + day2 + ', ' + year;
                var mdFullStr = weekDayStr + ', ' + monthStr + ' ' + day + ', ' + year; // eee, monthName dd, yyyy
                var mdFullStr2 = weekDayStr + ', ' + monthStr + ' ' + day2 + ', ' + year;
                return angular.isDefined(elementVal) &&
                  (dateStr.indexOf(expected) !== -1 || dateStr2.indexOf(expected) !== -1 ||
                    mdShortStr.indexOf(expected) !== -1 || mdShortStr2.indexOf(expected) !== -1 ||
                    mdFullStr.indexOf(expected) !== -1 || mdFullStr2.indexOf(expected) !== -1);
              } else if (actual.toLowerCase().indexOf('amount') !== -1 ||
                actual.toLowerCase().indexOf('balance') !== -1) {
                var moneyStr1;
                var moneyStr2;
                if (typeof elementVal === 'number') {
                  var moneyVal = Math.abs(elementVal).toFixed(2); // allow search using XXX.XX input for money values
                  moneyStr1 = '-$' + moneyVal;
                  moneyStr2 = '$-' + moneyVal;
                } else {
                  moneyStr1 = '-$' + elementVal; // case where value is already stored as a string
                  moneyStr2 = '$-' + elementVal;
                }
                return angular.isDefined(elementVal) &&
                  (moneyStr1.indexOf(expected) !== -1 || moneyStr2.indexOf(expected) !== -1);
              } else {
                return angular.isDefined(elementVal) && elementVal.toString().toLowerCase().indexOf(
                  expected) !== -1;
              }
            });
            return returnValue;
          });
        }
        return output;
      };
    }]);
});

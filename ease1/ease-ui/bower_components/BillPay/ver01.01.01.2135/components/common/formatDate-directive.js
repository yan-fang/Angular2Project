define(['angular', 'moment'], function(angular, moment) {
  'use strict';

  angular.module('BillPayModule').directive('formatDate', function() {
    return {
      require: '^ngModel',
      restrict: 'A',
      link: function(scope, elem, attrs, ctrl) {
        var dateFormat = attrs.formatDate;
        
        // attrs.$observe('formatDate', function(newValue) {
        //   if (dateFormat === newValue || !ctrl.$modelValue) return;
        //   dateFormat = newValue;
        //   ctrl.$modelValue = new Date(ctrl.$setViewValue);
        // });

        ctrl.$formatters.unshift(function(modelValue) {
          scope = scope;
          // if (!dateFormat || !modelValue) return '';
          var retVal = moment(modelValue, 'ddd MMM DD YYYY').format(dateFormat);
          return retVal;
        });

        // ctrl.$parsers.unshift(function(viewValue) {
        //   scope = scope;
        //   var date = moment(viewValue, dateFormat);
        //   return (date && date.isValid() && date.year() > 1950 ) ? date.toDate() : '';
        // });
      }
    };
  });
});
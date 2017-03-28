define(['angular'],
  function(angular) {
    'use strict';

    angular
      .module('DebitModule')
      .directive('debitYearInput', function() {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(inputValue) {

              // numbers only
              var transformedInput = inputValue.replace(/[^0-9]/g, '');
              if (transformedInput !== inputValue) {
                modelCtrl.$setValidity('yearInput', false);
                modelCtrl.$setViewValue(transformedInput);
                modelCtrl.$render();
                return transformedInput;
              }

              // max 2 digits
              if (inputValue.length > 2) {
                modelCtrl.$setViewValue( inputValue.substring(2, 0) );
                modelCtrl.$render();
                return inputValue.substring(2, 0);
              }

              // 2 digit year that is greater than current year
              var currentYear = new Date().getFullYear();
              currentYear = parseInt(currentYear.toString().substr(2, 2), 10);

              // Entered year as integer
              var expirationYear = parseInt(inputValue, 10);

              /*
               * TO DO
               *
               * Please fix above code to get 2 digit current year
               * before the year 2090 to avoid repeating dangerous
               * y2k bug.
               *
               * https://en.wikipedia.org/wiki/Year_2000_problem
               *
              */

              if (inputValue.length === 2 &&
                  expirationYear > currentYear &&
                  expirationYear < currentYear + 10) {
                modelCtrl.$setValidity('yearInput', true);
                return inputValue;
              } else {
                modelCtrl.$setValidity('yearInput', false);
              }

            });
          }
        };
      });
  });

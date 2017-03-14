define(['angular'],
  function(angular) {
    'use strict';

    angular
      .module('DebitModule')
      .directive('debitMonthInput', function() {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(inputValue) {

              // numbers only
              var transformedInput = inputValue.replace(/[^0-9]/g, '');
              if (transformedInput !== inputValue) {

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

              // 2 digit value between 1 - 12
              if (inputValue.length === 2 &&
                  parseInt(inputValue, 10) >= 1 &&
                  parseInt(inputValue, 10) <= 12 ) {
                modelCtrl.$setValidity('monthInput', true);
                return inputValue;
              } else {
                modelCtrl.$setValidity('monthInput', false);
              }
            });
          }
        };
      });
  });

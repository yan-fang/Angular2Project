define(['angular'],
  function(angular) {
    'use strict';

    angular
      .module('DebitModule')
      .directive('debitNumbersOnly', function() {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(inputValue) {
              var transformedInput;

              transformedInput = inputValue.replace(/[^0-9]/g, '');
              if (transformedInput !== inputValue) {
                modelCtrl.$setViewValue(transformedInput);
                modelCtrl.$render();
              }
              return transformedInput;
            });
          }
        };
      });
  });

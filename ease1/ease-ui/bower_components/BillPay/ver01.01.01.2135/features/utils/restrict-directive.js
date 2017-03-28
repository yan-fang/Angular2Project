define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('restrictPattern', restrictPatternDirective);

  function restrictPatternDirective() {
    return {
      restrict: 'A',
      compile: function() {
        return function(scope, element, attrs) {
          // Handle key events
          element.bind('keypress', function(event) {
            var keyCode = event.which || event.keyCode;

            // Pass tabs, shift, ctrl and command, backspace and delete
            if (keyCode === 8 || keyCode === 9 || keyCode === 16 || keyCode === 17
              || (keyCode >= 35 && keyCode <= 40)
              || keyCode === 46 || keyCode === 91) {
              return;
            }

            var keyCodeChar = String.fromCharCode(keyCode);

            // If the keyCode char does not match the allowed Regex Pattern, then don't allow the input into the field.
            if (!keyCodeChar.match(new RegExp(attrs.restrictPattern, 'i'))) {
              event.preventDefault();
              return false;
            }
          });
        };
      }
    };
  }
});

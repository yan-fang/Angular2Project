define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('validateMemo', function() {
    return {
      require: '^ngModel',
      restrict: 'A',
      link: function(scope, elem, attrs, ctrl) {
        ctrl.$validators.isMemoValid = function(modelValue, viewValue) {
          var value = modelValue || viewValue;

          // 1. no value input
          if (!value) {
            ctrl.memoErrorMessage = null;
            return true;
          }

          // 1. check memo more than 35 characters
          if (value.length >= 35) {
            ctrl.memoErrorMessage = 'Memo should be less than 35 characters';
            return false;
          }

          // 2. check memo charactor 
          if (value && !/^[a-zA-Z0-9\s\.\-\,\;\:\$\?\!]+$/.test(value)) {
            ctrl.memoErrorMessage = 'Only these special characters are allowed (. , : ; - $ ? !)';
            return false
          }
          
          // 3. valid input
          ctrl.memoErrorMessage = null;
          return true;
        };
      }
    };
  });
});
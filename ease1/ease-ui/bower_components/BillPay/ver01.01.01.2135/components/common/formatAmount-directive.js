define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .directive('formatAmount', formatAmount)
    .filter('formatPaymentAmount', formatPaymentAmount)

  formatAmount.$inject = ['$filter'];

  function formatAmount($filter) {
    return {
      require: 'ngModel',
      scope: { accountCategory: '='},
      link: function(scope, element, attrs, ngModelCtrl) {

        ngModelCtrl.$formatters.unshift(function(modelValue) {
          var retVal = $filter('currency')(modelValue);
          return retVal;
        });

        /*// This runs when the model gets updated on the scope directly and keeps our view in sync
        ngModelCtrl.$render = function() {
          element.val($filter('formatPaymentAmount')(ngModelCtrl.$viewValue, false));
        };*/

        // This runs when we update the text field
        ngModelCtrl.$parsers.push(function(/*viewValue*/) {
          return $filter('formatPaymentAmount')(ngModelCtrl.$viewValue, false);
        });

        //var regex = /\d*\.?\d\d?/g;

        element.bind('keyup', function() {

          var isAmountValid = true,
            paymentAmountErrorMessage = '';
          var value = $filter('formatPaymentAmount')(this.value, false);

          var tempValue = value.toString().trim().replace(/[^0-9.]/g, '');

          this.value = value;
          if (!tempValue || tempValue === '0.00') {
            isAmountValid = false;
            paymentAmountErrorMessage = 'Payment amount cannot be $0.00';
          }else if (parseFloat(tempValue) < 1.00 && scope.accountCategory !== undefined 
            && scope.accountCategory === 'retail') {
            isAmountValid = false;
            paymentAmountErrorMessage = 'Payment amount cannot be less than $1.00';
          }else if (parseFloat(tempValue) > 99999.99) {
            isAmountValid = false;
            paymentAmountErrorMessage = 'Payment amount cannot exceed $99,999.99';
          }

          scope.$apply(function() {
            ngModelCtrl.$setValidity('isAmountValid', isAmountValid);
            ngModelCtrl.paymentAmountErrorMessage = paymentAmountErrorMessage;
          });
        });
        element.bind('blur', function() {
          var currentValue = $filter('formatPaymentAmount')(this.value, false);

          currentValue = currentValue.toString().trim().replace(/[^0-9.]/g, '');

          this.value = '$' + $filter('number')(currentValue, 2);

          if (!currentValue || parseFloat(currentValue) === 0.00) {
            this.value = null;
            scope.$apply(function() {
              ngModelCtrl.$setValidity('isAmountValid', false);
              ngModelCtrl.paymentAmountErrorMessage = 'Payment amount cannot be $0.00';
            });
          }
        });

        element.bind('focus', function() {
          var currentValue = $filter('formatPaymentAmount')(this.value, false);

          currentValue = currentValue.toString().trim().replace(/[^0-9.]/g, '');

          this.value = '$' + $filter('number')(currentValue, 2);

          if (!currentValue || parseFloat(currentValue) === 0.00) {
            this.value = null;
            scope.$apply(function() {
              ngModelCtrl.$setValidity('isAmountValid', false);
            });
          }
        });

        //disable paste
        element.bind('paste', function(event) {
          event.preventDefault();
        });
        //disable drag drop
        element.bind('drop', function(event) {
          event.preventDefault();
        });

      }
    };
  }

  formatPaymentAmount.$inject = ['$filter'];

  function formatPaymentAmount($filter) {
    return function(paymentAmount) {

      var value, formattedAmount;

      //replace alphabets and special characters
      value = paymentAmount.toString().trim().replace(/[^0-9.]/g, '');

      //replace second dot
      value = value.replace(/^([^.]*\.)(.*)$/, function(a, b, c) {
        return b + c.replace(/\./g, '');
      });

      var dotSeparatedValue = []
      dotSeparatedValue = value.split('.');

      //check different combinations of the value
      if (!dotSeparatedValue[0] && !dotSeparatedValue[1]) {
        formattedAmount = '$';
        if (value.indexOf('.') === 0) {
          formattedAmount = '$0.';
        }
      }else if (dotSeparatedValue[1] && dotSeparatedValue[1].length && dotSeparatedValue[1].length >= 2) {
        dotSeparatedValue[1] = dotSeparatedValue[1].substr(0, 2);
        value = dotSeparatedValue[0] + '.' + dotSeparatedValue[1];
        formattedAmount = '$' + $filter('number')(value, dotSeparatedValue[1].length);
      }else if (dotSeparatedValue[1] && dotSeparatedValue[1].length && dotSeparatedValue[1].length < 2) {
        formattedAmount = '$' + $filter('number')(value, dotSeparatedValue[1].length);
      }else if (!dotSeparatedValue[1] && value.indexOf('.') !== -1) {
        formattedAmount = '$' + $filter('number')(value) + '.';
      }else {
        formattedAmount = '$' + $filter('number')(value);
      }

      return formattedAmount;
    };
  }

});
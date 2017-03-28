/**
 * Created by neb699 on 7/13/16.
 */
define(['angular'], function(angular) {
  'use strict';

  angular
      .module('BankModule')
      .directive('moneyInput', moneyInputDirective);

  moneyInputDirective.$inject = ['$locale'];
  function moneyInputDirective($locale) {
    return {
      restrict : 'A',
      require: 'ngModel',
      link : function link(scope, element, attrs, ngModelCtrl) {

        var startIndex = 0;
        var precision = 2;
        var maxIndex = 13;

        var currencyRegEx = new RegExp('[^\\d\\b' +$locale.NUMBER_FORMATS.DECIMAL_SEP + '\\b]' ,'g');

        ngModelCtrl.$parsers.unshift(function(amountEntered) {

          var filtered;

          if( amountEntered.indexOf($locale.NUMBER_FORMATS.DECIMAL_SEP) === -1) {
            filtered = amountEntered.substr(startIndex, maxIndex);
            return updateModelView(filtered, amountEntered);
          }
          var amountSplit = amountEntered.split($locale.NUMBER_FORMATS.DECIMAL_SEP);
          filtered = amountSplit[0] + $locale.NUMBER_FORMATS.DECIMAL_SEP + amountSplit[1].substr(0, precision);
          return updateModelView(filtered, amountEntered);

        });

        function updateModelView(filtered, entered) {

          filtered = filtered.replace(currencyRegEx, '');
          if(filtered !== entered) {
            ngModelCtrl.$setViewValue(filtered);
            ngModelCtrl.$modelValue = filtered;
            ngModelCtrl.$render();
          }

          return filtered;
        }
      }
    }
  }
});

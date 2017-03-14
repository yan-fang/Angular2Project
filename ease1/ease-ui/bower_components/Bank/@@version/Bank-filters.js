define(['angular'], function (angular) {
  'use strict';

  angular
      .module('BankModule')
      .filter('dollars', getWholeNumber)
      .filter('cents', getDecimal);


  //------------------------------------------ Filters -----------------------------------------------------------------

  getWholeNumber.$inject = [ '$filter', '$locale'];
  function getWholeNumber($filter, locale) {

    var formats = locale.NUMBER_FORMATS;
    return wholeNumberFilter;

    function wholeNumberFilter(amount) {
      var value = $filter('currency')(amount);
      var sep = value.indexOf(formats.DECIMAL_SEP);
      if (amount < 0){
        return ("- " + value.substring(2, sep));
      }
      else {
        return value.substring(1, sep);
      }
    }
  }

  getDecimal.$inject = [ '$filter', '$locale'];
  function getDecimal($filter, locale) {

    var formats = locale.NUMBER_FORMATS;
    return decimalFilter;

    function decimalFilter(amount) {
      var value = $filter('currency')(amount);
      var sep = value.indexOf(formats.DECIMAL_SEP);
      if (amount < 0){
        return value.substring(sep + 1, sep + 3);
      }
      else {
        return value.substring(sep + 1);
      }
    }

  }

});

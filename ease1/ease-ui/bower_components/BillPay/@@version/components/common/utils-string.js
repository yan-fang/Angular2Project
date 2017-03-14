define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').factory('StringUtils', StringUtils);
  function StringUtils() {

    return {
      hasEmptyString: hasEmptyString,
      isEmpty: isEmpty
    }

    function hasEmptyString() {
      for (var i = 0; i < arguments.length; i++) {
        if (isEmpty(arguments[i])) return true;
      }

      return false;
    }

    function isEmpty(string) {
      if (string === null) return true;
      if (string === undefined) return true;
      if (string === '') return true;
      return false;
    }
  }
});

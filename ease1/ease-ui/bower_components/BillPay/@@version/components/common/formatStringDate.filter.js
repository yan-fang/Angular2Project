define(['angular'], function(angular) {
  'use strict';

  var billPayModule = angular.module('BillPayModule')

  billPayModule.filter('stringDate', ['$filter', function($filter) {
    return function(string, format) {
      var date = new Date(string.replace(/\"/g, ''));
      return $filter('date')(date, format);
    }
  }]);
});
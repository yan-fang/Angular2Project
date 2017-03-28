define(['angular'], function(angular) {
  'use strict';

  var billPayModule = angular.module('BillPayModule')

  billPayModule.directive('changeRole', ['$timeout', function($timeout) {
    return {
      link: function(scope, element, attrs) {
        var role = attrs.changeRole;
        $timeout(function() {
          element.removeAttr('role');
          element.attr('role', role);
        }, 300);
      }
    };
  }]);
});
define(['angular'], function(angular) {
  'use strict';

  var statementsCalendarModule = angular.module('AutoLoanStatementsModule');

  statementsCalendarModule.directive('statementsCalendar', [function() {
    return {
      restrict: 'A',
      scope: {
        'statements': '=',
        'showNextYear': '=',
        'showPreviousYear': '='
      },
      templateUrl: function getTemplate($element, $attrs) {
        return $attrs.templateUrl ||
            '/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/statements/partials/AutoLoan-statementsCalendar.html';
      },
      link: function() {

      }
    };
  }]);
});

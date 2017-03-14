define(['angular'], function (angular) {
  'use strict';
  angular
      .module('BankModule')
      .directive('focusCloseOnTab', function focusCloseOnTab() {
        return {
          restrict: 'A',
          link: function (scope, elem, attrs) {
            elem.bind('keydown', function (event) {
              var first = angular.element(document.querySelector('.close-dialog'));
              if (event.keyCode == 9) {
                event.preventDefault();
                first[0].focus();
              }
            });
          }
        }
      });
});

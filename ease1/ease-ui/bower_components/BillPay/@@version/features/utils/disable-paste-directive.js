define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('disablePaste', disablePasteDirective);

  function disablePasteDirective() {
    return {
      restrict: 'A',
      link: function(scope, element) {
        element.on('cut copy paste', function(event) {
          event.preventDefault();
        });
      }
    };
  }
});

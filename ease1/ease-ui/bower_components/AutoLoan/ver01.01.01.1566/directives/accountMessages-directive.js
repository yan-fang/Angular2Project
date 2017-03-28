define(['angular'], function(angular) {
  'use strict';

  var accountMessagesModule = angular.module('AccountMessagesModule',[]);

  accountMessagesModule.directive('autoAccountMessage', [function() {
    return {
      restrict: 'A',
      scope: {
        'message': '='
      },
      templateUrl: '/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/partials/accountMessages.html'
    };
  }]);
});

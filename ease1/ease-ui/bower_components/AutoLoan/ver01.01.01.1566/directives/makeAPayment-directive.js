define(['angular'], function(angular) {
  'use strict';

  var makeAPaymentModule = angular.module('MakeAPaymentModule',[]);

  makeAPaymentModule.directive('makeAPayment', ['autoLoanModuleService', function(autoLoanModuleService) {
    return {
      restrict: 'A',
      scope: {
        'callback': '&',
        'type': '@',
        'text':'='
      },
      templateUrl: '/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/partials/makeAPayment.html',
      link: function($scope) {
        $scope.isButtonVisible = function() {
          return $scope.type === 'button' && autoLoanModuleService.isMakeAPaymentButtonVisible();
        }
        $scope.isLinkVisible = function() {
          return $scope.type === 'link' && autoLoanModuleService.isMakeAPaymentButtonVisible();
        }
        $scope.isDisabled = function() {
          return autoLoanModuleService.getDisableMakeAPayment();
        }
        $scope.isSpinnerEnabled = function() {
          return autoLoanModuleService.isSpinnerEnabled();
        }
      }
    };
  }]);
});

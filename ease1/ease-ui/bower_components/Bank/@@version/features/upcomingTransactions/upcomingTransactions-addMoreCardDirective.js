define(['angular'], function (angular) {
  'use strict';
  angular
    .module('BankModule')
    .controller('upcomingAddMoreCardController', upcomingAddMoreCardController)
    .directive('upcomingAddMoreCardDirective', upcomingAddMoreCardDirective);

    upcomingAddMoreCardController.$inject = ['BankFiles'];
    function upcomingAddMoreCardController(BankFiles) {
      var addMoreButtonPath = BankFiles.getFilePath('images/icon-blue-plus.png');
      angular.extend(this, {
        addMoreButton: addMoreButtonPath
      });
    }

    upcomingAddMoreCardDirective.$inject = ['BankFiles'];
    function upcomingAddMoreCardDirective(BankFiles) {
      return {
        restrict: 'E',
        replace: false,
        bindToController: true,
        controller: 'upcomingAddMoreCardController',
        controllerAs: 'upcomingAddMoreCardCtrl',
        templateUrl: BankFiles.getFilePath('features/upcomingTransactions/partials/upcoming-addMoreTransactions.html')
      }
    }
});

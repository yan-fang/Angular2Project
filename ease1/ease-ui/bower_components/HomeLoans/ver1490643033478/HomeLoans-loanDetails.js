define(['angular'], function(angular) {
  'use strict';
  var HomeLoansDetailsModule = angular.module('HomeLoansDetailsModule', ['EaseProperties', 'easeAppUtils',
    'restangular']);

  HomeLoansDetailsModule.controller('HomeLoansDetailsController',
    function($scope, $controller, accountDetailsData, $state, $filter,HomeLoansProperties) {

      var vm = this;
      var properties = HomeLoansProperties.getProperties();
      $scope.todayDate = $filter('date')(new Date(), 'yyyy-MM-dd');
      angular.extend(vm, {
        focusClass:'loanDetailsLink',
        initClose: false,
        modalType: 'loanDetailsModal',
        modalClass: 'hl-details-icon',
        close: function(){
          //Go to previous state (The account details page)
          $state.go('^');
        },
        dateFormat: 'MMMM dd, yyyy',
        accountDetails: accountDetailsData.accountDetails,
        originalAmountValue: properties.originalAmountValue,
        originalAmountLabel: properties.originalAmountLabel
      });
    });

  return HomeLoansDetailsModule;
});

define(['angular'], function(angular) {
  'use strict';

  var EscrowDetailsModule = angular.module('EscrowDetailsModule', ['EaseProperties', 'easeAppUtils',
    'restangular']);

  EscrowDetailsModule.controller('EscrowDetailsController',
    function($scope, $controller, accountDetailsData, $state, $filter) {

      var vm = this;
      $scope.todayDate = $filter('date')(new Date(), 'yyyy-MM-dd');
      angular.extend(vm, {
        focusClass:'escrowDetails',
        initClose: false,
        modalType: 'escrowDetailsModal',
        modalClass: 'icon-modal-dollar',
        currentEscrowBalance: data.currentEscrowBalance,
        minimumEscrowBalance: data.minimumEscrowBalance,
        totalPaymentDue: data.totalPaymentDue,
        accountShortage: data.accountShortage,
        countyTax: data.countyTax,
        hazardInsurance: data.hazardInsurance,
        date:data.escrowAnalysisEffectiveDate,
        // TODO not mapped with API so marking it as null by default
        estimatedYearlyPmt: null,
        cityPropertyTax: null,
        homeOwnersIns: null,
        privateMtgIns: null,
        close: function(){
          //Go to previous state (The account details page)
          $state.go('^');
        },
        dateFormat: 'MMMM dd, yyyy',
        accountDetails: accountDetailsData.accountDetails
      });
    });

  return EscrowDetailsModule;
});

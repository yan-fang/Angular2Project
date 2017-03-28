define(['angular'], function(angular) {
  'use strict';
  var module = angular.module('AutoLoanStateServiceModule',['ui.router']);

  module.service('AutoLoanStateService',function($state, $stateParams) {
    var services = this;
    var urlContains =  function(state, urlToCheck) {
      return (state.url.indexOf(urlToCheck)!==-1)
    };

    var getParams = function(accountDetailsData) {
      var params = {
        'ProductName': $stateParams.ProductName,
        'lineOfBusiness': $stateParams.accountDetails.lineOfBusiness,
        'accountReferenceId': accountDetailsData.accountRefId,
        'payment': {
          'lineOfBusiness': $stateParams.accountDetails.lineOfBusiness,
          'isAccountDataAvailable': true
        }
      };
      angular.extend(params, $stateParams);
      return params;
    };

    services.goToLoanDetailsState = function(accountDetailsData) {
      $state.go('AutoLoanDetails.transactions.loanDetails', getParams(accountDetailsData));
    };

    services.goToPaymentDetailsState = function(accountDetailsData) {
      $state.go('AutoLoanDetails.transactions.paymentDetails', getParams(accountDetailsData));
    };

    services.goToLoanPaymentState = function(accountDetailsData) {
      $state.go('AutoLoanPayment', getParams(accountDetailsData));
    };

    services.goToLoanTrackerState = function(accountDetailsData) {
      $state.go('autoLoanTracker', getParams(accountDetailsData));
    };

    services.goToCarPayCatchUpState = function(accountDetailsData) {
      $state.go('carPayCatchUp', getParams(accountDetailsData));
    };

    services.goToEventsHistoryState =function(accountDetailsData) {
      $state.go('autoLoanTracker.eventsHistory', getParams(accountDetailsData));
    };

    services.goToMoreServicesState =function(accountDetailsData) {
      $state.go('AutoLoanDetails.transactions.moreServices', getParams(accountDetailsData));
    };

    services.goToDuedateChangeState =function(accountDetailsData) {
      $state.go('AutoLoanDetails.transactions.dueDateChange', getParams(accountDetailsData));
    };

    services.goToLoanDetails = function(accountDetailsData) {
      $state.go('AutoLoanDetails.transactions', getParams(accountDetailsData));
    };

    services.goToPaperlessPreference = function() {
           $state.go('paperlessPreference');
    };

    services.overrideBackButton = function($scope,accountDetailsData) {
      var $rootScope = $scope.$root;
      var backButton = $rootScope.$on('$stateChangeStart',
        function overrideBackButton(event, toState, toParams, fromState) {
          if ((urlContains(fromState,'carPayCatchUp') || urlContains(fromState,'autoLoanTracker'))
            && urlContains(toState,'accountSummary')) {
            event.preventDefault();
            services.goToLoanDetails(accountDetailsData);
          }
        });

    };
  });

  return module;
});

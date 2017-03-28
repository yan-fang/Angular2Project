/**
 * Created by wni931 on 01/23/17.
 */

define(['angular'],
  function (angular) {
    'use strict';
    var HomeLoansModule = angular.module('HomeLoansModule');
    HomeLoansModule.controller('LoanDetailsController', ['homeLoansAccountDetailsService', '$state', '$rootScope', '$scope', 'close', 'HomeLoansProperties', '$filter' ,
        function (homeLoansAccountDetailsService, $state, $rootScope, $scope, close, HomeLoansProperties, $filter) {
          var vm = $scope;
          vm.showIconMobile = true;
          vm.i18nHL = homeLoansAccountDetailsService.getI18n();

          var productCategory = homeLoansAccountDetailsService.getProductCategory();
          var properties = HomeLoansProperties.getProperties();
          vm.accountDetails= homeLoansAccountDetailsService.getAccountDetailsData().accountDetails;
          vm.dateFormat = 'MMMM dd, yyyy';
          vm.originalAmountValue = properties.originalAmountValue;
          vm.originalAmountLabel = properties.originalAmountLabel;
          vm.loanTermDurationFriendlyFormat = properties.loanTermDurationFriendlyFormat;
          vm.remainingTermDurationFriendlyFormat = properties.remainingTermDurationFriendlyFormat
          $scope.todayDate = $filter('date')(new Date(), 'yyyy-MM-dd');
          vm.close = close;
        }]
    );
  });

/**
 * Created by wni931 on 01/23/17.
 */

define(['angular'],
  function (angular) {
    'use strict';
    var HomeLoansModule = angular.module('HomeLoansModule');
    HomeLoansModule.controller('PaymentDetailsController', ['homeLoansAccountDetailsService', '$state', '$rootScope', '$scope', 'close', 'HomeLoansProperties', '$filter' ,
        function (homeLoansAccountDetailsService, $state, $rootScope, $scope, close, HomeLoansProperties, $filter) {
          var vm = $scope;
          vm.i18nHL = homeLoansAccountDetailsService.getI18n();

          var productCategory = homeLoansAccountDetailsService.getProductCategory();
          var accountDetailsData = homeLoansAccountDetailsService.getAccountDetailsData();
          var properties = HomeLoansProperties.getProperties();
          vm.accountDetails= accountDetailsData.accountDetails;
          vm.features = accountDetailsData.features;
          vm.dateFormat = 'MMMM dd, yyyy';
          vm.close = close;

          vm.goToMakeAPaymentModal = function(evt){
            // close this modal before opening the MAP
            close();
            evt.cancelBubble = true;
            //Payment is a non-stateful modal.  So exit from the current state.
            //$state.go('^');
            $scope.focusId = 'makeAPaymentButton';
            homeLoansAccountDetailsService.setLoadingPayment('loading');
            var paymentDetailsButtonDoc = document.getElementById('paymentDetailsModal');
            homeLoansAccountDetailsService.setMakeAPaymentModalFocus(paymentDetailsButtonDoc);
            homeLoansAccountDetailsService.setAccountDetailsData(accountDetailsData);
            var payment = {
              'category'   : $scope.AccountType,
              'referenceId': accountDetailsData.accountReferenceId
            };

            $state.go('HomeLoanPayment',
              {'lineOfBusiness': $scope.AccountType,
                'accountReferenceId': accountDetailsData.accountReferenceId,
                'payment':{isAccountDataAvailable: false}});
          }
        }]
    );
  });

/**
 * Created by wni931 on 01/23/17.
 */

define(['angular'],
  function (angular) {
    'use strict';
    var HomeLoansModule = angular.module('HomeLoansModule');
    HomeLoansModule.controller('PaymentsSuccessController', ['homeLoansAccountDetailsService', 'UmmPaymentFactory', '$state', '$rootScope', '$scope', 'close',
      function (homeLoansAccountDetailsService, UmmPaymentFactory, $state, $rootScope, $scope, close) {
        //$scope.close = close;
        var vm = $scope;
        vm.close = close;
        vm.i18n = homeLoansAccountDetailsService.getI18n();
        var productCategory = homeLoansAccountDetailsService.getProductCategory();
        // has the data from the rest call to the payment accounts v6. getUmmPayments of the OL.
        vm.fromAccounts = UmmPaymentFactory.getUmmData();
        vm.paymentInfo = homeLoansAccountDetailsService.getPaymentInfoData();
        vm.productCategory = homeLoansAccountDetailsService.getProductCategory();
        vm.accountRefId = homeLoansAccountDetailsService.getAccountRefId();
        vm.request = homeLoansAccountDetailsService.getPaymentsRequest();
        vm.paymentConfirmationMessage = homeLoansAccountDetailsService.getPaymentsSuccess();
        vm.onetimepayment = true;
        vm.accountNbr4 = null;
        /**
         * initializing the modal with the data thats needed for the display.
         */
        vm.initializeModal = function () {
          console.log(vm.request);
          vm.onetimepayment = vm.paymentConfirmationMessage.paymentType == 'onetime';
          var length = vm.paymentInfo.accountDetails.accountNumberTLNPI.length;
          vm.accountNbr4 = vm.paymentInfo.accountDetails.accountNumberTLNPI.substring(length - 4, length);
          if(vm.paymentConfirmationMessage.accountName != null){
            var bankNameLen = vm.paymentConfirmationMessage.accountName.length;
            if(bankNameLen > 14){
              vm.paymentConfirmationMessage.accountNameTrimmed =  vm.paymentConfirmationMessage.accountName.substring(0,14);
            } else {
              vm.paymentConfirmationMessage.accountNameTrimmed = vm.paymentConfirmationMessage.accountName;
            }
          }

        };
        /**
         * navigate back to the mapmodal to edit
         */
        vm.editPayment = function () {
          vm.close(false);
          homeLoansAccountDetailsService.paymentEditSetup();
        };
        /**
         * delete flow of the payments.
         */
        vm.cancel = function () {
          vm.close(false);
          homeLoansAccountDetailsService.paymentCancel();
        };
        vm.initializeModal();
      }]
    );
    HomeLoansModule.controller('PaymentsCancelConfirmController', ['homeLoansAccountDetailsService', 'UmmPaymentFactory', '$state', '$rootScope', '$scope', 'close',
      function (homeLoansAccountDetailsService, UmmPaymentFactory, $state, $rootScope, $scope, close) {
        var vm = $scope;
        vm.i18n = homeLoansAccountDetailsService.getI18n();
        var productCategory = homeLoansAccountDetailsService.getProductCategory();
        // has the data from the rest call to the payment accounts v6. getUmmPayments of the OL.
        vm.fromAccounts = UmmPaymentFactory.getUmmData();
        vm.paymentInfo = homeLoansAccountDetailsService.getPaymentInfoData();
        vm.productCategory = homeLoansAccountDetailsService.getProductCategory();
        vm.accountRefId = homeLoansAccountDetailsService.getAccountRefId();
        vm.request = homeLoansAccountDetailsService.getPaymentsRequest();
        vm.paymentConfirmationMessage = homeLoansAccountDetailsService.getPaymentsSuccess();
        vm.onetimepayment = true;
        vm.accountNbr4 = null;
        vm.paymentTypeText = null;
        vm.biweekly = false;
        vm.close = close;
        vm.fromTransactions = null;
        /**
         * initializing the modal with the data that's needed for the display.
         */
        vm.initializeModal = function () {
          if (vm.paymentConfirmationMessage.fromTransactions) {

          }
          vm.buttonText = vm.i18n.payment.confirm;
          vm.buttonDisabled = false;
          vm.onetimepayment = vm.paymentConfirmationMessage.paymentType == 'onetime';
          homeLoansAccountDetailsService.setIsBackButtonFlag(false);
          var length = vm.paymentInfo.accountDetails.accountNumberTLNPI.length;
          vm.accountNbr4 = vm.paymentInfo.accountDetails.accountNumberTLNPI.substring(length - 4, length);
          if(vm.paymentConfirmationMessage.totalPaymentReceivedAmount == null || vm.paymentConfirmationMessage.totalPaymentReceivedAmount == 0){
            vm.paymentConfirmationMessage.totalPaymentReceivedAmount = vm.paymentConfirmationMessage.paymentAmountSum;
          }
          if(vm.paymentConfirmationMessage.accountName != null){
            var bankNameLen = vm.paymentConfirmationMessage.accountName.length;
            if(bankNameLen > 14){
              vm.paymentConfirmationMessage.accountNameTrimmed =  vm.paymentConfirmationMessage.accountName.substring(0,14);
            } else {
              vm.paymentConfirmationMessage.accountNameTrimmed = vm.paymentConfirmationMessage.accountName;
            }
            var accntNbrLen = vm.paymentConfirmationMessage.fromAccountNumber.length;
            if(accntNbrLen > 4){
              vm.paymentConfirmationMessage.accountNbrTrimmed =  vm.paymentConfirmationMessage.fromAccountNumber.substring(accntNbrLen - 4, accntNbrLen);
            } else {
              vm.paymentConfirmationMessage.accountNbrTrimmed = vm.paymentConfirmationMessage.fromAccountNumber;
            }
          }
          if (!vm.onetimepayment) {
            vm.biweekly = (vm.paymentInfo.accountDetails.paymentFrequency != null && vm.paymentInfo.accountDetails.paymentFrequency == "BiWeekly");
            var loanType = (vm.biweekly) ? vm.i18n.payment.biweekly : vm.i18n.payment.monthly;
            vm.paymentTypeText = vm.i18n.payment.aboutToCancel + " " + vm.i18n.payment.automatic + " " + loanType
              + " " + vm.i18n.payment.paymentSeries;
            vm.paymentConfirmationMessage.sendOn = (vm.paymentConfirmationMessage.paymentDate == null)?vm.i18n.payment.myDueDate:null;
            vm.paymentConfirmationMessage.amountOption = (vm.paymentConfirmationMessage.additionalPrincipalAmount != null && vm.paymentConfirmationMessage.additionalPrincipalAmount > 0) ? vm.i18n.payment.monthlyAmnt + " + " + vm.i18n.payment.addPrincipal : vm.i18n.payment.monthlyAmnt;
          }
        };
        /**
         * navigate back to the mapmodal to edit
         */
        vm.back = function () {
          vm.close();
          homeLoansAccountDetailsService.setBackTransactionFlag(false);
      	  homeLoansAccountDetailsService.buttonAnalyticsTracking('go back:button');
      	  homeLoansAccountDetailsService.setIsBackButtonFlag(true);
          if (!vm.paymentConfirmationMessage.fromTransactions && !vm.paymentConfirmationMessage.reLaunchModal) {
            homeLoansAccountDetailsService.setBackTransactionFlag(true);
            homeLoansAccountDetailsService.paymentSetupSuccess();
          } else if(vm.paymentConfirmationMessage.reLaunchModal){
        	  if (vm.paymentConfirmationMessage.paymentType == 'recurring') {
        		  homeLoansAccountDetailsService.setBackTransactionFlag(true);
        	  }
            $state.go('HomeLoanPayment',
              {
                'lineOfBusiness'    : vm.productCategory,
                'accountReferenceId': vm.accountRefId,
                'payment'           : {isAccountDataAvailable: true, lineOfBusiness: vm.productCategory}
              });

          }
          $state.reload = false;
        };
        /**
         * delete flow of the payments.
         */
        vm.confirm = function () {
          $state.reload = true;
          vm.cancelInProgress = true;
          vm.buttonText = "";
          vm.buttonDisabled = true;
          homeLoansAccountDetailsService.setIsBackButtonFlag(false);
          homeLoansAccountDetailsService.deleteHomeLoansPayment(vm.accountRefId, vm.paymentConfirmationMessage.paymentDate,
            vm.productCategory, vm.paymentConfirmationMessage.isExternal, vm.paymentConfirmationMessage.transactionId, vm.paymentConfirmationMessage.paymentType, vm.sequenceNumber)
            .then(function (data) {
              //Successfully deleted payment.
              vm.cancelInProgress = false;
              vm.close();
              homeLoansAccountDetailsService.setInProgress(false);
              homeLoansAccountDetailsService.setCancelPaymentFlag(true);
              homeLoansAccountDetailsService.setIsBackButtonFlag(true);
              homeLoansAccountDetailsService.paymentCancelSuccess();
            }, function (data) {
              //Unsuccessful attempt to delete payment
              var toParams = '';
              vm.close($state.current.parent.name);
              homeLoansAccountDetailsService.setInProgress(false);
            });
        };
        vm.initializeModal();
      }]
    );
    HomeLoansModule.controller('PaymentsCancelSuccessController', ['homeLoansAccountDetailsService', 'UmmPaymentFactory', '$state', '$rootScope', '$scope', 'close',
      function (homeLoansAccountDetailsService, UmmPaymentFactory, $state, $rootScope, $scope, close) {
        var vm = $scope;
        vm.i18n = homeLoansAccountDetailsService.getI18n();
        var productCategory = homeLoansAccountDetailsService.getProductCategory();
        // has the data from the rest call to the payment accounts v6. getUmmPayments of the OL.
        vm.fromAccounts = UmmPaymentFactory.getUmmData();
        vm.paymentInfo = homeLoansAccountDetailsService.getPaymentInfoData();
        vm.productCategory = homeLoansAccountDetailsService.getProductCategory();
        vm.accountRefId = homeLoansAccountDetailsService.getAccountRefId();
        vm.request = homeLoansAccountDetailsService.getPaymentsRequest();
        vm.paymentConfirmationMessage = homeLoansAccountDetailsService.getPaymentsSuccess();
        vm.onetimepayment = true;
        vm.accountNbr4 = null;
        vm.paymentTypeText = null;
        vm.biweekly = false;
        vm.close = close;
        /**
         * initializing the modal with the data that's needed for the display.
         */
        vm.initializeModal = function () {
          console.log(vm.request);
          vm.onetimepayment = vm.paymentConfirmationMessage.paymentType == 'onetime';
          var length = vm.paymentInfo.accountDetails.accountNumberTLNPI.length;
          vm.accountNbr4 = vm.paymentInfo.accountDetails.accountNumberTLNPI.substring(length - 4, length);
          if (!vm.onetimepayment) {
            vm.biweekly = (vm.paymentInfo.accountDetails.paymentFrequency != null && vm.paymentInfo.accountDetails.paymentFrequency == "BiWeekly");
            vm.paymentTypeText = vm.i18n.payment.automatic + " " + (vm.biweekly) ? vm.i18n.payment.biweekly : vm.i18n.payment.monthly
            + " " + vm.i18n.payment.paymentSeries;
          }
        };
        vm.initializeModal();
      }]
    );
  });

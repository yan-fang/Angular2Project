define(['angular'], function(angular) { 
  'use strict';

  angular.module('BillPayModule')
    .controller('DeletePayeeController', DeletePayeeController);

  DeletePayeeController.$inject = [
    '$state',
    '$stateParams',
    'DeletePayeeService',
    '$filter',
    'BillPayPubSubFactory',
    '$timeout'
  ];

  function DeletePayeeController(
    $state, 
    $stateParams, 
    DeletePayeeService,
    $filter,
    BillPayPubSubFactory,
    $timeout
  ) {
 
    var vm = this;

    angular.extend(this, {
      modalClass: 'billPay-delete-payee-modal',
      accountSubCategory: $stateParams.subCategory,
      paymentList: DeletePayeeService.getPaymentList(),
      payeeDetail: DeletePayeeService.getPayeeToDelete(),
      info: [],
      pendingPayments: [],
      inProcessPayments: [],
      displayText: '',
      nameToDisplay: '',

      deletePayee: deletePayee,
      close: closeModal
    });

    //init controller
    logSitecatalystEvent('deletePayeeLanding');

    vm.nameToDisplay = getNameToDisplay();
    vm.info = createInfoList();
    vm.pendingPayments = createPendingPaymentList();
    vm.inProcessPayments = createInProcessPayments();
    vm.displayText = createDisplayText();
    
    function closeModal() {
      DeletePayeeService.resetDeleteData();
      logSitecatalystEvent('billPayCenter');
      $state.go('BillPay.PayeeList').finally(returnFocus($stateParams.returnFocusId));
    }

    function logSitecatalystEvent(viewName) {
      BillPayPubSubFactory.logTrackAnalyticsPageView(
        $stateParams.subCategory,
        viewName
      );
    }

    function deletePayee() {
      vm.isDeletePayeeProcessing = true;
      if (vm.payeeDetail.ebillAccountActivationStatus === 'EbillActive') {
        deletePayeeSuccess();
      } else {
        DeletePayeeService
          .deletePayeeRestCall()
          .then(deletePayeeSuccess);
      }
    }

    function deletePayeeSuccess() {
      $state.go($state.current.parent.split('.')[0] +'.ConfirmDeletePayee', {
        subCategory: vm.accountSubCategory
      });
    }

    function createInfoList() {
      var infoList = [];

      //if  display name exists
      if (vm.payeeDetail.payeeNickname) {
        infoList.unshift({
          label: 'Nickname',
          detail: vm.payeeDetail.payeeNickname
        });
      }

      // if account number exists
      if (vm.payeeDetail.accountNumber) {
        infoList.unshift({
          label: 'Account Number',
          detail: vm.payeeDetail.accountNumber
        });
      }

      // payee name
      infoList.unshift({
        label: 'Payee Name',
        detail: vm.payeeDetail.payeeName
      }); 

      return infoList;
    }

    function createPendingPaymentList() {
      var infoList = [];

      if (vm.paymentList.entries) {
        for (var i = vm.paymentList.entries.length - 1; i >= 0; i--) {
          var payment = vm.paymentList.entries[i];

          if (payment.paymentProcessingStatus === 'Pending') {
            infoList.unshift({
              label: $filter('date')(payment.transactionDetail.paymentDates.paymentDate, 'MMM dd, yyyy'),
              detail: $filter('currency')(payment.transactionDetail.paymentAmount)
            });
          }
        }
      }

      return infoList;
    }

    function createInProcessPayments() {
      var infoList = [];

      if (vm.paymentList.entries) {
        for (var i = vm.paymentList.entries.length - 1; i >= 0; i--) {
          var payment = vm.paymentList.entries[i];

          if (payment.paymentProcessingStatus === 'InProcess') {
            infoList.unshift({
              label: $filter('date')(payment.transactionDetail.paymentDates.paymentDate, 'MMM dd, yyyy'),
              detail: $filter('currency')(payment.transactionDetail.paymentAmount)
            });
          }
        }
      }
      
      return infoList;
    }

    function getNameToDisplay() {
      return vm.payeeDetail.payeeNickname? vm.payeeDetail.payeeNickname : vm.payeeDetail.payeeName;
    }

    function createDisplayText() {
      if (vm.pendingPayments.length === 0 && vm.inProcessPayments.length === 0) {
        return 'There are no pending payments for ' + vm.nameToDisplay + '.';
      } 

      if (vm.pendingPayments.length === 0 && vm.inProcessPayments.length > 0) {
        return 'Payments already being processed will be paid.';
      } 

      if (vm.pendingPayments.length > 0 && vm.inProcessPayments.length === 0) {
        return 'Pending payments will be canceled.';
      } 

      if (vm.pendingPayments.length > 0 && vm.inProcessPayments.length > 0) {
        return 'Payments already scheduled will be paid, but pending payments won\'t.';
      }   
    }

    function returnFocus(id) {
      if (!id) return;

      $timeout(function() {
        try {
          document
            .getElementById(id)
            .focus();
        /*eslint-disable */
        } catch (err) {
        }
        /*eslint-enable */
      }, 100);
    }

    /* test-code */
    vm.__testonly__ = {};
    vm.__testonly__.createInfoList = createInfoList;
    vm.__testonly__.createPendingPaymentList = createPendingPaymentList;
    vm.__testonly__.createInProcessPayments = createInProcessPayments;
    vm.__testonly__.createDisplayText = createDisplayText;
    vm.__testonly__.getNameToDisplay = getNameToDisplay;
    vm.__testonly__.deletePayeeSuccess = deletePayeeSuccess;
    vm.__testonly__.deletePayee = deletePayee;
    vm.__testonly__.returnFocus = returnFocus;
    /* end-test-code */
  }
});

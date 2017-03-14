define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .controller('ConfirmDeletePayeeController', ConfirmDeletePayeeController);

  ConfirmDeletePayeeController.$inject = [
    '$filter',
    '$state', 
    '$stateParams',
    'BillPayPubSubFactory',
    'DeletePayeeService'
  ];

  function ConfirmDeletePayeeController(
    $filter,
    $state, 
    $stateParams,
    BillPayPubSubFactory,
    DeletePayeeService
  ) {
      
    var vm = this;
    angular.extend(this, {
      modalClass: '',
      modalTitle: '',
      payeeDetail: DeletePayeeService.getPayeeToDelete(),
      accountSubCategory: $stateParams.subCategory,
      paymentList: DeletePayeeService.getPaymentList(),
      numberOfPendingPayments: 0,
      info: [],
      nameToDisplay: '',
      eBillStatus: DeletePayeeService.getPayeeToDelete().ebillAccountActivationStatus,

      close: closeModal
    });

    //init controller
    logSitecatalystEvent('deletePayeeConfirmation');

    if (vm.eBillStatus === 'EbillActive') {
      vm.modalClass = 'billPay-cannot-delete-payee-modal';
      vm.modalTitle = 'Caution';
    } else {
      vm.modalClass = 'billPay-confirm-delete-payee-modal';
      vm.modalTitle = 'Success';
      vm.info = createInfoList();
      vm.numberOfPendingPayments = getNumberOfPendingPaymentList();
    }

    vm.nameToDisplay = getNameToDisplay();

    function closeModal() {
      $state.go($state.current.parent);
    }

    function logSitecatalystEvent(viewName) {
      BillPayPubSubFactory.logTrackAnalyticsPageView(
        $stateParams.subCategory,
        viewName
      );
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

    function getNumberOfPendingPaymentList() {
      var list = $filter('filter')(vm.paymentList.entries, {paymentProcessingStatus:'Pending'});
      return list? list.length : 0;
    }

    function getNameToDisplay() {
      return vm.payeeDetail.payeeNickname? vm.payeeDetail.payeeNickname : vm.payeeDetail.payeeName;
    }

    /* test-code */
    vm.__testonly__ = {};
    vm.__testonly__.createInfoList = createInfoList;
    vm.__testonly__.getNumberOfPendingPaymentList = getNumberOfPendingPaymentList;
    vm.__testonly__.getNameToDisplay = getNameToDisplay;
    /* end-test-code */ 
  }
});

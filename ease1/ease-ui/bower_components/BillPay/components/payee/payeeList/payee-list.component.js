define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('payeeList', function() {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: '/ease-ui/bower_components/BillPay/@@version/' +
                   'components/payee/payeeList/payee-list.component.html',
      controller: PayeeListController,
      controllerAs: '$ctrl',
      bindToController: true
    };
  });

  PayeeListController.$inject = [
    '$state',
    '$location',
    'PayeeListService',
    'PayeeDetailService',
    'BillPayPubSubFactory',
    'StringUtils',
    'DeletePayeeService'
  ];

  function PayeeListController(
    $state,
    $location,
    PayeeListService,
    PayeeDetailService,
    BillPayPubSubFactory,
    StringUtils,
    DeletePayeeService
  ) {
    var vm = this;

    angular.extend(this, {
      makePaymentLoading: false,
      deletePayeeLoading: false,
      recurringPaymentLoading: false,
      editLoading: false,
      payeeList: PayeeListService.getPayeeList(),
      accountSubCategory: $location.search().subCategory,
      showSettingsMenu: false,

      checkLastPaymentInfo: PayeeDetailService.checkPayeeLastPaymentInfo,
      checkLatestScheduledTrx: PayeeDetailService.checkPayeeLatestScheduledTrx,
      getPayeeDisplayName: getPayeeDisplayName,
      makePayment: makePayment,
      recurringPayment: recurringPayment,
      deletePayee: deletePayee,
      editPayee: editPayee,
      evaluateShouldClose: evaluateShouldClose,
      openOnlyAD: openOnlyAD
    });

    function getPayeeDisplayName(payee) {
      if (!StringUtils.isEmpty(payee.payeeNickname)) return payee.payeeNickname;
      if (!StringUtils.isEmpty(payee.payeeName)) return payee.payeeName;
      return '';
    }

    function makePayment(payee, id) {
      if (vm.makePaymentLoading) {
        return;
      }

      vm.makePaymentLoading = true;

      BillPayPubSubFactory.logTrackAnalyticsPageView(
        vm.accountSubCategory,
        'oneTimePaymentLanding'
      );
      PayeeDetailService.setPayeeDetail(payee);
      $state.go(
        'BillPay.MakePayment',
        {
          returnFocusId: 'BillPay-makePayment-Button-' + id
        }
      ).finally(function() {
        vm.makePaymentLoading = false;
      });
    }

    function recurringPayment(payee, buttonIndex) {
      if (vm.recurringPaymentLoading) {
        return;
      }

      vm.recurringPaymentLoading = true;

      PayeeDetailService.setPayeeDetail(payee);
      $state.go('BillPay.RecurringPayment', {
        returnFocusId: 'billpay-recurring-payment-Button-' + buttonIndex
      }).finally(function() {
        vm.recurringPaymentLoading = false;
      });
    }

    function deletePayee(payee, id) {
      if (vm.deletePayeeLoading) {
        return;
      }

      vm.deletePayeeLoading = true;

      DeletePayeeService.setPayeeToDelete(payee);
      $state.go('BillPay.DeletePayee', {
        returnFocusId: 'BillPay-deletePayee-Button-' + id
      }).finally(function() {
        vm.deletePayeeLoading = false;
      });
    }

    /**
     * Triggers the edit payee flow for a given payee.
     *
     * @param {object} payee - The payee to edit
     */
    function editPayee(payee, buttonIndex) {
      if (vm.editLoading) {
        return;
      }

      vm.editLoading = true;

      PayeeDetailService.initializePayeeDetail(
        payee.payeeReferenceId,
        $state.params.accountReferenceId
      ).then(function() {
        $state.go('BillPay.editPayee', {
          returnFocusId: 'billpay-button-edit-payee-' + buttonIndex
        }).finally(function() {
          vm.editLoading = false;
        });
      })
      .catch(function() {
        vm.editLoading = false;
      });
    }


    /**
     * This method will take an angular $event sent from ng-click on the payee list accordion
     * and determine if the accordion should in fact close. This is necessary as using the keyboard to
     * activate buttons within the accordion drawers was causing the drawer to close. This will
     * prevent hat circumstance from happening
     *
     * @param {event} ev - Angular $event sent from the ng-click in the payee list accordion
     * @returns {bool} - True to close the drawer, false to leave it open
     */
    function evaluateShouldClose(ev) {
      return !(ev.type === 'keypress'
        && ev.target.nodeName === 'BUTTON'
        && !ev.target.classList.contains('payee-nickname'));
    }

    /**
     * Only return true if the event is triggered by a keypress
     */
    function openOnlyAD(ev) {
      return ev.which === 13;
    }
  }
});

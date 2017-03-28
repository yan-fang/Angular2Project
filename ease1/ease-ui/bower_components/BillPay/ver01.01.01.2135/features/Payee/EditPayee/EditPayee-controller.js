define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .controller('EditPayeeController', EditPayeeController);

  EditPayeeController.$inject = [
    '$state',
    'PayeeDetailService',
    'PayeeService',
    'BillPayErrorHandlerService',
    '$location',
    'BillPayPubSubFactory',
    'USAStateListService',
    '$stateParams',
    '$timeout',
    '$rootScope'
  ];

  function EditPayeeController(
    $state,
    PayeeDetailService,
    PayeeService,
    BillPayErrorHandlerService,
    $location,
    BillPayPubSubFactory,
    USAStateListService,
    $stateParams,
    $timeout,
    $rootScope) {
    var vm = this;

    angular.extend(this, {
      modalClass: ['edit-payee-flow', 'modal-edit'],
      modalTitle: 'Edit Payee',
      payeeServiceInstance: PayeeService,
      currentStep: (PayeeDetailService.getPayeeDetailFormatted().payeeAddress === null ? 'accountInfo' : 'contactInfo'),
      payeeDetail: PayeeDetailService.getPayeeDetailFormatted(),
      loading: '',
      pendingPayments: PayeeDetailService.getPayeeDetailFormatted().scheduledPayments,
      flowType: (PayeeDetailService.getPayeeDetailFormatted().payeeAddress === null ? 'editRegistered' : 'editManual'),
      stateList: USAStateListService.states,
      fixableErrors: [],

      close: close,
      proceed: proceed
    });

    /**
     * Returns the user to the Bill Pay hub when this modal is closed
     */
    function close() {
      logSitecatalystEvent('billPayCenter');
      $state.go('BillPay.PayeeList').finally(function() {
        $rootScope.$broadcast('editPayeeSuccess', {
          sourceElement: $stateParams.returnFocusId
        });
      });
    }

    // site catalyst
    trackEvent(vm.flowType, vm.currentStep)

    function trackEvent(flowType, currentStep) {
      if (currentStep === 'success') {
        if (flowType === 'editRegistered') {
          logSitecatalystEvent('editManagedPayeeConfirmation');
        }

        if (flowType === 'editManual') {
          logSitecatalystEvent('editManualPayeeConfirmation');
        }
      } else {
        if (flowType === 'editRegistered') {
          logSitecatalystEvent('editManagedPayeeLanding');
        }

        if (flowType === 'editManual') {
          logSitecatalystEvent('editManualPayeeLanding');
        }
      }
    }

    function logSitecatalystEvent(viewName) {
      BillPayPubSubFactory.logTrackAnalyticsPageView(
        $stateParams.subCategory,
        viewName
      );
    }

    function proceed() {
      if (vm.loading === 'loading') {
        return;
      }

      vm.loading = 'loading';
      PayeeService.setPayee(vm.payeeDetail);

      PayeeService.updatePayee().then(function success() {
        vm.loading = '';
        vm.currentStep = 'success'
        vm.modalClass = ['edit-payee-flow', 'modal-success'];
        vm.modalTitle = 'Success';
        trackEvent(vm.flowType, vm.currentStep);
      }, function error(err) {
        if (err.recoverable) {
          vm.fixableErrors = PayeeService.getErrorFields(vm.flowType);
          vm.loading = '';

          if (!vm.fixableErrors.length) {
            BillPayErrorHandlerService.handleError(err);
          }
        } else {
          BillPayErrorHandlerService.handleError(err);
        }
      });
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

  }
});

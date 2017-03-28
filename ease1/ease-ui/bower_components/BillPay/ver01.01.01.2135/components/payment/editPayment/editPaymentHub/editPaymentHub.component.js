define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('editPaymentHub', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/payment/editPayment/editPaymentHub/editPaymentHub.component.html',
      controller: controller,
      scope: {
        id: '@'
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  controller.$inject = [
    '$state', 
    '$stateParams', 
    '$timeout', 
    'OneTimePaymentDSService', 
    'RecurringPaymentDSService',
    'BillPayErrorHandlerService',
    'BillPayPubSubFactory'
  ];

  function controller(
    $state, 
    $stateParams,
    $timeout,
    OneTimePaymentDSService,
    RecurringPaymentDSService,
    BillPayErrorHandlerService,
    BillPayPubSubFactory
  ) {
    var vm = this;
    var paymentDetail = OneTimePaymentDSService.getPaymentDetail();
    var recurringPaymentDetail = RecurringPaymentDSService.getPaymentDetail();

    angular.extend(this, {
      isSubmitted: false,
      recurringOption: undefined,

      getPageTitle: getPageTitle,
      getPage: getPage,
      close: closeModal,
    });

    function getPageTitle() {
      switch(getPage()) {
        case 'edit-recurring-hub': return 'Edit Recurring Payment';
        case 'edit-one-time-action': return 'Edit a Payment';
        case 'edit-one-time-confirmation': return 'Success';
        case 'edit-recurring-action': return 'Recurring Payment';
        case 'edit-recurring-confirmation': return 'Success';
      } 
    }

    /**
     * get page for edit payment modal
     * 
     * edit-one-time-action: edit one time payment action page
     * edit-one-time-confirmation: edit one time payment confirmation page
     * 
     * edit-recurring-hub: edit recurring payment hub
     * edit-recurring-action: edit recurring payment action page
     * edit-recurring-confirmation: edit recurring payment confirmation page
     */
    function getPage() {
      if (recurringPaymentDetail && recurringPaymentDetail.paymentPlanReferenceId) {
        // 1. go hub flow
        if (vm.recurringOption == 'ONE_TIME') {          
          // 1.1  user select one time
          return vm.isSubmitted ? 'edit-one-time-confirmation' : 'edit-one-time-action';
        } if (vm.recurringOption == 'RECURRING') {
          // 1.2 user select recurring
          return vm.isSubmitted ? 'edit-recurring-confirmation' : 'edit-recurring-action';
        } else {
          // 1.3 user doesn't have option
          return 'edit-recurring-hub';
        }
      } else {
        // 2. only one time
        return vm.isSubmitted ? 'edit-one-time-confirmation' : 'edit-one-time-action';
      }
    }

    function closeModal() {
      $state.go($state.current.parent, {}, {
        reload: vm.isSubmitted
      }).finally(function() {
        returnFocus($stateParams.upcomingFocusId);
        
        BillPayPubSubFactory.logTrackAnalyticsPageView(
          $stateParams.subCategory, 
          'bankAccountDetail'
        );
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

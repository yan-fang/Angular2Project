define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('makePaymentHub', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/payment/makePayment/makePaymentHub/makePaymentHub.component.html',
      controller: controller,
      scope: {
        id: '@',
        mode: '@'
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  controller.$inject = [
    '$state', 
    '$stateParams', 
    '$timeout',
    'BillPayPubSubFactory'
  ];

  function controller(
    $state, 
    $stateParams,
    $timeout,
    BillPayPubSubFactory
  ) {
    var vm = this;

    // Bindable properties
    angular.extend(this, {
      isOneTimeFromRecurring: false,
      isSubmitted: false,

      getPageTitle: getPageTitle,
      getPage: getPage,
      switchPaymentModeFn: switchPaymentModeFn,
      close: closeModal,
    });

    function getPageTitle() {
      switch(getPage()) {
        case 'one-time-action': return 'Make a Payment';
        case 'one-time-confirmation': return 'Success';
        case 'recurring-action': return 'Recurring Payment';
        case 'recurring-confirmation': return 'Success';
        default: return 'ERRRRROR...'
      } 
    }

    /**
     * get page for make payment modal
     * 
     * one-time-action: make one time payment action page
     * one-time-confirmation: make one time payment confirmation page
     * 
     * recurring-action: make recurring payment action page
     * recurring-confirmation: make recurring payment confirmation page
     */
    function getPage() {
      if (vm.mode === 'ONE_TIME') {
        return vm.isSubmitted ? 'one-time-confirmation' : 'one-time-action';
      }
      if (vm.mode === 'RECURRING') {
        return vm.isSubmitted ? 'recurring-confirmation' : 'recurring-action';
      }
    }

    function switchPaymentModeFn() {
      vm.mode = 'ONE_TIME';
      vm.isOneTimeFromRecurring = true;
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

define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .controller('AddPayeeAcctNumberAskController', AddPayeeAcctNumberAskController);

  AddPayeeAcctNumberAskController.$inject = [
    '$state',
    '$location',
    'BillPayPubSubFactory'
  ];

  function AddPayeeAcctNumberAskController($state, $location, BillPayPubSubFactory) {
    angular.extend(this, {
      goToNextStep: goToNextStep,
      validChoiceMade: validChoiceMade
    });

    BillPayPubSubFactory.logTrackAnalyticsPageView(
      $location.search().subCategory,
      'manualAddPayeeAccountNumberRequired'
    );

    function goToNextStep() {
      $state.go('BillPay.addPayee.accountInfo');
    }

    /**
     * This method exists because using the required attribute on the radio buttons is not allowed for that role.
     * This method is used with ng-disabled in the continue button so that we know if a proper selection
     * has been made yet or not.
     *
     * @param {bool} val - ngModel value
     * @returns {bool} - Whether the given val is a boolean (i.e. a valid radio button choice / value)
     */
    function validChoiceMade(val) {
      return typeof val === 'boolean';
    }
  }
});

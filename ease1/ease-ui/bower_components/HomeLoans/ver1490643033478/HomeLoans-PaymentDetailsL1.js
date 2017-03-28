define(['angular'], function(angular) {

  'use strict';

  var paymentDetailsL1Module = angular.module('paymentDetailsL1Module', ['EaseProperties', 'easeAppUtils', 'restangular']);

  paymentDetailsL1Module.controller('PaymentDetailsL1Controller',
    function($scope, $controller, accountDetailsData, EaseConstant, $state) {

      var vm = this;

      angular.extend(vm, {
        focusClass:'loanDetailsLink',
        initClose: false,
        modalType: 'paymentModal',
        modalClass: 'hl-payment-details-icon',
        close: function(){
          //Go to previous state (The account details page)
          $state.go('^');
        },
        dateFormat: 'MMMM dd, yyyy',
        accountDetails: accountDetailsData.accountDetails
      });


      console.log("paymentDetailsL1Module initialize");
    });

  return paymentDetailsL1Module;
});


define(['angular',
    'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/pastDuePayment/pastDuePayment-controller.js?',
    'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/pastDuePayment/past-due-disclaimer.controller.js?'],

  function(angular, pastDueControllers, pastDueDisclaimerControllers) {
    'use strict';

    return angular.module('PastDueModule', [])
      .controller('PastDuePaymentController', pastDueControllers.PastDuePaymentController)
      .controller('PastDueDisclaimerController', pastDueDisclaimerControllers.PastDueDisclaimerController)
  });
define([
  'angular'
], function(angular) {
  'use strict';
  angular.module(
    'DebitModule', [
      'ui.router',
      'restangular',
      'oc.lazyLoad',
      'EaseProperties',
      'easeAppUtils',
      'EaseExceptionsModule',
      'ngAnimate'
    ]
  )
  .config(function($stateProvider) {
    var basePath = './ease-ui/bower_components/Debit/@@version';
    var dependenciesPaths = [
      basePath + '/styles/debitCard.css',
      basePath + '/Debit-constants.js',
      basePath + '/Debit-controller.js',
      basePath + '/Debit-services.js',
      basePath + '/Debit-directives.js',
      basePath + '/Debit-filters.js'
    ];

    // -------------- Register all states in the Debit module ------------------
    $stateProvider
      .state('BankDetails.transactions.debitActivation', {
        url: '/Activate',
        parent: 'BankDetails.transactions',
        resolve: {
          debitDependencies: function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'DebitModule',
              files: dependenciesPaths
            });
          }
        },
        template: '<debit-activation data-return-state="BankDetails.transactions"></debit-activation>'
      })
      .state('BankDetails.transactions.debitLock', {
        url: '/LockCard',
        parent: 'BankDetails.transactions',
        resolve: {
          debitDependencies: function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'DebitModule',
              files: dependenciesPaths
            });
          }
        },
        template: '<debit-lock data-return-state="BankDetails.transactions"></debit-lock>'
      })
      .state('BankDetails.transactions.debitUnlock', {
        url: '/UnlockCard',
        parent: 'BankDetails.transactions',
        resolve: {
          debitDependencies: function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'DebitModule',
              files: dependenciesPaths
            });
          }
        },
        template: '<debit-unlock data-return-state="BankDetails.transactions"></debit-unlock>'
      })
      .state('BankDetails.transactions.debitChangePin', {
        url: '/ChangePin',
        parent: 'BankDetails.transactions',
        resolve: {
          debitDependencies: function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'DebitModule',
              files: [
                basePath + '/styles/debitCard.css',
                basePath + '/Debit-constants.js',
                basePath + '/Debit-controller.js',
                basePath + '/Debit-services.js',
                basePath + '/Debit-directives.js',
                basePath + '/components/otp/otp-directive.js',
                basePath + '/components/otp/otp-controller.js',
                basePath + '/components/otp/otp-services.js',
                basePath + '/components/otp/otp-tracking.js'
              ]
            });
          }
        },
        template: '<debit-change-pin data-return-state="BankDetails.transactions"></debit-change-pin>'
      })
      .state('BankDetails.transactions.debitOrder', {
        url: '/OrderCard',
        parent: 'BankDetails.transactions',
        resolve: {
          debitDependencies: function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'DebitModule',
              files: [
                basePath + '/styles/debitCard.css',
                basePath + '/Debit-constants.js',
                basePath + '/Debit-services.js',
                basePath + '/features/order/order-controller.js',
                basePath + '/features/order/order-services.js',
                basePath + '/features/order/order-directive.js',
                basePath + '/features/order/order-tracking.js',
                basePath + '/components/otp/otp-directive.js',
                basePath + '/components/otp/otp-controller.js',
                basePath + '/components/otp/otp-services.js',
                basePath + '/components/otp/otp-tracking.js'
              ]
            });
          }
        },
        template: '<debit-order data-return-state="BankDetails.transactions"></debit-order>'
      });
  });
});

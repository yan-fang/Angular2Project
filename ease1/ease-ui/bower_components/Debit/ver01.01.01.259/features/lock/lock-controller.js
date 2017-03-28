define([
  'angular'
], function(angular) {
  'use strict';

  angular.module('DebitModule')
         .controller('DebitLockController', DebitLockController);

  DebitLockController.$inject = [
    '$q',
    '$rootScope',
    '$scope',
    '$state',
    '$window',
    '$stateParams',
    'EaseConstant',
    'debitConstants',
    'DebitLocalization',
    'DebitTemplatePathProvider',
    'DebitLockServices',
    'DebitLockTracking',
    'easeHttpInterceptor'
  ];

  function DebitLockController(
    $q,
    $rootScope,
    $scope,
    $state,
    $window,
    $stateParams,
    EaseConstant,
    debitConstants,
    DebitLocalization,
    TemplateProvider,
    DebitLockServices,
    DebitLockTracking,
    easeHttpInterceptor) {
    var vm = this;

    var STATES = {
      LOADING: 'LOADING',
      EMPTY: 'EMPTY',
      LIST: 'LIST',
      LOCK: 'LOCK',
      SUCCESS: 'SUCCESS'
    };

    vm.templatePaths = {
      LOADING: debitConstants.BASE_URL + '/components/partials/_loading.html',
      LIST: TemplateProvider.getFeatureTemplateUrl('lock', '_list'),
      EMPTY: TemplateProvider.getFeatureTemplateUrl('lock', '_empty'),
      LOCK: TemplateProvider.getFeatureTemplateUrl('lock', '_lock'),
      SUCCESS: TemplateProvider.getFeatureTemplateUrl('lock', '_success')
    };

    vm.lastTransaction = null;
    vm.cards = [];
    vm.selectedCard = null;
    vm.currentState = STATES.LOADING;

    vm.errors = {};
    vm.submitDisabled = false;

    var handleError = function(error) {
      vm.submitDisabled = false;

      if (error.cause.status === 500) {
        vm.close();
        return $rootScope.$broadcast('error', EaseConstant.defaultErrorMessage);
      } else {
        vm.errors[vm.currentState] = error.cause.data.error;
      }

    };

    var TRANSACTION_STRING_KEYS = {
      '2'  : 'pintransaction',
      '3'  : 'cashwithdrawal',
      '4'  : 'signtransaction',
      '31' : 'checkdeposit',
      '32' : 'cashdeposit'
    };

    vm.selectCard = function(card) {
      DebitLockServices.getLastTransactions(card.accountReferenceId)
        .then(function(results) {
          if (results.data.entries.length) {
            vm.lastTransaction = results.data.entries[0];
            if (!vm.lastTransaction.merchant) {
              vm.lastTransaction.merchant = {
                name : vm.lastTransaction.transactionDescriptionDetail.transactionDescriptionTitle
              }
            }
            var transactionStringKey = TRANSACTION_STRING_KEYS[vm.lastTransaction.transactionType];
            vm.lastTransaction.atmTransaction = transactionStringKey.indexOf('transaction') > -1 ? false : true;
            if (vm.lastTransaction.atmTransaction) {
              vm.lastTransaction.atmTransactionString = vm.i18n.lockScreen.lastTransaction[transactionStringKey];
            }
          } else {
            vm.lastTransaction = false;
          }
          vm.selectedCard = card;
          DebitLockTracking.lockPage();
          vm.currentState = STATES.LOCK;
        }).catch(handleError);
    }

    vm.lockCard = function() {
      vm.submitDisabled = true;
      easeHttpInterceptor.setBroadCastEventOnce('nope');
      DebitLockServices.lockCard({
        accountReferenceId: vm.selectedCard.accountReferenceId,
        cardReferenceId: vm.selectedCard.cardReferenceId
      }).then(function() {
        vm.errors[vm.currentState] = null;
        vm.submitDisabled = false;
        DebitLockTracking.lockConfirmationPage();
        vm.currentState = STATES.SUCCESS;
        $scope.$emit('debitCardChange', 'lock');
      }).catch(handleError);
    };

    vm.close = function() {
      $window.document.getElementById('moreServicesLink').focus();
      $scope.$emit('debitModalClosed');
      $state.go(vm.returnState, {}, {location: 'replace'});
      DebitLockTracking.accountDetailsPage();
    };

    vm.initializeLockCard = function() {
      return $q.all({
        i18n: DebitLocalization.get(),
        cards: DebitLockServices.getActivatedCards($stateParams.accountReferenceId)
      }).then(function(results) {
        vm.i18n = results.i18n.data.debit.lock;
        vm.cards = results.cards;

        switch (results.cards.length) {
          case 0:
            vm.currentState = STATES.EMPTY;
            break;
          case 1:
            vm.selectCard(results.cards[0]);
            break;
          default:
            vm.currentState = STATES.LIST;
        }
      }).catch(handleError);
    };

    vm.initializeLockCard();

  }
});

/*global _ */
define([
  'angular'
], function(angular) {
  'use strict';

  angular
    .module('DebitModule')
    .controller('DebitLockController',
    [ '$q',
      '$rootScope',
      '$scope',
      '$state',
      '$stateParams',
      '$DebitApi',
      'DebitLockUnlockTracking',
      'EaseConstant',
      'DebitLocalization',
      'DebitTemplatePathProvider',
      'easeHttpInterceptor',

      function(
        $q,
        $rootScope,
        $scope,
        $state,
        $stateParams,
        $DebitApi,
        DebitLockUnlockTracking,
        EaseConstant,
        DebitLocalization,
        DebitTemplatePathProvider,
        easeHttpInterceptor) {

        var vm = this;

        var STATES = {
          LOADING: 'LOADING',
          EMPTY: 'EMPTY',
          CARD_LIST: 'CARD_LIST',
          LOCK_CARD: 'LOCK_CARD',
          SUCCESS: 'SUCCESS'
        };

        // Heads UP: ES6 way would be
        // http://es6-features.org/#ComputedPropertyNames
        var BASE_TEMPLATE_URL = DebitTemplatePathProvider.getBaseTemplateUrl('debitLock');
        var TEMPLATES = {
          LOADING: BASE_TEMPLATE_URL + 'loading.html',
          EMPTY: BASE_TEMPLATE_URL + 'empty.html',
          CARD_LIST: BASE_TEMPLATE_URL + 'card_list.html',
          LOCK_CARD: BASE_TEMPLATE_URL + 'lock_card.html',
          SUCCESS: BASE_TEMPLATE_URL + 'success.html'
        };

        var TRANSACTION_STRING_KEYS = {
          '2'  : 'pintransaction',
          '3'  : 'cashwithdrawal',
          '4'  : 'signtransaction',
          '31' : 'checkdeposit',
          '32' : 'cashdeposit'
        };

        function handleError(error) {
          vm.submitDisabled = false;

          if (error.cause.status === 500) {
            vm.close();
            return $rootScope.$broadcast('error', EaseConstant.defaultErrorMessage);
          } else if ( /^4\d{2}/.test(error.cause.status) ) {
            vm.errors[vm.currentState] = error.cause.data.error;
          }
        }

        vm.reset = function() {
          vm.lastTransaction = null;
          vm.cards = [];
          vm.selectedCard = null;
          vm.currentState = STATES.LOADING;

          vm.errors = {};
          vm.submitDisabled = false;
          return vm;
        };

        vm.init = function() {
          vm.reset();

          return $q.all({
            i18n: DebitLocalization.get(),
            cards: $DebitApi.getAllCards($stateParams.accountReferenceId, 'LOCK_CARD')
          }).then(function(results) {
            angular.extend(vm, {
              i18n: results.i18n.data.debit.lock,
              cards: _.get(results.cards.data.groupedEntries, 'lock', [])
            });

            vm.initializeState();

          }).catch(handleError);
        };

        vm.initializeState = function() {
          switch (vm.cards.length) {
            case 0:
              vm.changeState(STATES.EMPTY);
              break;
            case 1:
              vm.selectCard(vm.cards[0]);
              break;
            default:
              vm.changeState(STATES.CARD_LIST);
              break;
          }
        };

        vm.selectCard = function(card) {
          easeHttpInterceptor.setBroadCastEventOnce('nope');

          $DebitApi.getLastTransactions(card.accountReferenceId)
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
              DebitLockUnlockTracking.lockPage();
              vm.changeState(STATES.LOCK_CARD);
            }).catch(handleError);
        };

        vm.lockCard = function() {
          vm.submitDisabled = true;
          easeHttpInterceptor.setBroadCastEventOnce('nope');

          $DebitApi.lockCard({
            accountReferenceId: vm.selectedCard.accountReferenceId,
            cardReferenceId: vm.selectedCard.cardReferenceId
          }).then(function() {
            vm.errors[vm.currentState] = null;
            //remove the card from the card list
            vm.cards.splice( vm.cards.indexOf(vm.selectedCard), 1 );
            vm.submitDisabled = false;
            DebitLockUnlockTracking.lockConfirmationPage();
            vm.changeState(STATES.SUCCESS);
            $scope.$emit('debitCardChange', 'lock');
          }).catch(handleError);
        }

        vm.changeState = function(state) {
          vm.currentState = _.get(STATES, state, STATES.CARD_LIST);
        };

        vm.close = function() {
          $scope.$emit('debitModalClosed');
          $state.go(vm.returnState, {}, {location: 'replace'});
        };

        vm.init();
        angular.extend(vm, {STATES: STATES, TEMPLATES: TEMPLATES});
      }])
    .directive('debitLock', ['DebitTemplatePathProvider', function(DebitTemplatePathProvider) {
      return {
        bindToController: true,
        scope: {
          returnState: '@'
        },
        controller: 'DebitLockController as debitLock',
        templateUrl: DebitTemplatePathProvider.getTemplateUrl('Debit-lock')
      };
    }]);

});

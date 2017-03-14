/*global _ */
define([
  'angular'
], function(angular) {
  'use strict';

  angular.module('DebitModule')
    .controller('DebitUnlockController',
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
          UNLOCK_CARD: 'UNLOCK_CARD',
          SUCCESS: 'SUCCESS'
        };

        // Heads UP: ES6 way would be
        // http://es6-features.org/#ComputedPropertyNames
        var BASE_TEMPLATE_URL = DebitTemplatePathProvider.getBaseTemplateUrl('debitUnlock');
        var TEMPLATES = {
          LOADING: BASE_TEMPLATE_URL + 'loading.html',
          EMPTY: BASE_TEMPLATE_URL + 'empty.html',
          CARD_LIST: BASE_TEMPLATE_URL + 'card_list.html',
          UNLOCK_CARD: BASE_TEMPLATE_URL + 'unlock_card.html',
          SUCCESS: BASE_TEMPLATE_URL + 'success.html'
        };

        var apiErrorHandler = {
          // invalid expiration date
          '200057': function() {
            vm.showValidationForm = true;
            vm.models.expiration.month = null;
            vm.models.expiration.year = null;
          }
        };

        function handleError(error) {
          vm.submitDisabled = false;

          if (error.cause.status === 500) {
            vm.close();
            return $rootScope.$broadcast('error', EaseConstant.defaultErrorMessage);
          } else {
            if (apiErrorHandler[error.cause.data.id]) {
              apiErrorHandler[error.cause.data.id]();
            } else if ( /^4\d{2}/.test(error.cause.status) ) {
              vm.errors[vm.currentState] = error.cause.data.error;
            }
          }
        }

        vm.reset = function() {
          vm.cards = [];
          vm.showValidationForm = false;
          vm.models = {
            expiration: {
              month : null,
              year : null
            }
          };
          vm.expirationDate = null;

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
            cards: $DebitApi.getAllCards($stateParams.accountReferenceId, 'UNLOCK_CARD')
          }).then(function(results) {
            angular.extend(vm, {
              i18n: results.i18n.data.debit.unlock,
              cards: _.get(results.cards.data.groupedEntries, 'unlock', [])
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
          vm.selectedCard = card;
          DebitLockUnlockTracking.unlockPage();
          vm.changeState(STATES.UNLOCK_CARD);
        };

        vm.unlockCard = function() {
          vm.submitDisabled = true;
          vm.expirationDate = (vm.models.expiration.month && vm.models.expiration.year) ?
                                  vm.models.expiration.month + '/' + vm.models.expiration.year :
                                  null;
          easeHttpInterceptor.setBroadCastEventOnce('nope');

          $DebitApi.unlockCard({
            accountReferenceId: vm.selectedCard.accountReferenceId,
            cardReferenceId: vm.selectedCard.cardReferenceId,
            expirationDate: vm.expirationDate
          }).then(function() {
            vm.errors[vm.currentState] = null;
            //remove the card from the card list
            vm.cards.splice( vm.cards.indexOf(vm.selectedCard), 1 );
            vm.submitDisabled = false;
            DebitLockUnlockTracking.unlockConfirmationPage();
            vm.changeState(STATES.SUCCESS);
            // emit an event that unlock was successful.
            // this allows bank to update more Services modal options.
            $scope.$emit('debitCardChange', 'unlock');
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
    .directive('debitUnlock', ['DebitTemplatePathProvider', function(DebitTemplatePathProvider) {
      return {
        bindToController: true,
        scope: {
          returnState: '@'
        },
        controller: 'DebitUnlockController as debitUnlock',
        templateUrl: DebitTemplatePathProvider.getTemplateUrl('Debit-unlock')
      };
    }]);

});

/*global _ */
define([
  'angular'
], function(angular) {
  'use strict';

  angular.module('DebitModule')
    .controller('DebitChangePinController',
    [ '$q',
      '$rootScope',
      '$scope',
      '$state',
      '$stateParams',
      '$DebitApi',
      'DebitChangePinTracking',
      'EaseConstant',
      'debitConstants',
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
        DebitChangePinTracking,
        EaseConstant,
        debitConstants,
        DebitLocalization,
        DebitTemplatePathProvider,
        easeHttpInterceptor) {

        var vm = this;
        var STATES = {
          LOADING: 'LOADING',
          EMPTY: 'EMPTY',
          CARD_LIST: 'CARD_LIST',
          SET_PIN: 'SET_PIN',
          SUCCESS: 'SUCCESS'
        };

        // Heads UP: ES6 way would be
        // http://es6-features.org/#ComputedPropertyNames
        var BASE_TEMPLATE_URL = DebitTemplatePathProvider.getBaseTemplateUrl('debitChangePin');
        var TEMPLATES = {
          LOADING: debitConstants.BASE_URL + '/components/partials/_loading.html',
          EMPTY: BASE_TEMPLATE_URL + 'empty.html',
          CARD_LIST: BASE_TEMPLATE_URL + 'card_list.html',
          SET_PIN: BASE_TEMPLATE_URL + 'set_pin.html',
          SUCCESS: BASE_TEMPLATE_URL + 'success.html'
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

        function initializeTooltip(triggerMessage) {
          vm.tooltipOptions = {
            position: 'top-right',
            size: 'medium',
            triggerMessage: triggerMessage,
            attrs: [
              {key: 'id', value: 'pin-instructions-tooltip-trigger'}
            ]
          };
        }

        vm.reset = function() {
          vm.cards = [];
          vm.STATES = STATES;
          vm.TEMPLATES = TEMPLATES;
          vm.currentState = '';
          vm.models = {
            pin: {
              entry: '',
              confirm: ''
            }
          };

          vm.errors = {};
          vm.submitDisabled = false;

          return vm;
        };

        var initializeState = function() {
          switch (vm.cards.length) {
            case 0:
              vm.currentState = STATES.EMPTY;
              break;
            case 1:
              vm.selectCard(vm.cards[0]);
              break;
            default:
              vm.currentState = STATES.CARD_LIST;
              break;
          }
        };

        vm.init = function() {
          vm.reset();
          vm.currentState = STATES.LOADING;
          return $q.all({
            i18n: DebitLocalization.get(),
            cards: $DebitApi.getAllCards($stateParams.accountReferenceId, 'CHANGE_PIN')
          }).then(function(results) {
            vm.i18n = results.i18n.data.debit.changepin;
            vm.cards = _.get(results.cards.data.groupedEntries, 'changePin', []);
            initializeState();
            initializeTooltip(vm.i18n.pin.learnMore);
          }).catch(handleError);
        };

        /**
         * On selecting a card, perform an authentication check
         */
        vm.selectCard = function(card) {
          vm.selectedCard = card;
          vm.currentState = STATES.SET_PIN;
          DebitChangePinTracking.changePinPage();
        }

        vm.changePin = function() {
          vm.submitDisabled = true;

          easeHttpInterceptor.setBroadCastEventOnce('nope');

          $DebitApi.changePin({
            accountReferenceId: vm.selectedCard.accountReferenceId,
            cardPinNumber: vm.models.pin.entry,
            cardReferenceId: vm.selectedCard.cardReferenceId
          }).then(function() {
            vm.errors[vm.currentState] = null;
            vm.submitDisabled = false;
            vm.currentState = STATES.SUCCESS;
            DebitChangePinTracking.confirmationPage();

          }).catch(handleError);
        }

        vm.close = function() {
          $scope.$emit('debitModalClosed');
          $state.go(vm.returnState, {}, {location: 'replace'});
        };

        vm.reset();
        $scope.$on('debitOtp', function(e, state) {
          if (state === 'success') {
            vm.init();
          }
        });
      }])
    .directive('debitChangePin',['DebitTemplatePathProvider', function(DebitTemplatePathProvider) {
      return {
        bindToController: true,
        scope: {
          returnState: '@'
        },
        controller: 'DebitChangePinController',
        controllerAs: 'debitChangePin',
        templateUrl: DebitTemplatePathProvider.getTemplateUrl('Debit-changepin')
      };
    }]);

});

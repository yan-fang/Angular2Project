/*global _ */
define([
  'angular'
], function(angular) {
  'use strict';

  angular.module('DebitModule')
    .controller('DebitActivationController',
    [ '$q',
      '$rootScope',
      '$scope',
      '$state',
      '$stateParams',
      '$DebitApi',
      'DebitActivationTracking',
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
        DebitActivationTracking,
        EaseConstant,
        DebitLocalization,
        DebitTemplatePathProvider,
        easeHttpInterceptor) {

        var vm = this;

        var STATES = {
          LOADING: 'LOADING',
          EMPTY: 'EMPTY',
          CARD_LIST: 'CARD_LIST',
          ACTIVATE_CARD: 'ACTIVATE_CARD',
          ASK_RETAIL_PIN: 'ASK_RETAIL_PIN',
          SET_PIN: 'SET_PIN',
          SUCCESS: 'SUCCESS'
        };

        // Heads UP: ES6 way would be
        // http://es6-features.org/#ComputedPropertyNames
        var BASE_TEMPLATE_URL = DebitTemplatePathProvider.getBaseTemplateUrl('debitActivation');
        var TEMPLATES = {
          LOADING: BASE_TEMPLATE_URL + 'loading.html',
          EMPTY: BASE_TEMPLATE_URL + 'empty.html',
          CARD_LIST: BASE_TEMPLATE_URL + 'card_list.html',
          ACTIVATE_CARD: BASE_TEMPLATE_URL + 'activate_card.html',
          ASK_RETAIL_PIN : BASE_TEMPLATE_URL + 'ask_retail_pin.html',
          SET_PIN: BASE_TEMPLATE_URL + 'set_pin.html',
          SUCCESS: BASE_TEMPLATE_URL + 'success.html'
        };

        var apiErrorHandler = {
          // invalid expiration date
          '200057': function() {
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

        function initializeTooltip(triggerMessage) {
          vm.tooltipOptions = {
            position: 'top-left',
            showIcon: false,
            size: 'medium',
            triggerMessage: triggerMessage,
            attrs: [
              {key: 'id', value: 'pin-instructions-tooltip-trigger'}
            ]
          };
        }

        vm.reset = function() {
          vm.cards = [];
          vm.currentState = STATES.LOADING;
          vm.models = {
            pin: {},
            expiration: {}
          };

          vm.errors = {};
          vm.submitDisabled = false;

          return vm;
        };

        vm.init = function() {
          vm.reset();
          return $q.all({
            i18n: DebitLocalization.get(),
            cards: $DebitApi.getAllCards($stateParams.accountReferenceId, 'ACTIVATE_CARD')
          }).then(function(results) {
            angular.extend(vm, {
              i18n: results.i18n.data.debit.activation,
              cards: _.get(results.cards.data.groupedEntries, 'activate', [])
            });

            vm.initializeState();
            initializeTooltip(vm.i18n.pin.description.learnMore);
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
              DebitActivationTracking.selectCardPage();
              vm.changeState(STATES.CARD_LIST);
              break;
          }
        };

        vm.selectCard = function(card) {
          vm.selectedCard = card;
          vm.models = {
            pin: {},
            expiration: {}
          };
          vm.errors = {};

          DebitActivationTracking.expirationDatePage(vm.selectedCard.cardType);
          vm.changeState(STATES.ACTIVATE_CARD);
        };

        vm.validateOrActivateCard = function() {
          // This is for retail cards, We want to ask them if they want to keep or change their pin
          if (vm.selectedCard.cardType === 'Retail') {
            return vm.askUserToChangePin();

            // If the 360 customer is new, then we need to first validate the card.
            // else try to activate card ignoring pin state...
          } else {
            return vm.selectedCard.isNewCustomer ? vm.validateExpirationDate() : vm.activateCard();
          }
        };

        // Prompt retail customers if they want to keep or change pin
        vm.askUserToChangePin = function() {

          vm.submitDisabled = true;
          vm.errors[vm.currentState] = null;

          DebitActivationTracking.submitExpirationDate({
            isNewCustomer: null,
            cardType: 'Retail'
          });

          $DebitApi.validateExpirationDate({
            accountReferenceId: vm.selectedCard.accountReferenceId,
            cardReferenceId: vm.selectedCard.cardReferenceId,
            expirationDate: vm.models.expiration.month + '/' + vm.models.expiration.year
          }).then(function() {
            DebitActivationTracking.setAskRetailPage();
            vm.changeState(STATES.ASK_RETAIL_PIN);
          }).catch(handleError);
        };
        

        // Change the state to allow the retail customer to change their pin. This will call the /activate/new route
        vm.changeRetailPin = function() {
          vm.submitDisabled = false;
          vm.errors[vm.currentState] = null;

          DebitActivationTracking.setPinPage(vm.selectedCard.cardType);
          vm.changeState(STATES.SET_PIN);
        };


        vm.validateExpirationDate = function() {
          vm.submitDisabled = true;
          DebitActivationTracking.submitExpirationDate({
            isNewCustomer: vm.selectedCard.isNewCustomer || null, // TODO: This is not the boolean we are looking for
            cardType: vm.selectedCard.cardType
          });

          vm.errors[vm.currentState] = null;

          // Do not trigger "the we hit the snag window"
          easeHttpInterceptor.setBroadCastEventOnce('nope');
          $DebitApi.validateExpirationDate({
            accountReferenceId: vm.selectedCard.accountReferenceId,
            cardReferenceId: vm.selectedCard.cardReferenceId,
            expirationDate: vm.models.expiration.month + '/' + vm.models.expiration.year
          }).then(function() {
            vm.errors[vm.currentState] = null;
            //remove the card from the card list
            vm.cards.splice( vm.cards.indexOf(vm.selectedCard), 1 );

            vm.submitDisabled = false;
            if (vm.selectedCard.isNewCustomer) {

              DebitActivationTracking.setPinPage(vm.selectedCard.cardType);
              vm.changeState(STATES.SET_PIN);

            } else {
              DebitActivationTracking.confirmationPage(vm.selectedCard.cardType);
              vm.changeState(STATES.SUCCESS);
              // emit an event that activate was successful.
              // this allows bank to update more Services modal options.
              $scope.$emit('debitCardChange', 'activate');
            }
          }).catch(handleError);
        };

        // Attempt to activate card
        vm.activateCard = function() {
          vm.submitDisabled = true;

          if (vm.selectedCard.cardType === 'Retail') {
            // Track if the Retail card is keeping or using new pin
            DebitActivationTracking.activateRetail(vm.models.pin ? vm.models.pin.entry : null);
            
            // Existing 360 customer should see the activate button
          } else if (vm.selectedCard.cardType === '360') {
            DebitActivationTracking.submitExpirationDate({
              isNewCustomer: vm.selectedCard.isNewCustomer, // TODO: This is not the boolean we are looking for
              cardType: vm.selectedCard.cardType
            });
          }

          vm.errors[vm.currentState] = null;

          // Do not trigger "the we hit the snag window"
          easeHttpInterceptor.setBroadCastEventOnce('nope');
          $DebitApi.activateCard({
            accountReferenceId: vm.selectedCard.accountReferenceId,
            cardReferenceId: vm.selectedCard.cardReferenceId,
            expirationDate: vm.models.expiration.month + '/' + vm.models.expiration.year,
            cardPinNumberTLPCI: vm.models.pin ? vm.models.pin.entry : null
          }).then(function() {
            vm.errors[vm.currentState] = null;
            //remove the card from the card list
            vm.cards.splice( vm.cards.indexOf(vm.selectedCard), 1 );

            vm.submitDisabled = false;
            DebitActivationTracking.confirmationPage(vm.selectedCard.cardType);
            vm.changeState(STATES.SUCCESS);
            // emit an event that activate was successful.
            // this allows bank to update more Services modal options.
            $scope.$emit('debitCardChange', 'activate');

          }).catch(handleError);
        };

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
    .directive('debitActivation',['DebitTemplatePathProvider', function(DebitTemplatePathProvider) {
      return {
        bindToController: true,
        scope: {
          returnState: '@'
        },
        controller: 'DebitActivationController',
        controllerAs: 'debitActivation',
        templateUrl: DebitTemplatePathProvider.getTemplateUrl('Debit-activation')
      };
    }]);

});

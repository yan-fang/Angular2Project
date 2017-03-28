define([
  'angular'
], function(angular) {
  'use strict';

  angular.module('DebitModule')
         .controller('DebitUnlockController', DebitUnlockController);

  DebitUnlockController.$inject = [
    '$q',
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    '$window',
    'EaseConstant',
    'debitConstants',
    'DebitLocalization',
    'DebitTemplatePathProvider',
    'DebitUnlockServices',
    'DebitUnlockTracking',
    'easeHttpInterceptor'
  ];

  function DebitUnlockController(
    $q,
    $rootScope,
    $scope,
    $state,
    $stateParams,
    $window,
    EaseConstant,
    debitConstants,
    DebitLocalization,
    TemplateProvider,
    DebitUnlockServices,
    DebitUnlockTracking,
    easeHttpInterceptor) {
    var vm = this;

    var STATES = {
      LOADING: 'LOADING',
      EMPTY: 'EMPTY',
      LIST: 'LIST',
      UNLOCK: 'UNLOCK',
      SUCCESS: 'SUCCESS'
    };

    vm.templatePaths = {
      LOADING: debitConstants.BASE_URL + '/components/partials/_loading.html',
      LIST: TemplateProvider.getFeatureTemplateUrl('unlock', '_list'),
      EMPTY: TemplateProvider.getFeatureTemplateUrl('unlock', '_empty'),
      UNLOCK: TemplateProvider.getFeatureTemplateUrl('unlock', '_unlock'),
      SUCCESS: TemplateProvider.getFeatureTemplateUrl('unlock', '_success')
    };

    vm.cards = [];
    vm.selectedCard = null;
    vm.currentState = STATES.LOADING;
    vm.models = {
      expiration: {
        month : null,
        year : null
      }
    };
    vm.expirationDate = null;
    vm.errors = {};
    vm.submitDisabled = false;

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

    vm.selectCard = function(card) {
      vm.selectedCard = card;
      DebitUnlockTracking.unlockPage();
      vm.currentState = STATES.UNLOCK;
    }

    vm.unlockCard = function() {
      vm.submitDisabled = true;
      vm.expirationDate = (vm.models.expiration.month && vm.models.expiration.year) ?
                              vm.models.expiration.month + '/' + vm.models.expiration.year :
                              null;
      easeHttpInterceptor.setBroadCastEventOnce('nope');
      DebitUnlockServices.unlockCard({
        accountReferenceId: vm.selectedCard.accountReferenceId,
        cardReferenceId: vm.selectedCard.cardReferenceId,
        expirationDate: vm.expirationDate
      }).then(function() {
        vm.errors[vm.currentState] = null;
        vm.submitDisabled = false;
        DebitUnlockTracking.unlockConfirmationPage();
        vm.currentState = STATES.SUCCESS;
        $scope.$emit('debitCardChange', 'unlock');
      }).catch(handleError);
    };

    vm.close = function() {
      $window.document.getElementById('moreServicesLink').focus();
      $scope.$emit('debitModalClosed');
      $state.go(vm.returnState, {}, {location: 'replace'});
      DebitUnlockTracking.accountDetailsPage();
    };

    vm.initializeUnlockCard = function() {
      return $q.all({
        i18n: DebitLocalization.get(),
        cards: DebitUnlockServices.getLockedCards($stateParams.accountReferenceId)
      }).then(function(results) {
        vm.i18n = results.i18n.data.debit.unlock;
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

    vm.initializeUnlockCard();

  }
});

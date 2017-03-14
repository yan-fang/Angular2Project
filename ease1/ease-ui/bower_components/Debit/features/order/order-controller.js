define([
  'angular'
], function(angular) {
  'use strict';

  angular.module('DebitModule')
         .controller('DebitOrderController', DebitOrderController);

  DebitOrderController.$inject = [
    '$q',
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    'EaseConstant',
    'debitConstants',
    'DebitLocalization',
    'DebitTemplatePathProvider',
    'DebitOrderServices',
    'DebitOrderTracking',
    'easeHttpInterceptor'
  ];

  function DebitOrderController(
    $q,
    $rootScope,
    $scope,
    $state,
    $stateParams,
    EaseConstant,
    debitConstants,
    DebitLocalization,
    TemplateProvider,
    DebitOrderServices,
    DebitOrderTracking,
    easeHttpInterceptor) {
    var vm = this;

    var STATES = {
      LOADING: 'LOADING',
      ORDER_TYPE: 'ORDER_TYPE',
      REISSUE: 'REISSUE',
      REORDER: 'REORDER',
      SUCCESS: 'SUCCESS',
      ERROR : 'ERROR'
    };

    vm.templatePaths = {
      LOADING: debitConstants.BASE_URL + '/components/partials/_loading.html',
      ORDER_TYPE:  TemplateProvider.getFeatureTemplateUrl('order', '_reissue_or_reorder'),
      REISSUE: TemplateProvider.getFeatureTemplateUrl('order', '_reissue'),
      REORDER: TemplateProvider.getFeatureTemplateUrl('order', '_reorder'),
      SUCCESS: TemplateProvider.getFeatureTemplateUrl('order', '_success'),
      ERROR: TemplateProvider.getFeatureTemplateUrl('order', '_error')
    };

    vm.reissueTemplates = {
      '0': TemplateProvider.getFeatureTemplateUrl('order', 'reissue/_request'),
      '1': TemplateProvider.getFeatureTemplateUrl('order', 'reissue/_ship'),
      '2': TemplateProvider.getFeatureTemplateUrl('order', 'reissue/_confirm')
    };

    vm.reorderTemplates = {
      '0': TemplateProvider.getFeatureTemplateUrl('order', 'reorder/_transactions'),
      '1': TemplateProvider.getFeatureTemplateUrl('order', 'reorder/_ship'),
      '2': TemplateProvider.getFeatureTemplateUrl('order', 'reorder/_confirm')
    };

    vm.errorTemplates = {
      'INSUFFICIENT': TemplateProvider.getFeatureTemplateUrl('order', 'errors/_insufficient_funds'),
      'DIFFERENT_ADDRESS': TemplateProvider.getFeatureTemplateUrl('order', 'errors/_different_address'),
      'CANCEL': TemplateProvider.getFeatureTemplateUrl('order', 'errors/_cancel_order'),
      'IN_PROGRESS': TemplateProvider.getFeatureTemplateUrl('order', 'errors/_in_progress'),
      'CONFIRM_ACTION': TemplateProvider.getFeatureTemplateUrl('order', 'errors/_confirm_action')
    };

    var PROGRESS_ICONS = ['icon-card', 'icon-envelope', 'icon-praise'];

    var confirmedToProceed = false;

    var apiErrorHandler = {
      // insufficient funds
      '201761': function() {
        vm.hasInsufficientFunds = true;
        vm.changeState(STATES.ERROR);
        vm.modalClass = 'caution';
        DebitOrderTracking.insufficientFundsPage(vm.action);
      }
    };

    var handleError = function(error) {
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
    };

   /*
    * Reset scope
    */

    var reset = function() {
      confirmedToProceed = false;

      vm.cards = [];
      vm.selectedCard = null;
      vm.action = '';
      vm.currentState = '';
      vm.currentStateStep = 0;
      vm.isEligible = true;

      vm.models = {
        isCardExpedited: false,
        reissueReason: ''
      };

      vm.modalClass = '';
      vm.errors = {};
      vm.submitDisabled = false;
      vm.showLoading = false;
      vm.sameLocation = true;
    };

    var initializeProgressBar = function(steps) {
      vm.progressBar = [];
      //Initialize Progress bar to be active on first step
      steps.forEach(function(step, idx) {
        vm.progressBar.push({
          icon: PROGRESS_ICONS[idx],
          label: step,
          classes: idx === 0 ? 'active' : ''
        });
      });
    };

    var showEligibilityErrors = function(isOrderInProgress) {
      if (isOrderInProgress) {
        vm.isEligible = false;
        DebitOrderTracking.inProgressPage(vm.action);
      } else {
        // either this is a reorder during reissue or a reissue/reorder despite unactivated card
        vm.modalClass = 'caution';
        // the below SC will probably get renamed
        DebitOrderTracking.reorderWhileReissuePage();
      }

      vm.changeState(STATES.ERROR);
    };

    var initializeReissue = function(steps) {
      vm.isEligible = true;
      vm.action = 'reissue';

      var isReissueInProgress = DebitOrderServices.isOrderInProgress(vm.selectedCard, vm.action);
      var isActivatedCard = DebitOrderServices.isActivatedCard(vm.selectedCard);

      if (!isReissueInProgress && (confirmedToProceed || isActivatedCard)) {
        vm.sameLocation = true;
        vm.hasInsufficientFunds = false;
        vm.isReasonsOpen = false;
        initializeProgressBar(steps);

        vm.modalClass = '';
        vm.changeState(STATES.REISSUE);
        DebitOrderTracking.reissueReasonPage();
      } else {
        showEligibilityErrors(isReissueInProgress);
      }
    };

    var initializeReorder = function() {
      vm.isEligible = true;
      vm.action = 'reorder';

      var isReorderInProgress = DebitOrderServices.isOrderInProgress(vm.selectedCard, vm.action);
      var isActiveNonreissuingCard = !vm.selectedCard.isReissueInProgress
                        && DebitOrderServices.isActivatedCard(vm.selectedCard);

      if (!isReorderInProgress && (confirmedToProceed || isActiveNonreissuingCard)) {
        DebitOrderTracking.dontHaveCard();
        vm.sameLocation = true;
        vm.hasInsufficientFunds = false;
        initializeProgressBar(['transactions', 'ship', 'confirm']);

        vm.modalClass = 'transactions';
        vm.changeState(STATES.REORDER);
        DebitOrderTracking.transactionsPage();
      } else {
        showEligibilityErrors(isReorderInProgress);
      }
    };

    var incrementStep = function() {
      vm.progressBar[vm.currentStateStep].classes = 'complete';
      vm.currentStateStep++;
      vm.progressBar[vm.currentStateStep].classes = 'active';
    };

    var decrementStep = function() {
      vm.progressBar[vm.currentStateStep].classes = '';
      vm.currentStateStep--;
      vm.progressBar[vm.currentStateStep].classes = 'active';
    };

    var resetFlags = function() {
      if (!vm.sameLocation || vm.hasInsufficientFunds) {
        vm.sameLocation = true;
        vm.hasInsufficientFunds = false;
      }
      vm.submitDisabled = false;
      vm.showLoading = false;
    };

    var featureSuccess = function() {
      vm.errors[vm.currentState] = null;
      vm.submitDisabled = false;
      vm.showLoading = false;
      vm.changeState(STATES.SUCCESS);
      vm.models.isCardExpedited ?
        DebitOrderTracking.expeditedSuccessPage(vm.action) :
        DebitOrderTracking.standardSuccessPage(vm.action);
      vm.modalClass = 'success';
    };

    var featureError = function(error) {
      vm.submitDisabled = false;
      vm.showLoading = false;
      handleError(error);
    };

   /*
    * Initialize Feature.
    * Reset scope, get active card (there should only be 1)
    */
    vm.init = function() {
      reset();
      vm.currentState = STATES.LOADING;
      return $q.all({
        i18n: DebitLocalization.get(),
        card: DebitOrderServices.getActiveCard($stateParams.accountReferenceId)
      }).then(function(results) {
        vm.i18n = results.i18n.data.debit.order;
        vm.selectedCard = results.card;
        vm.changeState(STATES.ORDER_TYPE);
      }).catch(handleError);
    };

    vm.initializeOrderCard = {
      reissue: initializeReissue,
      reorder: initializeReorder
    };

    vm.changeState = function(state) {
      vm.currentState = _.get(STATES, state, STATES.ORDER_TYPE);
    };

    vm.selectCard = function(card) {
      vm.selectedCard = card;
      vm.changeState(STATES.ORDER_TYPE);
      DebitOrderTracking.getNewCardPage();
    };

    vm.confirmToProceed = function() {
      confirmedToProceed = true;

      vm.action === 'reissue' ? initializeReissue(vm.i18n.reissue.steps)
                              : initializeReorder();
    };

    /* reissue related views */
    vm.selectReason = function(reason, reasonCode) {
      vm.isReasonsOpen = false;
      vm.models.reissueReason = {
        value: reason,
        code: reasonCode.replace(/_/g, ' ')
      };
    };

    vm.requestReissue = function() {
      DebitOrderTracking.reasonFilter(vm.models.reissueReason.code);
      incrementStep();
      DebitOrderTracking.confirmAddressPage(vm.action);
    };

    vm.shipCard = function() {
      if (vm.sameLocation) {
        DebitOrderTracking.useThisAddress();
        incrementStep();
        vm.models.isCardExpedited ?
          DebitOrderTracking.expeditedConfirmationPage(vm.action) :
          DebitOrderTracking.standardConfirmationPage(vm.action);
      } else {
        DebitOrderTracking.useDifferentAddress();
        vm.changeState(STATES.ERROR);
        vm.modalClass = 'caution';
        DebitOrderTracking.almostDonePage(vm.action);
      }
    };

    vm.reissueCard = function() {
      vm.submitDisabled = true;
      vm.showLoading = true;
      vm.currentStateStep = 2;
      vm.progressBar[vm.currentStateStep].classes='complete';
      var reissueCardData = {
        accountReferenceId: vm.selectedCard.accountReferenceId,
        cardReferenceId: vm.selectedCard.cardReferenceId,
        isCardExpedited: vm.models.isCardExpedited,
        cardStyle: debitConstants.CARD_STYLE_CODES[$stateParams.accountDetails.productId]
      };

      easeHttpInterceptor.setBroadCastEventOnce('nope');

      DebitOrderServices.reissueCard(reissueCardData)
        .then(featureSuccess)
        .catch(featureError);
    };

    vm.standardDeliveryOrder = function() {
      vm.models.isCardExpedited = false;
      vm.changeState(STATES[vm.action.toUpperCase()]);
      vm.modalClass = '';
      vm.action === 'reissue' ? vm.reissueCard() : vm.reorderCard();
    };

    vm.cancelOrder = function() {
      resetFlags();
      vm.changeState(STATES.ERROR);
      vm.modalClass = 'caution';
      DebitOrderTracking.cancelOrder();
    };

    /* reorder related views */
    vm.reviewTransactions = function() {
      incrementStep();
      vm.modalClass = '';
      DebitOrderTracking.confirmAddressPage(vm.action);
    };

    vm.reorderCard = function() {
      vm.submitDisabled = true;
      vm.showLoading = true;
      var reorderCardData = {
        accountReferenceId: vm.selectedCard.accountReferenceId,
        cardReferenceId: vm.selectedCard.cardReferenceId,
        isCardExpedited: vm.models.isCardExpedited,
        cardStyle: debitConstants.CARD_STYLE_CODES[$stateParams.accountDetails.productId]
      };

      easeHttpInterceptor.setBroadCastEventOnce('nope');

      DebitOrderServices.reorderCard(reorderCardData)
        .then(featureSuccess)
        .catch(featureError);
    };

    vm.back = function() {
      vm.modalClass = '';
      vm.errors[vm.currentState] = null;

      if (vm.currentStateStep === 0) {
        return vm.changeState(STATES.ORDER_TYPE);
      } else if (vm.currentState === STATES.ERROR) {
        vm.changeState(STATES[vm.action.toUpperCase()]);
        vm.modalClass = '';
        resetFlags();
        vm.progressBar[vm.currentStateStep].classes = 'active';
      } else {
        resetFlags();
        decrementStep();
        if (vm.action === 'reorder' && vm.currentStateStep === 0) {
          vm.modalClass = 'transactions';
        }
      }
    };

    vm.close = function() {
      $scope.$emit('debitModalClosed');
      $state.go(vm.returnState, {}, {location: 'replace'});
    };

    reset();
    $scope.$on('debitOtp', function(e, state) {
      if (state === 'success') {
        vm.init();
      }
    });
  }
});

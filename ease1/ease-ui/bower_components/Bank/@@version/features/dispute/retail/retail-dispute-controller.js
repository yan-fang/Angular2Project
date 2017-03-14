define(['angular'], function (angular) {
  'use strict';

  angular
    .module('BankModule')
    .controller('RetailDisputeController', RetailDisputeController);

  RetailDisputeController.$inject = ['i18nBank','$window', '$rootScope', 'RetailDisputeFactory', 'BankPubSubFactory', '$stateParams', 'PubSubDisputeEventMap', 'RetailDisputeFormlyFactory', 'CommonDisputeFactory', 'EaseConstant'];
  function RetailDisputeController(i18nBank, $window, $rootScope, RetailDisputeFactory, BankPubSubFactory, $stateParams, PubSubDisputeEventMap, RetailDisputeFormlyFactory, CommonDisputeFactory, EaseConstant) {

    RetailDisputeFactory.initDisputeFactory($stateParams.transactionIndex, i18nBank);
    BankPubSubFactory.logTrackAnalyticsPageView(PubSubDisputeEventMap[$stateParams.disputeType].levels);

    var vm = this;
    var MAX_CHARACTER_COUNT = 250;
    var transactionObj = RetailDisputeFactory.getDisputedTransaction();
    vm.pageProperties = RetailDisputeFactory.getPageProperties($stateParams.propertyPackage);
    vm.dispute = RetailDisputeFactory.getDispute();
    vm.formly =  RetailDisputeFormlyFactory.getFormlyConfig();
    vm.isCountNegative = false;
    vm.disableButton = false;

    angular.extend(vm, {
      close: close,
      getBillPayConfirmationMessage : getBillPayConfirmationMessage,
      goToFraudOrDisputeFlow : goToFraudOrDisputeFlow,
      goToPreviousView : goToPreviousView,
      goToView: goToView,
      loading: '',
      maxCharacterCount : MAX_CHARACTER_COUNT,
      setDisputeReason: RetailDisputeFactory.setDisputeReason,
      submitRetailDispute : submitRetailDispute,
      transactionObj:  transactionObj
    });

    function close() {
      RetailDisputeFactory.resetFactory();
      if($stateParams.transactionId){
        $window.document.getElementById('transaction-'+ $stateParams.transactionId+'-dispute').focus();
      }
      CommonDisputeFactory.close();
    }

    function getBillPayConfirmationMessage() {
      return vm.dispute.disputeReason === 'FRAUD' ?
        vm.formly.models['fraudDetailQuestions'].stopPayment : vm.formly.models['billPayGeneral'].stopPayment;
    }

    function goToFraudOrDisputeFlow(destination) {
      if(destination ==='customerInfoFraud') {
        RetailDisputeFactory.setDisputeReason('FRAUD');
      }
      goToView(destination);
    }

    function goToView(destination, pubsubEvent) {
      var logEvent = pubsubEvent || destination;
      BankPubSubFactory.logTrackAnalyticsPageView(PubSubDisputeEventMap[logEvent].levels);
      vm.pageProperties = RetailDisputeFactory.getPageProperties(destination);
    }

    function goToPreviousView() {
      if(vm.pageProperties.formlyFormId) {
        RetailDisputeFormlyFactory.clearFormModel(vm.pageProperties.formlyFormId)
      }
      goToView(vm.pageProperties.previousPage);
    }


    function submitRetailDispute(successState, successPubSub) {
      vm.loading = 'loading';
      vm.disableButton = true;
      RetailDisputeFactory.createRetailDisputeObject(vm.formly.models);
      var promise = RetailDisputeFactory.sendRetailDisputeRequest();
      promise.then(function success(){
        goToView(successState, successPubSub);
      }, function error(){
        handleSubmissionError(successPubSub);
        vm.disableButton = false;
        vm.loading = '';
        close();
      })
    }

    function handleSubmissionError(currentState) {
      logErrorInSiteCatalyst(currentState, 'level5');
      $rootScope.$broadcast('error', EaseConstant.defaultErrorMessage);
    }

    function logErrorInSiteCatalyst(currentState, errorLevel) {
      var levels = angular.copy(PubSubDisputeEventMap[currentState].levels);
      levels[errorLevel] = 'error';
      BankPubSubFactory.logTrackAnalyticsPageView(levels);
    }

  }

});



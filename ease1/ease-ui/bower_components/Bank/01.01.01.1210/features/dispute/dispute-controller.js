define(['angular'], function (angular) {
  'use strict';

  angular
    .module('BankModule')
    .controller('BankDisputeController', BankDisputeController);

  BankDisputeController.$inject = ['$rootScope', 'i18nBank', 'BankDisputeFactory', 'BankPubSubFactory', '$stateParams', 'PubSubDisputeEventMap', 'EaseConstant', 'DisputeFormlyFactory', 'CommonDisputeFactory'];
  function BankDisputeController($rootScope, i18nBank, BankDisputeFactory, BankPubSubFactory, $stateParams, PubSubDisputeEventMap, EaseConstant, DisputeFormlyFactory, CommonDisputeFactory) {
    var disputeType = $stateParams.disputeType;

    i18nBank.dispute.disputeType = disputeType;

    BankDisputeFactory.initDisputeFactory($stateParams.transactionIndex, i18nBank);
    var MAX_CHARACTER_COUNT = 3500;

    var vm = this;
    
    var transactionObj = BankDisputeFactory.getDisputedTransaction();
    var cardHolder = BankDisputeFactory.getCardHolder();
    DisputeFormlyFactory.setJointAccountProperties(cardHolder);
    vm.pageProperties = BankDisputeFactory.getPageProperties($stateParams.propertyPackage);
    vm.disputeReason = '';
    vm.formly =  DisputeFormlyFactory.getFormlyConfig();
    vm.isCountNegative = false;
    vm.disableButton = false;
    vm.disputeItemsMenu = [];
    vm.disputeItems = vm.formly.selectOptions;
    vm.disputeData = {
      id : "dispute-reason-menuitem",
      placeholder : vm.formly.selectorTitle
    };
    

    // PubSub Event dispute modal view
    BankPubSubFactory.logTrackAnalyticsPageView(PubSubDisputeEventMap[disputeType].levels);

    angular.extend(vm, {
      cardHolder : cardHolder,
      close: close,
      disputeType : disputeType,
      logCallCenterLinkEvent : logCallCenterLinkEvent,
      maxCharacterCount : MAX_CHARACTER_COUNT,
      goToView: goToView,
      initClose: false,
      isDropdownOpen : false,
      loading: '',
      showCounter : showCounter,
      selectedItemLabel : vm.formly.selectorTitle,
      setSelectedItem : setSelectedItem,
      submitFraudDispute : submitFraudDispute,
      submitNonFraudDispute : submitNonFraudDispute,
      transactionObj:  transactionObj,
      isDisputeFormSubmitDisabled: isDisputeFormSubmitDisabled
    });

    function close() {
      CommonDisputeFactory.close();
      if($stateParams.transactionId){
        $window.document.getElementById('transaction-'+ $stateParams.transactionId+'-dispute').focus();
      }
      BankDisputeFactory.resetFactory();
    }

    function goToView(destination) {
      // PubSub Event dispute modal view
      BankPubSubFactory.logTrackAnalyticsPageView(PubSubDisputeEventMap[destination].levels);
      vm.pageProperties = BankDisputeFactory.getPageProperties(destination);
      vm.formly =  DisputeFormlyFactory.getFormlyConfig();
    }

    function logCallCenterLinkEvent() {
      BankPubSubFactory.logTrackAnalyticsClick(PubSubDisputeEventMap.callCenterLink);
    }

    function submitNonFraudDispute() {
      vm.disableButton = true;
      var disputeProperties = vm.formly.models[vm.disputeReason];
      BankDisputeFactory.createDisputeObject(vm.disputeReason, disputeProperties);
      submitDispute('disputeSubmitted');
    }

    function submitFraudDispute() {
      vm.disableButton = true;
      BankDisputeFactory.createDisputeObject(vm.disputeReason);
      submitDispute('cardLockedPage');
    }

    function submitDispute(successState) {
      vm.loading = 'loading';
      var promise = BankDisputeFactory.sendDisputeRequest();

      promise.then(function success(){
        goToView(successState);
      }, function error(){
        logDisputeError(successState);
        $rootScope.$broadcast('error', EaseConstant.defaultErrorMessage);
        vm.loading = '';
        vm.disableButton = false;
        close();
      })
    }

    function logDisputeError(successState){
      var levels = {};
      angular.copy(PubSubDisputeEventMap[successState].levels, levels);
      levels.level5="error";
      BankPubSubFactory.logTrackAnalyticsPageView(levels);
    }

    function showCounter() {
      return vm.disputeReason;
    }

    function setSelectedItem(item) {
      vm.disputeReason = item.reasonValue;
      vm.selectedItemLabel = item.label;
    }

    function isDisputeFormSubmitDisabled() {
      return !vm.disputeReason || vm.isCountNegative || vm.disableButton
    }
  }
});



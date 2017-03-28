define(['angular'], function(angular) {
  'use strict';

  angular
    .module('AutoLoanAccordion', [])
    .controller('accordionController', accordionController)
    .directive('autoLoanAccordion', accordionDirective)
    .directive('stopClickEvent', stopClickEventDirective);
  accordionController.$inject = ['$scope', 'autoLoanModuleService','autoLoanPaymentService'];
  function accordionController($scope, autoLoanModuleService, autoLoanPaymentService) {

    var vm = this;
    var openIndices = [];
    var accountDetailsData = autoLoanModuleService.getAccountDetailsData();
    var displayNumber = accountDetailsData.accountDetails.displayAccountNumber;

    vm.accountNickname = accountDetailsData.accountDetails.accountNickname;
    vm.displayLast4AcctNumber = displayNumber.substring(displayNumber.length - 4);
    vm.i18n = autoLoanModuleService.getI18n();

    vm.showCancelButton = autoLoanModuleService.isFeatureEnabled('ease.coaf.cancelonetimepayment');
    vm.showPaymentPlanCancelButton = autoLoanModuleService.isFeatureEnabled('ease.coaf.paymentplandelete');

    angular.extend(vm, {
      getDrawerClass: getDrawerClass,
      isOpen: isOpen,
      setOpenIndex: setOpenIndex,
      cancelOneTimePayment: cancelOneTimePayment,
      cancelRecurringPayment: cancelRecurringPayment,
      getOpenIndices: getOpenIndices
    });

    //TODO: DEPRECATED If currently using, please use isOpen and directive high changes for opening and closing.
    function getDrawerClass(index) {
      if (isOpen(index)) {
        return 'childOpen';
      }
    }

    function isOpen(testIndex) {
      return openIndices.indexOf(testIndex) > -1;
    }

    function setOpenIndex(index) {
      if (isOpen(index)) {
        var currentIndex = openIndices.indexOf(index);
        openIndices.splice(currentIndex, 1);
        return;
      }
      if (this.onlyOpenOne) {
        openIndices[0] = index;
      } else {
        openIndices.push(index);
      }
    }

    function getOpenIndices() {
      return openIndices;
    }

    function cancelOneTimePayment(evt, oneTimePaymentToCancel) {
      autoLoanModuleService.setOneTimePaymentObjToCancel(oneTimePaymentToCancel);
      autoLoanModuleService.oneTimePaymentCancel();
    }


    function cancelRecurringPayment(paymentPlan) {
      paymentPlan.frequencyTypeText = paymentPlan.paymentFrequency;
      paymentPlan.payFromText = autoLoanPaymentService
        .formatPayFrom(paymentPlan.bankName, paymentPlan.fromAccountNumber);
      paymentPlan.totalAmount = paymentPlan.transactionAmount;

      autoLoanModuleService.setPaymentPlan(paymentPlan);
      autoLoanModuleService.deletePaymentPlanConfirm();
    }
  }


  function accordionDirective() {

    return {
      restrict: 'AE',
      bindToController: true,
      controller: 'accordionController',
      controllerAs: 'accordionVM',
      scope: {
        accordionElements: '=',
        onlyOpenOne: '=',
        accordionParent: '='
      },
      templateUrl: function getTemplate($element, $attrs) {
        if ($attrs.templateOverride) {
          return $attrs.templateOverride;
        }
        return '/ease-ui/dist/partials/accordion.html';
      }
    };
  }

  function stopClickEventDirective() {
    return {
      restrict: 'A',
      link: function(scope, element) {
        element.bind('click', function(e) {
          e.stopPropagation();
        });
      }
    };
  }

});


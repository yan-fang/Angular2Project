define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('managePayee', function() {
    return {
      restrict: 'E',
      scope: {
        uid: '@',
        showMenu: '=',
        recurringPayment: '&?',
        recurringPaymentLoading: '=?',
        deletePayee: '&?',
        deletePayeeLoading: '=?',
        editPayee: '&?',
        editLoading: '=?',
        payeeType: '@?'
      },
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/' +
                   'components/payee/manage/manage.component.html',
      controller: ManageController,
      controllerAs: '$ctrl',
      bindToController: true
    };
  });

  ManageController.$inject = [
    '$document',
    '$element',
    '$rootScope',
    'FeatureToggleService'
  ];

  function ManageController($document, $element, $rootScope, FeatureToggleService) {
    var vm = this;

    angular.extend(this, {
      features: {
        deletePayee: FeatureToggleService.getFeatureToggleData()['ease.billpay.deletepayee'],
        editPayee: FeatureToggleService.getFeatureToggleData()['ease.billpay.editpayee'],
        editPayeeRegistered: FeatureToggleService.getFeatureToggleData()['ease.billpay.editpayee.registered'],
        editPayeeManual: FeatureToggleService.getFeatureToggleData()['ease.billpay.editpayee.manual'],
        addRecurringPayment: FeatureToggleService.getFeatureToggleData()['ease.billpay.addrecurringpayment']
      }
    });

    activate();

    function activate() {
      $rootScope.$on('haltClose', function() {
        $document.off('click', listenForClicks);
      });

      $rootScope.$on('enableClose', function() {
        $document.on('click', listenForClicks);
      });

      $rootScope.$watch(function() {
        return vm.showMenu;
      }, function(newVal) {
        if (newVal) {
          $document.on('click', listenForClicks);
        } else {
          $document.off('click', listenForClicks);
        }
      });

      vm.__testonly__ = { listenForClicks: listenForClicks };
    }

    function listenForClicks(e) {
      if (!e.target || !$element[0].contains(e.target)) {
        $rootScope.$apply(function() {
          vm.showMenu = false;
        });
      }
    }
  }
});

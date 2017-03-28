define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .directive('ebillMarkAsPaid', function() {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/' +
                     'components/ebill/markAsPaid/ebill-mark-as-paid.component.html',
        controller: markAsPaidCtrl,
        controllerAs: '$ctrl',
        bindToController: true
      };
    });

  markAsPaidCtrl.$inject = [
    '$state',
    '$timeout',
    'ebillService'
  ];

  function markAsPaidCtrl($state, $timeout, ebillService) {
    var vm = this;

    angular.extend(this, {
      modalTitle: 'Mark Bill as Paid',
      modalClass: [],
      billInfo: {
        memo: ''
      },
      submitInProgress: false,
      showMemo: false,
      alphaNumericRegex: /^[A-z0-9 .']+$/,
      step: 'confirm',
      ebillInfo: [
        {
          label: 'Payee Name',
          detail: 'PECO Energy'
        }, {
          label: 'Due Date',
          detail: 'Mar 24, 2017'
        }, {
          label: 'Amount',
          detail: '$24.42'
        }
      ],
      close: close,
      submit: submit,
      focusMemo: focusMemo
    });

    /**
     * Returns user to the parent state
     */
    function close() {
      $state.go($state.current.parent);
    }

    /**
     * Submits the eBill and optional memo field to the eBill mark as paid OL method
     */
    function submit() {
      if (vm.submitInProgress) {
        return;
      }

      vm.submitInProgress = true;

      ebillService.markAsPaid(vm.billInfo).then(function() {
        vm.modalTitle = 'Success';
        vm.step = 'success';
        vm.modalClass = ['modal-success'];
      });
    }

    /**
     * Will programatically set focus on the memo input field when called
     */
    function focusMemo() {
      $timeout(function() {
        try {
          document.getElementById('memo').focus();
        /*eslint-disable */
        } catch (err) {
        }
        /*eslint-enable */
      }, 150);
    }
  }
});

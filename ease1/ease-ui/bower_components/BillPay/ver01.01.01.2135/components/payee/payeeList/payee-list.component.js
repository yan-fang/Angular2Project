define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('payeeList', function() {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/' +
                   'components/payee/payeeList/payee-list.component.html',
      controller: PayeeListController,
      controllerAs: '$ctrl',
      bindToController: true
    };
  });

  PayeeListController.$inject = [
    '$state',
    '$location',
    'PayeeListService',
    'PayeeDetailService',
    'StringUtils',
    'DeletePayeeService',
    '$rootScope',
    '$timeout',
    '$q',
    'FeatureToggleService'
  ];

  function PayeeListController(
    $state,
    $location,
    PayeeListService,
    PayeeDetailService,
    StringUtils,
    DeletePayeeService,
    $rootScope,
    $timeout,
    $q,
    FeatureToggleService
  ) {
    var vm = this;

    angular.extend(this, {
      makePaymentLoading: false,
      deletePayeeLoading: false,
      recurringPaymentLoading: false,
      editLoading: false,
      payeeList: PayeeListService.getPayeeList(),
      accountSubCategory: $location.search().subCategory,
      showSettingsMenu: [],
      openDrawerId: null,
      features: {
        oneTimePayment: FeatureToggleService.getFeatureToggleData()['ease.billpay.makeonetimepayment'],
        payeeDetail: FeatureToggleService.getFeatureToggleData()['ease.billpay.payeedetailapi'],
        getAccount: FeatureToggleService.getFeatureToggleData()['ease.billpay.getaccountapi']
      },

      checkLastPaymentInfo: PayeeDetailService.checkPayeeLastPaymentInfo,
      checkLatestScheduledTrx: PayeeDetailService.checkPayeeLatestScheduledTrx,
      getPayeeDisplayName: getPayeeDisplayName,
      makePayment: makePayment,
      recurringPayment: recurringPayment,
      deletePayee: deletePayee,
      editPayee: editPayee,
      closeDrawer: closeDrawer,
      openDrawer: openDrawer,
      evaluateShouldClose: evaluateShouldClose,
      openOnlyAD: openOnlyAD,
      returnFocus: returnFocus,
      getPayeeType: getPayeeType
    });

    activate();

    function activate() {
      $rootScope.$on('editPayeeSuccess', function(event, data) {
        vm.openDrawerId = null;
        openDrawer(data.sourceElement).then(function() {
          vm.showSettingsMenu[data.sourceElement] = true;
          returnFocus('billpay-button-edit-payee-' + data.sourceElement);
          $rootScope.$broadcast('enableClose');
        });
      });

      $rootScope.$on('addRecurringSuccess', function(event, data) {
        vm.openDrawerId = null;
        openDrawer(data.sourceElement).then(function() {
          vm.showSettingsMenu[data.sourceElement] = true;
          returnFocus('billpay-recurring-payment-Button-' + data.sourceElement);
          $rootScope.$broadcast('enableClose');
        });
      });

      $rootScope.$on('deletePayeeFailure', function(event, data) {
        vm.openDrawerId = null;
        openDrawer(data.sourceElement).then(function() {
          vm.showSettingsMenu[data.sourceElement] = true;
          returnFocus('BillPay-deletePayee-Button-' + data.sourceElement);
          $rootScope.$broadcast('enableClose');
        });
      });

      $rootScope.$on('deletePayeeSuccess', function(event, data) {
        if (vm.payeeList.length > 0) {
          var drawerToOpen = 0;

          // If the deleted payee wasn't the first and wasn't the last, open the previous
          if (vm.openDrawerId !== 0 && vm.openDrawerId < vm.payeeList.length) {
            drawerToOpen = vm.openDrawerId;
          }

          vm.openDrawerId = null;

          // Open the drawer and focus on the header
          openDrawer(drawerToOpen).then(function() {
            vm.showSettingsMenu[data.sourceElement] = false;
            returnFocus('btn-payee-nickname-' + drawerToOpen);
            $rootScope.$broadcast('enableClose');
          });
        } else {
          // Return focus to the Add Payee button if we just deleted the only payee
          vm.openDrawerId = null;
          returnFocus('btn-add-payee');
        }
      });
    }

    function getPayeeDisplayName(payee) {
      if (!StringUtils.isEmpty(payee.payeeNickname)) return payee.payeeNickname;
      if (!StringUtils.isEmpty(payee.payeeName)) return payee.payeeName;
      return '';
    }

    function makePayment(payee, id) {
      if (vm.makePaymentLoading) {
        return;
      }

      vm.makePaymentLoading = true;

      PayeeDetailService.setPayeeDetail(payee);
      $state.go(
        'BillPay.MakePayment',
        {
          returnFocusId: 'BillPay-makePayment-Button-' + id
        }
      ).finally(function() {
        vm.makePaymentLoading = false;
      });
    }

    function recurringPayment(payee, buttonIndex) {
      if (vm.recurringPaymentLoading) {
        return;
      }

      vm.recurringPaymentLoading = true;

      PayeeDetailService.setPayeeDetail(payee);
      $state.go('BillPay.RecurringPayment', {
        returnFocusId: buttonIndex
      }).finally(function() {
        $rootScope.$broadcast('haltClose');
        vm.recurringPaymentLoading = false;
      });
    }

    function deletePayee(payee, id) {
      if (vm.deletePayeeLoading) {
        return;
      }

      vm.deletePayeeLoading = true;

      DeletePayeeService.setPayeeToDelete(payee);
      $state.go('BillPay.DeletePayee', {
        returnFocusId: id
      }).finally(function() {
        $rootScope.$broadcast('haltClose');
        vm.deletePayeeLoading = false;
      });
    }

    /**
     * Triggers the edit payee flow for a given payee.
     *
     * @param {object} payee - The payee to edit
     */
    function editPayee(payee, buttonIndex) {
      if (vm.editLoading) {
        return;
      }

      vm.editLoading = true;

      PayeeDetailService.initializePayeeDetail(
        payee.payeeReferenceId,
        $state.params.accountReferenceId
      ).then(function() {
        $state.go('BillPay.editPayee', {
          returnFocusId: buttonIndex
        }).finally(function() {
          $rootScope.$broadcast('haltClose');
          vm.editLoading = false;
        });
      })
      .catch(function() {
        vm.editLoading = false;
      });
    }

    /**
     * Will broadcast a close drawer custom event to close an EASE accordion of the given index
     *
     * @param {number} id - Index of the drawer to close
     */
    function closeDrawer(id) {
      document.dispatchEvent(new CustomEvent('toggle-drawer', {
        detail: {
          actionType: 'close',
          drawerId: 'BillPay-payeeList-item-detail-' + id
        }
      }))

      vm.openDrawerId = null;
      vm.showSettingsMenu[id] = false;
    }

    /**
     * Will broadcast an open drawer custom event to open  an EASE accordion of the given index. If the given
     * drawer is already open, will call the clase drawer method instead as we only want one drawer open at a time.
     *
     * @param {number} id - Index of the drawer to open
     */
    function openDrawer(id) {
      var deferred = $q.defer();

      // Close drawer if it receives a second click event
      if (vm.openDrawerId === id) {
        closeDrawer(vm.openDrawerId);
        return;
      }

      // Open only one at a time
      if (vm.openDrawerId !== null) {
        closeDrawer(vm.openDrawerId);
      }

      document.dispatchEvent(new CustomEvent('toggle-drawer', {
        detail: {
          actionType: 'open',
          drawerId: 'BillPay-payeeList-item-detail-' + id
        }
      }))

      $timeout(function() {
        vm.openDrawerId = id;
        deferred.resolve();
      }, 125);

      return deferred.promise;
    }

    /**
     * Will set programatic focus for a given id
     */
    function returnFocus(id) {
      if (typeof id === 'undefined') {
        return;
      }

      $timeout(function() {
        try {
          document
            .getElementById(id)
            .focus();
        /*eslint-disable */
        } catch(err) {
        }
        /*eslint-enable */
      }, 10);
    }

    /**
     * This method will take an angular $event sent from ng-click on the payee list accordion
     * and determine if the accordion should in fact close. This is necessary as using the keyboard to
     * activate buttons within the accordion drawers was causing the drawer to close. This will
     * prevent hat circumstance from happening
     *
     * @param {event} ev - Angular $event sent from the ng-click in the payee list accordion
     * @returns {bool} - True to close the drawer, false to leave it open
     */
    function evaluateShouldClose(ev) {
      return !(ev.type === 'keypress'
        && ev.target.nodeName === 'BUTTON'
        && ev.target.classList.contains('payee-nickname'));
    }

    /**
     * Only return true if the event is triggered by a keypress
     */
    function openOnlyAD(ev) {
      return ev.type === 'keypress' && ev.which === 13;
    }

    /**
     * Identify the payee type for a given payee (manual or registered)
     *
     * @param {object} payee - An individual payee from the get payee list call
     * @returns {string} - Either 'manual' or 'registered'
     */
    function getPayeeType(payee) {
      if (typeof payee.payeeAddress === 'undefined') {
        return 'registered';
      }

      return Object.keys(payee.payeeAddress).length > 0 ? 'manual' : 'registered';
    }
  }
});

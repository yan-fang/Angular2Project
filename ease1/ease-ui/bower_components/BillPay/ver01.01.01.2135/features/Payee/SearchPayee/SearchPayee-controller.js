define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .controller('SearchPayeeController', SearchPayeeController);

  SearchPayeeController.$inject = [
    '$state',
    'SearchPayeeService',
    'PayeeService',
    'BillPayErrorHandlerService',
    '$location',
    'BillPayPubSubFactory',
    '$filter',
    '$timeout'
  ];

  function SearchPayeeController(
    $state,
    SearchPayeeService,
    PayeeService,
    BillPayErrorHandlerService,
    $location,
    BillPayPubSubFactory,
    $filter,
    $timeout) {
    var vm = this;

    angular.extend(this, {
      modalClass: ['add-payee-flow', 'bill-pay-search-payee'],
      payeeList: $filter('filter')(SearchPayeeService.getPayeeList(), SearchPayeeService.getPayeeName()),
      searchedTerm: null,
      focusId: document.getElementById('btn-add-payee'),
      loadingClassName: '',
      selectedIndex: SearchPayeeService.getSelectedIndex(),
      payeeInfo: {
        payeeName: SearchPayeeService.getPayeeName()
      },
      payeeListCache: SearchPayeeService.getPayeeList(),

      close: close,
      goToAccountInfo: goToAccountInfo,
      beginManualAdd: beginManualAdd,
      checkKeyDown: checkKeyDown,
      search: search,
      hideHeader: hideHeader
    });

    logSitecatalystEvent('searchPayee');

    /**
     * Returns the user to the Bill Pay hub when this modal is closed
     */
    function close() {
      SearchPayeeService.resetSearchData();
      logSitecatalystEvent('billPayCenter');
      $state.go('BillPay.PayeeList').then(returnFocus('btn-add-payee'));
    }

    /**
     * Used to take the user to the second step in the add payee from search flow
     *
     * @param {object} payee - The selected payee object as returned from the call to getSuggestions
     */
    function goToAccountInfo(payee) {
      PayeeService.setPayee(payee);
      PayeeService.setManualAdd(false);
      SearchPayeeService.setSearchTerm(vm.payeeList[vm.selectedIndex].payeeName);
      SearchPayeeService.setSelectedIndex(vm.selectedIndex);

      $state.go('BillPay.addPayee.accountInfo');
    }

    /**
     * Used to take the user to the add payee manual flow
     */
    function beginManualAdd() {
      PayeeService.setPayee(vm.payeeInfo);
      PayeeService.setManualAdd(true);
      SearchPayeeService.setSearchTerm(vm.payeeInfo.payeeName);
      SearchPayeeService.setSelectedIndex(vm.selectedIndex);

      $state.go('BillPay.addPayee.acctNumberAsk');
    }

    /**
     * This method is passed into the ng-change directive for the search input box. If there
     * are search suggestions, it will listen for the press of the up arrow, down arrow or enter key
     * and either visibly change the selected search suggestion or select the current suggestion and move
     * on to the next step in the flow.
     *
     * @param {event} - Event from the ng-change directive
     */
    function checkKeyDown(event) {
      switch (event.keyCode) {
        case 38:
          // Up arrow key
          event.preventDefault();

          if (vm.selectedIndex - 1 !== -1) {
            vm.selectedIndex--;
            var tmpNode = document.querySelectorAll('.bp-search-payee-item')[vm.selectedIndex];

            if (tmpNode) {
              tmpNode.focus();
            }
          }

          break;

        case 40:
          // Down arrow key
          event.preventDefault();

          if (vm.selectedIndex + 1 < vm.payeeList.length) {
            vm.selectedIndex++;
          } else {
            vm.selectedIndex = 0;
          }

          var tmpNode = document.querySelectorAll('.bp-search-payee-item')[vm.selectedIndex];

          if (tmpNode) {
            tmpNode.focus();
          }

          break;

        case 13:
          // Enter key
          if (vm.payeeList.length === 0) {
            beginManualAdd();
            break;
          }

          event.preventDefault();
          goToAccountInfo(vm.payeeList[vm.selectedIndex]);
          break;

        default:
          break;
      }
    }

    /**
     * Queries the search payee service for a given term. Will only query the service if the search
     * term is three characters in length. Shorter terms will not be evaluated. Longer terms are filtered
     * by Angular's $filter. A loading animation will be triggered whenever a three character term is passed in
     * for the duration of the xhr request.
     *
     * @param {string} payeeName - Term to use when querying the search payee service
     */
    function search(payeeName) {
      // Don't make another request if the user was just backspacing down to three chars

      payeeName = payeeName.trim();

      if (payeeName.length >= 3) {
        if (payeeName.charAt(2) === ' ') {
          var shortestNewString = payeeName.match(/[a-zA-Z0-9._%+-]+\s+[a-zA-Z0-9._%+-]/).toString();

          if (shortestNewString === vm.searchedTerm) {
            vm.payeeList = $filter('filter')(vm.payeeListCache, payeeName);
          } else {
            // If there is not already a request in progress
            if (vm.loadingClassName !== 'loading') {
              getSuggestion(shortestNewString);
            }
          }
        } else {
          if (payeeName.substring(0, 3) === vm.searchedTerm) {
            vm.payeeList = $filter('filter')(vm.payeeListCache, payeeName);
          } else {
            // If there is not already a request in progress
            if (vm.loadingClassName !== 'loading') {
              getSuggestion(payeeName.substring(0, 3));
            }
          }
        }
      } else {
        vm.payeeList = [];
        vm.searchedTerm = '';
        vm.payeeListCache = [];
        vm.loadingClassName = '';
      }
    }

    function logSitecatalystEvent(viewName) {
      BillPayPubSubFactory.logTrackAnalyticsPageView(
        $location.search().subCategory,
        viewName
      );
    }

    function getSuggestion(payeeName) {
      vm.loadingClassName = 'loading';
      vm.payeeList = [];
      SearchPayeeService.getSuggestions(payeeName).then(function success(data) {
        vm.loadingClassName = '';
        vm.payeeListCache = typeof data.entries !== 'undefined' ? data.entries : [];
        vm.payeeList = $filter('filter')(vm.payeeListCache, vm.payeeInfo.payeeName);
        vm.searchedTerm = payeeName;

        SearchPayeeService.setSearchData(vm.payeeListCache);

        if (vm.payeeList.length) {
          vm.selectedIndex = 0;
        }

        if (vm.payeeInfo.payeeName.length<3) {
          vm.payeeList = [];
          vm.searchedTerm = '';
          vm.payeeListCache = [];
        }
      }, function error(err) {
        vm.payeeList = [];
        BillPayErrorHandlerService.handleError(err);
      });
    }

    /**
     * Used to add the hide-header class to the modal when user focuses on search input box.
     * This allows us to hide certain elements on the mobile experience.
     */
    function hideHeader() {
      if (vm.modalClass.indexOf('hide-header') === -1) {
        vm.modalClass.push('hide-header');
      }
    }

    function returnFocus(id) {
      if (!id) {
        return;
      }

      $timeout(function() {
        try {
          document.getElementById(id).focus();
          /*eslint-disable */
        } catch (err) {}
        /*eslint-enable */
      }, 100);
    }

  }
});

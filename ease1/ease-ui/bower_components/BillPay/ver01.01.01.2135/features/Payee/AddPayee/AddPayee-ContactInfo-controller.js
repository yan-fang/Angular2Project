define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .controller('AddPayeeContactInfoController', AddPayeeContactInfoController);

  AddPayeeContactInfoController.$inject = [
    '$state',
    'USAStateListService',
    '$filter',
    'PayeeService',
    'BillPayErrorHandlerService',
    '$location',
    'BillPayPubSubFactory',
    'BillPayConstants'
  ];

  function AddPayeeContactInfoController(
    $state,
    USAStateListService,
    $filter,
    PayeeService,
    BillPayErrorHandlerService,
    $location,
    BillPayPubSubFactory,
    BillPayConstants
  ) {
    var vm = this;

    angular.extend(this, {
      addressRegex: /^[a-zA-Z0-9. ]+$/,
      zipRegex: BillPayConstants.zipcodeRegex,
      requestInProgress: false,
      fixableErrors: PayeeService.getErrorFields('contactInfo'),

      // The ease-input component does not accept a config object for some reason,
      // so here are ten million things added to the controller just to support it.
      fieldRequired: true,
      phoneLabel: 'Phone',
      phoneId: 'phone-number',
      phoneMaxLength: 10,
      validatePhone: validatePhone,
      phoneObj: {
        placeholder: '(000) 000-0000',
        maxCharMsg: 'Phone Number should be 10 digits',
        validationMsg: 'This is not a valid phone number.' 
      },

      // The following ten million properties are for the ease-ui-dropdown.
      stateListOpen: false,
      stateListRequired: true,
      stateListSelected: stateListSelected,
      stateListComboBox: {
        id: 'state-list',
        placeholder: 'Select State',
        label: 'State',
        errorMessage: 'You must select a state'
      },
      validateState: validateState,

      goBack: goBack,
      stateList: initStateList(),
      stateListItems: initStateList(),
      submit: submit,
      clearError: clearError
    });

    BillPayPubSubFactory.logTrackAnalyticsPageView(
      $location.search().subCategory, 
      'manualAddPayeeAddress'
    );

    /**
     * Used in an ng-change event to remove the field in question from the recoverable
     * error list
     *
     * @param {string} fieldName - error array key to remove
     */
    function clearError(fieldName) {
      var idx = vm.fixableErrors.indexOf(fieldName);

      if (idx !== -1) {
        vm.fixableErrors.splice(idx, 1);
      }
    }

    /**
     * This method is required by the EASE ui phone component. It takes the payee phone number as input
     * and validates that it contains 10 digits, regardless of formatting applied
     *
     * @param {string} phone - The payee phone number. Can be all digits or with formatting applied
     * @returns {bool} - True for valid phone number, false for invalid
     */
    function validatePhone(phone) {
      if (typeof phone === 'undefined') {
        return false;
      }

      phone = phone.replace(/[^0-9\.]+/g, '');
      return phone.length === 10;
    }

    /**
     * Method to take user to the previous view
     */
    function goBack() {
      $state.go('BillPay.addPayee.accountInfo');
    }

    /**
     * Required by the EASE UI dropdown menu component to set the user's selection
     *
     * @param {object} item - The selected state
     * @param {object} payeeInfo - The raw form data
     */
    function stateListSelected(item, payeeInfo) {
      if (typeof(item) === 'object') {
        payeeInfo.AddressInfo.state = item.abbreviation;
      }
    }

    /**
     * Required by the EASE UI dropdown menu component to set the initial list of state values
     */
    function initStateList() {
      return $filter('orderBy')(USAStateListService.states, 'abbreviation');
    }

    /**
     * Required by the EASE UI dropdown to validate the user's selection in the state field.
     *
     * @param {object} payeeInfo - The form data as entered by the user
     * @returns {bool} - True for valid state selection, false for invalid
     */
    function validateState(payeeInfo) {
      if (typeof payeeInfo.AddressInfo === 'undefined'
        || typeof payeeInfo.AddressInfo.state === 'undefined'
        || !payeeInfo.AddressInfo.state) {
        return false;
      }

      return payeeInfo.AddressInfo.state.length === 2;
    }

    /**
     * Submits given information to the payee service / OL. This is only used in the
     * registered payee flow. When called will trigger a loading indicator while the XHR
     * request is in progress. On success will move user to the success view, on error will
     * determine whether a recoverable error has occured and act appropriately. Unrecoverable
     * errors will take user to the 'hit a snag' modal :'‑(
     *
     * @param {object} payeeInfo - Collected form data to send to the OL
     */
    function submit(payeeInfo) {
      if (vm.requestInProgress) {
        return;
      }

      // Show loading animation
      vm.requestInProgress = true;

      PayeeService.addPayee().then(function success(res) {
        payeeInfo.payeeReferenceId = res.payeeReferenceId;
        $state.go('BillPay.addPayee.success');
      }, function error(err) {
        vm.requestInProgress = false;

        if (err.recoverable) {
          vm.fixableErrors = PayeeService.getErrorFields('contactInfo');
          $state.go(err.nextStep);
        } else {
          BillPayErrorHandlerService.handleError(err);
        }
      });
    }
  }
});

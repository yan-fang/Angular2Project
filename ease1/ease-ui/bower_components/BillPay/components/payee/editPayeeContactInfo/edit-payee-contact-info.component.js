define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('editPayeeContactInfo', function() {
    return {
      restrict: 'E',
      scope: {
        payeeService: '=',
        payeeInfo: '=',
        submit: '&',
        showBackButton: '@?',
        back: '&?',
        loading: '@',
        stateList: '=',
        fixableErrors: '=?'
      },
      templateUrl: '/ease-ui/bower_components/BillPay/@@version/' +
                   'components/payee/editPayeeContactInfo/edit-payee-contact-info.component.html',
      controller: editPayeeContactInfoController,
      controllerAs: '$ctrl',
      bindToController: true
    };
  });

  editPayeeContactInfoController.$inject = [
    '$filter',
    '$scope'
  ];

  function editPayeeContactInfoController($filter, $scope) {
    var vm = this;

    angular.extend(this, {
      loading: '',
      inputMatch: true,
      alphaNumericRegex: /^[A-z0-9 .']+$/,
      addressRegex: /^[a-zA-Z0-9. ]+$/,
      zipRegex: /^\d{5}([\-]\d{4}|[\-]____){0,1}$/,
      payeeInfoCache: angular.copy(vm.payeeInfo),
      formChanged: false,

      // The following ten million properties are for the various ease-ui-components
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
      stateList: initStateList(),
      stateListItems: initStateList(),
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

      compareAccountNumbers: compareAccountNumbers,
      clearError: clearError,
      validateChange: validateChange
    });

    init();

    function init() {
      $scope.$watch(function() {
        return !angular.equals(vm.payeeInfo, vm.payeeInfoCache);
      }, function(newVal) {
        vm.formChanged = newVal;
      });
    }

    /**
     * When given two account numbers as input, sets a property on the controller to indicate a
     * success or unsuccessful match. This is used to show errors and enable/disable the submit
     * button
     *
     * @param {string} accountNumberOne - Account number
     * @param {string} accountNumberTwo - Account number confirmation
     */
    function compareAccountNumbers(accountNumberOne, accountNumberTwo) {
      vm.inputMatch = accountNumberOne === accountNumberTwo;
    }

    /**
     * Required by the EASE UI dropdown menu component to set the user's selection
     *
     * @param {object} item - The selected state
     */
    function stateListSelected(item) {
      if (typeof(item) === 'object') {
        vm.payeeInfo.payeeAddress.stateCode = item.abbreviation;
      }
    }

    /**
     * Required by the EASE UI dropdown menu component to set the initial list of state values
     */
    function initStateList() {
      return $filter('orderBy')(vm.stateList, 'abbreviation');
    }

    /**
     * Required by the EASE UI dropdown to validate the user's selection in the state field.
     *
     * @param {object} payeeInfo - The form data as entered by the user
     * @returns {bool} - True for valid state selection, false for invalid
     */
    function validateState() {
      if (typeof vm.payeeInfo.payeeAddress === 'undefined'
        || typeof vm.payeeInfo.payeeAddress.stateCode === 'undefined'
        || !vm.payeeInfo.payeeAddress.stateCode) {
        return false;
      }

      return vm.payeeInfo.payeeAddress.stateCode.length === 2;
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

    function validateChange() {
      vm.formChanged = angular.equals(vm.payeeInfo, vm.payeeInfoCache);
    }
  }
});

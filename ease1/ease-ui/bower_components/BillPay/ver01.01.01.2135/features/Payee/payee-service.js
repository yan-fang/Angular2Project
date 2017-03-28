define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .factory('PayeeService', PayeeService);

  PayeeService.$inject = [
    'EaseConstantFactory',
    '$state',
    '$location',
    'BillPayConstants',
    'Restangular',
    'easeHttpInterceptor',
    'EASEUtilsFactory',
    'PayeeListService',
    '$q'
  ];

  function PayeeService(
    EaseConstantFactory,
    $state,
    $location,
    BillPayConstants,
    Restangular,
    easeHttpInterceptor,
    EASEUtilsFactory,
    PayeeListService,
    $q
  ) {
    var service = {
      getPayee: getPayee,
      setPayee: setPayee,
      supplementPayee: supplementPayee,
      setManualAdd: setManualAdd,
      getManualAdd: getManualAdd,
      generateRequestObject: generateRequestObject,
      generateReqObjEditPayee: generateReqObjEditPayee,
      addPayee: addPayee,
      updatePayee: updatePayee,
      getErrorFields: getErrorFields,
      getNextStep: getNextStep,
      setErrorStatus: setErrorStatus
    };

    var payee,
      manualAdd = false,
      errorStatusCode;

    return service;

    function getPayee() {
      return payee;
    }

    /**
     * Method to add supplementary data to the payee object, as collected from the user in the form
     *
     * @param {object} info - This object will add or overwrite properties in the existing payee info object
     */
    function supplementPayee(info) {
      angular.extend(payee, info);
    }

    /**
     * Setter for the payee info object. Used to set the inital value to be supplemented
     * with the supplementPayee method herein.
     *
     * @param {object} selectedPayee - Initail payee info object as created by the user in the form
     */
    function setPayee(selectedPayee) {
      payee = selectedPayee;
    }

    /**
     * Setter for indicating that the payee is being added as a registered payee or manually.
     *
     * @param {bool} isManualAdd - True to indicate a manual flow, false to indicate registered payee flow
     */
    function setManualAdd(isManualAdd) {
      manualAdd = isManualAdd;
    }

    /**
     * Getter for indicating that the payee is being added as a registered payee or manually
     *
     * @returns {bool} - True for manual flow, false for registered payee flow
     */
    function getManualAdd() {
      return manualAdd;
    }

    /**
     * A map to translate raw payee info into a format necessary for sending to the OL add payee API
     * taking into account whether we are adding a registered payee.
     *
     * @returns {object} Payee info in the format required by the OL
     */
    function generateRequestObject() {
      var requestObject = {
        payeeName: payee.payeeName,
        isAddressOnFile: !manualAdd
      };

      if (typeof payee.nickname !== 'undefined') {
        requestObject.payeeNickname = payee.nickname;
      }

      if (typeof payee.accountNumber !== 'undefined') {
        requestObject.accountNumberTLNPI = payee.accountNumber;
      }

      if (manualAdd) {
        requestObject.payeeAddress = {
          addressLine1: payee.AddressInfo.line1,
          city: payee.AddressInfo.city,
          stateCode: payee.AddressInfo.state,
          postalCode: payee.zipcode.replace(/[^0-9\-]+/g, '')
        };

        if (requestObject.payeeAddress.postalCode.length === 6) {
          requestObject.payeeAddress.postalCode = requestObject.payeeAddress.postalCode.slice(0, 5);
        }

        if (typeof payee.phoneNumber !== 'undefined') {
          requestObject.payeePhoneNumber = payee.phoneNumber.replace(/[^0-9\.]+/g, '');
        }

        if (typeof payee.AddressInfo.line2 !== 'undefined') {
          requestObject.payeeAddress.addressLine2 = payee.AddressInfo.line2;
        }
      } else {
        requestObject.merchantInfo = {
          merchantNumber: payee.merchantNumber
        };

        if (payee.requiresMerchantPostalCode) {
          requestObject.merchantInfo.postalCode = payee.zipcode.replace(/[^0-9\-]+/g, '');

          if (requestObject.merchantInfo.postalCode.length === 6) {
            requestObject.merchantInfo.postalCode = requestObject.merchantInfo.postalCode.slice(0, 5);
          }

          requestObject.merchantInfo.requiresMerchantPostalCode = true;
        } else {
          requestObject.merchantInfo.requiresMerchantPostalCode = false;
        }
      }

      return requestObject;
    }

    /**
     * Makes a request to the OL add payee method. On response from the OL will either resolve a promise
     * or determine if a recoverable error has occurred. Error scenarios result in a rejected promise
     *
     * @returns {promise}
     */
    function addPayee() {
      var addPayeeService = Restangular.all(BillPayConstants.billPayAddPayeeUrl),
        requestObject = generateRequestObject(),
        deferred = $q.defer();

      var headers = {
        EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
        BUS_EVT_ID: BillPayConstants.PAYEE_ADD_EVT_ID
      };

      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      easeHttpInterceptor.setBroadCastEventOnce('BillPay');

      addPayeeService.post(requestObject, '', headers)
        .then(function(data) {
          PayeeListService.updatePayeeList($state.params.accountReferenceId);
          errorStatusCode = null;
          deferred.resolve(data);
        }, function(err) {
          if (BillPayConstants.recoverableErrorCodes.indexOf(err.cause.data.status) !== -1) {
            errorStatusCode = err.cause.data.status;

            deferred.reject({
              status: err.cause.data.status,
              recoverable: true,
              nextStep: getNextStep()
            });
          } else {
            PayeeListService.updatePayeeList($state.params.accountReferenceId);
            err.recoverable = false;
            deferred.reject(err);
          }
        });

      return deferred.promise;
    }

    /**
     * Makes a request to the OL update payee method. On response from the OL will either resolve a promise
     * or determine if a recoverable error has occurred. Error scenarios result in a rejected promise
     *
     * @returns {promise}
     */
    function updatePayee() {
      var updatePayeeService = Restangular.all(BillPayConstants.billPayAddPayeeUrl),
        requestObject = generateReqObjEditPayee(),
        deferred = $q.defer();

      var headers = {
        EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
        BUS_EVT_ID: BillPayConstants.PAYEE_EDIT_EVT_ID
      };

      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      easeHttpInterceptor.setBroadCastEventOnce('BillPay');


      updatePayeeService.customPOST(requestObject, encodeURIComponent(payee.payeeReferenceId), '', headers)
        .then(function(data) {
          PayeeListService.updatePayeeList($state.params.accountReferenceId);
          errorStatusCode = null;
          deferred.resolve(data);
        }, function(err) {
          if (BillPayConstants.recoverableErrorCodes.indexOf(err.cause.data.status) !== -1) {
            errorStatusCode = err.cause.data.status;

            deferred.reject({
              status: err.cause.data.status,
              recoverable: true,
              nextStep: getNextStep()
            });
          } else {
            PayeeListService.updatePayeeList($state.params.accountReferenceId);
            err.recoverable = false;
            deferred.reject(err);
          }
        });

      return deferred.promise;
    }

    function generateReqObjEditPayee() {
      var requestObject = {
        payeeName: payee.payeeName,
        payeeNickname: payee.nickname,
        accountNumberTLNPI: payee.accountNumber,
        payeePhoneNumber: payee.phoneNumber.replace(/[^\d]/g, ''),
        isPayeeAddressModifiable: payee.isPayeeAddressModifiable
      };

      if (payee.isPayeeAddressModifiable) {
        requestObject.payeeAddress = payee.payeeAddress;

        if (typeof payee.payeeAddress.postalCode !== 'undefined') {
          if (payee.payeeAddress.postalCode.replace(/\D+/g, '').length === 5) {
            requestObject.payeeAddress.postalCode = payee.payeeAddress.postalCode.replace(/\D+/g, '');
          } else {
            requestObject.payeeAddress.postalCode = payee.payeeAddress.postalCode.replace(/[^0-9\-]+/g, '');
          }
        }
      }

      return requestObject;
    }

    /**
     * Given an error scenario, returns the earliest view that must be corrected by the user
     *
     * @returns {string} - View to be used with a $state.go
     */
    function getNextStep() {
      switch (errorStatusCode) {
        case '202071':
          if (manualAdd) {
            return 'BillPay.addPayee.contactInfo';
          }

          return 'BillPay.addPayee.accountInfo';

        case '202068':
          return 'BillPay.addPayee.contactInfo';

        case '201842':
          return 'BillPay.addPayee.contactInfo';

        case '202070':
          return 'BillPay.addPayee.accountInfo';

        default:
          return '';
      }
    }

    /**
     * Given an error response from the OL, will translate the error status into
     * an array of form fields that need correction for the specified view
     *
     * @returns {array} Input field names that need user review and correction
     */
    function getErrorFields(view) {
      var fieldsByView = {
        '202071': {
          'accountInfo': (manualAdd ? [] : ['zipcode']),
          'contactInfo': (manualAdd ? ['zipcode'] : []),
          'editManual': ['zipcode']
        },
        '202068': {
          'contactInfo': ['address'],
          'editManual': ['address']
        },
        '201842': {
          'contactInfo': ['address', 'zipcode'],
          'editManual': ['address', 'zipcode']
        },
        '202070': {
          'accountInfo': ['accountNumberOne'],
          'editRegistered': ['accountNumberOne'],
          'editManual': ['accountNumberOne']
        }
      }

      if (!errorStatusCode) {
        return [];
      }

      if (Object.keys(fieldsByView).indexOf(errorStatusCode) === -1) {
        return [];
      }

      return fieldsByView[errorStatusCode][view] || [];
    }

    /**
     * Setter for the error status code received from the OL. Mostly used to expose this property for unit testing
     *
     * @param {string} code - The status property from the OL response to /payee
     */
    function setErrorStatus(code) {
      errorStatusCode = code;
    }
  }
});

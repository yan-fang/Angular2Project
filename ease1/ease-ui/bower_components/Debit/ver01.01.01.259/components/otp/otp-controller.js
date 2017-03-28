define([
  'angular'
], function(angular) {
  'use strict';

  angular.module('DebitModule')
         .controller('DebitOtpController', DebitOtpController);

  DebitOtpController.$inject = [
    '$q',
    '$rootScope',
    '$window',
    '$scope',
    '$state',
    '$stateParams',
    'EaseConstant',
    'debitConstants',
    'DebitLocalization',
    'DebitTemplatePathProvider',
    'DebitOtpServices',
    'DebitOtpTracking',
    'easeHttpInterceptor'];

  function DebitOtpController(
    $q,
    $rootScope,
    $window,
    $scope,
    $state,
    $stateParams,
    EaseConstant,
    debitConstants,
    DebitLocalization,
    DebitTemplatePathProvider,
    DebitOtpServices,
    DebitOtpTracking,
    easeHttpInterceptor) {

    var vm = this;
    var STATES = {
      LOADING: 'LOADING',
      NO_CONTACTS: 'NO_CONTACTS',
      SEND_CODE: 'SEND_CODE',
      ENTER_CODE: 'ENTER_CODE',
      INELIGIBLE: 'INELIGIBLE'
    };

    vm.templatePaths = {
      LOADING: debitConstants.BASE_URL + '/components/partials/_loading.html',
      NO_CONTACTS: DebitTemplatePathProvider.getComponentTemplateUrl('otp', '_no_contacts'),
      SEND_CODE: DebitTemplatePathProvider.getComponentTemplateUrl('otp', '_send_code'),
      ENTER_CODE: DebitTemplatePathProvider.getComponentTemplateUrl('otp', '_enter_code'),
      INELIGIBLE: DebitTemplatePathProvider.getComponentTemplateUrl('otp', '_ineligible')
    };

    vm.i18n = {};
    vm.currentState = STATES.LOADING;
    vm.errors = {};
    vm.models = {
      contactPoint: '',
      pinAuthenticationToken: '',
      otp: ''
    }

    var getErrorType = function(error) {
      return error.indexOf('EXPIRED_PIN') > -1 ? 'EXPIRED_PIN' :
             error.indexOf('INVALID_PIN') > -1 ? 'INVALID_PIN' : 'OTHER';
    }

    var handleError = function(error) {
      if (error.cause.status === 500) {
        $scope.$emit('debitOtp', 'failure');
        return $rootScope.$broadcast('error', EaseConstant.defaultErrorMessage);
      } else if ( /^4\d{2}/.test(error.cause.status) ) {
        vm.models.otp = '';
        vm.submitDisabled = false;

        var errorType = getErrorType(JSON.stringify(error.cause.data));
        vm.errors[errorType] = true;

        if (errorType === 'OTHER') {
          vm.currentState = STATES.INELIGIBLE;
        }
      }
    }

    var selectDefaultContactPoint = function(contactPoints) {
      var phones = contactPoints.smsTLNPI.map(function(phoneNumber) {
        return {type: 'sms', value: phoneNumber}
      });
      var emails = contactPoints.emailTLNPI.map(function(emailAddress) {
        return {type: 'email', value: emailAddress}
      });

      vm.contactPoints = _.union(phones, emails);
      vm.models.contactPoint = {
        type: vm.contactPoints[0].type,
        value: vm.contactPoints[0].value
      }
    }

    vm.startOtp = function(businessEventId) {
      return DebitLocalization.get()
        .then(function(i18n) {
          vm.i18n = i18n.data.debit.otp;
          return DebitOtpServices.getContactPoints(businessEventId);
        }).then(function(contactPoints) {
          if (contactPoints.data.emailTLNPI.length ||
              contactPoints.data.smsTLNPI.length) {
            if ($window.localStorage.getItem('otp') === 'challenger') {
              $window.location.href = DebitOtpServices.challengerRedirect(vm.feature,
                                        $stateParams.ProductName, $stateParams.accountReferenceId);
            } else {
              selectDefaultContactPoint(contactPoints.data);
              vm.currentState = STATES.SEND_CODE;
              DebitOtpTracking.sendOtpPage(vm.feature);
            }
          } else {
            vm.currentState = STATES.NO_CONTACTS;
            DebitOtpTracking.noValidContactsPage();
          }
        }).catch(handleError);
    };

    vm.sendCodeRequested = function() {
      vm.submitDisabled = true;
      DebitOtpTracking.sendOtp();

      easeHttpInterceptor.setBroadCastEventOnce('nope');

      DebitOtpServices.getOtp(vm.models.contactPoint, vm.businessEventId)
        .then(function(results) {
          vm.submitDisabled = false;
          if (results.data) {
            vm.models.pinAuthenticationToken = results.data.pinAuthenticationToken;
            vm.currentState = STATES.ENTER_CODE;
            DebitOtpTracking.enterOtpPage(vm.feature);
            vm.errors = {};
          }
        }).catch(handleError);
    }

    vm.resendCodeRequested = function() {
      vm.currentState = STATES.SEND_CODE;
      DebitOtpTracking.resendOtp();
    }

    vm.skipToEnterCode = function() {
      DebitOtpTracking.alreadyHaveOtp();
      vm.currentState = STATES.ENTER_CODE;
    }

    vm.validateOtp = function() {
      vm.submitDisabled = true;
      vm.errors = {};
      easeHttpInterceptor.setBroadCastEventOnce('nope');

      DebitOtpServices.verifyOtp({
        pinAuthenticationToken : vm.models.pinAuthenticationToken,
        pin : vm.models.otp
      }, vm.businessEventId).then(function() {
        vm.submitDisabled = false;
        vm.currentState = '';
        $scope.$emit('debitOtp', 'success');
      }).catch(handleError);

      DebitOtpTracking.validateOtp();
    }

    vm.init = function(feature, businessEventId) {
      easeHttpInterceptor.setBroadCastEventOnce('nope');

      DebitOtpServices.validateAccess(feature, businessEventId)
        .then(function() {
          $scope.$emit('debitOtp', 'success');
          vm.currentState = '';
        })
        .catch(function() {
          $scope.$emit('debitOtp', 'needed');
          vm.startOtp(businessEventId);
        });
    }

    vm.init(vm.feature, vm.businessEventId);
  }

});

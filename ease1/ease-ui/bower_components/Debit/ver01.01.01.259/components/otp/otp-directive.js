define([
  'angular'
], function(angular) {
  'use strict';

  angular.module('DebitModule')
         .directive('debitOtp', ['DebitTemplatePathProvider', debitOtpDirective]);

  function debitOtpDirective(DebitTemplatePathProvider) {
    return {
      bindToController: true,
      scope: {
        feature: '@',
        businessEventId: '@'
      },
      controller: 'DebitOtpController as otp',
      templateUrl: DebitTemplatePathProvider.getComponentTemplateUrl('otp')
    };
  }
})

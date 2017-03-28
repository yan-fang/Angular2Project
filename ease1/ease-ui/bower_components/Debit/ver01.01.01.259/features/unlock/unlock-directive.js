define([
  'angular'
], function(angular) {
  'use strict';

  angular.module('DebitModule')
         .directive('debitUnlock', ['DebitTemplatePathProvider', debitUnlockDirective]);

  function debitUnlockDirective(DebitTemplatePathProvider) {
    return {
      bindToController: true,
      scope: {
        returnState: '@'
      },
      controller: 'DebitUnlockController as debitUnlock',
      templateUrl: DebitTemplatePathProvider.getFeatureTemplateUrl('unlock')
    };
  }
});

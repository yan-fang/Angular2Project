define([
  'angular'
], function(angular) {
  'use strict';

  angular.module('DebitModule')
         .directive('debitLock', ['DebitTemplatePathProvider', debitLockDirective]);

  function debitLockDirective(DebitTemplatePathProvider) {
    return {
      bindToController: true,
      scope: {
        returnState: '@'
      },
      controller: 'DebitLockController as debitLock',
      templateUrl: DebitTemplatePathProvider.getFeatureTemplateUrl('lock')
    };
  }
});

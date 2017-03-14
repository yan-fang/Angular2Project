define([
  'angular'
], function(angular) {
  'use strict';

  angular.module('DebitModule')
         .directive('debitOrder', ['DebitTemplatePathProvider', debitOrderDirective]);

  function debitOrderDirective(DebitTemplatePathProvider) {
    return {
      bindToController: true,
      scope: {
        returnState: '@'
      },
      controller: 'DebitOrderController as debitOrder',
      templateUrl: DebitTemplatePathProvider.getFeatureTemplateUrl('order')
    };
  }
})

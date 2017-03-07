define([
  'angular', 'compatibilityPdf','pdfjs'
], function(angular) {
  'use strict';
  var statementModule = angular.module('StatementModule', ['EaseProperties', 'easeAppUtils', 'restangular']);
  return statementModule;
});

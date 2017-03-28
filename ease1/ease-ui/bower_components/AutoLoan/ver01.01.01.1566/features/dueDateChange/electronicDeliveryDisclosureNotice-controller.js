define(['angular'],
  function(angular) {
    'use strict';
    var ElectronicDeliveryDisclosureNoticeModule = angular.module('ElectronicDeliveryDisclosureNoticeModule',
      ['ui.router']);
    ElectronicDeliveryDisclosureNoticeModule.controller('ElectronicDeliveryDisclosureNoticeController',
      function($scope, $state, autoLoanModuleService, $window, autoLoanDueDateChangeService) {
        var vm = this;
        vm.i18n = autoLoanModuleService.getI18n();

        vm.openLetter = function() {
          var ddcLetter = autoLoanDueDateChangeService.getDueDateChangeLetter();
          var blob = new Blob([ddcLetter], {type: 'application/pdf'});
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, 'dueDateChangeLetter.pdf');
          } else {
            var fileURL = URL.createObjectURL(blob)
            $window.open(fileURL);
          }
        };

        angular.extend(vm, {
          modalType: 'due-date-change electronic-delivery-disclosure-notice-modal',
          modalClass: 'icon-tiles',
          close: function() {
            $state.go('AutoLoanDetails.transactions.dueDateChangeEDoc');
          }
        });
      });
    return ElectronicDeliveryDisclosureNoticeModule;
  });

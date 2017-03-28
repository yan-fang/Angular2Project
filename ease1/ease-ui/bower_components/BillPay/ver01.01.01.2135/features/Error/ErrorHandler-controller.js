define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .controller('BillPayErrorHandlerController', BillPayErrorHandlerController);

  BillPayErrorHandlerController.$inject = [
    '$state',
    'BillPayErrorHandlerService'
  ];

  function BillPayErrorHandlerController(
    $state,
    BillPayErrorHandlerService
  ) {
    angular.extend(this, {
      modalTitle: 'Oops, we\'ve hit a snag.',
      modalClass: ['modal', 'error-modal'],
      error: BillPayErrorHandlerService.getError(),

      close: closeModal
    });

    function closeModal() {
      $state.go($state.current.parent);
    }
  }
});

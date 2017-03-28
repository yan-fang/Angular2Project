define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('memoInput', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/payment/common/memoInput/memoInput.component.html',
      controller: controller,
      scope: {
        id: '@',
        memo: '=',
        form: '='
      },
      controllerAs: '$ctrl',
      bindToController: true
    }
  });

  controller.$inject = [
    '$timeout'
  ]

  function controller(
    $timeout
  ) {
    var vm = this;

    // Bindable properties
    angular.extend(this, {
      showMemo: vm.memo ? true: false,

      addMemo: addMemo
    });

    function addMemo() {
      vm.showMemo = true;
      $timeout(function() {
        document.getElementById(vm.id + '-memo').focus();
      }, 100);
    }
  }
});

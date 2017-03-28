/**
 * Created by neb699 on 4/26/16.
 */
define(['angular'], function (angular) {
  'use strict';

  angular
      .module('BankModule')
      .directive('transactionMemo', transactionMemo);

  transactionMemo.$inject = ['BankFiles'];
  function transactionMemo(BankFiles) {
    return {
      restrict: 'EA',
      scope: {
        memoLabel: '=',
        memo: '='
      },
      template: '<div ng-include="getTemplate()"></div>',
      link: function(scope) {
        scope.getTemplate = function () {
          if (scope.memo) {
            return BankFiles.getFilePath('features/components/memo/show-memo.html');
          } else {
            return BankFiles.getFilePath('features/components/memo/add-memo.html');
          }
        }
      }
    };
  }
});
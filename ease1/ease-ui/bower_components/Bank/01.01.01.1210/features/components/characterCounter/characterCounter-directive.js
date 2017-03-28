/**
 * Created by neb699 on 7/8/16.
 */
define(['angular'], function(angular) {
  'use strict';

  angular
      .module('BankModule')
      .directive('characterCounter', characterCounterDirective)
      .controller('characterCounterController', characterCounterController);

  characterCounterDirective.$inject = ['BankFiles'];
  function characterCounterDirective(BankFiles) {
    return {
      restrict : 'E',
      replace: true,
      controller : "characterCounterController",
      controllerAs: "vm",
      bindToController: true,
      scope: {
        propertiesToWatch : '=',
        displayToggle : '=',
        maxCount: '=',
        assistiveText: '=',
        isCountNegative: '='
      },
      templateUrl: BankFiles.getFilePath('features/components/characterCounter/characterCounter.html')
    }
  }

  function characterCounterController() {
    var vm = this;
    vm.getRemainingCharacterCount = getRemainingCharacterCount;

    function getRemainingCharacterCount() {
      var remaining = vm.maxCount - getLengthOfInputs(vm.propertiesToWatch);
      vm.isCountNegative = remaining < 0;
      return remaining;
    }

    function getLengthOfInputs(model) {
      return typeof model === 'undefined' ?  0 : getSumOfPropertyLength(model);
    }

    function getSumOfPropertyLength(model) {
      var keys = Object.keys(model);
      var reduceAction = function add(runningSum, currentKey) {
        return runningSum + model[currentKey].toString().length;
      };
      return keys.reduce(reduceAction, 0);
    }
  }
});

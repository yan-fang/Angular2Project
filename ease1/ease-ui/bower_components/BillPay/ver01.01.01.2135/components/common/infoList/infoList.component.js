define(['angular'], function(angular) {
  'use strict';

  /**
   *
   *  !!!!!! DEFECT:
   *  When numberOfRows is equal to infolist length -1,
   *  the component cannot work as we expecting
   * 
   */

  angular.module('BillPayModule').directive('infoList', function() {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/bower_components/BillPay/ver01.01.01.2135/components/' + 
                   'common/infoList/infoList.component.html',
      scope: {
        id: '@',
        info: '=',
        numberOfRows: '@',
        title: '@'
      },
      controller: controller,
      controllerAs: '$ctrl',
      bindToController: true
    };
  });

  controller.$inject = [
    '$scope'
  ];

  function controller($scope) {

    angular.extend(this, {
      showAllItem: showAllItem
    });

    // initalize controller
    $scope.$evalAsync(function() {
      this.numberOfRows = parseInt(this.numberOfRows, 10);
      if (this.numberOfRows === this.info.length-1) {
        this.numberOfRows++;
      }
    }.bind(this));

    function showAllItem() {
      this.numberOfRows = this.info.length;
    }
  }
});
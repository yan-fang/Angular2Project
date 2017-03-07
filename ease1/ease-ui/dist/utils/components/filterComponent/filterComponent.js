define(['angular', 'easeDateRangePicker'], function () {
  'use strict';

  angular.module('filterComponent', ['easeDateRangePicker'])
    .directive('filter', ['$timeout',filterFn])
    .directive('filterButtonBlur',['$timeout',blurFn]);

  function filterFn($scope,$timeout) {
    function filterController($scope,$timeout) {
      var vm = this;
      vm.displayDates = false;
      vm.startDate = null;
      vm.endDate = null;
      vm.dateRangeText = 'Custom Date Range';
      vm.maximumAcceptableDate;
      vm.minimumAcceptableDate;
      vm.selectedStatement;
      vm.minDate;
      vm.showCategory; 
      vm.showStatementLink;
      vm.statement = 'Statement Period';
      vm.dateRangeDisplay = '';
      vm.buttons = {};
      vm.filterButton = false;
      vm.customMenuOptions;
      vm.selectedMenu = {};
      vm.categories;
      vm.categorySelected;
      vm.categoryDisplay=false;

      vm.filterParams = {
        rangeDates : {start:'',end:''},
        searchText : ''
      };

      $scope.$on('menuOptionsAvailable',function(evnt,menuOptions,merge) {
        if (!!merge) {
          if (angular.isArray(menuOptions)) {
            if (!angular.isDefined(vm.customMenuOptions)){
               vm.customMenuOptions = [];
            }
            vm.customMenuOptions = vm.customMenuOptions.concat(menuOptions)
            return;
          }
          angular.extend(vm.customMenuOptions,menuOptions);
        }
        else {
          vm.customMenuOptions = menuOptions;
        }      

        vm.clearCategory();  
      });

      $scope.$watchCollection(angular.bind(vm, function() {
        return [this.startDate, this.endDate]; // `this` IS the `this` above!!
      }), function () {
        vm.selectedStatement = null;
        vm.displayDates = !!vm.startDate || !!vm.endDate? true : false;
      
        if(vm.startDate&&vm.endDate&&vm.startDate!==vm.endDate) {
          vm.dateRangeDisplay = vm.startDate + ' - ' + vm.endDate;
        }
        else {
          vm.startDate ? vm.dateRangeDisplay = vm.endDate = vm.startDate : vm.dateRangeDisplay = vm.startDate = vm.endDate;
        }
        vm.resetMenuSelection();
        vm.filterParams.rangeDates = vm.displayDates ? 
          {start: new Date(vm.startDate), end: new Date(vm.endDate)} : {start: null, end: null};
      });

      vm.handleMenuSelection = function(selectedMenu,clearSearchFilter) {
        vm.hideFilterMenu();
        vm.afterFilterMenuName = selectedMenu;
        if (!!clearSearchFilter){
          vm.filterParams.searchText = "";
        }
        $scope.$emit('onFilterMenuSelect',selectedMenu);
      }

      vm.hideFilterMenu = function() {
        for (var key in vm.buttons) {
        if (!angular.equals(key,'filterButton'))
          vm.buttons[key] = false;
        }
     }
      var getClassName = function(str) {
        return str.replace(/([A-Z])/g, function($1) {return '-'+$1.toLowerCase();}) + '-option' ;
      }

      vm.resetMenuSelection = function(whichButton,afterFilterMenuName){
          vm.afterFilterMenuName = afterFilterMenuName;
          $scope.$emit('onFilterMenuDeselect',whichButton);
      }
      $scope.$on('filteredbyStatement',function(evnt,statementObject) {
        if (!!statementObject) {
          vm.displayDates=true;
          if(vm.customMenuOptions){
            vm.resetMenuSelection('cardsButton','Card');
          }
          vm.clearCategory();
        }
         vm.dateRangeDisplay = '';  
      });

      vm.selectCategory = function(category) {
        vm.categorySelected = category;
        vm.categoryDisplay = true;
        vm.hideFilterMenu();
        $scope.$emit('categorySelected', vm.categorySelected.value);
      };

      vm.clearCategory = function() {
        vm.categoryDisplay = false;
        vm.categorySelected = null;
        $scope.$emit('categoryClear');
      };

      vm.displayToggle = function(whichButton) {
        $timeout(function() {         
          if (typeof vm.buttons[whichButton] === 'undefined') {
            vm.buttons[whichButton] = false;
          }
          
          if (vm.lastClickedButton && 
              vm.lastClickedButton!=='filterButton' &&
              vm.lastClickedButton!== whichButton) { // Hide menu when doubled clicked on it.
              vm.buttons[vm.lastClickedButton] = false;
          }
          vm.lastClickedButton = whichButton;
          vm.buttons[whichButton] = !vm.buttons[whichButton];
          if (vm.buttons[whichButton]) {
             $timeout(function() { 
               if (document.getElementsByClassName(getClassName(whichButton))[0]) {
                    document.getElementsByClassName(getClassName(whichButton))[0].focus();
               }
             },200);          
          }
         },200);
      };

     vm.isFilterVisible = function() {  
        var tmpFilterCard= vm.afterFilterMenuName || '';
        return vm.buttons.filterButton||vm.displayDates||vm.categoryDisplay||(tmpFilterCard && tmpFilterCard.toLowerCase() !== 'card');
      }
   
      vm.selectStatementLink = function(){
          vm.displayToggle('dateButton');
        $scope.$emit('selectStatementLink');

      }

      
      vm.clearDates = function() {
        vm.startDate = null;
        vm.endDate = null;
        vm.displayDates = false;
        vm.selectedStatement=null;
        vm.resetMenuSelection('Date');
      }
    }

    return {
      restrict: 'AE',
      scope : {
        filterParams : '=filterCriteria',
        showStatementLink:'=?',
        selectedStatement:'=?',
        maximumAcceptableDate : '=',
        minimumAcceptableDate : '=',
        customMenuUrl : '=',
        showCategory:'=?',
        categories:'=?'
      },
      templateUrl: '/ease-ui/dist/partials/filter.html',
      bindToController: true,
      controller: ['$scope','$timeout', filterController],
      controllerAs: 'filterCtrl'
    }
  }
  
  function blurFn ($timeout) {
    return {
      restrict: 'A',
      link: function(scope,element,attrs){

        var list_blur_listening = true;
        
        element.bind('keydown', function(evt) {
          list_blur_listening = false;
          if (evt.which === 13 || evt.which === 32) {
            evt.currentTarget.click();
            scope.filterCtrl.hideFilterMenu();
            list_blur_listening = true;
          } else if (evt.which === 27) {
            $timeout(function () { 
              scope.filterCtrl.hideFilterMenu();
           },200);
          }
        });

        element.bind('mousedown', function(evt) {
           list_blur_listening = false;
        });

      }
    }
  }
});
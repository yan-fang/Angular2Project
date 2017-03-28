define(['angular','c1Date', 'easeMultiDateSelector'], function(angular) {
  'use strict';

  angular.module('easeDateRangePicker', ['easeMultiDateSelector'])
    .constant('RANGE_PICKER', {
      'START' : 1,
      'END' : 0,
      'TEMPLATE' : '/ease-ui/dist/partials/dateRangePicker.html',
      'MODAL_TYPE' : 'ease-date-range-modal'
    })
    .directive('dateRangePicker', dateRangeFn);

  function dateRangeFn() {
    function dateRangeCtrl($scope,EaseModalService, RANGE_PICKER,pubsubService,$state,$timeout) {
      var vm = this;
      var currentRange = false;
      var mode = false;
      vm.minDate = vm.minimumAcceptableDate ? new Date(vm.minimumAcceptableDate) :  new Date('1 Jan 1900'); 
      vm.maxDate = vm.maximumAcceptableDate ? new Date(vm.maximumAcceptableDate)  : new Date('31 Dec 2090');
      var currentRangeType = RANGE_PICKER['START'];
      vm.date, vm.startDate, vm.endDate;
      vm.selectedDatesRange = [];
      vm.modalType = RANGE_PICKER['MODAL_TYPE'];
      vm.hasFocus = true;
      vm.startDateBeforeMinDate, vm.endDateAfterMaxDate, vm.startDateAfterMaxDate, vm.endDateBeforeMinDate;
      vm.originalMinDate, vm.originalMaxDate, vm.isFormValid;
      vm.isStartDateInvalid = true;

      $scope.$watchCollection(angular.bind(vm, function() {
        return [this.minimumAcceptableDate, this.maximumAcceptableDate];
      }), function () {
        vm.minDate = vm.minimumAcceptableDate ? new Date(vm.minimumAcceptableDate) :  new Date('1 Jan 1900'); 
        vm.maxDate = vm.maximumAcceptableDate ? new Date(vm.maximumAcceptableDate)  : new Date('31 Dec 2090');
      });
      /**
       * Set the range for either start or end input box
       * @param {dt} dt is the current date selected by user
       * @_currentRange === 1 then set start else set end
       * @_mode === true then set dates manually
       */
      vm.setRange = function(dt) {
        var currentDate = c1Date(dt).format('abbrev').split(' ').slice(1).join(' ');
        !mode ? currentRange ^= true : currentRange = RANGE_PICKER[currentRangeType];
        if (currentRange) {
          vm.startDate = currentDate;
          vm.selectedDatesRange.length = 0;
          vm.endDate = null;
          mode = false;
          vm.hasFocus = false;
          vm.startDateBeforeMinDate = vm.startDateAfterMaxDate = false;
          vm.startDate = _isValidDate(new Date(vm.startDate)) ? vm.startDate : null;
          
          if(vm.startDate!==null) {
             vm.isStartDateInvalid = false;
          }

          $scope.$emit('onStartDateSelect',vm.startDate);
        } else {
          vm.endDate = currentDate;
          if (mode && vm.selectedDatesRange.length > 1) {
            var tempArray = vm.selectedDatesRange.splice(0,2);
            tempArray.pop();
            tempArray.push(new Date(vm.endDate).setHours(0,0,0,0));
            vm.selectedDatesRange = tempArray;
            _buildRange(tempArray);
            mode = false;

          }
          vm.hasFocus = true;
          vm.endDateAfterMaxDate = vm.endDateBeforeMinDate = false;
          vm.isFormValid = true;
          vm.endDate = _isValidDate(new Date(vm.endDate)) ? vm.endDate : null;
          $scope.$emit('onEndDateSelect',vm.endDate);
        }
      }

      vm.setRangeType = function(type) {
        currentRangeType = type;
        switch (currentRangeType) {
        case 'START':
          $scope.$emit('onStartDateReset');
          _resetDatePicker();
          vm.startDate = null;
          vm.endDate = null;
          vm.date = null;
          vm.startDateBeforeMinDate = vm.startDateAfterMaxDate = false;
          vm.isStartDateInvalid = true;
          break;
        case 'END':
          vm.endDate = null;
          vm.endDateAfterMaxDate = vm.endDateBeforeMinDate = false;
          break;
        }
        mode = true;
        vm.isFormValid = (!vm.startDateBeforeMinDate) && (!vm.startDateAfterMaxDate) && (!vm.endDateAfterMaxDate) && (!vm.endDateBeforeMinDate);
      }

      vm.setInputDate = function(dt) {

        if (dt) {

          _isValidDateRange(dt, currentRangeType);
          if (!vm.isFormValid){
            if(!vm.isValidEndDate){
               vm.startDate = _isValidDate(new Date(vm.startDate)) ? vm.startDate : null;
               $scope.$emit('onEndDateReset',vm.startDate);
            }
            return;
          }

          // Push END date to 23:59:59 so can be selected as the same date of START date
          vm.date = currentRangeType === 'END' ? new Date(dt).setHours(23, 59, 59) : dt;
          vm.setRange(c1Date(dt).format('abbrev').split(' ').slice(1).join(' '));
          vm.selectedDatesRange.push(new Date(dt).setHours(0, 0, 0, 0));
          if (vm.selectedDatesRange.length === 2) _buildRange(vm.selectedDatesRange);
        }
        
      }

      vm.openPicker = function() {
        if (!vm.originalMinDate && !vm.originalMaxDate) {
          vm.originalMinDate = vm.minimumAcceptableDate ? new Date(vm.minimumAcceptableDate) : new Date('1 Jan 1900');
          vm.originalMaxDate = vm.maximumAcceptableDate ? new Date(vm.maximumAcceptableDate) : new Date('31 Dec 2090');
        }
        _resetDatePicker();
        EaseModalService({ templateUrl: RANGE_PICKER['TEMPLATE'], controller: vm });
        var currentState = $state.current.name;
        var pubsubLOB = getPubSubLOB(currentState);
        pubsubService.pubsubPageView({
          scDLLevel1: 'ease',
          scDLLevel2: 'account details',
          scDLLevel3: 'filter dates',
          scDLLevel4: '',
          scDLLevel5: '',
          scDLCountry: 'us',
          scDLLanguage: 'english',
          scDLSystem: 'ease_web',
          scDLLOB: pubsubLOB
        });

      function getPubSubLOB(currentState) {
        if (currentState.indexOf('HomeLoans') !== -1) {
          return 'home loans';
        } else if (currentState.indexOf('AutoLoan') !== -1) {
          return 'coaf';
        } else if (currentState.indexOf('CreditCard') !== -1) {
          return 'card';
        } else {
          return '360';
        }
      }

      }

      vm.closeModal = function() {
        vm.startingDate = vm.startDate;
        vm.endingDate = vm.endDate;
        pubsubService.pubsubTrackAnalytics({ name : 'done:button' });

      }
      
      vm.close=function(){
        $scope.$emit('easeDatePickerModalClosed');
      }

      function _buildRange(selectedDates) {
        //This needs to be DRY
        if (selectedDates.length === 2) {
          var tempVal = Math.min.apply(null, selectedDates);
          var maxVal = Math.max.apply(null, selectedDates);
          tempVal = new Date(tempVal).setHours(24);
          while (tempVal < maxVal) {
            vm.selectedDatesRange.push(tempVal);
            // Set a day ahead after pushing to prevent duplicating last date
            tempVal = new Date(tempVal).setHours(24);
          }
        }
      }

      function _isValidDate(dt) {
          return ((dt instanceof Date)  ||  (Object.prototype.toString.call(dt) === '[object Date]'));
      }

      function _resetDatePicker() {
        vm.startDate = null;
        vm.endDate = null;
        vm.selectedDatesRange.length = 0;
        currentRange = false;
        mode = false;
        vm.date = null;
        vm.isStartDateInvalid = true;
        vm.isFormValid = true;
        vm.minDate = vm.minimumAcceptableDate ? new Date(vm.minimumAcceptableDate) :  new Date('1 Jan 1900'); 
        vm.maxDate = vm.maximumAcceptableDate ? new Date(vm.maximumAcceptableDate)  : new Date('31 Dec 2090'); 
        vm.startDateBeforeMinDate = vm.startDateAfterMaxDate = vm.endDateAfterMaxDate = vm.endDateBeforeMinDate = false;
      }

      function _isValidDateRange(dt, rangeType) {
        var newDate = new Date(dt);
        var isValidDate = _isValidDate(newDate);
        var isValid = true ;
        if(!isValidDate && rangeType === 'START'){
          vm.startDateBeforeMinDate = true;
          isValid = false;
        }else if(!isValidDate && rangeType === 'END'){
          vm.endDateAfterMaxDate = true;
          isValid = false;
        }
        if (rangeType === 'START' && isValidDate) {
          vm.startDateBeforeMinDate = !(isValid = newDate >= vm.minDate);
          if (isValid) {            
            vm.startDateAfterMaxDate = !(isValid = newDate <= vm.maxDate);
            vm.isStartDateInvalid = false;
          }
        } else if(rangeType === 'END' && isValidDate) {
          vm.endDateAfterMaxDate = !(isValid = newDate <= vm.maxDate);
          if (isValid)
            vm.endDateBeforeMinDate = !(isValid = newDate >= vm.minDate);
        }
        vm.isValidStartDate = (vm.startDateBeforeMinDate ==false) && (vm.startDateAfterMaxDate == false);
        var endDateElem = document.getElementsByName("end_date")[0];
        if (vm.isValidStartDate && endDateElem.value == '') {
          vm.isStartDateInvalid = false;
          $timeout(function() {
            endDateElem.focus(); 
          }, 0);
        }
        vm.isValidEndDate =  (vm.endDateAfterMaxDate == false) && (vm.endDateBeforeMinDate == false);
        vm.isFormValid = isValid;
      }
    }
    dateRangeCtrl.$inject = ["$scope", "EaseModalService", "RANGE_PICKER", "pubsubService", "$state", "$timeout"];

    function _dateRangeLinker(scope, element, attributes, controller) {
      element.on('click', function() {
        controller.openPicker();
      });
    }

    return{
      restrict: 'A',
      scope: {
        startingDate : '=',
        endingDate : '=',
        maximumAcceptableDate : '=',
        minimumAcceptableDate : '='
      },
      controller: dateRangeCtrl,
      controllerAs: 'rangeCtrl',
      transclude: true,
      bindToController: true,
      link: _dateRangeLinker,
      template: '<a class="hand-pointer">Custom Dates</a>'
    }
  }
});
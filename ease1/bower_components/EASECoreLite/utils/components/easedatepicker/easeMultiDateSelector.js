define(['angular'], function (angular) {
  'use strict'
  angular.module('easeMultiDateSelector', [])
    .config(['$provide', '$injector', function ($provide, $injector) {

      // extending datepicker (access to attributes and app scope through $parent)
      var datepickerDelegate = function ($delegate) {
        var directive = $delegate[0]

        // Override compile
        var link = directive.link

        directive.compile = function () {
          return function (scope, element, attrs, ctrls) {
            link.apply(this, arguments)
            if (!angular.isDefined(attrs.multiSelect)) return
            scope.selectedDates = []
            scope.$parent.$watchCollection(attrs.multiSelect, function (newVal) {
              scope.selectedDates = newVal || []
            })
            var ngModelCtrl = ctrls[1]
            ngModelCtrl.$viewChangeListeners.push(function () {
              var newVal = scope.$parent.$eval(attrs.ngModel)
              if (!newVal)
                return
              var dateVal = newVal.getTime(),
                selectedDates = scope.selectedDates
              // reset range
              if (!selectedDates.length || selectedDates.length > 1)
                return selectedDates.splice(0, selectedDates.length, dateVal)
              selectedDates.push(dateVal)
              var tempVal = Math.min.apply(null, selectedDates)
              var maxVal = Math.max.apply(null, selectedDates)
              // Start on the next day to prevent duplicating the first date
              tempVal = new Date(tempVal).setHours(24)
              while (tempVal < maxVal) {
                selectedDates.push(tempVal)
                // Set a day ahead after pushing to prevent duplicating last date
                tempVal = new Date(tempVal).setHours(24)
              }
            })
          }
        }
        return $delegate
      }
      if ($injector.has('datepickerDirective'))
        $provide.decorator('datepickerDirective', ['$delegate', datepickerDelegate])
      // extending daypicker (access to day and datepicker scope through $parent)
      var daypickerDelegate = function ($delegate, $timeout) {
        var directive = $delegate[0]
        // Override compile
        var link = directive.link
        directive.compile = function () {
          return function (scope, element, attrs, ctrls) {
            link.apply(this, arguments)
            var datepickerCtrl = ctrls[0]
            var ngModelCtrl = ctrls[1]
            // Listen for 'refreshDatepickers' event...
            scope.$on('refreshDatepickers', function refreshView () {
              console.log('refreshed dp')
              datepickerCtrl.activeDate.setYear(1960)
              datepickerCtrl.refreshView()
              $timeout(function () {
                datepickerCtrl.activeDate.setYear(new Date().getFullYear())
                datepickerCtrl.refreshView()
              })
            })

            if (!angular.isDefined(scope.$parent.selectedDates)) return
            var datepickerCtroller = ctrls
            scope.$watch(function () {
              return datepickerCtroller.activeDate.getTime()
            }, update)

            scope.$watch(scope.selectedDates, update)

            function update () {
              angular.forEach(scope.rows, function (row) {
                angular.forEach(row, function (day) {
                  day.selected = scope.selectedDates.indexOf(day.date.setHours(0, 0, 0, 0)) > -1
                  day.isStartDay = day.date.setHours(0, 0, 0, 0) === scope.selectedDates[0]
                  day.isEndDay = day.date.setHours(0, 0, 0, 0) === scope.selectedDates[1]
                  day.isToday = day.date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)

                  // start date = end date
                  if (day.isStartDay && day.isEndDay) {
                    day.customClass = 'td-range'
                    day.displayLabel = ''
                  } else if (day.isStartDay) {
                    day.customClass = 'td-range'
                    day.displayLabel = 'START'
                  } else if (day.isEndDay) {
                    day.customClass = 'td-range'
                    day.displayLabel = 'END'
                  } else if (day.selected && !day.isStartDay && !day.isEndDay) {
                    day.customClass = 'td-selected'
                  } else {
                    day.customClass = ''
                  }
                })
              })
            }
          }
        }
        return $delegate
      }
      if ($injector.has('daypickerDirective'))
        $provide.decorator('daypickerDirective', ['$delegate', '$timeout', daypickerDelegate])
    }])
});
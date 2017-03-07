define(['angular', 'easeDropdownModule'], function(angular) {
  'use strict';

  var easeDropdownModule = angular.module('easeDropdownModule');
  easeDropdownModule.directive('dropdown', ['$document', function($document) {
    var dropdownCloseHandlers = [];

    return {
      restrict: 'AE',
      replace: true,
      scope: {
        datasourceFunction: '&',
        ngModel: '=',
        placeholder: '@',
        widgetId: '=widgetId',
        displayField: '@',
        onSelectFunction: '&',
        selectedItem: '@'
      },
      templateUrl: '/ease-ui/dist/partials/simpleDropdown.html',
      link: function(scope, element) {
        var menuNode = element.find('ul');
        scope.datasource = scope.datasourceFunction();

        if (scope.selectedItem === "true") {
          scope.ngModel = scope.datasource[0];
        }
        scope.close = true;
        scope.open = false;

        var closeDropdown = function() {
          if (scope.open) {
            scope.close = true;
            scope.open = false;
            if (scope.lastFocus) {
              scope.lastFocus.focus();
            }
          }
        };

        var closeDropdownOnClick = function() {
          scope.$evalAsync(function() {
            scope.close = true;
            scope.open = false;
          });
        }

        scope.openDropdown = function(event) {
          if (scope.close) {
            scope.open = true;
            scope.close = false;
            scope.selectedItemIndex = findSelectedItemIndex();
            highlightSelected(scope.selectedItemIndex);
            event.stopPropagation();

            // only one drop down should be opened, close other opened drop downs
            dropdownCloseHandlers.forEach(function(fn) {
              if (fn !== closeDropdownOnClick) {
                fn();
              }
            });
          }
        };

        scope.select = function(item, event) {
          scope.ngModel = item;
          scope.onSelectFunction({ 'item': item, 'event': event });
          closeDropdown();
          event.stopPropagation();
          event.preventDefault();
        };

        var findSelectedItemIndex = function() {
          if (!scope.datasource) {
            return 0;
          }
          for (var i = 0; i < scope.datasource.length; i++) {
            if (angular.equals(scope.ngModel, scope.datasource[i])) {
              return i;
            }
          }
          return 0;
        };

        var highlightSelected = function(index, liElements) {
          if (!liElements) {
            liElements = menuNode.find('li');
          }
          liElements.removeClass('hover-focus');
          angular.element(liElements[index]).addClass('hover-focus');
          if (scope.datasource && scope.datasource.length) {
            angular.element(liElements[index]).find('div')[0].focus();
          }
        };

        var moveFocusItem = function(way) {
          var liElements = menuNode.find('li');
          if (way === 'up') {
            scope.selectedItemIndex -= 1;
          } else if (way === 'down') {
            scope.selectedItemIndex += 1;
          }
          if (scope.selectedItemIndex < 0) {
            scope.selectedItemIndex = liElements.length - 1;
          } else if (scope.selectedItemIndex > liElements.length - 1) {
            scope.selectedItemIndex = 0;
          }
          highlightSelected(scope.selectedItemIndex, liElements);
        };

        element.bind('keydown keypress', function(event) {
          var charCode = event.keyCode || event.which || event.charCode;
          if (scope.open) {
            if (charCode === 27) {
              // escape
              closeDropdown();
            } else if (charCode === 38) {
              // up arrow
              moveFocusItem('up');
            } else if (charCode === 40 || charCode === 9) {
              // down arrow or tab
              moveFocusItem('down');
            } else if (charCode === 32 || charCode === 13) {
              // space or enter
              scope.select(scope.datasource[scope.selectedItemIndex], event);
              if (scope.lastFocus) {
                scope.lastFocus.focus();
              }
            } else {
              return true;
            }
          } else {
            if (charCode === 32 || charCode === 13 || charCode === 40) {
              scope.lastFocus = document.activeElement;
              scope.openDropdown(event);
            } else {
              return true;
            }
          }
          event.stopPropagation();
          event.preventDefault();
          scope.$apply();
          return false;
        });

        $document.on('click', closeDropdownOnClick);
        dropdownCloseHandlers.push(closeDropdownOnClick);
        element.on('$destroy', function() {
          dropdownCloseHandlers = [];
        });

      }
    };
  }]);

  return easeDropdownModule;
});

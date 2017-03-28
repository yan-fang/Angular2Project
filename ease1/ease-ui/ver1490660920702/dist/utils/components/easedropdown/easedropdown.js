define(['angular'], function(angular) {
  'use strict';

  var easeDropdownModule = angular.module('easeDropdownModule', ['EaseProperties', 'pubsubServiceModule',
    'easeAppUtils'
  ]);

  easeDropdownModule.directive('amountPay', ['$document' ,'EASEUtilsFactory', function($document,EASEUtilsFactory) {
    return{
      restrict:'A',
      scope: {
        service: "=" //UmmPaymentFactory
      },
      link: function(scope, element, atts) {
        element.bind('keyup', function() {
          var totalAmount = angular.element($document[0].getElementById('amountId')).text();
          var regex = /\d*\.?\d\d?/g;
          if (this.value.match(/\d*\.\d{1,3}/)) {
            if (this.value.indexOf('.') !== -1) {
              var decimal = this.value.split('.')[1];
              if (parseFloat(decimal) > 0) {
                this.value = (Math.round(this.value * 100) / 100)
              }
            }
            this.value = regex.exec(this.value);
          }
          scope.$emit('EASE_DD_DISPLAY_MSG',scope.service.isOtherAmountValid(this.value));
          var symbol = angular.element(this.nextElementSibling);
          if (this.value !== '') {
            symbol.removeClass('gray');
          }else{
            symbol.addClass('gray');
          }
          var tooltip = "$"+ this.value + " exceeds account balance, if you proceed, transfer money later to avoid overdraft.";
          if (parseFloat(totalAmount) < parseFloat(this.value)) {
            EASEUtilsFactory.DisplayTooltip(true,tooltip);
          } else {
            EASEUtilsFactory.DisplayTooltip(false);
          }
        });

        element.bind('keypress', function(evt) {
          var charCode = (evt.which) ? evt.which : evt.keyCode;
          if (((charCode == 46 || charCode == 8) && this.value.indexOf('.') === -1)
            || (charCode >= 48 && charCode <= 57) ) {
            return true;
          }
          evt.stopPropagation();
          evt.preventDefault();
          return false;
        })

        element.on('$destroy', function() {
          scope.$destroy();
        })
      }
    }
  }])

  easeDropdownModule.directive('easeDropdown',['$document', '$rootScope', 'pubsubService', 'EaseConstant', '$timeout',
    function( $document, $rootScope, pubsubService, EaseConstant, $timeout) {
    return {
      restrict: 'AE',
      templateUrl:'/ease-ui/dist/partials/dropdown.html',
      scope: {
        type:'=',
        localize:'=',
        selectedItem:'=?bindData',
        labelTxt:'=?',
        isValid:'=',
        focus:'=',
        service: '=',
        widgetId: '=',
        labelId: '=',
        noPlaceHolder: '=',
        watchRelatedDd: '=',
        defaultItemIndex: '=',
        lengthItem: '@'
      },
      link: function(scope, element, attrs) {
        attrs.lengthItem = attrs.lengthItem || EaseConstant.kDefaultLengthForDropDownItem
        var label = angular.element(element[0].firstElementChild);
        var box = angular.element(element[0].lastElementChild);
        var allEaseDropdowns = angular.element($document[0].getElementsByTagName('ease-dropdown'));
        if (typeof scope.widgetId === 'undefined') {
          scope.widgetId = scope.type;
        }
        var setSelectedIdx = function() {
          if (typeof scope.noPlaceHolder !== 'undefined' && scope.noPlaceHolder) {
            if (scope.type === 'amountDd') {
              scope.selectedItem = null;
            }
            return false;
          }

          if (typeof scope.defaultItemIndex !== 'undefined') {
            scope.selectedItem = scope.dropdownSelect[scope.defaultItemIndex];
          } else if (scope.service.getSelectedIdx) {
            scope.selectedItem = scope.dropdownSelect[scope.service.getSelectedIdx(scope.widgetId)];
          } else{
            scope.selectedItem = scope.dropdownSelect[0];
          }
        };
        scope.isDropdownOpen = false;
        scope.dropdownSelect =  scope.service.getData(scope.widgetId);
        setSelectedIdx();
        if (scope.dropdownSelect.length === 1) {
          $timeout(function() {
            $rootScope.$broadcast('EASE_DD_ITEM_SELECTED', {
              type: scope.widgetId,
              item: scope.dropdownSelect[0],
              init: true
            });
          }, 100);
        } else {
            $timeout(function() {
              $rootScope.$broadcast('EASE_DD_ITEM_SELECTED', {
                type: scope.widgetId,
                item: scope.selectedItem,
                init: true
              });
            }, 100);
        }
        scope.$watch(scope.service.isDataChanged, function(newVal,oldVal) {
          if (newVal !== oldVal) {
            scope.dropdownSelect = scope.service.getData(scope.widgetId);
            setSelectedIdx();
            $rootScope.$broadcast('EASE_DD_ITEM_SELECTED',
              {type: scope.widgetId, item:scope.selectedItem});
          }
        });
        scope.initWidget = true;
        if (typeof scope.watchRelatedDd !== 'undefined') {
          scope.$watch(scope.service[scope.watchRelatedDd], function() {
            scope.dropdownSelect = scope.service.getData(scope.widgetId);
            setSelectedIdx();
            $rootScope.$broadcast('EASE_DD_ITEM_SELECTED',
              {type: scope.widgetId, item:scope.selectedItem, init: scope.initWidget});
            scope.initWidget = false;
          });
        }else{
          scope.initWidget = false;
        }

        scope.closeDropdown = function(menuNode) {
          if (menuNode === undefined) {
            menuNode = box.find('ul');
          }
          if (menuNode.hasClass('headerslidedown')) {
            menuNode.removeClass('headerslidedown');
            menuNode.addClass('headerslideup');
          }
          scope.isDropdownOpen = false;
        };

        scope.closeAllDropdowns = function() {
          var menuNodes = allEaseDropdowns.find('ul');
          angular.forEach(menuNodes, function(value) {
            var menuNode = angular.element(value);
            if (menuNode.hasClass('headerslidedown')) {
              menuNode.removeClass('headerslidedown');
              menuNode.addClass('headerslideup');
            }
          });
          scope.isDropdownOpen = false;
        };

        scope.openDropdown = function(menuNode) {
          scope.closeAllDropdowns();
          if (typeof scope.labelTxt === 'undefined') {
            scope.labelTxt = '';
          }
          pubsubService.pubsubformfieldClick({formfieldName:scope.labelTxt.toLowerCase()});
          box.find('li').removeClass('hover-focus');
          if (menuNode === undefined) {
            menuNode = box.find('ul');
          }
          if (scope.type === 'amountDd'
              && typeof scope.selectedItem !== 'undefined'
              &&  scope.selectedItem != null
              && scope.selectedItem.type === 'otherAmnt') {
            menuNode.addClass('otherAmntSelected');
          }else{
            menuNode.removeClass('otherAmntSelected');
          }
          menuNode.removeClass('headerslideup');
          menuNode.addClass('headerslidedown');
          scope.isDropdownOpen = true;
        };

        scope.$on('EASE_DD_DISPLAY_MSG', function(e, data) {
          if (!data.init) {
            if (data.success) {
              label.removeClass('hasError');
              box.removeClass('shake');
              box.removeClass('hasError');
              label[0].innerHTML = scope.labelTxt;
              scope.isValid = true;
            }else{
              // label.addClass('hasError');
              // box.addClass('hasError');
              // box.addClass('shake');
              // label[0].innerHTML = scope.labelTxt + ' ' + data.message;
              scope.isValid = false;
            }
          }
        });

        scope.$on('EASE_DD_CLOSE_DROPDOWN', function() {
          scope.closeDropdown();
        });

        element.bind('click', function(evt) {
          var menuNode = box.find('ul');
          if (menuNode.hasClass('headerslideup')) {
            box.removeClass('shake');
            scope.openDropdown(menuNode);
          } else {
            if (scope.isValid) {
              box.removeClass('shake');
            }
            scope.closeDropdown(menuNode);
          }
        });
        scope.itemIdxFocus = 0;
        var moveFocusItem = function(way,charVal) {
          var liElemts = box.find('li');
          liElemts.removeClass('hover-focus');
          if (way === 'up') {
            scope.itemIdxFocus -=1;
          }else if (way==='down' && charVal===13) {
            scope.itemIdxFocus = 1;
          }else if (way === 'down') {
            scope.itemIdxFocus +=1;
          }
          if (scope.itemIdxFocus <= 0) {
            scope.itemIdxFocus =scope.dropdownSelect.length;
          }else if (scope.itemIdxFocus > scope.dropdownSelect.length) {
            scope.itemIdxFocus = 1;
          }
          angular.element(liElemts[scope.itemIdxFocus - 1]).addClass('hover-focus');
          angular.element(liElemts[scope.itemIdxFocus - 1]).find('div')[1].focus();
        };
        var findSelectedItemIdx = function() {
          for(var i=0;i<scope.dropdownSelect.length;i++) {
            var item = scope.dropdownSelect[i];
            if (angular.equals(item, scope.selectedItem)) {
              return i;
            }
          }
        };
        element.bind('keydown', function(evt) {
          var charCode = (evt.which) ? evt.which : evt.keyCode;
          if (scope.isDropdownOpen) {
            if (charCode === 27) {
              scope.closeDropdown();
            }else if (charCode === 38) {
              moveFocusItem('up','');
            }else if (charCode === 40 || charCode === 9) {
              moveFocusItem('down','');
            }else if (charCode === 32 || charCode === 13) {
              scope.selectedItem = scope.dropdownSelect[scope.itemIdxFocus-1];
              $rootScope.$broadcast('EASE_DD_ITEM_SELECTED', {type: scope.widgetId, item:scope.selectedItem});
              scope.closeDropdown();
              scope.lastFocus.focus();
              scope.$apply();
            }
            else{
              return true;
            }
          }else{
            if (charCode === 32 || charCode === 13 || charCode === 40) {
              scope.lastFocus = document.activeElement;
              scope.openDropdown();
              scope.fitemIdxFocus = findSelectedItemIdx();
              if (charCode === 13 || charCode === 32 || charCode === 40) {
                moveFocusItem('down', 13);}
              else{
                moveFocusItem('down','');
              }
            }else{
              return true;
            }
          }
          evt.stopPropagation();
          evt.preventDefault();
          scope.$evalAsync();
          return false;
        });

        element.on('$destroy', function() {
          scope.$destroy();
        })
      }
    };
  }]);

  easeDropdownModule.directive('easeDropdownItemSelected',[function() {
    return {
      restrict: 'AE',
      template: '<div ng-include="getContentUrl"></div>',
      scope:{
        item:'=',
        type:'=',
        service:'=',
        lengthItem:'@'
      },
      link: function(scope, element, attr) {
        scope.getContentUrl = (function() {
          if (['accountDd', 'transferTo', 'transferFrom'].indexOf(scope.type) !== -1) {
            return '/ease-ui/dist/partials/dropdownAccountItem.html';
          }else if (scope.type === 'amountDd') {
            return '/ease-ui/dist/partials/dropdownAmountItem.html';
          }
        })();
        scope.stopPropagation = function(evt) {
          evt.stopPropagation();
          evt.cancelBubble = true;
          return false;
        };
        scope.showSymbol = function() {
          if (scope.type === 'amountDd' && scope.item && scope.item.value.length > 0) {
            return true;
          }else{
            return false;
          }
        };
        scope.showAmount = function() {
          if (scope.amountValue && scope.amountValue !== '') {
            return true;
          }else{
            return false;
          }
        };

        var buildDataItem = function() {
          if (scope.item !== null) {
            scope['amountTypeId'] = scope.item.type;
            scope['amountType'] = scope.localize[scope.item.type];
            scope['amountValue'] = scope.item.value;
          }else{
            scope['amountTypeId'] = '';
            scope['amountType'] = '';
            scope['amountValue'] = '';
          }
        };
        var isOtherSelected = function() {
          var contInput = angular.element(element.find('span')[2]);
          if (typeof scope.amountType !== 'undefined' &&
              ['otherAmnt','principalOnly'].indexOf(scope.amountTypeId) !== -1) {
            scope.$parent.isValid = false;
            contInput.addClass('showInput');
            contInput.removeClass('hideInput');
            var input = element.find('input');
            input[0].focus();
            input[0].value = '';
            scope.formatDollar='gray';
            input.bind('click', function(e) {
              scope.$emit('EASE_DD_CLOSE_DROPDOWN');
            });
            input.bind('blur', function(e) {
              var valueInput = parseFloat(e.currentTarget.value).toFixed(2);
              if (!isNaN(valueInput)) {
                scope.formatDollar='';
                scope.item.value = valueInput;
                e.currentTarget.value = valueInput;
                scope.item = scope.$parent.selectedItem;
              }
              scope.$emit('EASE_DD_DISPLAY_MSG',scope.service.isOtherAmountValid(valueInput));
            });
          }else{
            scope.formatDollar='';
            contInput.removeClass('showInput');
            contInput.addClass('hideInput');
            scope.$emit('EASE_DD_DISPLAY_MSG',{success:true});
          }
        };
        scope['localize'] = scope.$parent.localize;
        scope['accClass'] = 'selectedItem';
        scope['amntClass'] = 'infoSelectedItem hideInput';

        scope.$on('EASE_DD_ITEM_SELECTED', function(e, data) {
          if (data.type === scope.type) {
            scope.item = data.item;
            if (scope.$parent.service.setDropdownValue) {
              scope.$parent.service.setDropdownValue(data.type, data.item);
            }
            if (scope.type === "amountDd") {
              scope.formatDollar='';
              buildDataItem();
              isOtherSelected();
            }else{
              if (scope.item && scope.item.referenceId && scope.item.referenceId.toString() !== '-1') {
                scope.$emit('EASE_DD_DISPLAY_MSG',{
                  success:true,
                  init:((typeof data.init !== 'undefined')? true:false)
                });
              }else{
                scope.$emit('EASE_DD_DISPLAY_MSG',{
                  success:false,
                  init:((typeof data.init !== 'undefined')? true:false)
                });
              }

            }
          }
        });

        if (scope.type === "amountDd") {
          buildDataItem();
          isOtherSelected();
        }

        element.on('$destroy', function() {
          scope.$destroy();
        })
      }
    };
  }]);

  easeDropdownModule.directive('easeDropdownItems', ["$rootScope", function($rootScope) {
    return {
      restrict: 'AE',
      template: '<div ng-include="getContentUrl"></div>',
      scope:{
        item:'=',
        type:'=',
        service:'=',
        idIndex: '@',
        lengthItem:'@'
      },
      link: function(scope, element, attr) {
        scope.getContentUrl = (function() {
          if (['accountDd', 'transferTo', 'transferFrom'].indexOf(scope.type) !== -1) {
            return '/ease-ui/dist/partials/dropdownAccountItem.html';
          }else if (scope.type === 'amountDd') {
            return '/ease-ui/dist/partials/dropdownAmountItem.html';
          }
        })();

        scope['localize'] = scope.$parent.localize;
        scope['accClass'] = 'ddTitle';
        scope['accountNameClass'] = 'accountName';
        scope['amntClass'] = 'ddAmount';
        scope.selectItem = function(item, evt) {
          $rootScope.$broadcast('EASE_DD_ITEM_SELECTED', {type: scope.type, item:item});

        };

        if (scope.type === "amountDd") {
          scope['typeId'] = scope.item.type;
          scope['amountType'] = scope.localize[scope.item.type];
          scope['amountValue'] = scope.item.value;
        }
        scope.showSymbol = function() {
          if (scope['amountValue'].length > 0) {
            return true;
          }else{
            return false;
          }
        };
        scope.showAmount = function() {
          if (scope.amountValue && scope.amountValue !== '') {
            return true;
          }else{
            return false;
          }
        };
        element.on('$destroy', function() {
          scope.$destroy();
        })
      }
    };
  }]);

  easeDropdownModule.directive('clickOutside', ['$document', 'EASEUtilsFactory', function($document, EASEUtilsFactory) {
    return {
      restrict: 'A',
      scope: {
        clickOutside: '&'
      },
      link: function($scope, elem, attr) {
        var classList = (attr.outsideIfNot !== undefined) ? attr.outsideIfNot.replace(', ', ',').split(',') : [];
        if (attr.id !== undefined) classList.push(attr.id);

        $document.on('click', function(e) {
          EASEUtilsFactory.DisplayTooltip(false);
          var i = 0,
            element;

          if (!e.target) return;

          for (element = e.target; element; element = element.parentNode) {
            var id = element.id;
            var classNames = element.className;

            if (id !== undefined) {
              for (i = 0; i < classList.length; i++) {
                if (id.indexOf(classList[i]) > -1 || classNames.indexOf(classList[i]) > -1) {
                  return;
                }
              }
            }
          }

          $scope.$eval($scope.clickOutside);
        });
      }
    };
  }]);

  return easeDropdownModule;
});

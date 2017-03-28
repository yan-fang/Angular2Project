define(['angular'], function(angular) {
  'use strict';
  angular.module('CommonModule', ['EaseProperties']).directive('collapseToggle', function() {
      return {
        restrict: 'A',
        scope: {
          model: '=',
          name: '@',
          element: '@'
        },
        link: function(scope, element, attrs) {
          scope.$watch('model', function(newValue) {
            var element_id = scope.name;
            $(scope.element).collapse('hide');
            $(element_id).collapse('toggle');
          });
        }
      };
    }).directive('initCollapse', function() {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          if (scope.$last) {
            $(scope.toggle.collapseEl).collapse({
              toggle: false
            });
          }
        }
      };
    }).directive('errorMessage', function() {
      return {
        restrict: 'E',
        template: '<div class="error-label" role="alert">{{error}}</div>' +
          '<div class="error-summary" ng-repeat="field in fields" role="alert">' +
          '<p ng-if="field.formControl.$touched && field.formControl.$invalid">{{field.templateOptions.label}} is ' +
          'required.</p></div>',
        scope: {
          error: '@',
          fields: '='
        }
      };
    }).directive('ifImageNotExistDir', function() {
      return {
        restrict: 'A',
        scope: {
          productName: '@',
          page: '@'
        },
        link: function(scope, element, attrs) {
          element.bind('error', function() {
            var eleSpan;
            if (this.parentNode.firstElementChild.nodeName === 'IMG') {
              eleSpan = document.createElement('span');
              this.parentNode.insertBefore(eleSpan, this);
            } else {
              eleSpan = this.parentNode.firstElementChild;
            }
            eleSpan.innerHTML = attrs.productName.trim();
            if (attrs.page === 'AccountSummary' || attrs.page === 'undefined' || attrs.page === undefined) {
              eleSpan.className = 'headerTruncate';
            } else {
              eleSpan.className = 'headerAccDetailTruncate';
            }
            this.style.display = 'none';
          });
        }
      };
    }).directive('brandImage', ["$compile", function($compile) {
      return {
        replace: true,
        restrict: 'EA',
        scope: {
          elementVal: '='
        },
        link: function(scope, element, attrs) {
          var elementVal, headerTruncateLarge, headerTruncateSmall, displayName;
          var elementVal = scope.elementVal;
          var getTemplate = function() {
            var productImageIsAvailable = (typeof elementVal.accountNickname === 'undefined' && !!elementVal.imagePath);
            if (productImageIsAvailable) {
              return ' <img  page="AccountSummary" if-Image-Not-Exist-Dir product-Name="{{elementVal.displayName}}" ng-src="{{elementVal.imagePath}}">'
            } else {
              headerTruncateLarge = elementVal.displayName.length <= 21;
              headerTruncateSmall = elementVal.displayName.length >= 20;
              displayName = elementVal.displayName.length >= 20 ? elementVal.displayName.substring(0, 20) : elementVal.displayName;
              return '<h2 ng-class="{headerTruncateLarge:' + headerTruncateLarge + ',\'headerTruncateSmall\':' +
                headerTruncateSmall + '}">' + displayName + '</h2>';
            }
          };
          var template = getTemplate();
          element.append($compile(template)(scope));
        }
      };
    }])
    // directive used to prevent the paste in textbox
    .directive('noPaste', function() {
      return {
        link: function(scope, ele, attrs) {
          ele.on('paste', function(evt) {
            evt.preventDefault();
          })
        }
      }
    })
    // directive used to restrict number only entry
    .directive('numberOnly', function() {
      return {
        restrict: 'A',
        link: function(scope, element, atts) {
          element.on('keypress', function(evt) {
            var charCode = (typeof evt.which === "number") ? evt.which : evt.keyCode
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
              if (!(evt.metaKey || evt.ctrlKey)) {
                evt.preventDefault();
              }
            } else {
              return true;
            }
          })
        }
      }
    }).directive('autofocus', ['$timeout',
      function($timeout) {
        return {
          restrict: 'A',
          link: function($scope, $element) {
            $timeout(function() {
              $element[0].focus();
            }, 500);
          }
        }
      }
    ]).directive('loadMoreTransactions', function() {
      return {
        restrict: 'E',
        scope: false,
        link: function($scope, $element, $attr) {
          $scope.label = $attr.label;
        },
        template: '<button id ="loadMoreBtn" aria-describedby = {{label}} ' +
        'class ="load-more-transaction-btn">{{label}}</button>'
      }
    }).directive('clickButtonOnce', ["$timeout", function($timeout) {
      var delay = 500;
      return {
        restrict: 'A',
        priority: -1,
        link: function(scope, elem) {
          var disabled = false;

          function onClick(evt) {
            if(evt.keyCode === 9 || evt.keyCode === 16){
              return;
            }
            if (evt.keyCode === 13) {
              elem.triggerHandler('click');
            }
            if (disabled) {
              evt.preventDefault();
              evt.stopImmediatePropagation();
            } else {
              disabled = true;
              $timeout(function() { disabled = false; }, delay, false);
            }
          }
          scope.$on('$destroy', function() { elem.off('click keydown', onClick); });
          elem.on('click keydown', onClick);
        }
      };
    }])
    .directive('validateAmount', ["$document", "EaseConstant", function($document, EaseConstant) {
      return {
        restrict: 'A',
        scope: {
          displaymsg: '&',
          isValid: '=isValid',
          isInstant: '='
        },
        link: function(scope, element) {
          element.bind('keyup', function() {
            var totalAmount = parseFloat(angular.element($document[0].getElementById('amountId'))
              .text().replace(/[^\d.,]/g, ''));
            var value;
            if (this.value.charAt(0) === '$') {
              value = this.value.substr(1, this.value.length);
            } else {
              value = this.value;
            }
            var regex = /\d*\.?\d\d?/g;
            if (value.match(/\d*\.\d{1,3}/)) {
              if (value.indexOf('.') !== -1) {
                var decimal = value.split('.')[1];
                if (parseFloat(decimal) > 0) {
                  this.value = (Math.round(value * 100) / 100);
                }
              }
              this.value = '$' + regex.exec(value);
            }
            if (totalAmount < parseFloat(value) &&
              scope.isInstant ||
              parseFloat(value) > EaseConstant.kTransferAmountUpperBound) {
              element.addClass('shake');
              scope.isValid = false;
              scope.displaymsg({ 'showError': true, 'amount': parseFloat(value), 'availableBalance': totalAmount });
            } else if (parseFloat(value) < EaseConstant.kTransferAmountLowerBound) {
              element.addClass('shake');
              scope.isValid = false;
              scope.displaymsg({ 'showError': true, 'amount': parseFloat(value), 'availableBalance': totalAmount });
            } else if (value === '' || parseInt(value) < 0) {
              this.value = '';
              scope.displaymsg({ 'showError': false, 'amount': parseFloat(value), 'availableBalance': totalAmount });
              scope.isValid = false;
              element.removeClass('shake');
            } else {
              element.removeClass('shake');
              scope.displaymsg({ 'showError': false, 'amount': parseFloat(value), 'availableBalance': totalAmount });
              scope.isValid = true;
            }
          });
          element.bind('keydown', function(evt) {
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if (((charCode === 46 || charCode === 8) && this.value.indexOf('.') === -1) || (charCode >= 48 &&
                charCode <= 57) || (charCode >= 96 && charCode <= 105) || charCode === 9 || charCode === 8 ||
              charCode === 190 || charCode === 110) {
              if (this.value === '') {
                this.value = '$' + this.value;
              }
              return true;
            }
            evt.stopPropagation();
            evt.preventDefault();
            return false;
          });
          element.bind('blur', function() {
            var currentValue;
            if (this.value.charAt(0) === '$') {
              currentValue = this.value.substr(1, this.value.length);
            } else {
              currentValue = this.value;
            }
            if (!isNaN(parseFloat(currentValue).toFixed(2)) &&
              parseFloat(currentValue) >= EaseConstant.kTransferAmountLowerBound) {
              this.value = '$' + parseFloat(currentValue).toFixed(2);
              scope.isValid = true;
            } else {
              this.value = '';
              scope.isValid = false;
              //element.addClass('shake');
              var value = currentValue;
              scope.displaymsg({ 'showError': true, 'amount': parseFloat(value) });
            }
          })
        }
      }
    }])
    .directive('keypressHandler', function() {
      return {
        restrict: 'A',
        link: function(scope, element, attr) {
          element.bind('keypress', function(event) {
            if (event.keyCode === 13) {
              element.triggerHandler('click', function() {});
            }
          })
        }
      }
    });

});

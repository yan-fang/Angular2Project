define(['angular'], function(angular) {
  'use strict';

  var easeTransferDirective = angular.module('TransferModule');

  easeTransferDirective.directive('easeTransferValidation', [function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        isInputValid: '=',
        availableAmount: '@',
        dailyLimit: '@?',
        monthlyLimit: '@?',
        upperBound: '@?',
        texasHelocMinimumAmount: '@?',
        ngModel: '=?',
        isInstantTransfer: '=',
        isExternalTransfer: '='
      },
      link: function(scope, element, attrs, ngModel) {
        if (!ngModel) {
          return;
        }

        var precision = 2,
          value = '',
          isDotEntered = false;

        element.bind('keydown ', function(e) {
          var keyCode = e.keyCode || e.which || e.charCode,
            dotKeyPressed = (keyCode === 190 &&
            (e.shiftKey === false && e.altKey === false && e.ctrlKey === false));

          if (dotKeyPressed) {
            if (isDotEntered) {
              e.preventDefault();
            } else {
              isDotEntered = true;
            }
          }

          // Allow: backspace, delete, tab, escape, enter and .
          if (_.indexOf([46, 8, 9, 27, 13, 110], keyCode) !== -1 ||
            // Allow: Ctrl+A
            (keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right
            (keyCode >= 35 && keyCode <= 39) || dotKeyPressed) {
            // let it happen, don't do anything
            return true;
          }
          /// $parse will not trigger when it is 'space' entered.
          if (keyCode === 32) {
            e.preventDefault();
          }
        });

        ngModel.$parsers.push(function(actualValue) {
          var tmp,
            modifiedValue = actualValue.replace(/[^0-9.]/g, ''),
            inputValueDotIndex = actualValue.indexOf('.');

          if (inputValueDotIndex !== -1) {
            if (inputValueDotIndex !== actualValue.lastIndexOf('.')) {
              modifiedValue = actualValue.substr(0, actualValue.length - 1);
            } else {
              tmp = modifiedValue.split('.');
              tmp[1] = tmp[1].substr(0, precision);
              modifiedValue = [tmp[0], tmp[1]].join('.');
            }
          }

          if (isDotEntered &&
            inputValueDotIndex === -1) {
            isDotEntered = false;
          }

          if (modifiedValue !== actualValue) {
            ngModel.$setViewValue(modifiedValue);
            ngModel.$render();
          }
          return modifiedValue;
        });

        element.bind('blur', function() {
          value = ngModel.$viewValue;
          if (_.isEmpty(value) || value === '0.00' || value === '.') {
            scope.$apply(function() {
              scope.ngModel = '';
            });
          } else if (value % 1 === 0 || value.split('.')[1].length >= 1) {
            scope.$apply(function() {
              scope.ngModel = parseFloat(value).toFixed(2);
            });
          }
        });
        element.bind('dragstart drop', function(e) {
          e.preventDefault();
        });
        var minimun = attrs.min || 0.01;
        ngModel.$validators.easemininumamount = function(value) {
          return (parseFloat(value) >= minimun);
        };
        ngModel.$validators.easemaximumbalance = function(value) {
          return (scope.isInstantTransfer &&
					!!scope.availableAmount && !scope.isExternalTransfer) ?
						(parseFloat(value) <= scope.availableAmount) : true;
        };
        ngModel.$validators.easeremainingdailylimit = function(value) {
          return !!scope.dailyLimit ? parseFloat(value) <= scope.dailyLimit : true;
        };
        ngModel.$validators.easeremainingmonthlylimit = function(value) {
          return !!scope.monthlyLimit ? parseFloat(value) <= scope.monthlyLimit : true;
        };
        ngModel.$validators.max = function(value) {
          return !!scope.upperBound ? parseFloat(value) <= scope.upperBound : true;
        };
        ngModel.$validators.texashelocmin = function(value) {
          return !!scope.texasHelocMinimumAmount ? parseFloat(value) >= scope.texasHelocMinimumAmount : true;
        };
      }
    }
  }]);
  easeTransferDirective.directive('selectOnClick',['$window', function($window) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        element.bind('click', function() {
          if (!$window.getSelection().toString()) {
            this.setSelectionRange(0, this.value.length)
          }
        });
      }
    }
  }]);

  easeTransferDirective.directive('currencyInput', ['$timeout', function($timeout) {
    return {
      restrict: 'E',
      templateUrl: '/ease-ui/dist/features/Transfer/html/currencyInput.html',
      scope: {
        amount: '=',
        label: '@',
        lowerBound: '@',
        upperBound: '@',
        lowerBoundError: '@',
        upperBoundError: '@',
        texasHelocError: '@',
        isInputValid: '=',
        availableAmount: '=',
        exceedError: '@',
        dailyLimitError: '@',
        monthlyLimitError: '@',
        currencyIcon: '@',
        placeholder: '@',
        dailyLimitRemainingMessage: '@?',
        helocMinimumWithdrawalLabel: '@?',
        dailyLimitRemainingAmount: '=?',
        monthlyLimitRemainingAmount: '=?',
        helocMinimumAmount: '=?',
        showRemainingLimit: '=',
        transferTo: '=',
        submitted: '=',
        isAmountEmpty: '=',
        texasHelocMinimumAmount: '=?',
        isDisabled: '=?',
        tooltipNotice: '@',
        tooltipMonthlyLimit: '@',
        errorMessage: '=',
        isInstantTransfer: '=',
        isExternalTransfer: '='
      },
      link: function(scope, element) {
        var form = scope.inputForm;
        scope.amount = (scope.amount && scope.amount !== '0.00') ? scope.amount : '';
        scope.checkErrors = function() {
          if (scope.errorMessage) {
            scope.errorMessage = false;
          }
          if (_.isEmpty(form.$error) && form.$valid) {
            scope.isInputValid = true;
          } else {
            scope.isInputValid = false;
          }
          if (form.$error.required || scope.amount==='' || parseFloat(scope.amount) === 0) {
            scope.isAmountEmpty = true;
          } else {
            scope.isAmountEmpty = false;
          }
        };
        scope.$on('TRANSFER-DD-CHANGED', function() {
          scope.inputForm.txtTransferAmount.$validate();
          scope.checkErrors();
        });
        scope.$watch('amount', function() {
          scope.checkErrors();
        });
        scope.$watchCollection(function getValue() {
          return [scope.submitted];
        }, function collectionChanged(newValue) {
          if (newValue && newValue[0]) {
            $timeout(function() {
              var errorContainer = element[0].getElementsByClassName('amtExceed');
              if (errorContainer && errorContainer.length) {
                errorContainer[0].children[0].focus();
              }
            });
          }
        });
      }
    }
  }]);
	easeTransferDirective.directive('focusInput', function () {
		return {
			restrict: 'A',
			scope: {
				focusInput: '='
			},
			link: function ($scope, element) {
				if ($scope.focusInput) {
					element[0].focus();
				} else {
					return false;
				}
			}
		};
	});

  /* Directive to resolve issue with JAWS 17 reading pre-compiled variables;
   Used in currency-input.html, instead of ng-if;
   https://github.com/angular/angular.js/issues/11466
   */
  easeTransferDirective.directive('transferJawsIf', ['$animate', '$timeout', function($animate, $timeout) {
    return {
      multiElement: true,
      transclude: 'element',
      restrict: 'A',
      link: function($scope, $element, $attr, ctrl, $transclude) {
        var block, childScope, previousElements;
        $scope.$watch($attr.transferJawsIf, function transferIfWatchAction(value) {
          if (value) {
            if (!childScope) {
              $transclude(function(clone, newScope) {
                childScope = newScope;
                clone[clone.length++] = document.createComment(' end transferJawsIf: ' + $attr.transferJawsIf + ' ');
                block = {
                  clone: clone
                };
                $timeout(function() {
                  $animate.enter(clone, $element.parent(), $element);
                }, 1);
              });
            }
          } else {
            if (previousElements) {
              previousElements.remove();
              previousElements = null;
            }
            if (childScope) {
              childScope.$destroy();
              childScope = null;
            }
            if (block) {
              previousElements = block.clone;
              block = null;
              $timeout(function() {
                $animate.leave(previousElements).then(function() {
                  previousElements = null;
                });
              }, 1);
            }
          }
        });
      }
    };
  }]);
});

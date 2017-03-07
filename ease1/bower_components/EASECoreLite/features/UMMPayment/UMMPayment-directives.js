define(['angular'], function (angular) {
  'use strict';
  var UMMPaymentDirective = angular.module('UMMPaymentModule');

  UMMPaymentDirective.directive('addacctCompareTo', function () {
    return {
      require: "ngModel",
      scope: {
        otherModelValue: "=addacctCompareTo"
      },
      link: function (scope, element, attributes, ngModel) {
        ngModel.$validators.addacctCompareTo = function (modelValue) {
          if (modelValue) {
            return modelValue == scope.otherModelValue;
          }
          return false;
        };

        scope.$watch("otherModelValue", function () {
          ngModel.$validate();
        });
      }
    };
  });

  UMMPaymentDirective.directive('getBankDetails', function (UmmPaymentFactory) {
    return {
      link: function (scope, ele, attrs) {
        ele.on('blur', function (evt) {
          var regex = new RegExp('^[0-9]+$');
          scope.bankDetails;
          var bankName = scope.bankName;
          if(evt.target.value && evt.target.value.length === 9 && regex.test(evt.target.value)) {
            if( evt.target.value !== scope.extPay.abaNumber.$$lastCommittedViewValue) {
            UmmPaymentFactory.getBankDetails(evt.target.value).then(function (data) {
              if(data.easeDisplayError && data.easeDisplayError.displayMessage) {
                scope.extPay.abaNumber.$invalid = true;
                scope.extPay.abaNumber.$pristine = false;
                scope.extPay.abaNumber.$dirty = true;
                scope.extPay.abaNumber.$valid = false;
                scope.bankName = '';
              } else {
                scope.bankName = data.bankName;
                UmmPaymentFactory.setBankName(data.bankName);
              }
            }, function (ex) {
              scope.bankName = '';
            })}
            else{
              scope.bankName = bankName;
            }
          } else {
            scope.bankName = '';
          }
        })
      }
    }
  });

  //this function is making sync of two texboxes border same
  // and going to remove this after design change
  UMMPaymentDirective.directive('highlightTextbox', function () {
    return {
      restrict: 'A',
      require: "ngModel",
      link: function (scope, element, atts, ngModel) {
        var abaNumber = document.getElementById('abaNumber');
        var bankName = document.getElementById('bankName');
        var validator = ngModel.$validators;
        element.on('focus', function (evt) {
          if(evt.target.name === 'abaNumber') {
            if (ngModel.$invalid && !ngModel.$pristine) {
              angular.element(bankName).addClass('inputError');
            } else {
              angular.element(bankName).removeClass('inputError');
              angular.element(bankName).addClass('inputBorder');
            }
          } else if(evt.target.name === 'bankName') {
            if (scope.extPay.abaNumber.$invalid && !scope.extPay.abaNumber.$pristine) {
              angular.element(abaNumber).addClass('inputError');
            } else {
              angular.element(abaNumber).removeClass('inputError');
              angular.element(abaNumber).addClass('inputBorder');
            }
          }
        })
        element.on('blur', function (evt) {
          if(evt.target.name === 'abaNumber') {
            if (ngModel.$valid && ngModel.$pristine) {
            } else {
              angular.element(bankName).removeClass('inputBorder');
            }
          } else if(evt.target.name === 'bankName') {
            if (scope.extPay.abaNumber.$invalid && !scope.extPay.abaNumber.$pristine) {
            } else {
              angular.element(abaNumber).removeClass('inputBorder');
            }
          }
        })
      }
    }
  })

  return UMMPaymentDirective;
})

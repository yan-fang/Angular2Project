define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').directive('inputMask', inputMaskDirective);

  function inputMaskDirective() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function($scope, $element, attrs, ngModelCtrl) {
        var el = $element[0],
          cursorPosition = 0,
          cursorDirection = 'POSITIVE',
          currentEntry = '',
          characterEscaped = false,
          previousValue = '',
          doCleanMerge = false,
          mask = '',
          maskInfo = {
            specialCharsNo:0,
            pos:[2,5],
            neg:[3,6]
          };

        //initialize:
        switch (attrs.inputMask) {
          case 'dob':
            mask = '__/__/____';
            maskInfo = {
              pos: [2,5],
              neg: [3,6],
              regex: /[\d_][\d_]\/[\d_][\d_]\/[\d_][\d_][\d_][\d_]/
            };

            break;
          case 'phone':
            mask = '(___) ___-____';
            maskInfo = {
              pos: [0,4,5,9],
              neg: [1,5,6,10],
              regex: /\([\d_][\d_][\d_]\) [\d_][\d_][\d_]-[\d_][\d_][\d_][\d_]/
            };

            break;
          case 'zipcode':
            mask = '_____';
            maskInfo = {
              pos: [5],
              neg: [6],
              regex: /[\d_][\d_][\d_][\d_][\d_]/
            };

            break;
          case 'zipcode-plus':
            mask = '_____-____';
            maskInfo = {
              pos: [5],
              neg: [6],
              regex: /^\d{5}([\-]\d{4}){0,1}$/
            };

            break;
          case 'ssn':
            mask = '___-__-____';
            maskInfo = {
              pos: [3,6],
              neg: [4,7],
              regex: /[\d_][\d_][\d_]-[\d_][\d_]-[\d_][\d_][\d_][\d_]/
            };

            break;

          default:
            throw 'Invalid mask specified';
        }

        var formattedVal = mask;

        //Handling events:
        $element.on('paste', function(e) {
          var pastedContent = handlePaste(e);

          if (e.preventDefault) {
            e.stopPropagation();
            e.preventDefault();
          }

          if (pastedContent !== null) {
            cleanMerge(pastedContent);
            ngModelCtrl.$setViewValue(formattedVal);
            ngModelCtrl.$render();
          }
        });

        $element.on('blur', function() {
          if (ngModelCtrl.$viewValue === mask) {
            ngModelCtrl.$setViewValue('');
            ngModelCtrl.$render();
          }
        });

        //extracts special chars and their positions
        function calChangeLevel(viewValue) {
          var pureCurrent = viewValue.replace(/[^\d]/g, '');
          var purePrevious = previousValue.replace(/[^\d]/g, '');

          if (Math.abs(purePrevious.length-pureCurrent.length) > 1) {
            doCleanMerge = true;
          } else {
            doCleanMerge = false;
          }
        }

        function calculateDirection(viewValue) {
          if (viewValue.length && viewValue.length!==1 && viewValue.length< mask.length) {
            cursorDirection = 'NEGATIVE';
            //something is deleted at the index cursorPosition
          } else {
            cursorDirection = 'POSITIVE';
          }
        }

        function calSetCursorPosition() {
          var cursorBeforeChange = cursorPosition;

          if (cursorDirection === 'NEGATIVE') {
            if (maskInfo.neg.indexOf(cursorPosition) !== -1) {
              cursorPosition = cursorPosition - 1;
            }
          } else {
            if (maskInfo.pos.indexOf(cursorPosition) !== -1) { //escaping the default chars like /, ( , )
              if (!characterEscaped) {
                cursorPosition = cursorPosition + 1;
              }
            }
          }

          if (formattedVal.indexOf('_') !== -1 && cursorDirection === 'POSITIVE') {
            setCaretPosition(formattedVal.indexOf('_'), el);
          } else {
            if (!characterEscaped) {
              setCaretPosition(cursorPosition, el);
            } else {
              setCaretPosition(cursorBeforeChange -1, el);
            }
          }
        }

        function captureEntry(viewValue) {
          currentEntry = viewValue.charAt(cursorPosition - 1);
        }

        function format(viewValue) {
          calChangeLevel(viewValue);
          characterEscaped = false;
          captureEntry(viewValue);
          calculateDirection(viewValue);

          if (doCleanMerge) {
            cleanMerge(viewValue);
          } else {
            if (cursorDirection === 'POSITIVE') {
              if (
                /[\d]/g.test(currentEntry)
                && viewValue
                && viewValue.length <= mask.length + 1
                && cursorPosition !== (mask.length + 1)
              ) {
                if (maskInfo.neg.indexOf(cursorPosition) === -1) {
                  formattedVal = formattedVal.replaceAt(cursorPosition - 1, currentEntry);
                } else {
                  formattedVal = formattedVal.replaceAt(cursorPosition, currentEntry);
                }
                characterEscaped = false;
              } else {
                characterEscaped = true;
              }
            } else {
              if (maskInfo.pos.indexOf(cursorPosition) === -1) {
                formattedVal = viewValue.insertAt(cursorPosition, '_');
              }
            }

            if (!maskInfo.regex.test(formattedVal) || (!ngModelCtrl.$isEmpty(viewValue) && formattedVal === mask)) {
              cleanMerge(viewValue);
            }
          }
        }

        function cleanMerge(viewValue) {
          formattedVal = mask;
          var pureDigits = viewValue.replace(/[^\d]/g, '');
          if (pureDigits && pureDigits.length) {
            for (var j = 0; j < pureDigits.length; j++) {
              if (formattedVal && formattedVal.indexOf('_') !== -1) {
                formattedVal = formattedVal.replace(/_/, pureDigits.charAt(j));
              }
            }
          }
        }

        ngModelCtrl.$parsers.unshift(function(viewValue) {
          cursorPosition = getCaretPosition(el);
          if (!ngModelCtrl.$isEmpty(viewValue)) {
            if (viewValue !== formattedVal) {
              format(viewValue);
              ngModelCtrl.$setViewValue(formattedVal);
              ngModelCtrl.$render();
            }

            calSetCursorPosition();
            previousValue = formattedVal;

            return formattedVal;
          } else {
            formattedVal = mask;
            return viewValue;
          }

        });

        String.prototype.insertAt = function(index, string) {
          return this.substr(0, index) + string + this.substr(index);
        };

        String.prototype.replaceAt = function(index, character) {
          return this.substr(0, index) + character + this.substr(index+character.length);
        };

        function handlePaste(e) {
          var pastedContent = null;

          // Dig down to the original paste event
          if (typeof e.originalEvent !== 'undefined') {
            e = e.originalEvent;
          }

          if (e && e.clipboardData && e.clipboardData.getData) {
            if (/text\/html/.test(e.clipboardData.types)) {
              pastedContent = e.clipboardData.getData('text/html');
            } else if (/text\/plain/.test(e.clipboardData.types)) {
              pastedContent = e.clipboardData.getData('text/plain');
            } else if (typeof e.clipboardData.getData !== 'undefined') {
              pastedContent = e.clipboardData.getData('Text');
            } else {
              pastedContent = null;
            }
          } else {
            pastedContent = null;
          }

          return pastedContent;
        }

        //util functions
        function setCaretPosition(caretPos, el) {
          if (el !== null) {
            if (el.createTextRange) {
              var range = el.createTextRange();
              range.move('character', caretPos);
              range.select();
              return true;
            } else {
              if (el.selectionStart || el.selectionStart === 0) {
                el.focus();
                el.setSelectionRange(caretPos, caretPos);

                return true;
              } else {
                el.focus();
                return false;
              }
            }
          }
        }

        function getCaretPosition(input) {
          var caretPos;
          // Internet Explorer Caret Position (TextArea)
          if (document.selection && document.selection.createRange) {
            var range = document.selection.createRange();
            var bookmark = range.getBookmark();
            caretPos = bookmark.charCodeAt(2) - 2;
          } else {
            // Firefox Caret Position (TextArea)
            if (input.setSelectionRange) {
              caretPos = input.selectionStart;
            }
          }

          return caretPos;
        }
      }
    };
  }
});

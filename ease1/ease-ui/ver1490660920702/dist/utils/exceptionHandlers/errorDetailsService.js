define(['angular'], function(angular) {
  'use strict';

  function EaseException() {
    this.attributes = {};
    var attr = {};
    var err = new Error();
    var that = this;

    if (arguments[0]) {
      this.attributes = arguments[0];
      attr = this.attributes;
      for (var index in attr) {
        if (typeof attr[index] !== 'undefined') {
          that[index] = attr[index];
        }
      }
    }

    if (err.stack) {
      // remove one stack level:
      if (typeof(Components) !== 'undefined') {
        // Mozilla:
        this.stack = err.stack.substring(err.stack.indexOf('\n') + 1);
      } else if (typeof(chrome) !== 'undefined' || typeof(process) !== 'undefined') {
        // Google Chrome/Node.js:
        this.stack = err.stack.replace(/\n[^\n]*/, '');
      } else {
        this.stack = err.stack;
      }
    }

    if (typeof this.fileName === 'undefined') {
      this.fileName = err.fileName;
    }

    if (typeof this.lineNumber === 'undefined') {
      this.lineNumber = err.lineNumber;
    }

    if (typeof this.message === 'undefined') {
      this.message = err.message;
    }
  }

  EaseException.prototype = new Error() || Object.create(Error.prototype);
  EaseException.prototype.constructor = EaseException;
  EaseException.prototype.name = 'EaseException';
  EaseException.prototype.toString = function() {
    return 'Error in function ' + this.function +' at module ' + this.module + ' : ' + this.message;
  };

  var easeExceptionsModule = angular.module('EaseExceptionsModule', [])
    .factory('easeExceptionsService', ['$rootScope', '$log', '$document', '$injector',
      function($rootScope, $log, $document, $injector) {
        return {
          createEaseException: function(opt) {
            var myException = new EaseException(opt);
            return myException
          },
          stopSpinner: function() {
            var EaseConstant = $injector.get('EaseConstant');
            var spinners=['loading','formatLoading','loadingModal'];
            spinners.forEach(function(spin) {
              angular.element(document.querySelector('.' + spin)).removeClass(spin);
            });
            EaseConstant.isEnableActionButton = true;
          },
          displayErrorHadler : function(errorMsgheader, errorMsgbody) {
            var EASEUtilsFactory = $injector.get('EASEUtilsFactory');
            $rootScope.$broadcast('error',
              {
                msgHeader : errorMsgheader ? errorMsgheader : EASEUtilsFactory.getAccSummaryI18().errorSnag.snagHeader,
                msgBody : errorMsgbody ? errorMsgbody : EASEUtilsFactory.getAccSummaryI18().errorSnag.snagBody
              });
          }
        };
      }
    ]).config(['$provide',
      function($provide) {
        $provide.decorator('$exceptionHandler', ['$delegate', '$injector',
          function($delegate, $injector) {
            return function(exception, cause) {
              var service = $injector.get('easeExceptionsService'),
                state = $injector.get('$state');
              console.log(exception, cause);
              service.stopSpinner();
              // TODO: Currently code base is not at a place to turn on aggressive exception handling
              // state.go('accountSummary.error', {}, {reload: true});
            };
          }
        ]);
      }
    ]);

  return easeExceptionsModule;
});

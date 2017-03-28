'use strict';
define(['angular', 'errorDetailsService'], function(angular) {

  return angular.module('EaseExceptionsModule')
  .factory('easeHttpInterceptor', ['$q', 'easeExceptionsService', '$rootScope', '$injector',
    'EaseConstant', '$window', 'LogOutLinks', 'pubsubService', '_', 'languagePreferencesFactory', '$timeout',
    function($q, easeExceptionsService, $rootScope, $injector, easeConstant, $window, LogOutLinks, pubsubService, _,
      languagePreferencesFactory, $timeout) {
      var defaultErrorMessage = easeConstant.defaultErrorMessage,
        deniedErrorMessage = easeConstant.deniedErrorMessage, eventToConsume;

      var broadCastEvent = function(messageObj) {
        var message = messageObj || defaultErrorMessage;
        var eventName =  eventToConsume || 'error';
        $rootScope.$broadcast(eventName, message);
        //after the custome event was broadcasted, the eventToConsume is reset to null
        // making the snag modal error window as default for http errors.
        if (eventName === eventToConsume) {
          eventName = null;
        }
      };

      // if client would want to override, only for one time, the default error event and avoid
      // snag modal error window for http errors, it should call this function before
      // the http user call is executed
      var setBroadCastEvent = function (value){
        eventToConsume = value;
      };

      return {
        // add a call to this method in the finally or success callback function of the promise
        resetBroadCastEvent: function (){
          eventToConsume = null;
        },
        //call this method with a event you'd like to broadcast, by default is error event
        setBroadCastEventOnce: setBroadCastEvent,

        request: function(config) {
          config.headers = _.extend(config.headers, {
            'Accept-Language': languagePreferencesFactory.currentLocale,
            'c1-card-accept-language': languagePreferencesFactory.currentLocale
          });
          return config;
        },

        responseError: function(rejection) {
          var statusCode = rejection.status || null;
          var attributes = {
            'module': 'EaseExceptionsModule',
            'function': 'easeHttpInterceptor',
            'config': rejection.config || null,
            'statusCode': statusCode + '',
            'statusMessage': rejection.statusText || null,
            'cause': rejection || null
          };
          var qException = easeExceptionsService.createEaseException(attributes);
          var state = $injector.get('$state');
          if (!(state.current.name !== '' && (/[a-zA-Z]+\/prefetch/.test(attributes.config.url)))) {
            easeExceptionsService.stopSpinner();
            if (rejection.status === 403) {
              broadCastEvent(deniedErrorMessage);
              state.go('logout', {}, {
                location:false
              });
            }
            else if (rejection.status === 0) {
              //Redirect User to Logout If connection status is blocked or disconnected
              $window.location.href = LogOutLinks.eSICUrl;
            } else if (state.current.name !== '' && typeof rejection.status !== 'undefined' &&
                (/[a-zA-Z]+\/content/.test(attributes.config.url))) {
              //do nothing
            } else if (state.current.name !== '' && rejection.status !== 401) {
              if (!rejection.config.url.includes(easeConstant.kCacheRefresh)) {
                broadCastEvent(defaultErrorMessage);
              }
            }
          }
          return $q.reject(qException);
        },
        response: function(response) {
          if (typeof response.data === 'object') {
            response.data.isDisplayData = true;
            if (response.data.easeDisplayError) {
              var state = $injector.get('$state');
              if (response.data.easeDisplayError.severity === '1') {
                if(response.data.easeDisplayError.errorIdString == '200006' ||
                        response.data.easeDisplayError.errorIdString == '201933') {
                          $timeout(function() {
                            state.go('logout', {}, {
                              location: false
                            });
                  }, 5000)
                }
                easeExceptionsService.stopSpinner();
                  $rootScope.$broadcast('error', {
                    msgHeader: response.data.easeDisplayError.headerMessage,
                    msgBody: response.data.easeDisplayError.displayMessage
                  });
                  response.data.isDisplayData = false;
              } else if (response.data.easeDisplayError.severity === '2') {
                if(response.data.easeDisplayError.errorIdString == '200900') {
                  var errorObj = {};
                  errorObj.value = response.data.easeDisplayError;
                  state.go(easeConstant.states.kEscid, errorObj);
                }
              }
            }
          }
          return response;
        }
      };

    }
  ])
  .config(['$httpProvider',
    function httpFn($httpProvider) {

      //https://github.com/arasatasaygin/is.js/blob/master/is.js#L530
      var userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';

      //https://github.com/angular/angular.js/blob/v1.3.13/src/Angular.js#L185
      var msie = document.documentMode;

      if (/edge/i.test(userAgent) || msie){
        //http://stackoverflow.com/questions/16971831/better-way-to-prevent-ie-cache-in-angularjs#answer-23682047
        if (!$httpProvider.defaults.headers.get) {
          $httpProvider.defaults.headers.get = {};
        }

        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Thu, 01 Jan 1970 00:00:00 GMT';
        // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
      }

      $httpProvider.interceptors.push('easeHttpInterceptor');
    }
  ]);
});

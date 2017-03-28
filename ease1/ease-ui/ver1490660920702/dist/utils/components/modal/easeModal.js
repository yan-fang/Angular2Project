define(['angular'], function () {
  'use strict';
  var EaseModalService = angular.module('EaseModalModule',[])
    .factory('EaseModalService', ['$document', '$compile', '$rootScope', '$timeout',
      function ($document, $compile, $rootScope,  $timeout) {

        var body = $document.find('body'), scope;
        return function Dialog(templateUrl/*optional*/, options, passedInLocals) {
          var lastFormElement = null;
          var firstFormElement = null;
          var pageContent = $document[0].getElementById('page-content');

          /* attrElem = 'lastElementChild' or 'firstElementChild'*/
          var findElementChild = function(elem, attrElem){
            if (typeof elem !== 'undefined'){
              if (elem[attrElem] !== undefined && elem[attrElem] != null ){
                if (elem[attrElem].className === 'form-container'){
                  return findElementChild(elem[attrElem],'lastElementChild');
                }else if (elem[attrElem].className !== undefined && elem[attrElem].className.indexOf('easeDdContainer') !== -1){
                  return elem['firstElementChild'];
                } else {
                  return findElementChild(elem[attrElem],attrElem);
                }
              } else {
                return elem;
              }
            }
          };

          // Handle arguments if optional template isn't provided.
          if(angular.isObject(templateUrl)){
            passedInLocals = options;
            options = templateUrl;
          } else {
            options.templateUrl = templateUrl;
          }

          var modalBody = (function(){
            if(options.template){
              if(angular.isString(options.template)){
                return '<div class="modal hidden clip generic">' + options.template + '</div>';
              } else {
                return '<div class="modal hidden clip generic">' + options.template.html() + '</div>';
              }
            } else {
              return '<div data-ng-include="\'' + options.templateUrl + '\'"></div>'
            }
          })();

          var modalEl = angular.element(
            '<div>' +
            modalBody +
            '</div>');

          var closeFn = function () {
            modalEl.removeClass('fade');
            if (pageContent) {
              pageContent.setAttribute('aria-hidden', 'false');
            }
            $timeout(function(){
              modalEl.remove();
            }, 300)
          };

          if (options.scope){
            scope = options.scope
          }else{
            scope = $rootScope.$new();
            //bind your controller object here
            options.hasOwnProperty('controller') ? scope.controller = options.controller : angular.noop();
          };

          scope.$modalCancel = function () {
            if(scope.hasOwnProperty('controller')) {
              scope.controller.closeModal();
            }
            closeFn.call(this);
          };

          $rootScope.$on('logout', function () {
            closeFn();
          });

          $compile(modalEl)(scope);
          body.append(modalEl);
          if (pageContent) {
            pageContent.setAttribute('aria-hidden', 'true');
          }

          $timeout(function() {
            if (firstFormElement == null){
              firstFormElement = findElementChild(modalEl.find('form')[0], 'firstElementChild');
            }

            if(firstFormElement) {
              firstFormElement.focus();
            }
          }, 200);

          $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams){
            if(toState.name !== fromState.name){
              closeFn();
            }
          });
        };
      }])
      .directive('easeModal', ['$document', '$timeout',
        function($document, $timeout) {
          return {
            restrict: 'A',
            transclude: true,
            scope: {
              modalRole: '=?',
              modalType: '=',
              modalClass: '=',
              focusId: '=',
              initClose: '=',
              toggleClose: '&',
              deleteModal: '=',
              isBlur: '=?',
              modalLoadingClass: '=?'
            },
            link: function(scope, element) {
              scope.focusId = scope.focusId || 'closeModal';
              $timeout(function() {
                scope.lastFocus = document.activeElement;
                scope.on = true;
                $timeout(function() {
                 element[0].getElementsByClassName('close-dialog')[0].focus();
                }, 100);
              }, 100);

              scope.$watch('initClose', function() {
                if(scope.initClose) {
                  scope.closeModal();
                }
              });

              scope.$watch('deleteModal', function() {
                if(scope.deleteModal) {
                  $timeout(function () {
                    element.remove();
                  }, 200)
                }
              });

              // [TODO][SD] Bring back the focus This is not working
              scope.closeModal = function() {
                scope.on = !scope.on;
                var ev = new CustomEvent('easeUiModalClose');
                dispatchEvent(ev);
                // if(typeof scope.focusId !== 'undefined' && scope.focusId !== '') {
                //   document.getElementById(scope.focusId).focus();
                // }
                // document.body.className = '';
                scope.toggleClose();
                if(scope.lastFocus){
                  scope.lastFocus.focus();
                }
              };

              var shiftTabPress = false;

              element.on('keydown', function(event) {
                if(event.which === 27) {
                  scope.$apply(function() {
                    scope.closeModal();
                  });
                  element.off('keydown');
                  event.preventDefault();
                }

                if(event.which === 9 && !event.shiftKey ) {
                  shiftTabPress = false;
                  angular.element(element[0].getElementsByClassName('modalEnd')[0]).on('focus',function(){
                      if(!shiftTabPress){
                       element[0].getElementsByClassName('close-dialog')[0].focus();
                      }
                  });
                }

                if (event.which === 9 && event.shiftKey) {
                  shiftTabPress = true;

                  if(element[0].getElementsByClassName('close-dialog')[0] === event.target){
                    event.preventDefault();
                    element[0].getElementsByClassName('modalEnd')[0].focus();
                  }
                }
              });
            },
            templateUrl: '/ease-ui/dist/partials/open-modal.html'
          }
      }]);
  return EaseModalService;
});

define(['angular'], function(angular) {
  'use strict';
  var stModule = angular.module('StatementModule');

  stModule.directive('easePdfViewer', ['$compile', 'pdfDelegate', 'EaseConstant',
    function($compile, pdfDelegate, EaseConstant) {

      var linker = function(scope, element, attrs) {
        if (!angular.isNumber(scope.scale)) {
          scope.scale = EaseConstant.kDefaultPdfScale;
        }
        scope.loading = false;
        if(scope.pdfUrl) {
        var template = pdfDelegate.getTemplate(element, scope.pdfUrl, scope.scale, scope.headers);
        template.then(function(template) {
          element.html(template);
          $compile(element.contents())(scope);
          var totalCanvas = element.children().length;
          return totalCanvas;
        }).then(function(totalCanvas) {
          for (var i = 1; i <= totalCanvas; i++) {
            pdfDelegate.renderPage(i);
          }
        });
        } else {
        	pdfDelegate.initializeTemplate(element, scope.scale);
        }

        if (scope.accessor) {
          scope.accessor.renderPdf = function(template) {
            element.html(template);
            $compile(element.contents())(scope);
            var totalCanvas = element.children().length;
            for (var i = 1; i <= totalCanvas; i++) {
              pdfDelegate.renderPage(i);
            }
            scope.loading = false;
            return;
          };
        }
      };

      return {
        restrict: 'AE',
        link: linker,
        scope: {
          pdfUrl: '=',
          scale: '=',
          accessor: '=',
          loading: '=',
          headers: '='
        }
      };
    }
  ]);

  stModule.directive('tabThrough', function(){
      function lastTab(elm) {
        return angular.element(elm.children()[elm.children().length-1]);
      };
      return {
          restrict: 'A',
          scope: true,
          link: function(scope, element, attribute) {
            var modal = angular.element(document.getElementById(attribute.id));
            var totalTabsInModal = modal.children().length;
            var lastModalTab = lastTab(modal); //modal.children()[totalTabsInModal -1];
            var $first = angular.element(document.querySelector('.close-dialog'));

            element.bind('keydown', function(evt){
              //This is not reliable
              if(evt.keyCode === 9 && !evt.shiftKey && lastTab(lastModalTab)[0].getAttribute('id') === evt.target.getAttribute('id')) {
                if($first && $first.length === 1) {
                  evt.preventDefault();
                  $first[0].focus();
                }
              }
              if(evt.shitKey && evt.keyCode === 9) {
                evt.preventDefault();
              }
            })
          }
        };
  });

  stModule.directive('closeMonthPicker', function($document, $parse, EASEUtilsFactory){
    return {
      restrict: 'A',
      link: function(scope, element, attribute, controller) {
        $document.on("click", function(event){
          //Check if event is not null and undefined
          var _containerElement = ['statementPicker', 'header', 'stTitle', 'head', 'picker-icon', 'icon-drop-arrow', 'slide', 'prev-year', 'year-label', 'next-year', 'icon-prev', 'icon-next'];
          if(!!event && typeof(event) !== undefined ) {
            var clickedElm = event.target.getAttribute('class');
            var clickedElementClass = clickedElm ? clickedElm.split(' ')[0] : null;
          }
          var amIPicker = _.include(_containerElement, clickedElementClass);
          if(!amIPicker) {
            if(!scope.stCtrl.toggle) {
              scope.$apply(function(){
                scope.stCtrl.toggle = !scope.stCtrl.toggle;
              })
            }
          }
        });
      }
    }
  })
  return stModule;
});

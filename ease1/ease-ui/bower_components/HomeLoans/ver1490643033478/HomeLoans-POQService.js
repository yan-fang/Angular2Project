define(['angular'], function (angular) {
  'use strict';
  var payOffQuoteModule = angular.module('PayOffQuoteModule');
  payOffQuoteModule.factory('PayOffQuoteService', ['EaseConstant', 'EASEUtilsFactory', '$q',
    'Restangular', 'EaseConstantFactory', 'easeExceptionsService', 'homeLoansAccountDetailsService',
    function(EaseConstant, EASEUtilsFactory, $q,
             Restangular, EaseConstantFactory, easeExceptionsService, homeLoansAccountDetailsService ) {
      var that = this;

      return {

        getPayOffQuote: function(data) {
          var deferred = $q.defer();
          var payOffQuoteDate = data.payOffQuoteDate;
          var payOffQuoteURL = homeLoansAccountDetailsService.getPayOffQuoteURL(encodeURIComponent(data.accountRefId), payOffQuoteDate);
          var request = '';
          var headers = homeLoansAccountDetailsService.getPayOffQuoteHeaders();

          payOffQuoteURL.get('', {}, headers).then(function(data) {
            deferred.resolve(data);
          }, function(ex) {
            var error = easeExceptionsService.createEaseException({
              'module': 'PayOffQuoteModule',
              'function': 'PayOffQuoteService.getPayOffQuote',
              'fileName': 'HomeLoans-POQService.js',
              'lineNumber': 56,
              'message': ex.statusText,
              'cause': ex
            });
            deferred.reject(error);
          });
          return deferred.promise;
        }

      };
    }
  ]);

  payOffQuoteModule.factory('payOffQuotePdfDelegate', ['$q', 'EaseConstant', 'homeLoansAccountDetailsService','easeExceptionsService', function($q, EaseConstant, homeLoansAccountDetailsService,easeExceptionsService) {
    var that = this,
      pdfDoc, container, scale,
      numPages, totalPdfSize, payOffQuotePDFData;

    var loadingPdf = function loadingPdf(data) {
      console.log('Loading PDF ....');
      totalPdfSize = data.total;
      if (data.loaded >= data.total) {
        that.container.removeClass('spinner');
      }
      that.container.removeClass('spinner');
    };

    return {

      zoomIn: function zoomIn() {
        var lstCanvas = that.container.children();
        var scale = parseFloat(that.scale) + 0.1;
        scale = (scale >= 3.1) ? 3.1 : scale;
        this.getScaledTemplate(scale);
        return scale;
      },

      zoomOut: function zoomOut() {
        var lstCanvas = that.container.children();
        var scale = parseFloat(that.scale) - 0.1;
        scale = (scale <= 0.5) ? 0.5 : scale;
        this.getScaledTemplate(scale);
        return scale;
      },

      print: function() {},

      download: function download() {},

      payOffQuoteSuccess: function() {
        return function(data) {
          var deferred = $q.defer();
          console.log('data.eAPIResponse.context ==' + data.eAPIResponse.context);
          payOffQuotePDFData =  data.eAPIResponse.context.entity;

        };

      },

      payOffQuoteFailed: function() {
        return function(data) {
        };
      },

      getTemplate: function getTemplate(container, url, scale) {
        var deferred = $q.defer();
        var payOffQuotePDFData = '';
        that.scale = scale;
        that.container = container;
        var payOffQuoteRequest = null;

        var template = this.getPdf(url).then(function(data) {
          deferred.resolve(data);
        });

        return deferred.promise;
      },

      getScaledTemplate: function(newScale) {
        that.scale = newScale;
        for (var i = 1; i <= that.numPages; i++) {
          this.renderPage(i, true);
        }
      },

      getPdf: function getPdf(url) {
        console.log('url == ' + url);
        var deferred = $q.defer();
        var templateDiv = '';
        if (typeof url === 'undefined') {
          url = EaseConstant.kDefaultPdfUrl;
        }
        that.container.addClass('spinner');
        var pdfUrl = {'url': url, 'httpHeaders' : homeLoansAccountDetailsService.getPayOffQuoteHeaders()};
        PDFJS.getDocument(pdfUrl, null, null, loadingPdf)
          .then(function(pdfDocument) {
            that.pdfDoc = pdfDocument;
            that.numPages = pdfDocument.numPages;
            return pdfDocument;
          }
        ,
        function(ex) {
          deferred.reject(ex);
          throw easeExceptionsService.createEaseException({
            'module': 'PayOffQuoteModule',
            'function': 'PayOffQuoteService.getPayOffQuote',
            'fileName': 'HomeLoans-POQService.js',
            'lineNumber': 137,
            'message': ex.statusText,
            'cause': ex
          });
        }
     )
          .then(function(pdfDocument) {
            pdfDocument.getPage(1)
              .then(function(page) {
                var viewport = page.getViewport(that.scale);
                return viewport;
              }
                ,
                function(ex) {
                  deferred.reject(ex);
                  throw easeExceptionsService.createEaseException({
                    'module': 'PayOffQuoteModule',
                    'function': 'PayOffQuoteService.getPayOffQuote',
                    'fileName': 'HomeLoans-POQService.js',
                    'lineNumber': 156,
                    'message': ex.statusText,
                    'cause': ex
                  });
                }
              )
              .then(function(viewport) {
                for (var i = 1; i <= that.numPages; i++) {
                  templateDiv = templateDiv + '<canvas class="easePdfPage" id="pdfPage' + i +
                  '" data-pagenum="' + i + '" height="' + viewport.height + '" width="' + viewport.width +
                  '"></canvas>';
                }
                return templateDiv;
              }).then(function(templateDiv) {
                deferred.resolve(templateDiv);
              }
              ,   function(ex) {
                deferred.reject(ex);
                throw easeExceptionsService.createEaseException({
                  'module': 'PayOffQuoteModule',
                  'function': 'PayOffQuoteService.getPayOffQuote',
                  'fileName': 'HomeLoans-POQService.js',
                  'lineNumber': 178,
                  'message': ex.statusText,
                  'cause': ex
                });
              }
           );
          });
        return deferred.promise;
      },

      renderPage: function(pagenum, zoOrZi) {
        var zoomInOrZoomOur = zoOrZi || false;
        that.pdfDoc.getPage(pagenum).then(function(page) {
          var viewport = page.getViewport(that.scale);
          var canvas = document.getElementById('pdfPage' + page.pageNumber);
          if (zoomInOrZoomOur && !canvas.classList.contains('pdfFit')) {
            canvas.classList.add('pdfFit');
          }
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          page.render({
            canvasContext: canvas.getContext('2d'),
            viewport: viewport
          });
        });
      }
    };
  }]);

  payOffQuoteModule.directive('hlEasePdfViewer', ['$compile', 'payOffQuotePdfDelegate', 'EaseConstant',
    function($compile, payOffQuotePdfDelegate, EaseConstant) {

      var linker = function(scope, element, attrs) {
        if (!angular.isNumber(scope.scale)) {
          scope.scale = EaseConstant.kDefaultPdfScale;
        }
        scope.loading = true;
        var template = payOffQuotePdfDelegate.getTemplate(element, scope.pdfUrl, scope.scale);

        template.then(function(template) {
          element.html(template);
          $compile(element.contents())(scope);
          var totalCanvas = element.children().length;
          return totalCanvas;
        }).then(function(totalCanvas) {
          for (var i = 1; i <= totalCanvas; i++) {
            payOffQuotePdfDelegate.renderPage(i);
          }
        });

        if (scope.accessor) {
          scope.accessor.renderPdf = function(template) {
            element.html(template);
            $compile(element.contents())(scope);
            var totalCanvas = element.children().length;
            for (var i = 1; i <= totalCanvas; i++) {
              payOffQuotePdfDelegate.renderPage(i);
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
          loading: '='
        }
      };
    }
  ]);


  payOffQuoteModule.directive('hlTabThrough', function(){
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

  //payOffQuoteModule.directive('closeMonthPicker', function($document, $parse, EASEUtilsFactory){
  //  return {
  //    restrict: 'A',
  //    link: function(scope, element, attribute, controller) {
  //      $document.on("click", function(event){
  //        //Check if event is not null and undefined
  //        var _containerElement = ['statementPicker', 'header', 'stTitle', 'head', 'picker-icon', 'icon-drop-arrow', 'slide', 'prev-year', 'year-label', 'next-year', 'icon-prev', 'icon-next'];
  //        if(!!event && typeof(event) !== undefined ) {
  //          var clickedElm = event.target.getAttribute('class');
  //          var clickedElementClass = clickedElm ? clickedElm.split(' ')[0] : null;
  //        }
  //        var amIPicker = _.include(_containerElement, clickedElementClass);
  //        if(!amIPicker) {
  //          if(!scope.stCtrl.toggle) {
  //            scope.$apply(function(){
  //              scope.stCtrl.toggle = !scope.stCtrl.toggle;
  //            })
  //          }
  //        }
  //      });
  //    }
  //  }
  //})
});


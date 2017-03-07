define(['angular'], function(angular) {
  'use strict';

  var stModule = angular.module('StatementModule');

  stModule.factory('StatementService', ['EaseConstant', 'EASEUtilsFactory', '$q',
    'Restangular', 'EaseConstantFactory', 'easeExceptionsService',
    function(EaseConstant, EASEUtilsFactory, $q,
      Restangular, EaseConstantFactory, easeExceptionsService) {
      var that = this;

      this.getStatementUrl = function(data) {
        var accountRefId = data.accountRefId;
        var statementRefId = encodeURIComponent(data.statementReferenceId);
        var url = data.lob + '/' + accountRefId + '/statement/' + statementRefId;
        if (data.isAdaStatement) {
          url = url + '/ada';
        }
        return url;
      };

      return {

        getListStaments: function(info, pYear) {
          var getCall, accountRefId = info.accountRefId,
            deferred = $q.defer(),
            url = info.lob + '/' + accountRefId + '/statements',
            getLstStatements = Restangular.all(url);

          if (pYear) {
            getCall = getLstStatements.get(pYear);
          } else {
            getCall = getLstStatements.get('');
          }
          getCall.then(function(data) {
            deferred.resolve(data);
          }, function(ex) {
            var error = easeExceptionsService.createEaseException({
              'module': 'StatementModule',
              'function': 'StatementService.getListStaments',
              'fileName': 'Statement-service.js',
              'lineNumber': 35,
              'message': ex.statusText,
              'cause': ex
            });
            deferred.resolve(error);
          });

          return deferred.promise;
        },

        getStatement: function(data) {
          var deferred = $q.defer();
          var url = that.getStatementUrl(data);
          var getStatement = Restangular.all(url);
          getStatement.get('').then(function(data) {
            deferred.resolve(data);
          }, function(ex) {
            var error = easeExceptionsService.createEaseException({
              'module': 'StatementModule',
              'function': 'StatementService.getStatement',
              'fileName': 'Statement-service.js',
              'lineNumber': 56,
              'message': ex.statusText,
              'cause': ex
            });
            deferred.reject(error);
          });

          return deferred.promise;
        },

        getLatestStatement: function(statement) {
          return statement.filter(function(value) {
            return value.available === true;
          }).sort(function(statement_a, statement_b) {
            if (Number(statement_a.index) > Number(statement_b.index)) {
              return -1;
            } else {
              return 1;
            }
          });
        }
      };
    }
  ]);

  stModule.factory('pdfDelegate', ['$q', 'EaseConstant', function($q, EaseConstant) {
    var that = this,
      pdfDoc, container, scale,
      numPages, totalPdfSize;

    var loadingPdf = function loadingPdf(data) {
      console.log('Loading PDF ....');
      totalPdfSize = data.total;
      if (data.loaded >= data.total) {
        //that.container.removeClass('spinner');
      }
      console.log(data);
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

      print: function print() {},

      download: function download() {},

      getTemplate: function getTemplate(container, url, scale, headers) {
        var deferred = $q.defer();
        that.scale = scale;
        that.container = container;
        var template = this.getPdf(url, headers).then(function(data) {
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

      initializeTemplate: function getTemplate(container, scale) {
          that.scale = scale;
          that.container = container;
      },
      resetPdfScale : function() {
          that.scale = EaseConstant.kDefaultPdfScale;
      },

      getPdf: function getPdf(url, headers) {
        var deferred = $q.defer();
        var templateDiv = '';
        if (typeof url === 'undefined') {
          url = EaseConstant.kDefaultPdfUrl;
        }
        var pdfSrc = {'url' : url, 'httpHeaders' : headers};
        //that.container.addClass('spinner');
        PDFJS.getDocument(pdfSrc, null, null, loadingPdf)
          .then(function(pdfDocument) {
            that.pdfDoc = pdfDocument;
            that.numPages = pdfDocument.numPages;
            return pdfDocument;
          }, function(ex){
             deferred.reject();
           })
          .then(function(pdfDocument) {
            if(pdfDocument){
            pdfDocument.getPage(1)
              .then(function(page) {
                var viewport = page.getViewport(that.scale);
                return viewport;
              })
              .then(function(viewport) {
                for (var i = 1; i <= that.numPages; i++) {
                  templateDiv = templateDiv + '<canvas class="easePdfPage" id="pdfPage' + i +
                    '" data-pagenum="' + i + '" height="' + viewport.height + '" width="' + viewport.width +
                    '"></canvas>';
                }
                return templateDiv;
              }).then(function(templateDiv) {
                deferred.resolve(templateDiv);
              });
            }
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
});

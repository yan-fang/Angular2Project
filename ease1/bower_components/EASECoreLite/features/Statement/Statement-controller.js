define([
  'angular', 'easeModal'
], function(angular) {
  'use strict';
  var statementModule = angular.module('StatementModule');

  statementModule.controller('statementController', ['$scope', '$state', '$window', 'accountDetailsData', 'stCategory',
   'lstStatementData', 'StatementService', 'pdfDelegate', 'EaseLocalizeService', 'EASEUtilsFactory',
   'easeExceptionsService', 'EaseConstant', function($scope, $state, $window, accountDetailsData, stCategory,
    lstStatementData, statementService, pdfDelegate, EaseLocalizeService, EASEUtilsFactory, easeExceptionsService,
    EaseConstant) {
      $scope.init = function() {
        vm.lineOfBusiness = EASEUtilsFactory.getLOB(vm.category);
        if (vm.totalStatements > 0) {
          //showing latest statement
          vm.currentStatement = statementService.getLatestStatement(vm.lstStatements)[0];
          if (vm.currentStatement) {
            vm.statementYear = getCurrentYear(vm.currentStatement.statementYear);
            getStatement();
          } else {
            vm.statementYear = new Date().getFullYear();
          }
        }
      };

      var vm = this;
      //Private Functions
      function cleanUp() {
        vm.file = null;
        vm.pdfUrl = null;
        vm.currentIdx = 0;
        vm.currentStatement = {};
      }

      function getListStatements() {
        var info = {
          'lob': vm.currentStatement.lob,
          'accountRefId': vm.currentStatement.accountRefId
        };
        statementService.getListStaments(info, vm.statementYear).then(function(data) {
          vm.lstStatements = data.lstStatements;
        });
      }

      function getCurrentYear(pYear) {
        if (pYear && pYear.length === 4) {
          return Number(pYear);
        } else {
          throw easeExceptionsService.createEaseException({
            'module': 'StatementModule',
            'function': 'statementController.getCurrentYear(year)',
            'message': 'The current year shouldnt be null && lenght ==  4 digits',
            'fileName': 'Statement-controller.js',
            'lineNumber': 46
          });
        }
      }

      function settingMessageError(pIsError) {
        var isError = pIsError || true;
        if (isError) {
          vm.message.title = vm.i18n.messageErrorTitle;
          vm.message.content = vm.i18n.messageErrorContent;
        } else {
          vm.message.title = vm.i18n.noStatementsTitle;
          vm.message.content = vm.i18n.noStatementsContent;
        }
        vm.showMessage = true;
      }

      function getStatement() {
        if (!vm.currentStatement) {
          vm.reset();
          return;
        } else {
          var statement = angular.extend(vm.currentStatement, {
            'lob': vm.lob(),
            'accountRefId': accountDetailsData.accountRefId || accountDetailsData.accountDetails.referenceId,
            'isAdaStatement': vm.isAdaStatement
          });

          statementService.getStatement(statement).then(function(data) {
            vm.pdfUrl = data.url;
            vm.isLoading = true;
            vm.delegate.getPdf(vm.pdfUrl, false).then(function(template) {
              if (vm.accessor.renderPdf) {
                vm.accessor.renderPdf(template);
              }
            });
            vm.currentIdx = vm.lstStatements.indexOf(vm.currentStatement);
            vm.isServiceWorking = true;
          }, function(error) {
            vm.isServiceWorking = false;
            settingMessageError(true);
            vm.delegate.load('/ease-ui' + EaseConstant.kBuildVersionPath + '/dist/file/NotFound.pdf');
            throw error;
          });
        }
      }

      //Get the data from the service
      EaseLocalizeService.get('statements').then(function(response) {
        vm.i18n = response;
        if (vm.isServiceWorking && vm.totalStatements === 0) {
          settingMessageError(false);
        } else if (!vm.isServiceWorking) {
          settingMessageError(true);
        } else {
          vm.showMessage = false;
        }
      }, function(error) {
        vm.isServiceWorking = false;
        throw easeExceptionsService.createEaseException({
          'module': 'StatementModule',
          'function': 'statementController',
          'fileName': 'Statement-controller.js',
          'lineNumber': 17,
          'message': 'getting data for I18N : ' + error.statusText,
          'cause': error
        });
      });

      //Extend properties
      angular.extend(vm, {
        currentIdx: 0,
        file: {},
        pdfUrl: '',
        httpHeaders:{},
        initClose: false,
        modalType: 'statementPane',
        modalClass: '',
        opened: false,
        on: true,
        toggle: true,
        currentStatement: {},
        delegate: pdfDelegate,
        scalePdf: EaseConstant.kDefaultPdfScale,
        accessor: {},
        isLoading: false,
        isServiceWorking: false,
        accountDetailsData: (typeof accountDetailsData !== 'undefined') ? accountDetailsData.accountDetails : {},
        category: stCategory.toUpperCase(),
        message: {},
        showMessage: false,
        templateCalendar: '/ease-ui/dist/features/Statement/html/partials/Statement-calendar.html',
        lstStatements: lstStatementData.lstStatements || 'undefined',
        quarterlyStatements: lstStatementData.quarterlyStatements,
        lineOfBusiness: ''
      });
      vm.totalStatements = (function() {
        var value = 0;
        if (EASEUtilsFactory.isTypeOfArray(vm.lstStatements)) {
          vm.isServiceWorking = true;
          value = vm.lstStatements.length;
        } else {
          vm.isServiceWorking = false;
        }
        return value;
      })();

      //Methods
      angular.extend(vm, {
        lob: function() {
          return EASEUtilsFactory.getLOB(vm.category);
        },
        getAriaText: function(index, type) {
          return type === 'q' ? 'Statements for ' + this.quarterlyStatements[index].title :
            'Statement for ' +
            EASEUtilsFactory.getFullMonthText(index);
        },
        close: function() {
          cleanUp();
          $state.go('^');
        },

        reset: function() {
          cleanUp();
          vm.delegate.load('/ease-ui' + EaseConstant.kBuildVersionPath + '/dist/file/NotFound.pdf');
        },

        download: function() {
          /* istanbul ignore else  */
          if ($window.saveAs) {
            $window.saveAs(vm.file, 'statement.pdf');
          } else {
            throw easeExceptionsService.createEaseException({
              'module': 'StatementModule',
              'function': 'statementController.download',
              'fileName': 'Statement-controller.js',
              'lineNumber': 84,
              'message': 'download function is not supported'
            });
          }
        },

        printStatement: function() {
          var newWindow = $window.open(vm.pdfUrl);
          /* istanbul ignore else  */
          if (newWindow) {
            newWindow.print();
          } else {
            throw easeExceptionsService.createEaseException({
              'module': 'StatementModule',
              'function': 'statementController.printStatement',
              'fileName': 'Statement-controller.js',
              'lineNumber': 108,
              'message': 'print function is not supported'
            });
          }
        },

        changeStatement: function(statement) {
          vm.currentStatement = statement;
          if (vm.currentStatement.available) {
            getStatement();
            vm.toggle = true;
          }
        },

        zoomIn: function() {
          vm.scalePdf = vm.delegate.zoomIn();
        },

        zoomOut: function() {
          vm.scalePdf = vm.delegate.zoomOut();
        },
        //[TODO] [SD] Implement this
        prev: function() {
          vm.statementYear = vm.statementYear - 1;
          getListStatements();
        },

        // [Input]:- Index of Q indicating which Q statement needs to be rendered.
        // [Output]:- location of the Url for Q statement.
        retriveQuaterly: function(index) {
          // statementService.getStatements(index)
        },

        // [Output]:- location of Url for yearly statement.
        retrieveYearly: function() {
          // stub for LOBs to implement
        },

        //[TODO] [SD] Implement this
        next: function() {
          vm.statementYear = vm.statementYear + 1;
          getListStatements();
        },

        havePrev: function() {
          // check if any statements are available for vm.statementYear - 1
          return true;
        },

        haveNext: function() {
          // check if any statements are available for vm.statementYear + 1
          return true;
        },

        getDate: function(statement) {
          var date = new Date(statement.statementDate);
          return date.getDate();
        },

        showYearlySummary: function(statements) {
          for (var i=0; i < statements.length; i++) {
            if (!statements[i].available) {
              return false;
            }
          }
          return true;
        }
      });
      $scope.init();
    }
  ]);
  return statementModule;
});

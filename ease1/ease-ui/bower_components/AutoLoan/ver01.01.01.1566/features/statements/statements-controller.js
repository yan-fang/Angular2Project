define(['angular'], function(angular) {
  'use strict';
  var AutoLoanStatementsModule = angular.module('AutoLoanStatementsModule', []);

  AutoLoanStatementsModule.controller('AutoLoanStatementsController', ['$scope', '$window', '$filter', '$state',
    'autoLoanModuleService', 'autoLoanStatementService', '$controller','AutoLoanPubsubService','pubsubService',
    function($scope, $window, $filter, $state, autoLoanModuleService,
             autoLoanStatementService, $controller,AutoLoanPubsubService) {
      var vm = this;
      vm.i18n = autoLoanModuleService.getI18n();
      var accountDetailsData = autoLoanModuleService.getAccountDetailsData();

      _extendController();

      //properties
      vm.httpHeaders = {};
      vm.isAdaStatement = false;
      vm.isServiceWorking = true;
      vm.toggle = true;
      vm.currentStatement = {};
      vm.showSpinner = false;
      vm.showCalendarSpinner = false;
      vm.modalType = 'statementPane';
      vm.isNoStatementsAvailable = false;
      vm.statementIndex = 0;
      vm.errorMessage = {
        'title': vm.i18n.coaf.accountSummary.extensibility.statements.noStatement.title.v1,
        'content': vm.i18n.coaf.accountSummary.extensibility.statements.noStatement.content.v1
      };

      vm.calendarTemplate = '/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/' +
          'statements/partials/AutoLoan-statementsCalendar.html';

      //functions
      vm.printStatement = printStatement;
      vm.getCurrentStatement = getCurrentStatement;
      vm.getStatementList = getStatementList;
      vm.getSelectedStatement = getSelectedStatement;
      vm.init = init;
      vm.onAdaCheckboxChange = onAdaCheckboxChange;
      vm.changeMessageOnError = changeMessageOnError;
      vm.getStatement = getStatement;
      vm.close = close;
      vm.doesStatementListSizeExceed = doesStatementListSizeExceed;


      autoLoanModuleService.getPaymentPlanCurrentDate(accountDetailsData.accountRefId).then(function(data) {
        vm.currentDate =  $filter('date')(new Date(data.currentDate), 'yyyy-MM-dd');
        vm.previousYear = $filter('date')(new Date().setFullYear(new Date(data.currentDate).getFullYear() - 1),
          'yyyy-MM-dd');
        vm.init();
      });

      function init() {
        vm.showMessage = false;
        var displayNumber = accountDetailsData.accountDetails.displayAccountNumber;
        vm.accountNickname = accountDetailsData.accountDetails.accountNickname;
        vm.displayLast4AcctNumber = displayNumber.substring(displayNumber.length - 4);
        autoLoanStatementService.getListOfStatements(accountDetailsData.accountRefId, vm.previousYear, vm.currentDate,
          vm.getCurrentStatement);
        vm.showSpinner = true;
        vm.showErrorOnCalendarModal = false;
      }

      vm.toggleCalendar = function() {
        vm.toggle = !vm.toggle;
        return vm.toggle;
      };

      function _extendController() {
        angular.extend(vm, $controller('statementController', {
          $scope: $scope,
          $state: $state,
          $window: $window,
          accountDetailsData: accountDetailsData,
          stCategory: 'AL',
          lstStatementData: {},
          statementService: null
        }));
      }

      function changeMessageOnError() {
        vm.showSpinner = false;
        vm.showCalendarSpinner = false;
        if (!vm.showErrorOnCalendarModal) {
          vm.showMessage = true;
          addOrRemoveErrorStyles(true);
        }
        vm.errorMessage.title = vm.i18n.coaf.accountSummary.extensibility.statements.errorMessage.title.v1;
        vm.errorMessage.content = vm.i18n.coaf.accountSummary.extensibility.statements.errorMessage.content.v1;
      }

      function addOrRemoveErrorStyles(isError) {
        var navigationElement = angular.element(document.getElementsByClassName('navigation'));
        var toolbarElement = angular.element(document.getElementsByClassName('toolbar'));
        if (isError) {
          navigationElement.addClass('disabledDiv');
          toolbarElement.addClass('disabledDiv');
        } else {
          navigationElement.removeClass('disabledDiv');
          toolbarElement.removeClass('disabledDiv');
        }
      }

      function close() {
        AutoLoanPubsubService.trackPageView({
          level2: 'account details'
        });
        $state.go('^');
      }

      function getCurrentStatement(data) {
        if (data.availableDocuments && data.availableDocuments.length > 0) {
          vm.listOfStatements = data.availableDocuments;
          vm.originalStatements = vm.listOfStatements;
          vm.currentDocumentYear = $filter('date')
            (vm.listOfStatements[vm.listOfStatements.length - 1].documentDate, 'yyyy');
          vm.listOfStatements = $filter('filter')(vm.listOfStatements, vm.currentDocumentYear);
          vm.currentStatement = vm.listOfStatements[vm.listOfStatements.length-1];
          vm.statementIndex = vm.listOfStatements.length-1;
          vm.getStatement();
          vm.isNoStatementsAvailable = false;
          vm.showCalendarSpinner = false;

          AutoLoanPubsubService.trackPageView({
            level2: 'account details',
            level3: 'statements'
          });

        } else if (data.notificationMessage && data.notificationMessage.id === '200718') {
          vm.isNoStatementsAvailable = true;
          vm.showSpinner = false;
          vm.showCalendarSpinner = false;
          vm.showMessage = true;
          addOrRemoveErrorStyles(true);
        } else {
          vm.changeMessageOnError();
        }
      }

      function getStatementList(data) {
        if (data.availableDocuments && data.availableDocuments.length > 0) {
          vm.listOfStatements = data.availableDocuments;
          vm.originalStatements = vm.listOfStatements;
          vm.listOfStatements = $filter('filter')(vm.listOfStatements, vm.currentDocumentYear);
          vm.showCalendarSpinner = false;
        } else {
          vm.showErrorOnCalendarModal = true;
          vm.showCalendarSpinner = false;
          vm.changeMessageOnError();
        }
      }

      function doesStatementListSizeExceed(numberToCheck) {
        return vm.listOfStatements.length > numberToCheck;
      }

      vm.hasNextYear = function() {
        var nextYearHtmlElement =
            angular.element(document.getElementById('nextYearElementId'))[0];
        var coafStatementCalendarNextYear =
            angular.element(document.getElementById('coafStatementCalendarNextYear'))[0];
        if (new Date().getFullYear() != vm.currentDocumentYear) {
          nextYearHtmlElement.setAttribute('aria-hidden', 'false');
          coafStatementCalendarNextYear.setAttribute('tabindex', '1');
          return true;
        } else {
          nextYearHtmlElement.setAttribute('aria-hidden', 'true');
          coafStatementCalendarNextYear.setAttribute('tabindex','-1');
          return false;
        }
      };

      vm.hasPreviousYear = function() {
        var previousYearHtmlElement = angular.element(document.getElementById('previousYearElementId'))[0];
        var coafStatementCalendarPreviousYearHtmlElement =
            angular.element(document.getElementById('coafStatementCalendarPreviousYear'))[0];
        if ($filter('filter')(vm.originalStatements, vm.currentDocumentYear - 1).length > 0) {
          previousYearHtmlElement.setAttribute('aria-hidden', 'false');
          coafStatementCalendarPreviousYearHtmlElement.setAttribute('tabindex', '1');
          return true;
        } else {
          previousYearHtmlElement.setAttribute('aria-hidden', 'true');
          coafStatementCalendarPreviousYearHtmlElement.setAttribute('tabindex', '-1');
          return false;
        }
      };

      vm.getPreviousYearStatements = function() {
        vm.showCalendarSpinner = true;
        vm.currentDocumentYear = vm.currentDocumentYear - 1;
        var fromPastYearDate = (vm.currentDocumentYear - 1) + '-12-01';
        var fromCurrentYearDate = vm.currentDocumentYear + '-12-31';
        vm.listOfStatements = autoLoanStatementService.getListOfStatements(accountDetailsData.accountRefId,
            fromPastYearDate, fromCurrentYearDate,
            vm.getStatementList);
      };

      vm.getNextYearStatements = function() {
        vm.showCalendarSpinner = true;
        vm.currentDocumentYear = +vm.currentDocumentYear + 1;
        var fromPastYearDate = (vm.currentDocumentYear - 1) + '-12-01';
        if (vm.hasNextYear()) {
          var fromCurrentYearDate = vm.currentDocumentYear + '-12-31';
        } else {
          fromCurrentYearDate = vm.currentDate;
        }
        vm.listOfStatements = autoLoanStatementService.getListOfStatements(accountDetailsData.accountRefId,
            fromPastYearDate, fromCurrentYearDate,
            vm.getStatementList);
      };

      function onAdaCheckboxChange() {
        vm.getStatement();
      }

      function getSelectedStatement(statement) {
        vm.currentStatement = statement;
        vm.getStatement();
      }


      function getStatement() {
        if (!vm.currentStatement) {
          cleanUp();
          return;
        }
        var fileName = 'AutoLoanStatement_' + $filter('date')(vm.currentStatement.documentDate, 'MM-dd-yyyy') + '.pdf';
        vm.statementTitle = $filter('date')(vm.currentStatement.documentDate, 'MMM d, yyyy ') +
            vm.i18n.coaf.accountSummary.extensibility.statements.latestStatement.v1;
        vm.documentId = vm.currentStatement.documentId;
        vm.pdfUrl = autoLoanStatementService.getDocumentURL(accountDetailsData.accountDetails.accountReferenceId,
            vm.currentStatement.documentId, vm.isAdaStatement, fileName);
        vm.downLoadPdfUrl = autoLoanStatementService.getDocumentURL(accountDetailsData.accountDetails.accountReferenceId,
          vm.currentStatement.documentId, vm.isAdaStatement, fileName) +'&actionType=download';
        vm.isLoading = true;
        vm.showSpinner = true;
        vm.selectedStatementYear = vm.currentDocumentYear;
        vm.delegate.resetPdfScale();

        vm.delegate.getPdf(vm.pdfUrl, vm.httpHeaders).then(function(template) {
          if (vm.accessor.renderPdf) {
            vm.accessor.renderPdf(template);
          }
          vm.isServiceWorking = true;
          vm.isLoading = false;
          vm.showSpinner = false;
          addOrRemoveErrorStyles(false);

          var autoLoanStatementDropDown = {
            name: 'dropdown',
            filter : $filter('date')(vm.currentStatement.documentDate, 'MMM-yyyy')
          };


          AutoLoanPubsubService.trackClickEvent(autoLoanStatementDropDown);



        }, function(error) {
          vm.isServiceWorking = false;
          vm.changeMessageOnError();
        });
      }

      vm.setStatementIndex = function(statementIndex) {
        vm.statementIndex = statementIndex;
      };

      function printStatement() {
        var printWindow = $window.open(vm.pdfUrl);
        if (printWindow) {
          printWindow.print();
        }
      }

      function cleanUp() {
        vm.pdfUrl = null;
        vm.isServiceWorking = false;
      }

    }]);

  return AutoLoanStatementsModule;
});

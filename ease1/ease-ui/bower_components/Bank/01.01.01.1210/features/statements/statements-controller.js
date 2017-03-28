define(['angular'], function(angular) {
  'use strict';

  angular
    .module('BankModule')
    .controller('BankStatementsController', BankStatementsController);

  BankStatementsController.$inject = ['$state', '$window','accountDetailsData', 'lstStatementData', 'StatementService',
    'BankStatementsService', 'i18nBank', 'pdfDelegate', 'EASEUtilsFactory', 'easeExceptionsService', 'EaseConstant', '$scope', '$controller'];
function BankStatementsController($state, $window, accountDetailsData, lstStatementData, StatementService, BankStatementsService,
                                  i18nBank, pdfDelegate, EASEUtilsFactory, easeExceptionsService, EaseConstant, $scope, $controller) {

  var vm = this;
  var currentYear = new Date().getFullYear();
  var accountReferenceId = accountDetailsData.accountRefId;
  _extendController();
  vm.lstStatementsAllYears = lstStatementData.lstStatements;

  vm.totalStatements = (function() {
    var value = 0;
    if (typeof vm.lstStatementsAllYears !== 'undefined') {
      if(_.isEmpty(vm.lstStatementsAllYears)) {
        vm.isServiceWorking = false;
        settingMessageError(false);
      }
      else {
        vm.isServiceWorking = true;
        value = Object.keys(vm.lstStatementsAllYears).length;
      }
    } else {
      vm.isServiceWorking = false;
      settingMessageError(true);
    }
    return value;
  })();

  vm.init = init;
  vm.printStatement = printStatement;
  vm.isServiceWorking = false;
  vm.currentStatement = null;
  vm.close = function () {
    $state.go('BankDetails.transactions');
  };
  vm.changeStatement = changeStatement;
  vm.accountDetailsData = accountDetailsData;
  vm.prev = getPreviousYearStatements;
  vm.next = getNextYearStatements;
  vm.reset = reset;
  vm.showSpinner = false;
  vm.isLoading = false;
  vm.showMessage = false;
  vm.pdfUrl = '';
  vm.i18n = i18nBank.statements;
  vm.havePrev = havePrev;
  vm.haveNext = haveNext;
  vm.showYearlySummary = showYearlySummary;
  vm.getDate = getDate;
  vm.init();

  function init() {

    if (vm.totalStatements > 0) {
      findLatestStatement();
    }
    if (vm.currentStatement) {
      vm.statementYear = Number(vm.currentStatement.statementYear);
      vm.statementIndex = vm.currentStatement.index;
      vm.pdfUrl = BankStatementsService.getPdfUrl(accountReferenceId, vm.currentStatement.statementReferenceId);
      buildStatementTitle(vm.currentStatement);
    }
    else {
      vm.statementYear = currentYear;
      vm.lstStatements = vm.lstStatementsAllYears[currentYear]
      settingMessageError(false);
    }
    toggleYearArrowVisibility();
    getStatement();
  }

  function buildStatementTitle(currentStatement) {
    if(!currentStatement.statementTitle)
    currentStatement.statementTitle = vm.i18n.month[currentStatement.statementMonth] + " " + currentStatement.statementYear + " " + "Statement";
  }

  function findLatestStatement() {

    //Find the latest statement
    var allYears = [];
    for (var statementYear in vm.lstStatementsAllYears) {
      allYears.push(statementYear);
    }

    allYears.sort(function(a, b) {
      return Number(b) - Number(a);
    });

    for(var i=0; i< allYears.length; i++) {
      var statementYear = allYears[i];
      var latestFound = StatementService.getLatestStatement(vm.lstStatementsAllYears[statementYear]);
      //This works because the years are in ascending order.
      if(latestFound.length != 0) {
        vm.currentStatement = latestFound[0];
        vm.lstStatements = vm.lstStatementsAllYears[statementYear];
        break;
      }
    }

  }

  function settingMessageError(isError) {
    vm.errorMessage = [];
    if (isError) {
      vm.errorMessage.title = i18nBank.statements.apiErrorTitle;
      vm.errorMessage.content = i18nBank.statements.apiErrorMessage;
    } else {
      vm.errorMessage.title = i18nBank.statements.noStatementsTitle;
      vm.errorMessage.content = i18nBank.statements.noStatementsMessage;
    }
    vm.showMessage = true;
    vm.showSpinner = false;
  }

  function changeStatement(statement) {
    if (statement.available) {
      vm.currentStatement = statement;
      getStatement();
      vm.toggle = true;
    }
  }

  function getStatement() {
    if (!vm.currentStatement) {
      vm.reset();
      return;
    } else {
      buildStatementTitle(vm.currentStatement);
      vm.showMessage = false;
      vm.pdfUrl = BankStatementsService.getPdfUrl(accountReferenceId, vm.currentStatement.statementReferenceId);
      vm.isLoading = true;
      vm.showSpinner = true;
      pdfDelegate.resetPdfScale();
      pdfDelegate.getPdf(vm.pdfUrl, false).then(function (template) {
        if (vm.accessor.renderPdf) {
          vm.accessor.renderPdf(template);
        }
        vm.isServiceWorking = true;
        vm.showSpinner = false;
        vm.isLoading = false;
      }, function(error) {
        vm.isServiceWorking = false;
        settingMessageError(true);
      });
    }

  }

  function getNextYearStatements() {
    vm.statementIndex = null;
    var nextYear = vm.statementYear + 1;

    if(vm.lstStatementsAllYears[nextYear]) {
      vm.statementYear = nextYear;
    }
    toggleYearArrowVisibility();
    vm.lstStatements = vm.lstStatementsAllYears[vm.statementYear];
  }

  function getPreviousYearStatements() {
    vm.statementIndex = null;
    var prevYear = vm.statementYear - 1;

    if(vm.lstStatementsAllYears[prevYear]) {
      vm.statementYear = prevYear;
    }
    toggleYearArrowVisibility();
    vm.lstStatements = vm.lstStatementsAllYears[vm.statementYear];
  }

  function haveNext() {
    return vm.isNextYearAvailable;
  }

  function havePrev() {
    return vm.isPrevYearAvailable;
  }

  function showYearlySummary() {
    return false;
  }

  function getDate(statement) {
    if(statement.getDate) {
      var date = new Date(statement.statementDate);
      return date.getDate();
    }
    return "";
  }

  function toggleYearArrowVisibility() {
    var nextYear = vm.statementYear + 1;
    var prevYear = vm.statementYear - 1;
    if(vm.lstStatementsAllYears[nextYear]) {
      vm.isNextYearAvailable = true;
    }
    else vm.isNextYearAvailable = false;

    if(vm.lstStatementsAllYears[prevYear]) {
      vm.isPrevYearAvailable = true;
    }
    else vm.isPrevYearAvailable = false;

  }

  function printStatement(event) {
    //if Clicked or hit enter
    if (!event || event.which === 13) {
      var newWindow = $window.open(vm.pdfUrl);
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
    }
  }

  function reset() {
    vm.pdfUrl = null;
    vm.currentStatement = {};
  }

  function _extendController() {
    angular.extend(vm, $controller('statementController',{
      $scope: $scope,
      $state: $state,
      $window: $window,
      accountDetailsData: accountDetailsData,
      stCategory: "Bank",
      lstStatementData: {},
      statementService: null
    }));
  }
}

});

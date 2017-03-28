define(['angular'], function (angular) {
  'use strict';
  angular.module('HomeLoansModule')
    .controller('HomeLoansStatementController', homeLoansStatementController)
    .directive('tabLock', tabLockDirective)
    .directive('closeHlMonthPicker', closeHlMonthPicker);
  homeLoansStatementController.$inject = ['$scope', '$state', '$window', 'accountDetailsData',
    'lstStatementData', 'StatementService', 'pdfDelegate', 'EASEUtilsFactory', 'easeExceptionsService', 'EaseConstant', 'i18nData', 'homeLoansAccountDetailsService', 'HomeLoansUtils'];
  function homeLoansStatementController(
    $scope, $state, $window, accountDetailsData, lstStatementData, statementService, pdfDelegate,
    EASEUtilsFactory, easeExceptionsService, EaseConstant, i18nData, homeLoansAccountDetailsService, homeLoansUtils) {
    var vm = this;
    vm.i18n = i18nData.statements;
    var currentYear = new Date().getFullYear();
    $scope.toggle = true;
    $scope.toggleView = function toggleView() {
      $scope.toggle = !$scope.toggle;
    };
    $scope.currentStatement = vm.currentStatement;
    $scope.toggle = function (picker) {
      if (picker === 'months') {
        $scope.paramList.useMonths = !($scope.paramList.useMonths)
      } else if (picker === 'quarters') {
        $scope.paramList.useQuarters = !($scope.paramList.useQuarters)
      } else if (picker === 'yearly') {
        $scope.paramList.useYearly = !($scope.paramList.useYearly)
      } else {
        $scope.paramList.useCarousel = !($scope.paramList.useCarousel)
      }
    };
    $scope.paramList = {
      useMonths        : true,
      useQuarters      : true,
      useYearly        : false,
      useCarousel      : true,
      monthStatements  : lstStatementData.lstStatements[currentYear].monthlyStatements,
      quarterStatements: lstStatementData.lstStatements[currentYear].taxStatements,
      haveYearly       : function () {
        if ($scope.paramList.year === currentYear) {
          return false
        }
        return true
      },
      selectedStatement: {},
      year             : currentYear,
      goToPrev         : function () {
        vm.getPreviousYearStatements();
      },
      goToNext         : function () {
        vm.getNextYearStatements();
      },
      havePrev         : function () {
        return vm.isPrevYearAvailable;
      },
      haveNext         : function () {
        return vm.isNextYearAvailable;
      },
      selectQuarter    : function (stmt) {
        console.log(stmt);
      }
    };
    $scope.$watch('paramList.selectedStatement', function (newVal, oldVal) {
        console.log(newVal);
        console.log(oldVal);
        $scope.toggle = true;
        if ((newVal.statementReferenceId != null) ||
          (oldVal.statementReferenceId != null && newVal.statementReferenceId != oldVal.statementReferenceId)) {
          homeLoansUtils.buttonAnalytics({
            name  : 'dropdown',
            filter: newVal.statementTitle
          });
          vm.currentStatement = newVal;
          getStatement(newVal.statementReferenceId);
        }
      }
    );
    //Private Functions
    function init() {
      if (vm.totalStatements > 0) {
        findLatestStatement();
        if (vm.currentStatement) {
          vm.statementYear = Number(vm.currentStatement.statementYear);
          vm.statementIndex = vm.currentStatement.index;
          //If statement month has additional statements, select the latest statement.
          if (vm.currentStatement.additionalStatements) {
            var additionalStatements = vm.currentStatement.additionalStatements;
            vm.currentStatement = additionalStatements[additionalStatements.length - 1];
            vm.additionalStatements = additionalStatements;
            vm.additionalStatementIndex = vm.currentStatement.index;
          }
          vm.pdfUrl = homeLoansAccountDetailsService.getStatementsURL(encodeURIComponent(accountDetailsData.accountReferenceId), vm.currentStatement.statementReferenceId);
          vm.headers = homeLoansAccountDetailsService.getStatementsHeaders();
          $scope.paramList.selectedStatement = vm.currentStatement;
        }
        else {
          vm.statementYear = currentYear;
          vm.lstStatementsByYear = vm.lstStatements[currentYear].monthlyStatements;
          vm.taxStatement = vm.lstStatements[currentYear].taxStatements;
          $scope.paramList.monthStatements = vm.lstStatements[currentYear].monthlyStatements;
          $scope.paramList.quarterStatements = vm.lstStatements[currentYear].taxStatements;
          settingMessageError(false);
        }
        toggleYearArrowVisibility();
      }
    };
    function findLatestStatement() {
      //Find the latest statement
      var allYears = [];
      for (var statementYear in vm.lstStatements) {
        allYears.push(statementYear);
      }
      allYears.sort(function (a, b) {
        return Number(b) - Number(a);
      });
      for (var i = 0; i < allYears.length; i++) {
        var statementYear = allYears[i];
        var latestFound = statementService.getLatestStatement(vm.lstStatements[statementYear].monthlyStatements);
        //This works because the years are in ascending order.
        if (latestFound.length != 0) {
          vm.currentStatement = latestFound[0];
          vm.lstStatementsByYear = vm.lstStatements[statementYear].monthlyStatements;
          vm.taxStatements = vm.lstStatements[statementYear].taxStatements;
          $scope.paramList.monthStatements = vm.lstStatements[statementYear].monthlyStatements;
          $scope.paramList.quarterStatements = vm.lstStatements[statementYear].taxStatements;
          $scope.paramList.selectedStatement = vm.currentStatement;
          $scope.paramList.year = statementYear;
          break;
        }
      }
    }

    function cleanUp() {
      vm.pdfUrl = null;
      vm.currentStatement = {};
      $scope.paramList.selectedStatement = {};
    }

    function toggleYearArrowVisibility() {
      var nextYear = vm.statementYear + 1;
      var prevYear = vm.statementYear - 1;
      if (vm.lstStatements[nextYear]) {
        vm.isNextYearAvailable = true;
      }
      else vm.isNextYearAvailable = false;
      if (vm.lstStatements[prevYear]) {
        vm.isPrevYearAvailable = true;
      }
      else vm.isPrevYearAvailable = false;
    }

    function updateSelectedIndexes(index) {
      vm.taxStatementSelected = false;
      if (vm.mode === 'dayPicker') {
        vm.additionalStatementIndex = index;
      }
      else {
        if (vm.statementIndex != index) {
          vm.additionalStatementIndex = null;
        }
        vm.statementIndex = index;
      }
    }

    function clearIndexes() {
      vm.statementIndex = null;
      vm.additionalStatementIndex = null;
    }

    function getListStatements() {
      vm.lstStatementsByYear = vm.lstStatements[vm.statementYear].monthlyStatements;
      vm.taxStatements = vm.lstStatements[vm.statementYear].taxStatements;
      $scope.paramList.monthStatements = vm.lstStatements[vm.statementYear].monthlyStatements;
      $scope.paramList.quarterStatements = vm.lstStatements[vm.statementYear].taxStatements;
      $scope.paramList.year = vm.statementYear;
    }

    function settingMessageError(isError) {
      if (isError) {
        vm.message.title = i18nData.statements.apiErrorTitle;
        vm.message.content = i18nData.statements.apiErrorMessage;
      } else {
        vm.message.title = i18nData.statements.noStatementsTitle;
        vm.message.content = i18nData.statements.noStatementsMessage;
      }
      vm.showMessage = true;
    }

    function getStatement(statementRefId) {
      if (!vm.currentStatement) {
        vm.reset();
        return;
      } else {
        vm.showMessage = false;
        vm.pdfUrl = homeLoansAccountDetailsService.getStatementsURL(encodeURIComponent(accountDetailsData.accountReferenceId), statementRefId);
        vm.headers = homeLoansAccountDetailsService.getStatementsHeaders();
        vm.isLoading = true;
        pdfDelegate.getPdf(vm.pdfUrl, vm.headers).then(function (template) {
          homeLoansUtils.analyticsTracking('statements');
          if (vm.accessor.renderPdf) {
            vm.accessor.renderPdf(template);
          }
        });
        vm.isServiceWorking = true;
      }
    }

    //Extend properties
    angular.extend(vm, {
      mode                    : 'monthPicker',
      statementIndex          : null,
      additionalStatementIndex: null,
      taxStatementSelected    : false,
      taxStatementIndex       : null,
      pdfUrl                  : '',
      initClose               : false,
      modalType               : 'statementPane',
      modalClass              : '',
      toggle                  : true,
      currentStatement        : null,
      scalePdf                : EaseConstant.kDefaultPdfScale,
      accessor                : {},
      isLoading               : false,
      isServiceWorking        : false,
      isCurrentYear           : false,
      accountDetailsData      : (typeof accountDetailsData !== 'undefined') ? accountDetailsData.accountDetails : {},
      message                 : {},
      showMessage             : false,
      templateCalendar        : '/ease-ui/bower_components/HomeLoans/ver1490643033478/partials/HomeLoans-statementsCalendar.html',
      lstStatements           : lstStatementData.lstStatements,
      lstStatementsByYear     : "",
      taxStatement            : lstStatementData.taxStatement,
      headers                 : ''
    });
    vm.totalStatements = (function () {
      var value = 0;
      if (typeof vm.lstStatements !== 'undefined') {
        if (_.isEmpty(vm.lstStatements)) {
          vm.isServiceWorking = false;
          settingMessageError(false);
        }
        else {
          vm.isServiceWorking = true;
          value = Object.keys(vm.lstStatements).length
        }
      } else {
        vm.isServiceWorking = false;
        settingMessageError(true);
      }
      return value;
    })();
    //Methods
    angular.extend(vm, {
      onClick                  : function (selectedStatement) {
        updateSelectedIndexes(selectedStatement.index);
        vm.taxStatementIndex = null;
        vm.changeStatement(selectedStatement);
      },
      toggleMode               : function () {
        vm.mode === "dayPicker" ? vm.mode = 'monthPicker' : vm.mode = "dayPicker";
      },
      selectYearEnd            : function (selectedStatement) {
        //if (vm.taxStatement.available) {
        if (selectedStatement.available) {
          clearIndexes();
          vm.taxStatementIndex = selectedStatement.statementReferenceId;
          vm.taxStatementSelected = !vm.taxStatementSelected;
          vm.changeStatement(selectedStatement);
        }
      },
      getNextYearStatements    : function () {
        clearIndexes();
        vm.taxStatementSelected = false;
        var nextYear = vm.statementYear + 1;
        if (vm.lstStatements[nextYear]) {
          vm.statementYear = nextYear;
        }
        toggleYearArrowVisibility();
        getListStatements();
      },
      getPreviousYearStatements: function () {
        clearIndexes();
        vm.taxStatementSelected = false;
        var prevYear = vm.statementYear - 1;
        if (vm.lstStatements[prevYear]) {
          vm.statementYear = prevYear;
        }
        toggleYearArrowVisibility();
        getListStatements();
      },
      getAriaText              : function (index, type) {
        return 'Statement for ' + EASEUtilsFactory.getFullMonthText(index);
      },
      close                    : function () {
        cleanUp();
        $state.go('^');
      },
      reset                    : function () {
        cleanUp();
        pdfDelegate.load('/ease-ui/dist/file/NotFound.pdf');
      },
      downloadStatement        : function () {
        homeLoansUtils.buttonAnalytics({
          name: 'download button'
        });
      },
      printStatement           : function (event) {
        //if Clicked or hit enter
        homeLoansUtils.buttonAnalytics({
          name: 'print button'
        });
        if (!event || event.which === 13) {
          var newWindow = $window.open(vm.pdfUrl);
          if (newWindow) {
            newWindow.print();
          } else {
            throw easeExceptionsService.createEaseException({
              'module'    : 'StatementModule',
              'function'  : 'statementController.printStatement',
              'fileName'  : 'Statement-controller.js',
              'lineNumber': 108,
              'message'   : 'print function is not supported'
            });
          }
        }
      },
      changeStatement          : function (statement) {
        if (statement.available) {
          homeLoansUtils.buttonAnalytics({
            name  : 'dropdown',
            filter: statement.statementTitle
          });
          vm.currentStatement = statement;
          getStatement();
          vm.toggle = true;
        }
      },
      zoomIn                   : function (event) {
        //if Clicked or hit enter
        if (!event || event.which === 13) {
          vm.scalePdf = pdfDelegate.zoomIn();
        }
      },
      zoomOut                  : function (event) {
        //if Clicked or hit enter
        if (!event || event.which === 13) {
          vm.scalePdf = pdfDelegate.zoomOut();
        }
      },
      toggleDropdown           : function (evt) {
        vm.toggle = !vm.toggle;
        //set aria-expanded to true
        var element = angular.element(evt.currentTarget);
        element.attr('aria-expanded', !vm.toggle);
      }
    });
    init();
  }

  /**
   *
   * This directive locks input for the statement calendar (date picker). It uses the class 'firstTabElement' and
   * 'lastTabIndicatorElement' to create a cycle when tabbing. It uses the controllers 'toggle' variable to determine
   *  when to enter/leave the tab loop. It leaves by manually moving focus to 'nextTabableElement'.
   *
   *
   */
  tabLockDirective.$inject = ['$timeout'];
  function tabLockDirective($timeout) {
    return {
      restrict: 'A',
      scope   : {
        componentToggle : '=',
        nextTabElementId: '@'
      },
      link    : function (scope, element, attribute) {
        var shiftTabPress = false;
        element.on('keydown', function (event) {
          if (scope.componentToggle) {
            //component is active and user hits submit. Reset the tab loop to first element.
            if (event.which === 13 || event.which === 32) {
              //Enter key or space key.
              //timeout is needed so focus changes after other events occur.
              $timeout(function () {
                element[0].getElementsByClassName('firstTabElement')[0].focus();
              });
            }
            if (event.which === 9 && !event.shiftKey) {
              //Tab key
              shiftTabPress = false;
              angular.element(element[0].getElementsByClassName('lastTabIndicatorElement')[0]).on('focus', function () {
                if (!shiftTabPress) {
                  element[0].getElementsByClassName('firstTabElement')[0].focus();
                }
              });
            }
            if (event.which === 9 && event.shiftKey) {
              //shift + tab
              shiftTabPress = true;
              if (element[0].getElementsByClassName('firstTabElement')[0] === event.target) {
                event.preventDefault();
                element[0].getElementsByClassName('lastTabIndicatorElement')[0].focus();
              }
            }
          }
          else if (event.which === 9 && !scope.componentToggle) {
            //component is inactive... and user has hit the tab button.
            var elem = document.querySelectorAll('.nextTabableElement');
            elem[0].focus();
            event.preventDefault();
          }
        });
      }
    };
  };
  /**
   *
   * Allows a user to click outside of the date picker to close it (a natural behavior from user point of view).
   *
   */
  closeHlMonthPicker.$inject = ['$document'];
  function closeHlMonthPicker($document) {
    return {
      restrict: 'A',
      link    : function (scope, element, attribute, controller) {
        $document.on("click", function (event) {
          //Check if event is not null and undefined
          var _containerElement = ['statementPicker', 'header', 'stTitle', 'head', 'picker-icon', 'icon-drop-arrow', 'slide', 'prev-year', 'year-label', 'next-year', 'icon-prev', 'icon-next'];
          if (!!event && typeof(event) !== undefined) {
            var clickedElm = event.target.getAttribute('class');
            var allClasses = clickedElm.split(' ');
            var clickedElementClass = clickedElm ? allClasses[0] : null;
          }
          var amIPicker = _.include(_containerElement, clickedElementClass);
          var preventPickerClose = _.contains(allClasses, "preventPickerClose");
          if (!amIPicker && !preventPickerClose) {
            if (!scope.stCtrl.toggle) {
              scope.$apply(function () {
                scope.stCtrl.toggle = !scope.stCtrl.toggle;
              })
            }
          }
        });
      }
    }
  }
});

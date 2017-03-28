define(['angular'], function (angular) {
  'use strict';
  var payOffQuoteModule = angular.module('PayOffQuoteModule');

  payOffQuoteModule.controller('payOffQuoteController', ['$scope', '$state', '$window', 'accountDetailsData', 'stCategory', 'PayOffQuoteService',
    'payOffQuotePdfDelegate', 'EaseLocalizeService', 'EASEUtilsFactory', 'easeExceptionsService', 'EaseConstant', 'HomeLoansUtils', 'homeLoansAccountDetailsService', '$filter',
    function ($scope, $state, $window, accountDetailsData, stCategory, payOffQuoteService,
              payOffQuotePdfDelegate, EaseLocalizeService, EASEUtilsFactory, easeExceptionsService, EaseConstant, HomeLoansUtils, homeLoansAccountDetailsService, $filter) {

      var vm = this;
      var quoteSelectedDate = null;

      vm.dt = new Date();
      vm.isOpen = false;
      vm.open = function() {
        this.isOpen = true;
      };

      this.inlineOptions = {
        format_day_title: 'MMMM YYYY',
        placement: 'bottom-left',
        calendar_format: 'MMM, DD YYYY',
        min_date: (data.payoffQuoteStartDate+'T05:00:00.00-04:00'),
        max_date: (data.payoffQuoteEndDate+'T05:00:00.00-04:00'),
        gutter: 0
      };

      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var afterTomorrow = new Date();
      afterTomorrow.setDate(tomorrow.getDate() + 1);

      //Extend properties
      angular.extend(vm, {
        isValidDirective: {
          from: true,
          amount: true,
          date: true
        },
        currentIdx: 0,
        file: {},
        pdfUrl: '',
        initClose: false,
        modalType: 'statementPane',
        modalClass: '',
        on: true,
        toggle: true,
        currentStatement: {},
        delegate: payOffQuotePdfDelegate,
        scalePdf: EaseConstant.kDefaultPdfScale,
        accessor: {},
        isLoading: true,
        isServiceWorking: true,
        accountDetailsData: (typeof accountDetailsData !== 'undefined') ? accountDetailsData.accountDetails : {},
        category: stCategory.toUpperCase(),
        message: {},
        showMessage: false,
        templateCalendar: '/ease-ui/dist/features/Statement/html/partials/Statement-calendar.html',
        lineOfBusiness: 'homeloans',
        selectedDate: accountDetailsData.payOffQuoteSelectedDate+'T05:00:00.00-04:00',
        opened: false,
        quoteStartDate: accountDetailsData.payOffQuoteStartDate,
        quoteEndDate: accountDetailsData.payOffQuoteEndDate,
        showDatePicker: accountDetailsData.showDatePicker,
        openByKeypress: function (evt) {
          var charCode = (evt.which) ? evt.which : evt.keyCode;
          if (charCode === 32 || charCode === 13) {
            vm.open(evt);
          }
        },
        open1: function ($event) {
          $event.preventDefault();
          $event.stopPropagation();

          if (vm.opened) {
            var el = angular.element(document.getElementsByClassName('animateTable'));
            $timeout(function () {
              vm.opened = false;
              el.removeClass('selectDateClass');
            }, 100);
            el.addClass('selectDateClass');
          } else {
            vm.opened = true;
          }
        },
        dateOptions: {
          showWeeks: false,
          formatDayTitle: 'MMMM yyyy',
          formatDay: 'd',
          isDisabledMonths: false,
          lobmode: 'homeloans'
        },
        selectDate: function (scheduleDate) {
          vm.quoteSelectedDate = scheduleDate;
        }
      });


      $scope.init = function () {
        vm.accountDetailsData = accountDetailsData.accountDetails;
        var payoffQuoteDate = accountDetailsData.payOffQuoteSelectedDate;
        vm.pdfUrl = homeLoansAccountDetailsService.getPayOffQuoteURL(encodeURIComponent(accountDetailsData.accountReferenceId), payoffQuoteDate);
      };


      function cleanUp() {
        vm.file = null;
        vm.pdfUrl = null;
        vm.currentIdx = 0;
        vm.currentStatement = {};
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

      function settingPDFServiceMessageError() {
        vm.isServiceWorking = false;
        vm.message.title = "Pay Off Quote Generation Error";
        vm.message.content = "Our online payoff generator is not cooperating right now. We’re working on the issue. Please try back later."
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

          statementService.getStatement(statement).then(function (data) {
            vm.pdfUrl = data.url;
            vm.isLoading = true;
            vm.delegate.getPdf(vm.pdfUrl, false).then(function (template) {
              if (vm.accessor.renderPdf) {
                vm.accessor.renderPdf(template);
              }
            }, settingPDFServiceMessageError());
            vm.currentIdx = vm.lstStatements.indexOf(vm.currentStatement);
            vm.isServiceWorking = true;
          }, function (error) {
            vm.isServiceWorking = false;
            settingMessageError(true);
            vm.delegate.load('/ease-ui/dist/file/NotFound.pdf');
            throw error;
          });
        }
      }

      //Methods
      angular.extend(vm, {
        lob: function () {
          return EASEUtilsFactory.getLOB(vm.category);
        },

        close: function () {
          cleanUp();
          $state.go('^');
        },

        cleanUp: function () {
          vm.file = null;
          vm.pdfUrl = null;
          vm.currentIdx = 0;
          vm.currentStatement = {};
          vm.isServiceWorking = false;

        },


        getPayOffQuote: function ($event) {
          console.log('inside the getPayOffQuote function');
          console.log('vm.selectedDate=' + vm.selectedDate);
          quoteSelectedDate = $filter('date')(new Date(vm.selectedDate), 'yyyy-MM-dd');
          if (!vm.currentStatement) {
            vm.reset();
            return;
          } else {
            var getPayOffQuote = angular.extend(vm.currentStatement, {
              'accountRefId': accountDetailsData.accountReferenceId,
              'payOffQuoteDate': quoteSelectedDate

            });

            if (quoteSelectedDate) {
              vm.pdfUrl = homeLoansAccountDetailsService.getPayOffQuoteURL(
                encodeURIComponent(accountDetailsData.accountReferenceId), quoteSelectedDate);
              var url = homeLoansAccountDetailsService.getPayOffQuoteURL
              (encodeURIComponent(accountDetailsData.accountReferenceId), quoteSelectedDate);

              vm.isServiceWorking = true;
              vm.showMessage = false;
              vm.delegate.getPdf(url, false).then(function (template) {
                if (vm.accessor.renderPdf) {
                  vm.accessor.renderPdf(template);
                }
                //},   settingPDFServiceMessageError());
              });
            } else {
              vm.isServiceWorking = false;
              vm.message.title = "Pay Off Quote Generation Error";
              vm.message.content = "Our online payoff generator is not cooperating right now. We’re working on the issue. Please try back later."
              vm.showMessage = true;

            }

          }
        },

        reset: function () {
          cleanUp();
          vm.delegate.load('/ease-ui/dist/file/NotFound.pdf');
        },


        download: function () {
          /* istanbul ignore else  */
          $window.saveAs(vm.file, 'payOffQuote.pdf');
          if ($window.saveAs) {
            $window.saveAs(vm.file, 'payOffQuote.pdf');
          } else {
            throw easeExceptionsService.createEaseException({
              'module': 'PayOffQuoteModule',
              'function': 'payOffQuoteController.download',
              'fileName': 'HomeLoans-POQCtrl.js',
              'lineNumber': 144,
              'message': 'download function is not supported'
            });
          }
        },

        printStatement: function () {
          //Site Catalyst
          HomeLoansUtils.buttonAnalytics({
            name: 'print button'
          });

          var newWindow = $window.open(vm.pdfUrl);
          if (newWindow) {
            newWindow.print();
          } else {
            throw easeExceptionsService.createEaseException({
              'module': 'PayOffQuoteModule',
              'function': 'payOffQuoteController.printStatement',
              'fileName': 'HomeLoans-POQCtrl.js',
              'lineNumber': 160,
              'message': 'print function is not supported'
            });
          }
        },

        changeStatement: function (statement) {
          vm.currentStatement = statement;
          if (vm.currentStatement.available) {
            getStatement();
            vm.toggle = true;
          }
        },

        zoomIn: function () {
          vm.scalePdf = vm.delegate.zoomIn();
        },

        zoomOut: function () {
          vm.scalePdf = vm.delegate.zoomOut();
        },

        downloadLinkAnalytics: function () {
          //Site Catalyst
          HomeLoansUtils.buttonAnalytics({
            name: 'download button'
          });
        }

      });

      $scope.init();

    }

  ]);


  return payOffQuoteModule;
});

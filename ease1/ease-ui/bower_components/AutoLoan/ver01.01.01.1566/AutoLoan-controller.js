define(['angular'], function(angular) {
  'use strict';
  var PATH = '/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/';

  var AutoLoanController = angular.module('AutoLoanModule.controller',
      ['EaseProperties']);
  AutoLoanController.controller('AutoLoanController',
      ['$scope', '$state', '$timeout', '$filter','$stateParams','$controller', 'accountDetailsData',
        'EaseConstant', 'i18nData', 'autoLoanModuleService',
        'accountSummaryData', 'messagingService','AutoLoanStateService','AutoLoanPubsubService',
        'autoLoanDueDateChangeService', 'autoLoanPaymentService', 'carPayCatchUpService',
        function($scope, $state, $timeout, $filter,$stateParams, $controller, accountDetailsData, EaseConstant,
                 i18nData, autoLoanModuleService,
                 accountSummaryData, messagingService, AutoLoanStateService, AutoLoanPubsubService,
                 autoLoanDueDateChangeService, autoLoanPaymentService, carPayCatchUpService) {
          $controller('AccountDetailsParentController', {
            $scope: $scope,
            accountDetailsData: accountDetailsData
          });

          // $scope.$on('$locationChangeStart', function(event, toState, toParams, fromState, fromParams) {
          // this function can be used to cancel the navigation to L2 state
          //   evt.preventDefault();
          // })
          $scope.takeMeToPayCatchUp = function(evt) {
            $scope.focusId = evt.target.id;
            AutoLoanPubsubService.trackClickEvent({name : 'options:link'});
            $state.go('carPayCatchUp', {
              ProductName: $stateParams.ProductName,
              accountReferenceId: accountDetailsData.accountDetails.accountReferenceId
            });
          };

          // code to handle refresh urls
          var onLocationChange = function(event, toState, toParams, fromState, fromParams) {

            if ($stateParams.accountDetails.url) {
              var parts = $stateParams.accountDetails.url.split('/');
              var parent = parts[parts.length-2];
              var action = parts[parts.length - 1];
              switch (action) {
                case'autoLoanTracker' :
                  if (fromState.name==='autoLoanTracker' && toState.name==='AutoLoanDetails.transactions') {
                    AutoLoanStateService.goToLoanDetails(accountDetailsData);
                  } else {
                    AutoLoanStateService.goToLoanTrackerState(accountDetailsData);
                  }
                  onRouteChangeOff();
                  break;
                case 'Pay' :
                  if (parent==='autoLoanTracker') {
                    AutoLoanStateService.goToLoanTrackerState(accountDetailsData);
                  } else if (parent==='carPayCatchUp') {
                    AutoLoanStateService.goToCarPayCatchUpState(accountDetailsData);
                  } else {
                    AutoLoanStateService.goToLoanPaymentState(accountDetailsData);
                  }
                  onRouteChangeOff();
                  break;
                case 'carPayCatchUp' :
                  if (fromState.name==='carPayCatchUp' && toState.name==='AutoLoanDetails.transactions') {
                    AutoLoanStateService.goToLoanDetails(accountDetailsData);
                  } else {
                    AutoLoanStateService.goToCarPayCatchUpState(accountDetailsData);
                  }
                  onRouteChangeOff();
                  break;
                case 'loanDetails' :
                  AutoLoanStateService.goToLoanDetailsState(accountDetailsData);
                  onRouteChangeOff();
                  break;
                case 'paymentDetails' :
                  AutoLoanStateService.goToPaymentDetailsState(accountDetailsData);
                  onRouteChangeOff();
                  break;
                case 'events' :
                  AutoLoanStateService.goToLoanTrackerState(accountDetailsData);
                  onRouteChangeOff();
                  break;
                case 'moreServices' :
                  AutoLoanStateService.goToMoreServicesState(accountDetailsData);
                  onRouteChangeOff();
                  break;
                case 'dueDateChange' :
                  AutoLoanStateService.goToDuedateChangeState(accountDetailsData);
                  onRouteChangeOff();
                  break;
                case 'PaperlessPreference':
                  AutoLoanStateService.goToPaperlessPreference();
                  onRouteChangeOff();
                  break;
                default :
              }
            }
          };
          ///  do not remove or move this line from here , it will cause issue with Page Refresh
          var onRouteChangeOff = $scope.$on('$stateChangeSuccess', onLocationChange);



          //End


          var vm = this;
          var L2MakePaymentClickFlg = false;

          $scope.messagingService = messagingService;
          $scope.autoLoanModuleService = autoLoanModuleService;

          if (autoLoanModuleService.isFeatureEnabled('ease.coaf.makeapayment')) {
            $scope.makeAPaymentEnabled = true;
          }

          if (autoLoanModuleService.isFeatureEnabled('ease.coaf.tendaypayoffquote')) {
            $scope.tenDayPayOffQuoteEnabled = true;
          }

          if (autoLoanModuleService.isFeatureEnabled('ease.coaf.autoloantracker')) {
            $scope.autoLoanTrackerEnabled = true;
          }

          if (autoLoanModuleService.isFeatureEnabled('ease.coaf.accountextensibility')) {
            $scope.isAutoLoanAccountExtensibilityEnabled = true;
          }

          if (autoLoanModuleService.isFeatureEnabled('ease.coaf.accountMessages')) {
            $scope.isAccountMessagingFeatureEnabled = true;
          }

          if (autoLoanModuleService.isFeatureEnabled('ease.coaf.activecpcumessage')) {
            $scope.isActiveCpCuMessagingEnabled = true;
          }

          if (autoLoanModuleService.isFeatureEnabled('ease.coaf.pastduemessage')) {
            $scope.isPastDueMessagingFeatureEnabled = true;
          }

          var isPastDue = function() {
            return accountDetailsData.accountDetails.dueDate && accountDetailsData.accountDetails.totalAmountDue;
          };

          for (var i=0; accountSummaryData.accounts && i < accountSummaryData.accounts.length; i++) {
            var account = accountSummaryData.accounts[i];
            if (account.category === 'AL') {
              var accountNumber = account.accountNumberTLNPI.substring(0, 13);
              if (accountNumber === accountDetailsData.accountDetails.displayAccountNumber) {
                accountDetailsData.accountDetails.accountNickname = account.displayName;
                accountDetailsData.accountDetails.isPrimaryBorrower = true;
                if (account.customerRole === 'Co-Borrower') {
                  accountDetailsData.accountDetails.isPrimaryBorrower = false;
                }
                break;
              }
            }
          }

          var ddcStatusCodes = ['Completed', 'Incomplete', 'Pending'];
          var isLetterRequired = false;
          var dueDateChangeMessage =i18nData.coaf.dueDateChange;
          var needBothBorrowerSignatureMessage = dueDateChangeMessage.ddcBothBorrowersSignMessage.message.v1;
          var needBorrowerSignatureMessage = dueDateChangeMessage.ddcBorrowerOnlySignMessage.message.v1;
          var eSignLinkMessage = dueDateChangeMessage.dueDateChangeEsignLinkMessage.message.v1;

          autoLoanDueDateChangeService.getDDCHistory(autoLoanModuleService
                  .getAccountDetailsData().accountDetails.autoLoanAccountReferenceId,
              ddcStatusCodes)
              .then(function(data) {
                var accountDetails = autoLoanModuleService.getAccountDetailsData().accountDetails;
                autoLoanDueDateChangeService.setIsBorrowerRequested(accountDetails.isPrimaryBorrower);
                if (data.entries.length>0) {
                  isLetterRequired = data.entries[0].isLetterRequired;
                }
                vm.ddcHistoryMessage = autoLoanDueDateChangeService.createDDCHistoryMessage(data.entries);

                if ((vm.ddcHistoryMessage === needBothBorrowerSignatureMessage)
                  ||(vm.ddcHistoryMessage === needBorrowerSignatureMessage)) { 
                  vm.displayESignLink = eSignLinkMessage; 
                }
              });
          var accountDetailsPubSub = {
            level2: 'account details'
          };
          // create the past due message on L2
          if ($scope.isPastDueMessagingFeatureEnabled || $scope.isActiveCpCuMessagingEnabled) {
            var statuses = ['Open'];
            var pastDueAccountType;
            carPayCatchUpService.getPaymentCatchupPlans(autoLoanModuleService
              .getAccountDetailsData().accountDetails.autoLoanAccountReferenceId, statuses)
              .then(function(data) {
                vm.pastDueMessage = carPayCatchUpService.createPastDueMessage(data.entries);
                vm.paymentCatchupPlanMessage = carPayCatchUpService.createPaymentCatchupPlanMessage(data.entries);
                if ($scope.isPastDueMessagingFeatureEnabled && vm.pastDueMessage) {
                  pastDueAccountType = {accountType: 'past due'};
                } else if ($scope.isActiveCpCuMessagingEnabled && vm.paymentCatchupPlanMessage) {
                  pastDueAccountType = {accountType: 'cpcu'};
                } else if (!vm.pastDueMessage && vm.paymentCatchupPlanMessage) {
                  AutoLoanPubsubService.trackPageView(accountDetailsPubSub);
                }
              AutoLoanPubsubService.trackPageViewTrackAccountType(pastDueAccountType,accountDetailsPubSub);
            });
           } else {
             AutoLoanPubsubService.trackPageView(accountDetailsPubSub);
            }
          $scope.continueToEDocSign = function(evt) {
            vm.focusId = evt.target.id;
            if (vm.ddcHistoryMessage === needBothBorrowerSignatureMessage
               || vm.ddcHistoryMessage === needBorrowerSignatureMessage) {
              var accountDetails = autoLoanModuleService.getAccountDetailsData().accountDetails;
              autoLoanDueDateChangeService.setAppnId(accountDetails.loanApplicationId);
              autoLoanDueDateChangeService.setIsBorrowerRequested(accountDetails.isPrimaryBorrower);
              autoLoanDueDateChangeService.continueToSignWithLetter(accountDetails.accountReferenceId, isLetterRequired)
                .then(function() {
                $state.go('AutoLoanDetails.transactions.dueDateChangeEDoc');
              });
            }
          };

          $scope.scheduledTransactionExists =
            (accountDetailsData.transactions.scheduled && accountDetailsData.transactions.scheduled.length);
          $scope.pendingTransactionExists = (accountDetailsData.transactions.pending &&
          accountDetailsData.transactions.pending.length);
          $scope.postedTransactionExists = (accountDetailsData.transactions.entries &&
          accountDetailsData.transactions.entries.length);

          $scope.transactionsExists = $scope.scheduledTransactionExists || $scope.pendingTransactionExists
            || $scope.postedTransactionExists;
          autoLoanModuleService.setI18n(i18nData);

          //Sorting transactions - START
          EaseConstant.sortConstantKeys.kTransactionDate = 'date';
          EaseConstant.descendingSort.scheduled = false;
          EaseConstant.descendingSort.pending = false;
          $controller('AccountDetailsTransactionController', {
            $scope: $scope,
            accountDetailsData: $scope.accountDetailsData,
            accountTransactionsData: $scope.accountDetailsData.transactions
          });
          //Sorting transactions - END

          $scope.LoanDetails = function(evt) {
            if (!autoLoanModuleService.getDisableMakeAPayment()) {
              $scope.focusId = evt.target.id;
              $state.go('AutoLoanDetails.transactions.loanDetails');
            }
          };

          autoLoanModuleService.setAccountDetailsData(accountDetailsData);

          $scope.PayNow = function(evt) {
            $scope.L2MakePaymentClick();
            autoLoanModuleService.setDisableMakeAPayment(true);
            if ($scope.isL2MakePaymentClick()) {
              autoLoanModuleService.enableSpinner(true);
              L2MakePaymentClickFlg = false;
            }
            AutoLoanPubsubService.trackButtonClickEvent('COAF L2 HERO Button');
            autoLoanModuleService.setI18n(i18nData);
            autoLoanModuleService.setFocusId('accountPayment');
            autoLoanPaymentService.payNow();
          };

          $scope.isMakeAPaymentDisabled = function() {
            return autoLoanModuleService.getDisableMakeAPayment();
          };

          $scope.isSpinnerEnabled = function() {
            return autoLoanModuleService.isSpinnerEnabled();
          };

          $scope.L2MakePaymentClick = function() {
            L2MakePaymentClickFlg = true;
          };

          $scope.isL2MakePaymentClick = function() {
            return L2MakePaymentClickFlg;
          };

          $scope.PayDetails = function(evt) {
            if (autoLoanModuleService.isMakeAPaymentButtonVisible()
              && !autoLoanModuleService.getDisableMakeAPayment()) {
              $scope.focusId = evt.target.id;
              $state.go('AutoLoanDetails.transactions.paymentDetails', {
                ProductName: $stateParams.ProductName,
                accountReferenceId: accountDetailsData.accountDetails.accountReferenceId,
                'referenceId': accountDetailsData.accountDetails.accountReferenceId
              });
            }
          };

          $scope.ShowMoreServices = function(evt) {
            $scope.focusId = evt.target.id;
            $state.go('AutoLoanDetails.transactions.moreServices');
          };


          // lob specific controller code goes below
          $scope.InitilizeTemplate();

          $scope.productType = PATH + 'partials/AutoLoan-detail.html';
          $scope.transactionType = PATH + 'partials/AutoLoan-transactions.html';



          vm.i18n = i18nData;

          if (autoLoanModuleService.isMakeAPaymentButtonVisible()) {
            $scope.buttonText = vm.i18n.coaf.accountSummary.accountDetails.makeAPayment.button.v1;
            autoLoanModuleService.setDisableMakeAPayment(false);
            if (isPastDue()) {
              $scope.textAboveButton = $filter('currency')(accountDetailsData.accountDetails.totalAmountDue) + ' '
                + vm.i18n.coaf.accountSummary.accountDetails.due.label.v1 + ' '
                + $filter('uppercase')($filter('date')(accountDetailsData.accountDetails.dueDate, 'MMM')) + ' '
                + $filter('date')(accountDetailsData.accountDetails.dueDate, 'd');
            }
          }

        }]);

  AutoLoanController.controller('AutoLoanTransactionController',
    function($state, $scope, $controller, autoLoanModuleService) {

      if (autoLoanModuleService.isFeatureEnabled('ease.coaf.transactions')) {
        $scope.transactionsEnabled = true;
      }

      $scope.reloadTransactions = function(evt) {
        $state.go($state.current, {}, {reload: true});
      };

      if ($scope.scheduledTransactions) {
        $scope.scheduledTransactions.forEach(function(entry) {
          entry.isDPayRecurringTransaction = function() {
            return (entry.transactionDescription === 'DirectPay Recurring Payment');
          };

          entry.isPaymentPlanFailed = function() {
            if (entry.transactionDescription === 'DirectPay Recurring Payment') {
              return !(entry.bankName && entry.fromAccountNumber && entry.accountType && entry.paymentFrequency);
            }
          };
        });
      }

      var i = 0;
      //generating ids for pending transactions
      if ($scope.pendingTransactions) {
        $scope.pendingTransactions.forEach(function(entry) {
          entry.id = i;
          i++;
        });
      }
      //generating ids for posted transactions
      i = 0;
      if ($scope.displayTransactions) {
        $scope.displayTransactions.forEach(function(entry) {
          entry.id = i;
          i++;
        });
      }

      //Below line has to be called after parent controller
      // transactionsController in AccountDetails-controller is called.
      var pendingAndPostedTransactionsArray = [];

      if ($scope.pendingTransactions) {
        pendingAndPostedTransactionsArray = pendingAndPostedTransactionsArray.concat($scope.pendingTransactions);
      }
      if ($scope.displayTransactions) {
        pendingAndPostedTransactionsArray = pendingAndPostedTransactionsArray.concat($scope.displayTransactions);
      }

      var currentDate = new Date();
      var currentYear = currentDate.getFullYear();
      var accountReferenceId = autoLoanModuleService.getAccountDetailsData().accountDetails.accountReferenceId;
      autoLoanModuleService.getPaymentPlanCurrentDate(accountReferenceId).then(function(data) {
        currentDate = new Date(data.currentDate + 'T12:00:00');
        currentYear = currentDate.getFullYear();
      });
      var previousYear = currentYear - 1;
      var previousYearMinusOne = previousYear - 1;
      $scope.currentYear = currentYear;
      $scope.previousYear = previousYear;
      $scope.previousYearMinusOne = previousYearMinusOne;
      $scope.currentYearTransactions = [];
      $scope.previousYearTransactions = [];
      $scope.previousYearMinusOneTransactions = [];

      var groupPendingAndPostedTransactionsByYear = function(transaction) {
        var transactionDate = new Date(transaction.date);
        if (transactionDate) {
          if (transactionDate.getFullYear() === currentYear) {
            $scope.currentYearTransactions.push(transaction);
          } else if (transactionDate.getFullYear() === previousYear) {
            $scope.previousYearTransactions.push(transaction);
          } else if (transactionDate.getFullYear() === previousYearMinusOne) {
            $scope.previousYearMinusOneTransactions.push(transaction);
          }
        }
      };

      if (pendingAndPostedTransactionsArray) {
        pendingAndPostedTransactionsArray.forEach(groupPendingAndPostedTransactionsByYear);
      }
    });
  return AutoLoanController;
});

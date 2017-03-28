define([
  'angular',
  'StatementModule',
  'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/AutoLoan-service.js?',
  'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/utils/i18n/localize.js?'
], function(angular) {
  'use strict';

  var AutoLoanModule = angular.module('AutoLoanModule', ['ui.router', 'restangular', 'oc.lazyLoad',
    'EaseProperties', 'easeAppUtils', 'ngAnimate', 'StatementModule']);

  AutoLoanModule.config(function($stateProvider, $ocLazyLoadProvider, easeTemplatesProvider,
                                 easeFilesProvider, EaseConstant, paymentStateProvider, addAccountStateProvider) {

    var basePath = './ease-ui/bower_components/AutoLoan/';
    var versionedBasePath = basePath + 'ver01.01.01.1566/';

    $ocLazyLoadProvider.config({
      modules: [
        {
          name: 'AccountFeature',
          files: [versionedBasePath + 'features/accountfeature/accountFeature.js']
        }, {
          name: 'CarPayCatchUp',
          files: [versionedBasePath + 'features/carPayCatchUp/carPayCatchUp.js']
        }, {
          name: 'PastDue',
          files: [versionedBasePath + 'features/pastDuePayment/pastDue.js']
        }, {
          name: 'PastDue',
          files: [versionedBasePath + 'features/pastDuePayment/pastDue.js']
        }, {
          name: 'PaperlessPreference',
          files: [versionedBasePath + 'features/paperlessPreference/paperless-preference.js']
        }
      ]
    });

    function getI18nData(AutoLoanLocalizeService) {
      return AutoLoanLocalizeService.get('ease');
    }

    var AutoLoanState = {
      params: {
        accountDetails: ''
      },
      name: 'AutoLoanDetails',
      url: '/{ProductName}/{accountReferenceId}',
      'abstract': true,
      resolve: {
        'accountDetailsData': function($q, $ocLazyLoad, $injector, $stateParams) {
          return $ocLazyLoad.load({
            name: 'UMMPaymentModule',
            files: [easeFilesProvider.get('services', 'UMMPayment')]
          }).then(function() {
            var deferred = $q.defer();
            $injector.get('autoLoanModuleService').fetchAccountDetailData($stateParams.accountReferenceId, deferred);
            return deferred.promise;
          });
        },
        'accountServiceFeatures': function($q, $ocLazyLoad, $injector, $stateParams) {
          return $ocLazyLoad.load({
            name: 'UMMPaymentModule',
            files: [easeFilesProvider.get('services', 'UMMPayment')]
          }).then(function() {
            var deferred = $q.defer();
            $injector.get('autoLoanModuleService').loadAccountServiceFeatures(
              $stateParams.accountReferenceId,
              deferred);
            return deferred.promise;
          });
        },
        'autoloanStateService' : function($ocLazyLoad,$injector) {
          return $ocLazyLoad.load({
            name : 'AutoLoanStateServiceModule',
            files: [versionedBasePath + 'AutoLoan-stateService.js']
          }).then(function() {
            return $injector.get('AutoLoanStateService');
          });
        },
        'UmmPaymentFactory': function($ocLazyLoad, $injector) {
          return $ocLazyLoad.load({
            name : 'UMMPaymentModule',
            files: [easeFilesProvider.get('services', 'UMMPayment')]
          }).then(function() {
            return $injector.get('UmmPaymentFactory');
          });
        },
        'AutoLoanController': function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'AutoLoanModule.controller',
            files: [versionedBasePath + 'AutoLoan-controller.js']
          });
        },
        'AutoLoanDirectives': function getAutoLoanDirectives($ocLazyLoad) {
          return $ocLazyLoad.load({
            files: [
              versionedBasePath + 'AutoLoan-accordion.js',
              versionedBasePath + 'directives/makeAPayment-directive.js',
              versionedBasePath + 'directives/accountMessages-directive.js',
              versionedBasePath + 'directives/autoloan-carousel/autoloan-carousel.js',
              versionedBasePath + 'features/carPayCatchUp/cancel-payment.directive.js'

            ]
          });
        },
        'accountSummaryData': function(summaryService) {
          return summaryService.get();
        },
        'autoLoanDetailsDependencies': function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'AutoLoanDetailsModule',
            files: [
              versionedBasePath + 'AutoLoan-loanDetails.js'
            ]
          });
        },
        'paydownDependencies': function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'AutoLoanPayDownView',
            files: [
              versionedBasePath + 'AutoLoan-payDownViewController.js'
            ]
          }).then(function() {
            return $ocLazyLoad.load({
              name: 'AutoLoanPayDownView',
              files: [versionedBasePath + 'AutoLoan-payDownViewService.js']
            })
          });
        },
        'dueDateChangeDependencies': function($ocLazyLoad) {
          return $ocLazyLoad.load(
            [
              versionedBasePath + 'features/dueDateChange/dueDateChange-controller.js',
              versionedBasePath + 'features/dueDateChange/dueDateChangeEDoc-controller.js',
              versionedBasePath + 'features/dueDateChange/dueDateChangeError-controller.js',
              versionedBasePath + 'features/dueDateChange/email-controller.js',
              versionedBasePath + 'features/dueDateChange/dueDateChangeSuccess-controller.js',
              versionedBasePath + 'features/dueDateChange/electronicDeliveryDisclosureNotice-controller.js'
            ]
          ).then(function() {
            $ocLazyLoad.load([
              versionedBasePath + 'features/dueDateChange/dueDateChange-service.js'
            ])
          })
        },
        'pastDuePaymentDependencies': function($ocLazyLoad) {
          return $ocLazyLoad.load('PastDue');
        },

        'payCatchUpDependencies': function($ocLazyLoad) {
          return $ocLazyLoad.load('CarPayCatchUp');
        },

        'autoLoanAccountFeaturesDependencies': function($ocLazyLoad) {
          return $ocLazyLoad.load('AccountFeature');
        },

        'autoLoanStatementDependencies': function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'AutoLoanStatementsModule',
            files: [
              versionedBasePath + 'features/statements/statements-controller.js'
            ]
          }).then(function() {
            return $ocLazyLoad.load({
              name: 'AutoLoanStatementsModule',
              files: [
                versionedBasePath + 'features/statements/statements-service.js',
                versionedBasePath + 'features/statements/directives/statementsCalendar-directive.js']
            })
          });
        },
        'statementsDependencies': function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'StatementModule',
            files: [
              easeFilesProvider.get('controller', 'Statement'),
              easeFilesProvider.get('service', 'Statement'),
              easeFilesProvider.get('directive', 'Statement')]
          });
        },

        'pubsubDependencies': function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'AutoLoanPubsubService',
            files: [versionedBasePath + 'features/pubsub/pubsub-service.js']
          });
        },


        'AutoLoanConstantDependencies': function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'AutoLoanConstant',
            files: [versionedBasePath + 'AutoLoan-constant.js']
          });
        },
        'i18nData': getI18nData
      },
      controller: 'AutoLoanController',
      controllerAs: 'aDetails',
      templateUrl: easeTemplatesProvider.get('AccountDetail')
    };

    var AutoLoanTransactionsState = {
      name: 'AutoLoanDetails.transactions',
      url: '',
      parent: AutoLoanState,
      controller: 'AutoLoanTransactionController',
      templateUrl: versionedBasePath + 'partials/AutoLoan-transactions.html',
      resolve: {
        'paperlessDependencies': function($ocLazyLoad) {
          return $ocLazyLoad.load('PaperlessPreference');
        }
      }
    };

    var loanDetailsModal = {
      name: 'AutoLoanDetails.transactions.loanDetails',
      url: '/loanDetails',
      parent: AutoLoanTransactionsState,
      controller: 'AutoLoanDetailsController',
      controllerAs: 'alDetails',
      templateUrl: versionedBasePath + 'partials/AutoLoan-loan-details.html'
    };

    var paymentDetailsModal = {
      params: {
        fromState: 'paymentDetailsModal'
      },
      name: 'AutoLoanDetails.transactions.paymentDetails',
      url: '/paymentDetails',
      parent: AutoLoanTransactionsState,
      controller: 'AutoLoanPaymentDetails',
      controllerAs: 'alPaymentDetails',
      templateUrl: versionedBasePath + 'partials/AutoLoan-PaymentDetails.html'
    };

    var moreServicesModalState = {
      name: 'AutoLoanDetails.transactions.moreServices',
      url: '/moreServices',
      parent: AutoLoanTransactionsState,
      resolve: {
        'autoLoanDDCEligibility': function($q, $ocLazyLoad, $injector, $stateParams) {
          var deferred = $q.defer();
          $injector.get('autoLoanDueDateChangeService').getEligibility($stateParams.accountReferenceId, deferred);
          return deferred.promise;

        }

      },
      controller: 'AutoLoanAccountMoreFeaturesController',
      controllerAs: 'autoLoanAccountMoreFeaturesController',
      templateUrl: versionedBasePath + 'features/accountfeature/partials/accountMoreFeatures.html'
    };

    var paperlessPreferenceState = {
      name: 'paperlessPreference',
      url: '/PaperlessPreference',
      parent: AutoLoanTransactionsState,
      controller: 'paperlessPreferenceController',
      controllerAs: 'paperlessPreferenceController',
      templateUrl: versionedBasePath + 'features/paperlessPreference/partials/paperless-preference.html'
    };


    var autoLoanTrackerState = {
      params: {
        accountDetails: ''
      },
      'i18nData': getI18nData,
      name: 'autoLoanTracker',
      url: '/{ProductName}/{accountReferenceId}/autoLoanTracker',
      controller: 'AutoLoanPayDownViewController',
      controllerAs: 'alPayDownView',
      templateUrl: versionedBasePath + 'partials/AutoLoan-Tracker.html'
    };

    /* CAR PAY CATCH UP */
    var carPayCatchUpState = {
      params: {
        accountDetails: ''
      },
      'i18nData': getI18nData,
      name: 'carPayCatchUp',
      url: '/{ProductName}/{accountReferenceId}/carPayCatchUp',
      controller: 'CarPayCatchUpController',
      controllerAs: 'carPayCatchUpController',
      templateUrl: versionedBasePath + 'features/carPayCatchUp/partial/car-pay-catch-up-view.html'
    };
    var pastDueDisclaimerModalFromCPCU = {
      params: {
        fromState: ''
      },
      name: 'pastDueDisclaimerCPCU',
      url: '/pastDueDisclaimer',
      parent: carPayCatchUpState,
      controller: 'PastDueDisclaimerController',
      controllerAs: 'pastDueDisclaimerController',
      templateUrl: versionedBasePath + 'features/pastDuePayment/partial/past-due-disclaimer.html'
    };
    var helpIsOnTheWayModal = {
      name: 'helpIsOnTheWay',
      url: '/helpIsOnTheWay',
      parent: carPayCatchUpState,
      controller: 'HelpIsOnTheWayController',
      controllerAs: 'helpIsOnTheWayController',
      templateUrl: versionedBasePath + 'features/carPayCatchUp/partial/help-is-on-the-way.html'
    };
    var monthlyPaymentModal = {
      name: 'monthlyPayment',
      url: '/monthlyPayment',
      parent: carPayCatchUpState,

      resolve: {
        'cpcuPaymentDates': function($q, $ocLazyLoad, $injector, $stateParams,autoLoanModuleService,
                                      carPayCatchUpService) {
          return autoLoanModuleService.getPaymentPlanCurrentDate($stateParams.accountReferenceId)
            .then(function(data) {
              var deferred = $q.defer();
              var dateFormat = 'YYYY-MM-DD';
              autoLoanModuleService.setCurrentDate(data.currentDate);
              var requestParamsMap = {'includeRestrictions':true,'startDate':autoLoanModuleService
                .formatDate(data.currentDate,dateFormat,dateFormat),
                'endDate':autoLoanModuleService.addDaysToDate(data.currentDate,dateFormat,14,dateFormat)};
              carPayCatchUpService.getPaymentDates($stateParams.accountReferenceId,requestParamsMap, deferred);
              return deferred.promise;
            });
        }
      },
      controller: 'MonthlyPaymentController',
      controllerAs: 'monthlyPaymentController',
      templateUrl: versionedBasePath + 'features/carPayCatchUp/partial/monthly-payment-modal.html'
    };
    var whatAboutByDateModal = {
      name: 'whatAboutByDate',
      url: '/whatAboutByDate',
      parent: carPayCatchUpState,
      controller: 'WhatAboutByDateController',
      controllerAs: 'whatAboutByDateController',
      templateUrl: versionedBasePath + 'features/carPayCatchUp/partial/what-about-by-date.html'
    };
    var cpcuContactUsModal = {
      name: 'cpcuContactUs',
      url: '/ContactUs',
      parent: carPayCatchUpState,
      controller: 'CPCUContactUsController',
      controllerAs: 'cpcuContactUsController',
      templateUrl: versionedBasePath + 'features/carPayCatchUp/partial/contact-us.html'
    };
    var cpcuCancelPaymentModal = {
      name: 'cpcuCancelPayment',
      url: '/CancelPayment',
      parent: carPayCatchUpState,
      controller: 'CancelPaymentController',
      controllerAs: 'cancelPaymentController',
      templateUrl: versionedBasePath + 'features/carPayCatchUp/partial/cancel-payment.html'
    };
    var planSummaryModal = {
      name: 'planSummary',
      url: '/planSummary',
      parent: carPayCatchUpState,
      controller: 'PlanSummaryController',
      controllerAs: 'planSummaryController',
      templateUrl: versionedBasePath + 'features/carPayCatchUp/partial/plan-summary.html'
    };
    var reviewPlanModal = {
      name: 'reviewPlan',
      url: '/reviewPlan',
      parent: carPayCatchUpState,
      controller: 'ReviewPlanController',
      controllerAs: 'reviewPlanController',
      templateUrl: versionedBasePath + 'features/carPayCatchUp/partial/review-plan.html'
    };

    var carPayCatchupConfirmationModal = {
      name: 'carPayCatchupConfirmation',
      url: '/carPayCatchupConfirmation',
      parent: carPayCatchUpState,
      controller: 'CarPayCatchupConfirmationController',
      controllerAs: 'carPayCatchupConfirmationController',
      templateUrl: versionedBasePath + 'features/carPayCatchUp/partial/success.html'
    };

    var customizePlanModal = {
      name: 'customizePlan',
      url: '/customizePlan',
      parent: carPayCatchUpState,
      controller: 'CustomizePlanController',
      controllerAs: 'customizePlanController',
      templateUrl: versionedBasePath + 'features/carPayCatchUp/partial/customize-plan.html'
    };
    var selectPaymentAccountModal = {
      name: 'selectPaymentAccount',
      url: '/selectPaymentAccount',
      params: {defaultAccount:null},
      parent: carPayCatchUpState,
      controller: 'SelectPaymentAccountController',
      controllerAs: 'selectPaymentAccountController',
      templateUrl: versionedBasePath + 'features/carPayCatchUp/partial/select-payment-account.html'
    };
    var areYouSureModal = {
      name: 'areYouSure',
      url: '/areYouSure',
      parent: carPayCatchUpState,
      controller: 'AreYouSureController',
      controllerAs: 'areYouSureController',
      templateUrl: versionedBasePath + 'features/carPayCatchUp/partial/are-you-sure.html'
    };









    var eventsHistoryState = {
      name: 'autoLoanTracker.eventsHistory',
      url:'/events',
      parent: autoLoanTrackerState,
      controller: 'AutoLoanEventsController',
      controllerAs: 'autoLoanEventsController',
      templateUrl: versionedBasePath + 'partials/AutoLoan-events.html'
    };

    var showStatementsState = {
      name: 'AutoLoanDetails.transactions.showStatements',
      url: '/statements',
      parent: AutoLoanTransactionsState,
      controller: 'AutoLoanStatementsController',
      controllerAs: 'statementsController',
      templateUrl: versionedBasePath + 'features/statements/partials/AutoLoan-statements.html'
    };

    /* Past Due Payments */
    var pastDuePaymentModal = {
      params: {
        fromState: ''
      },
      name: 'AutoLoanDetails.transactions.pastDuePayment',
      url: '/pastDuePayment',
      parent: AutoLoanTransactionsState,
      controller: 'PastDuePaymentController',
      controllerAs: 'pastDuePaymentController',
      templateUrl: versionedBasePath + 'features/pastDuePayment/partial/past-due-payment.html'
    };
    var pastDueDisclaimerModal = {
      params: {
        fromState: ''
      },
      name: 'pastDueDisclaimer',
      url: '/pastDueDisclaimer',
      parent: AutoLoanTransactionsState,
      controller: 'PastDueDisclaimerController',
      controllerAs: 'pastDueDisclaimerController',
      templateUrl: versionedBasePath + 'features/pastDuePayment/partial/past-due-disclaimer.html'
    };

    /* Due Date Change */
    var dueDateChangeModal = {
      name: 'AutoLoanDetails.transactions.dueDateChange',
      url: '/dueDateChange',
      parent: AutoLoanTransactionsState,
      controller: 'AutoLoanDueDateChangeController',
      controllerAs: 'autoLoanDueDateChangeController',
      templateUrl: versionedBasePath + 'features/dueDateChange/partials/dueDateChange.html'
    };
    var dueDateChangeEDoc = {
      name: 'AutoLoanDetails.transactions.dueDateChangeEDoc',
      url: '/dueDateChangeEDoc',
      parent: AutoLoanTransactionsState,
      controller: 'AutoLoanDueDateChangeEDocController',
      controllerAs: 'autoLoanDueDateChangeEDocController',
      templateUrl: versionedBasePath + 'features/dueDateChange/partials/dueDateChangeEDoc.html'
    };
    var dueDateChangeError = {
      name: 'AutoLoanDetails.transactions.dueDateChangeError',
      url: '/dueDateChangeError',
      parent: AutoLoanTransactionsState,
      controller: 'AutoLoanDueDateChangeErrorController',
      controllerAs: 'autoLoanDueDateChangeErrorController',
      templateUrl: versionedBasePath + 'features/dueDateChange/partials/dueDateChangeError.html'
    };
    var emailModal = {
      name: 'AutoLoanDetails.transactions.emailModal',
      url: '/emailModal',
      parent: AutoLoanTransactionsState,
      controller: 'EmailController',
      controllerAs: 'emailController',
      templateUrl: versionedBasePath + 'features/dueDateChange/partials/email.html'
    };
    var dueDateChangeSuccess = {
      name: 'AutoLoanDetails.transactions.dueDateChangeSuccess',
      url: '/dueDateChangeSuccess',
      parent: AutoLoanTransactionsState,
      controller: 'AutoLoanDueDateChangeSuccessController',
      controllerAs: 'autoLoanDueDateChangeSuccessController',
      templateUrl: versionedBasePath + 'features/dueDateChange/partials/dueDateChangeSuccess.html'
    };
    var electronicDeliveryDisclosureNotice = {
      name: 'AutoLoanDetails.transactions.electronicDeliveryDisclosureNotice',
      url: '/electronicDeliveryDisclosureNotice',
      parent: AutoLoanTransactionsState,
      controller: 'ElectronicDeliveryDisclosureNoticeController',
      controllerAs: 'electronicDeliveryDisclosureNoticeController',
      templateUrl: versionedBasePath + 'features/dueDateChange/partials/electronicDeliveryDisclosureNotice.html'
    };
    var carPayCatchupError = {
      name: 'AutoLoanDetails.transactions.carPayCatchupError',
      url: '/carPayCatchupError',
      parent: carPayCatchUpState,
      controller: 'AutoLoanCarPayCatchupErrorController',
      controllerAs: 'autoLoanCarPayCatchupErrorController',
      templateUrl: versionedBasePath + 'features/carPayCatchUp/partial/carPayCatchupError.html'
    };

    $stateProvider.state(AutoLoanState);
    $stateProvider.state(AutoLoanTransactionsState);
    $stateProvider.state(loanDetailsModal);
    $stateProvider.state(paymentDetailsModal);
    $stateProvider.state(moreServicesModalState);
    $stateProvider.state(showStatementsState);

    /* Paperless */

    $stateProvider.state(paperlessPreferenceState);


    /* PAST DUE DISCLAIMER */
    $stateProvider.state(pastDuePaymentModal);
    $stateProvider.state(pastDueDisclaimerModal);

    /* AUTOLOAN TRACKER */
    $stateProvider.state(autoLoanTrackerState);
    $stateProvider.state(eventsHistoryState);

    /* DUE DATE CHANGE */
    $stateProvider.state(dueDateChangeModal);
    $stateProvider.state(dueDateChangeEDoc);
    $stateProvider.state(dueDateChangeError);
    $stateProvider.state(dueDateChangeSuccess);
    $stateProvider.state(emailModal);
    $stateProvider.state(electronicDeliveryDisclosureNotice);

    /* CAR PAY CATCH UP */
    $stateProvider.state(carPayCatchUpState);
    $stateProvider.state(pastDueDisclaimerModalFromCPCU);
    $stateProvider.state(helpIsOnTheWayModal);
    $stateProvider.state(monthlyPaymentModal);
    $stateProvider.state(whatAboutByDateModal);
    $stateProvider.state(cpcuContactUsModal);
    $stateProvider.state(planSummaryModal);
    $stateProvider.state(customizePlanModal);
    $stateProvider.state(areYouSureModal);
    $stateProvider.state(selectPaymentAccountModal);
    $stateProvider.state(carPayCatchupError);
    $stateProvider.state(cpcuCancelPaymentModal);
    $stateProvider.state(reviewPlanModal);
    $stateProvider.state(carPayCatchupConfirmationModal);




    /* PAYMENT */
    paymentStateProvider.set('AutoLoanPayment', AutoLoanTransactionsState, '/Pay');
    paymentStateProvider.set('AutoLoanTrackerPayment', autoLoanTrackerState, '/Pay');
    paymentStateProvider.set('CarPayCatchUpPayment', carPayCatchUpState, '/Pay');
    addAccountStateProvider.set('AutoLoanDetails.transactions.AddExtAccount', AutoLoanTransactionsState);
    addAccountStateProvider.set('autoLoanTracker.AddExtAccount', autoLoanTrackerState);
    addAccountStateProvider.set('carPayCatchUp.AddExtAccount', carPayCatchUpState);
    addAccountStateProvider.set('selectPaymentAccount.AddExtAccount', carPayCatchUpState);
  });

  AutoLoanModule.filter('splitCurrency', ['EASEUtilsFactory', function(EASEUtilsFactory) {
    return function(input, isDollar) {
      if (angular.isNumber(input)) {
        if (isDollar === 'true') {
          return EASEUtilsFactory.commaFormattedFixedByCurrency(Math.floor(input), 'USD');
        } else {
          var cents = Math.round(input * 100) % 100;
          if (cents.toString().length < 2) {
            return '0' + cents;
          }
          return cents;
        }
      }
    };
  }]);

  AutoLoanModule.filter('formatAmount', function($filter) {
    return function(amount) {
      if (amount < 0) {
        return '-' + $filter('currency')(Math.abs(amount).toFixed(2));
      } else {
        return $filter('currency')(amount.toFixed(2));
      }
    };
  });

  AutoLoanModule.filter('nonNegativeAmount', function($filter) {
    return function(amount) {
      if (amount < 0) {
        return $filter('currency')(Math.abs(amount).toFixed(2));
      } else {
        return $filter('currency')(amount.toFixed(2));
      }
    };
  });

  AutoLoanModule.filter('orderByDate', ['EASEUtilsFactory', function(EASEUtilsFactory) {
    return function(items, field, reverse) {

      return EASEUtilsFactory.mapSort(items,
        'date', reverse);

    };
  }]);

  AutoLoanModule.filter('formatPendingScheduledAmount', function($filter) {
    return function(amount) {
      if (amount > 0) {
        return '-' + $filter('currency')(amount.toFixed(2));
      } else {
        return $filter('currency')(Math.abs(amount).toFixed(2));
      }
    };
  });
});

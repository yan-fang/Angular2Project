define(['require', 'angular', 'easeAccordion', 'StatementModule'], function (require, angular) {
  'use strict';
  var HomeLoansDetailModule = angular.module('HomeLoansModule', ['ui.router', 'restangular', 'oc.lazyLoad',
    'EaseProperties', 'easeAppUtils', 'ngAnimate', 'easeAccordion', 'ngAria', 'StatementModule','coreUtils', 'ContentProperties', 'angular-lo-dash']);
  HomeLoansDetailModule.config(function ($stateProvider, easeTemplatesProvider, easeFilesProvider,
                                         paymentStateProvider,EaseConstant,transferStateProvider,addAccountStateProvider) {

    var basePath = '/ease-ui/bower_components/HomeLoans/ver1490643033478';
    var baseTemplatePath = basePath + '/partials';
    var paymentsFeature = basePath + '/features/payments';
    var paymentsFeatureTemplatePath = paymentsFeature + '/partials';
    var loanDetailsFeature = basePath + '/features/loanDetails/';
    var paymentDetailsFeature = basePath + '/features/paymentDetails/';


    var HomeLoansDetailsState = {
      name       : 'HomeLoansDetails',
      url        : '/{ProductName}/{accountReferenceId}',
      abstract   : true,
      params: {
        accountDetails: ''
      },
      resolve    : {
        'UmmPaymentFactory': function ($ocLazyLoad, $injector) {
          return $ocLazyLoad.load({
            name : 'UMMPaymentModule',
            files: [easeFilesProvider.get('services','UMMPayment'),
              basePath + '/HomeLoans-services.js',
              basePath + '/HomeLoans-utils.js']
          }).then(function(){
            return $injector.get("UmmPaymentFactory");
          });
        },
        'HomeLoansConstantDependencies' : ['$ocLazyLoad', function($ocLazyLoad){
          return $ocLazyLoad.load({
            name: 'HomeLoansConstantDependencies',
            files: [basePath + '/HomeLoans-constant.js']
          });
        }],
        'summaryModule': ['UmmPaymentFactory', function(UmmPaymentFactory){
          return require(['AccountSummaryBundle']);
        }],
        'accountServicesModule': function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name : 'accountServicesModule',
            files: ['js!accountServices']
          });
        },
        'i18nData': [ '$http', function ( $http) {
          return $http.get(basePath + '/utils/i18n/resources-locale_en-us.json').then(function(i18n) {
            return i18n.data.HomeLoans;
          });
        }],
        'hlUtils': ['$ocLazyLoad', 'summaryModule', function ($ocLazyLoad, summaryModule) {
          return $ocLazyLoad.load({
            name : 'homeLoansUtils',
            files: [basePath + '/HomeLoans-utils.js']
          });
        }],
        'hlProperties': [ 'hlUtils', '$ocLazyLoad', function (hlUtils, $ocLazyLoad) {
          return $ocLazyLoad.load({
            name : 'homeLoansProperties',
            files: [basePath + '/HomeLoans-properties.js']
          });
        }],
        'HomeLoansService': [ 'UmmPaymentFactory', '$ocLazyLoad', '$injector', 'hlProperties',
          function (UmmPaymentFactory, $ocLazyLoad, $injector, hlProperties) {
            return $ocLazyLoad.load({
              name : 'HomeLoansDetailModule.service',
              files: [basePath + '/HomeLoans-services.js']
            }).then(function () {
              return $injector.get("homeLoansAccountDetailsService");
            });
        }],
        'HomeLoansController': ['$ocLazyLoad', 'HomeLoansService', 'HomeLoansConstantDependencies', function ($ocLazyLoad, HomeLoansService, HomeLoansConstantDependencies) {
          return $ocLazyLoad.load({
            name : 'HomeLoansModule.controller',
            files: [basePath + '/HomeLoans-controller.js']
          });
        }],
        'statementsDependencies': function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name : 'StatementModule',
            files: [easeFilesProvider.get('controller', 'Statement'),
              easeFilesProvider.get('service', 'Statement'),
              easeFilesProvider.get('directive', 'Statement')]
          });
        },
        'HomeLoansStatementController': ['$ocLazyLoad', 'statementsDependencies', function ($ocLazyLoad, statementsDependencies) {
          return $ocLazyLoad.load({
            name : 'HomeLoansStatementController',
            files: [basePath + '/HomeLoans-statements.js']
          });
        }],
        'accountDetailsData':['HomeLoansService', '$ocLazyLoad', '$stateParams', function (HomeLoansService, $ocLazyLoad, $stateParams) {
          var productCategory = $stateParams.accountDetails.lineOfBusiness;
          return HomeLoansService.getHomeLoansAccountDetails(productCategory, $stateParams.accountReferenceId);
        }],
        'homeLoansL2DetailsDependencies': [ '$ocLazyLoad', 'accountDetailsData', function ($ocLazyLoad, accountDetailsData) {
          return $ocLazyLoad.load({
            name : 'HomeLoansDetailsModule',
            files: [loanDetailsFeature +'HomeLoans-l2Details.js']
          });
        }],
        'homeLoansPaymentDependencies': [ '$ocLazyLoad', 'HomeLoansService', 'UmmPaymentFactory',
          function ($ocLazyLoad, HomeLoansService, UmmPaymentFactory) {
            return $ocLazyLoad.load({
              name: 'HomeLoansPaymentModule',
              files: [basePath + '/HomeLoans-payment.js',
                paymentsFeature + '/HomeLoans-payments.js',
                paymentsFeature + '/HomeLoans-paymentsActions.js']
            });
          }
        ],
        'homeLoansMtgPaymentL1Dependencies': ['$ocLazyLoad', 'accountDetailsData', function ($ocLazyLoad, accountDetailsData) {
          return $ocLazyLoad.load({
            name : 'PaymentDetailsL1Module',
            files: [ paymentDetailsFeature + 'HomeLoans-l2PaymentDetails.js']
          });
        }],
        'payoffQuoteDatePickerDependency' : ['$ocLazyLoad', 'accountDetailsData', function($ocLazyLoad, accountDetailsData){
          return $ocLazyLoad.load({
            name : 'payOffQuoteDateModule',
            files: [basePath + '/HomeLoans-POQDPicker.js']
          });
        }],
        'payoffQuotePDFDependency' : ['$ocLazyLoad', 'accountDetailsData', function($ocLazyLoad, accountDetailsData){
          return $ocLazyLoad.load({
            serie : true,
            files: [basePath + '/HomeLoans-POQModule.js'
              , basePath + '/HomeLoans-POQService.js']
          });
        }]
      },
      controller : 'HomeLoansController',
      templateUrl: easeTemplatesProvider.get('AccountDetail')
    };
    var HomeLoansTransactionState = {
      name       : 'HomeLoansDetails.transactions',
      url        : '',
      parent     : HomeLoansDetailsState,
      controller : 'HomeLoansTransactionController',
      templateUrl: baseTemplatePath + '/HomeLoans-transactions.html',
      onEnter    : function (homeLoansAccountDetailsService) {
        homeLoansAccountDetailsService.setInProgress(false);
      }
    };
    var errorModal = {
      name        : 'HomeLoansDetails.transactions.error',
      url         : '/error',
      params      : {
        'errorReason': "Looks like we need to fix something, so we're working on it. " +
        "Try again in a bit or give us a call at 1-877-933-9100 (8:00 AM - 8:00 PM ET)."
      },
      parent      : HomeLoansTransactionState,
      controller  : 'homeLoansErrorController',
      controllerAs: 'hlError',
      templateUrl : baseTemplatePath + '/HomeLoans-error.html'
    };
    var homeEquityDetailsModal = {
      name        : 'HomeLoansDetails.transactions.homeEquityLoanDetailsL2',
      url         : '/loanDetailsHE/',
      parent      : HomeLoansTransactionState,
      onEnter     : function (HomeLoansUtils) {
        HomeLoansUtils.analyticsTracking('account details', 'loan details', '');
      },
      resolve : {
        callModal : function(homeLoansAccountDetailsService){
          return homeLoansAccountDetailsService.showLoanDetailsHE();
        }
      }
    };
    var mortgageLoanDetailsModal = {
      name        : 'HomeLoansDetails.transactions.mortgageLoanDetailsL2',
      url         : '/loanDetailsMTG/',
      parent      : HomeLoansTransactionState,
      onEnter     : function (HomeLoansUtils) {
        HomeLoansUtils.analyticsTracking('account details', 'loan details', '');
      },
      resolve : {
        callModal : function(homeLoansAccountDetailsService){
          return homeLoansAccountDetailsService.showLoanDetailsMTG();
        }
      }
    };
    var mtgPaymentDetailsL1Modal = {
      name        : 'HomeLoansDetails.transactions.mtgPaymentDetailsL1',
      url         : '/paymentDetailsMTG',
      parent      : HomeLoansTransactionState,
      onEnter     : function (HomeLoansUtils) {
        HomeLoansUtils.analyticsTracking('account details', 'payment details', '');
      },
      resolve : {
        callModal : function(homeLoansAccountDetailsService){
          return homeLoansAccountDetailsService.showPaymentDetailsMTG();
        }
      }
    };
    var hePaymentDetailsL1Modal = {
      name        : 'HomeLoansDetails.transactions.hePaymentDetailsL1',
      url         : '/paymentDetailsHE',
      parent      : HomeLoansTransactionState,
      onEnter     : function (HomeLoansUtils) {
        HomeLoansUtils.analyticsTracking('account details', 'payment details', '');
      },
      resolve : {
        callModal : function(homeLoansAccountDetailsService){
          return homeLoansAccountDetailsService.showPaymentDetailsHE();
        }
      }
    };
    var accountServicesModule = {
      name        : 'HomeLoansDetails.transactions.accountServices',
      url         : '/account_services',
      parent      : HomeLoansTransactionState,
      onEnter     : function (HomeLoansUtils) {
          HomeLoansUtils.analyticsTracking('account details', 'more account services','');
        },
      resolve     : {
        'moreAccountServicesModule': function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name : 'MoreAccountServicesModule',
            files: [basePath + '/HomeLoans-moreAccountServices.js']
          });
        }
        //'borrowerInfo': ['HomeLoansService', 'accountDetailsData' ,function (homeLoansAccountDetailsService, accountDetailsData) {
        //  var accountRef = encodeURIComponent(accountDetailsData.accountReferenceId);
        //  homeLoansAccountDetailsService.getBorrowerInfo(accountRef).then(function (result) {
        //    accountDetailsData.borrowerInfo = result;
        //  }, function (error) {
        //    console.log("Failed to retrieve borrowerInfo");
        //  });
        //}]
      },
      controller  : 'HLAccountServicesCtrl',
      controllerAs: 'accountServices',
      templateUrl : easeTemplatesProvider.get('AccountServices')
    };
    var requestDocumentL2Modal = {
      name        : 'HomeLoansDetails.transactions.requestDocumentServicesL2',
      url         : '/requestDocumentService',
      parent      : HomeLoansTransactionState,
      resolve     : {
        'requestLoanDocumentsL2Module': function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name : 'requestLoanDocumentsL2Module',
            files: [basePath + '/HomeLoans-requestLoanDocuments.js']
          });
        },
        data: function (homeLoansAccountDetailsService, accountDetailsData) {
          console.log("calling request document service");
          var accountOpenDate = '';
          if (accountDetailsData.accountDetails.mortgageAccount) {
            accountOpenDate = new Date(accountDetailsData.accountDetails.mortgageAccount.openDate);
          }
          if (accountDetailsData.accountDetails.homeEquityLoanAccount) {
            accountOpenDate = new Date(accountDetailsData.accountDetails.homeEquityLoanAccount.openDate);
          }

          return homeLoansAccountDetailsService.docTypes(
            encodeURIComponent(accountDetailsData.accountReferenceId), accountOpenDate);
        }
      },
      onEnter     : function (HomeLoansUtils) {
        HomeLoansUtils.analyticsTracking('account details', 'request loan documents');
      },
      controller  : 'RequestLoanDocumentsL2Controller',
      controllerAs: 'requestLoanDocumentsL2',
      templateUrl : baseTemplatePath + '/HomeLoans-RequestLoanDocumentsL2.html'
    };
    var requestDocumentSuccess = {
      name        : 'HomeLoansDetails.transactions.requestDocumentSuccess',
      parent      : HomeLoansTransactionState,
      params      : {
        requestedDocs: [],
        deliveryType : '',
        addressInfo  : {},
        faxInfo      : {}
      },
      onEnter     : function (HomeLoansUtils) {
        HomeLoansUtils.analyticsTracking('account details', 'request loan documents', 'confirmation');
      },
      controller  : 'RequestLoanDocumentSuccessController',
      controllerAs: 'reqDocSuccessCtrl',
      templateUrl : baseTemplatePath + '/HomeLoans-RequestLoanDocumentsSuccess.html'
    };
    var statementOpenModalState = {
      name        : 'HomeLoansDetails.transactions.statementOpen',
      url         : '/statements',
      resolve     : {
        lstStatementData: function (homeLoansAccountDetailsService, accountDetailsData) {
          var accountRef = encodeURIComponent(accountDetailsData.accountReferenceId);
          return homeLoansAccountDetailsService.getHomeLoansStatements(accountRef);
        }
      },
      onEnter     : function (HomeLoansUtils) {
        HomeLoansUtils.analyticsTracking('statements');
      },
      controller  : 'HomeLoansStatementController',
      controllerAs: 'stCtrl',
      templateUrl : baseTemplatePath + '/HomeLoans-statements.html'
    };
    var payOffQuoteOpenModalState = {
      name        : 'HomeLoansDetails.transactions.payOffQuoteOpen',
      url         : '/payOffQuote',
      resolve     : {
        payOffQuotePDF: function (PayOffQuoteService, accountDetailsData) {
          console.log('inside lstStatementData');
          var payOffQuoteSelectedDate = accountDetailsData.payOffQuoteSelectedDate;
          console.log("accountDetailsData.payOffQuoteSelectedDate" + accountDetailsData.payOffQuoteSelectedDate);
          var data = {
            'lob'            : 'HomeLoans',
            'accountRefId'   : accountDetailsData.accountReferenceId,
            'payOffQuoteDate': payOffQuoteSelectedDate
          };
        },
        stCategory    : function () {
          //TODO Change EaseConstant?
          return 'MLA';
        }
      },
      onEnter     : function (HomeLoansUtils) {
        HomeLoansUtils.analyticsTracking('account details', 'request payoff quote', 'document');
      },
      controller  : 'payOffQuoteController',
      controllerAs: 'payOffQuoteCtrl',
      templateUrl : baseTemplatePath + '/HomeLoans-PayOffQuote.html'
    };
    var payOffQuoteDatePickerModalState = {
      name        : 'HomeLoansDetails.transactions.payOffQuoteModal',
      url         : '/payOffQuote',
      parent      : HomeLoansTransactionState,
      controller  : 'PayOffQuoteDateController',
      controllerAs: 'payOffQuote',
      templateUrl : baseTemplatePath + '/HomeLoans-PayOffQuoteDatePicker.html',
      resolve     : {
        'payOffQuoteDependencies': function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            files: [basePath + '/HomeLoans-POQCtrl.js']
          });
        },
        data                     : function (homeLoansAccountDetailsService, accountDetailsData) {
          console.log("calling payoff quote service");
          var accountRef = encodeURIComponent(accountDetailsData.accountReferenceId);
          return homeLoansAccountDetailsService.getPayOffQuoteDates(accountRef);
        }
      },
      onEnter     : function (HomeLoansUtils) {
        HomeLoansUtils.analyticsTracking('account details', 'request payoff quote');
      }
    };
    var escrowDetails = {
      name        : 'HomeLoansDetails.transactions.escrowDetails',
      url         : '/escrowDetails',
      parent      : HomeLoansTransactionState,
      resolve     : {
        'escrowDetails': function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name : 'EscrowDetailsModule',
            files: [basePath + '/HomeLoans-escrowDetails.js']
          });
        },
        data: function(homeLoansAccountDetailsService, accountDetailsData){
          return homeLoansAccountDetailsService.getEscrowDetails(accountDetailsData.accountReferenceId);
        }
      },
      onEnter     : function (HomeLoansUtils) {
        HomeLoansUtils.analyticsTracking('account details', 'escrow details');
      },
      controller  : 'EscrowDetailsController',
      controllerAs: 'escrowDetailsCtrl',
      templateUrl : baseTemplatePath + '/HomeLoans-EscrowDetails.html'
    };
    $stateProvider.state(HomeLoansDetailsState);
    $stateProvider.state(HomeLoansTransactionState);
    $stateProvider.state(errorModal);
    $stateProvider.state(homeEquityDetailsModal);
    $stateProvider.state(mortgageLoanDetailsModal);
    $stateProvider.state(mtgPaymentDetailsL1Modal);
    $stateProvider.state(hePaymentDetailsL1Modal);
    $stateProvider.state(accountServicesModule);
    $stateProvider.state(requestDocumentL2Modal);
    $stateProvider.state(requestDocumentSuccess);
    $stateProvider.state(statementOpenModalState);
    $stateProvider.state(payOffQuoteOpenModalState);
    $stateProvider.state(payOffQuoteDatePickerModalState);
    $stateProvider.state(escrowDetails);
    paymentStateProvider.set('HomeLoanPayment', HomeLoansTransactionState, '/Pay');

    transferStateProvider.set(HomeLoansTransactionState, 'HomeLoansDetails.transfer', 'HomeLoansDetails.transferSuccess', 'HomeLoansDetails.transferCancel', 'HomeLoansDetails.transferCancelConfirm', 'HomeLoansDetails.transferError');
    var TransferMoneyStates = transferStateProvider.get();
    var TransferStart = TransferMoneyStates.transferStart ;
    var transferSuccess = TransferMoneyStates.transferSuccess;
    var transferCancel = TransferMoneyStates.transferCancel;
    var transferCancelConfirm = TransferMoneyStates.transferCancelConfirm;
    var transferError = TransferMoneyStates.transferError;

    $stateProvider.state(TransferStart);
    $stateProvider.state(transferSuccess);
    $stateProvider.state(transferCancel);
    $stateProvider.state(transferCancelConfirm);
    $stateProvider.state(transferError);

    addAccountStateProvider.set('HomeLoansDetails.transactions.AddExtAccount', HomeLoansTransactionState);
    addAccountStateProvider.set('HomeLoansDetails.AddExtAccount', HomeLoansTransactionState);


  });
  HomeLoansDetailModule.filter('splitCurrency', ['EASEUtilsFactory', function (EASEUtilsFactory) {
    return function (input, isDollar) {
      if (angular.isNumber(input)) {
        if (isDollar === 'true') {
          return EASEUtilsFactory.commaFormattedFixedByCurrency(Math.floor(input), "USD");
        } else {
          var cents = Math.round(input * 100) % 100;
          if (cents.toString().length < 2) {
            return '0' + cents;
          }
          return cents;
        }
      }
      ;
    }
  }]);
  HomeLoansDetailModule.filter('formatAmount', function () {
    return function (amount) {
      if (amount < 0) {
        return '-$' + Math.abs(amount).toFixed(2);
      } else {
        return '$' + amount.toFixed(2);
      }
    };
  });

  HomeLoansDetailModule.factory('homeLoansAccountDetailsService',
    function (
      EaseConstant, $q, Restangular, easeExceptionsService,
      $ocLazyLoad, EASEUtilsFactory, EaseLocalizeService,
      UmmPaymentFactory, EaseModalService, easeTemplates, $rootScope, $state, $http, easeUIModalService, pubsubService) {
      var basePath = '/ease-ui/bower_components/HomeLoans/ver1490643033478';
      var paymentsFeature = basePath + '/features/payments';
      var paymentsFeatureTemplatePath = paymentsFeature + '/partials';
      var loanDetailsFeatureTemplate = basePath + "/features/loanDetails/partials/";
      var paymentDetailsFeatureTemplate = basePath + "/features/paymentDetails/partials/";
      var services = {};
      var accountDetailsData;
      var i18core;
      var i18n;
      var productCategory;
      var loadingPayment;
      var accountRefId;
      var fromL1;
      var vm = this;
      var paymentInfo;
      var disableMakeAPayment, spinnerEnabled;
      var inProgress = false;
      var errorMessage = null;
      var paymentsRequest = null;
      var paymentsSuccess = null;
      var paymentSelectedOptions = null;
      var loanDetailsLinkFocus = null;
      var paymentDetailsModalIdFocus = null;
      var makeAPaymentButtonIdFocus = null;
      var isConfirm = false;
      var isBackButtonFlag = false;
      var manageAutoPay = false;
      var reloadOnError = false;
      var cancelPaymentFlag = false;
      var goBackTransactionFlag = false;
      //Make sure we add HomeLoans in the path for proxy to resolve.Should be in this format
      // <<url><context-path>/HomeLoans/<<uri>>
      var urls = {
        mortgageAccountDetails  : '/mortgages/getAccountById/',
        homeEquityAccountDetails: '/homeEquity/getAccountById/',
        transferAccounts        : 'HomeLoans/transferAccounts/',
        payments                : 'HomeLoans/payments/',
        documentRequest         : 'HomeLoans/accountServices/',
        mortgageTransactions    : '/mortgages/transactions/',
        homeEquityTransactions  : '/mortgages/transactions/',
        payOffQuotePDF          : 'payoffquotes/viewPdf/',
        statements              : '/statements/',
        borrowerInfo            : 'HomeLoans/borrowers/accountDetails/',
        recurringPayments       : 'HomeLoans/AutoPay/'
      };
      services.getHomeLoansAccountDetails = function (productType, accountDetailsRefId) {
        var deferred = $q.defer();
        var urlPart2 = '/';
        productCategory = productType;
        accountRefId = accountDetailsRefId;
        switch (productType) {
          case EaseConstant.lineOfBusiness.HomeLoans:
          {
            urlPart2 = urls.mortgageAccountDetails;
            break;
          }
          case EaseConstant.lineOfBusiness.HomeLoansHil:
          case EaseConstant.lineOfBusiness.HomeLoansHlc:
          {
            urlPart2 = urls.homeEquityAccountDetails;
            break;
          }
        }
        var url = 'HomeLoans' + urlPart2 + encodeURIComponent(accountDetailsRefId) + '/';
        var accountDetailsData = new function () {
          this.accountReferenceId = accountDetailsRefId;
          this.accountDetails;
          this.transactions = {};
          this.statements;
        };
        var homeLoansDetailsService = Restangular.all(url);
        var headers = {'BUS_EVT_ID': 50001, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
        var index_sort_desc_trans = function (a, b) {
          // sort based on the index instead of the date.
          return b.transactionIndex - a.transactionIndex;
        };
        var homeLoansDetailsData = homeLoansDetailsService.get('', {}, headers).then(function (data) {
            accountDetailsData.accountDetails = data.accountDetails;
            accountDetailsData.accountDetails.accountNumber = data.accountDetails.accountNumberTLNPI;
            accountDetailsData.transactions.entries = data.transactions.posted.sort(index_sort_desc_trans);
            accountDetailsData.transactions.scheduled = data.transactions.scheduled.sort(index_sort_desc_trans);
            accountDetailsData.transactions.pending = data.transactions.pending;
            accountDetailsData.statements = data.statements;
            accountDetailsData.features = data.features;
            services.setAccountDetailsData(accountDetailsData);
            deferred.resolve(accountDetailsData);
          },
          function (ex) {
            deferred.reject(ex);
            services.throwSnag();
          });
        return deferred.promise;
      };
      // OLD service which is no longer in use.
      services.getTransferAccounts = function () {
        var deferred = $q.defer();
        var headers = {'BUS_EVT_ID': 50013, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
        var transferAccountsData = Restangular.all(urls.transferAccounts).get('', {}, headers).then(function (data) {
          deferred.resolve(data);
        }, function (ex) {
          services.throwSnag();
        });
        return deferred.promise;
      };
      services.postHomeLoansPayment = function (request, accountDetailsRefId) {
        var deferred = $q.defer();
        var headers = null;
        var recurringPayments = false;
        services.setPaymentsRequest(request);
        if (request.paymentType == 'onetime') {
          if (request.productType == 'MLA') {
            headers = {'BUS_EVT_ID': 50014, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
          } else {
            headers = {'BUS_EVT_ID': 50019, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
          }
        } else {
          recurringPayments = true;
          headers = {'BUS_EVT_ID': 50029, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
        }
        if (!recurringPayments) {
          Restangular.all(urls.payments + encodeURIComponent(accountDetailsRefId)).post(request, {}, headers).then(function (data) {
            deferred.resolve(data);
          }, function (ex) {
            deferred.reject(ex);
            services.throwSnag('Payment Error', ex.cause.data.errorMessage);
          });
        } else {
          Restangular.all(urls.recurringPayments + encodeURIComponent(accountDetailsRefId)).post(request, {}, headers).then(function (data) {
            deferred.resolve(data);
          }, function (ex) {
            deferred.reject(ex);
            services.throwSnag('Payment Error');
          });
        }
        return deferred.promise;
      };
      services.deleteHomeLoansPayment = function (
        accountDetailsRefId, effectiveDate, productType,
        isExternal, transactionId, paymentType, sequenceNumber) {
        var deferred = $q.defer();
        var headers = null;
        var recurringPayments = false;
        if (paymentType == 'onetime') {
          if (productType == 'MLA') {
            headers = {'BUS_EVT_ID': 50017, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
          } else {
            headers = {'BUS_EVT_ID': 50020, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
          }
        }
        else {
          recurringPayments = true;
          headers = {'BUS_EVT_ID': 50032, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
        }
        var queryParams = {
          'isExternal'    : isExternal,
          'paymentDate'   : effectiveDate,
          'productType'   : productType,
          'transactionId' : transactionId,
          'paymentType'   : paymentType,
          'sequenceNumber': sequenceNumber
        };
        console.log("in the delete payment before call");
        if (!recurringPayments) {
          Restangular.all(urls.payments + encodeURIComponent(accountDetailsRefId)).remove(queryParams, headers).then(function (data) {
            deferred.resolve(data);
          }, function (ex) {
            deferred.reject(ex);
            services.throwSnag('Payment Error');
          });
        } else {
          Restangular.all(urls.recurringPayments + encodeURIComponent(accountDetailsRefId)).remove(queryParams, headers).then(function (data) {
            deferred.resolve(data);
          }, function (ex) {
            deferred.reject(ex);
            services.throwSnag('Payment Error');
          });
        }
        return deferred.promise;
      };
      services.editHomeLoansPayment = function (
        accountDetailsRefId, effectiveDate, productType, isExternal, request,
        sequenceNumber, transactionId) {
        var deferred = $q.defer();
        var queryParams = {
          'isExternal'    : isExternal,
          'paymentDate'   : effectiveDate,
          'productType'   : productType,
          'sequenceNumber': sequenceNumber,
          'transactionId' : transactionId
        };
        var recurringPayment = request.paymentType == 'recurring';
        if (!recurringPayment) {
          Restangular.all(urls.payments + encodeURIComponent(accountDetailsRefId)).customPUT(request, '', queryParams).then(function (data) {
            deferred.resolve(data);
          }, function (ex) {
            deferred.reject(ex);
            services.throwSnag('Payment error', ex.cause.data.errorMessage);
          });
        } else {
          Restangular.all(urls.recurringPayments + encodeURIComponent(accountDetailsRefId)).customPUT(request, '', queryParams).then(function (data) {
            deferred.resolve(data);
          }, function (ex) {
            deferred.reject(ex);
            services.throwSnag('Payment error', ex.cause.data.errorMessage);
          });
        }
        return deferred.promise;
      };
      services.submitDocumentRequest = function (accountDetailsRefId, servicingRequest) {
        var deferred = $q.defer();
        var headers = null;
        headers = {'BUS_EVT_ID': 50031, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
        console.log("calling service " + urls.documentRequest + encodeURIComponent(accountDetailsRefId));
        console.log("request body " + servicingRequest);
        Restangular.all(urls.documentRequest + encodeURIComponent(accountDetailsRefId) + '/orderDocuments').post(servicingRequest, {}, headers).then(function (data) {
          console.log("calling service " + urls.documentRequest + encodeURIComponent(accountDetailsRefId));
          console.log("request body " + servicingRequest);
          deferred.resolve(data);
        }, function (ex) {
          deferred.reject(ex);
          services.throwSnag("Error", "Looks like we can't place this request online right now. Please call us at 1-(877)-535-1212 to place request with an agent");
        });
        return deferred.promise;
      };
      services.getBorrowerInfo = function (accountDetailsRefId) {
        var deferred = $q.defer();
        var headers = {EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
        var url = urls.borrowerInfo + encodeURIComponent(accountDetailsRefId);
        console.log("calling service " + url);
        Restangular.all(url).get('', {}, headers).then(function (data) {
          deferred.resolve(data);
        }, function (ex) {
          deferred.reject(ex);
          services.throwSnag();
        });
        return deferred.promise;
      };
      // transaction update which is not being used.
      services.getTransactionUpdates = function (productCategory, accountDetailsRefId) {
        console.log('in ther refresh of transactions after success');
        var urlPart2 = '/';
        switch (productCategory) {
          case EaseConstant.lineOfBusiness.HomeLoans:
          {
            urlPart2 = urls.mortgageAccountDetails;
            break;
          }
          case EaseConstant.lineOfBusiness.HomeLoansHil:
          case EaseConstant.lineOfBusiness.HomeLoansHlc:
          {
            urlPart2 = urls.homeEquityAccountDetails;
            break;
          }
        }
        var url = 'HomeLoans' + urlPart2 + encodeURIComponent(accountDetailsRefId) + '/refresh';
        var deferred = $q.defer();
        var getTransactionUpdates = Restangular.all(url);
        console.log('URL:', url);
        getTransactionUpdates.get('').then(function (data) {
          deferred.resolve(data);
        }, function (ex) {
          deferred.reject(ex);
          services.throwSnag();
        });
        return deferred.promise;
      };
      services.getHomeLoansStatements = function (accountRefId) {
        var deferred = $q.defer();
        var headers = {'BUS_EVT_ID': 50030, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
        var url = 'HomeLoans/' + accountRefId + '/statements';
        Restangular.all(url).get('', {}, headers).then(function (data) {
          deferred.resolve(data);
        }, function (ex) {
          services.throwSnag();
          deferred.resolve(ex);
        });
        return deferred.promise;
      };
      services.getStatementsURL = function (accountReferenceId, statementReferenceId) {
        var restURL = Restangular.all("HomeLoans/" + accountReferenceId +
          urls.statements + statementReferenceId + "/HomeLoan_Statement");
        EASEUtilsFactory.setCustomerActivityHeader('50030', EASEUtilsFactory.getSyncId());
        return restURL.getRestangularUrl();
      };
      services.getPayOffQuoteDates = function (accountRefId) {
        var deferred = $q.defer();
        var headers = {'BUS_EVT_ID': 50036, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
        var url = 'HomeLoans/payoffquotes/validDates/' + accountRefId + '?productType=' + productCategory;
        Restangular.all(url).get('', {}, headers).then(function (data) {
          deferred.resolve(data);
        }, function (ex) {
          services.throwSnag();
          deferred.resolve(ex);
        });
        return deferred.promise;
      };
      services.getPayOffQuoteURL = function (accountReferenceId, payOffQuoteDate) {
        var restURL = Restangular.all("HomeLoans/" + urls.payOffQuotePDF + accountReferenceId +
          "?productType=" + productCategory + "&payoffQuoteDate=" + payOffQuoteDate);
        EASEUtilsFactory.setCustomerActivityHeader('50036', EASEUtilsFactory.getSyncId());
        return restURL.getRestangularUrl();
      };
      services.getPayOffQuoteHeaders = function () {
        var headers = {
          'BUS_EVT_ID'     : 50036,
          'EVT_SYNCH_TOKEN': EASEUtilsFactory.getSyncId()
        };
        return headers;
      };
      services.getStatementsHeaders = function () {
        var headers = {
          'BUS_EVT_ID'     : 50030,
          'EVT_SYNCH_TOKEN': EASEUtilsFactory.getSyncId()
        };
        return headers;
      };
      services.setAccountDetailsData = function (data) {
        accountDetailsData = data;
      };
      services.getAccountDetailsData = function () {
        return accountDetailsData;
      };
      services.setI18Core = function (data) {
        i18core = data;
      };
      services.getI18Core = function () {
        return i18core;
      };
      services.setI18n = function (data) {
        i18n = data;
      };
      services.getI18n = function () {
        return i18n;
      };
      services.getProductCategory = function () {
        return productCategory;
      };
      services.setProductCategory = function (productType) {
        productCategory = productType;
      };
      services.getLoadingPayment = function () {
        return loadingPayment;
      };
      services.setLoadingPayment = function (data) {
        loadingPayment = data;
      };
      services.getAccountRefId = function () {
        return accountRefId;
      };
      services.getFromL1 = function () {
        return fromL1;
      };
      services.setFromL1 = function (data) {
        fromL1 = data;
      };
      services.setPaymentInfoData = function (data) {
        paymentInfo = data;
      };
      services.getPaymentInfoData = function () {
        return paymentInfo;
      };
      services.setAccountRefId = function (accountReferenceId) {
        return accountRefId = accountReferenceId;
      };
      services.setDisableMakeAPayment = function (data) {
        disableMakeAPayment = data;
      };
      services.getDisableMakeAPayment = function () {
        return disableMakeAPayment;
      };
      services.isSpinnerEnabled = function () {
        return spinnerEnabled
      };
      services.enableSpinner = function (data) {
        spinnerEnabled = data;
      };
      services.setInProgress = function (value) {
        inProgress = value;
      };
      services.getProgress = function () {
        return inProgress;
      };
      services.setErrorMessage = function (message) {
        errorMessage = message;
      };
      services.getErrorMessage = function () {
        return errorMessage;
      };
      services.setPaymentsRequest = function (request) {
        paymentsRequest = request;
      };
      services.getPaymentsRequest = function () {
        return paymentsRequest;
      };
      services.setPaymentsSuccess = function (confirmation) {
        paymentsSuccess = confirmation;
      };
      services.getPaymentsSuccess = function () {
        return paymentsSuccess;
      };
      services.getPaymentSelectedOptions = function () {
        return paymentSelectedOptions;
      };
      services.setPaymentSelectedOptions = function (options) {
        paymentSelectedOptions = options;
      };
      services.setLoanDetailsLinkFocus = function (loanDetailsLink) {
        loanDetailsLinkFocus = loanDetailsLink;
      };
      services.getLoanDetailsLinkFocus = function () {
        return loanDetailsLinkFocus;
      };
      services.setPaymentDetailsModalFocus = function (paymentDetailsModalId) {
        paymentDetailsModalIdFocus = paymentDetailsModalId;
      };
      services.getPaymentDetailsModalFocus = function () {
        return paymentDetailsModalIdFocus;
      };
      services.setMakeAPaymentModalFocus = function (makeAPaymentButtonId) {
        makeAPaymentButtonIdFocus = makeAPaymentButtonId;
      };
      services.getMakeAPaymentModalFocus = function () {
        return makeAPaymentButtonIdFocus;
      };
      services.getIsConfirm = function () {
    	  return isConfirm;
      };
      services.setIsConfirm = function (value) {
    	  isConfirm = value;
      };
      services.getIsBackButtonFlag = function () {
    	  return isBackButtonFlag;
      };
      services.setIsBackButtonFlag = function (value) {
    	  isBackButtonFlag = value;
      };
      services.getManageAutoPay = function(){
        return manageAutoPay;
      };
      services.setManageAutoPay = function(value){
        manageAutoPay = value;
      };
      services.getReloadOnError = function() {
    	  return reloadOnError;
      };
      services.setReloadOnError = function(value) {
    	  reloadOnError = value;
      };
      // do nothing function
      services.doNothing = function(value) {

      };

      services.getCancelPaymentFlag = function() {
    	  return cancelPaymentFlag;
      };
      services.setCancelPaymentFlag = function(value) {
    	  cancelPaymentFlag = value;
      };

      services.getBackTransactionFlag = function() {
        return goBackTransactionFlag;
      };
      services.setBackTransactionFlag = function(value) {
        goBackTransactionFlag = value;
      };

      // perform Reload on failure of edit payments, refresh transactions for the account
      services.performReload = function() {
    	  if ((null != $state.current.parent) && ($state.current.parent.name == 'HomeLoansDetails.transactions')) {
              // for the homloansdetails state the refresh state should be transactions.
              $state.go('HomeLoansDetails.transactions', {}, {reload: 'true'});
            }
      };

      services.getRecurringPmtFrequency = function () {
        var recFrequency = "Monthly";
        if (productCategory == 'MLA') {
          recFrequency = accountDetailsData.accountDetails.mortgageAccount.loanAccountPaymentInfo.paymentFrequency;
        }
        return recFrequency;
      };
      services.paymentInfoService = function (accountRefId, productCategory) {
        var deferred = $q.defer();
        var headers = {'BUS_EVT_ID': 123456, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
        var url = 'HomeLoans/paymentinfo/' + encodeURIComponent(accountRefId) + '/' + productCategory;
        Restangular.all(url).get('', {}, headers).then(function (data) {
          deferred.resolve(data);
          //services.setPaymentInfoData(data);
        }, function (ex) {
          services.throwSnag();
          deferred.reject(ex);
        });
        return deferred.promise;
      };

      services.trackAnalytics = function(level2Val, level3Val, level4Val) {
        level3Val = level3Val || '';
        level4Val = level4Val || '';
        pubsubService.pubsubTrackAnalytics({
          taxonomy: {
            level1: 'ease',
            level2: level2Val,
            level3: level3Val,
            level4: level4Val,
            level5: '',
            country: 'us',
            language: 'english',
            system: 'ease_web'
          },
          lob: 'home loans'
        });
      };

      services.buttonAnalyticsTracking = function(buttonDetails) {
        window.publisherFW.publishEvent('trackAnalytics', {
          name : buttonDetails
        });
      };

      services.accountDetailsAnalyticsTracking = function(){
          pubsubService.pubsubTrackAnalytics({
        	  taxonomy: {
        	  level1: 'ease',
        	  level2: 'account details',
        	  level3: '',
        	  level4: '',
        	  level5: '',
        	  country: 'us',
        	  language: 'english',
        	  system: 'ease_web'
        	  },
        	  lob: 'home loans'
          });
        };

      services.launchUmmPayment = function (modalDetails, isAccountDataAvailable, stopSpinner, toggleFeature) {
        $ocLazyLoad.load([paymentsFeature + '/HomeLoans-payments.js', paymentsFeature + '/HomeLoans-paymentsActions.js',
          basePath + '/HomeLoans-properties.js',
          basePath + '/utils/i18n/resources-locale_en-us.json',
          basePath + '/HomeLoans-services.js',
          basePath + '/HomeLoans-utils.js']).then(function () {
          console.log('coming from wanna pay');
          var passValue = {
            accountRefId: modalDetails.accountRefId,
            category    : modalDetails.category
          };
          services.setProductCategory(modalDetails.category);
          services.setAccountRefId(modalDetails.accountRefId);
          loadingPayment = 'loading';
          if(typeof isAccountDataAvailable == 'undefined'){
            services.setManageAutoPay(true);
          }
          if (isAccountDataAvailable) {
            disableMakeAPayment = false;
            loadingPayment = '';
            inProgress = false;
            services.trackAnalytics('pay bill', '', '');
            easeUIModalService.showModal({
              templateUrl: paymentsFeatureTemplatePath + '/HomeLoans-PaymentsFlow.html',
              controller : 'PaymentsController'
            }).then(function (modal) {
              modal.close.then(function (moveState) {
                if (moveState || typeof moveState == 'undefined') {
                  console.log('closing the map modal');
                  $state.go($state.current.parent.name);
                }
              });
            });
          } else {
            i18n = $http.get(basePath + '/utils/i18n/resources-locale_en-us.json').then(function (data) {
              i18n = data.data.HomeLoans;
              services.setI18n(i18n);
            });
            UmmPaymentFactory.getUmmPayment(passValue).then(function (data) {
              services.paymentInfoService(passValue.accountRefId, passValue.category).then(function (data) {
                //replace with easeUIModal service call .. the down below when.
                services.setPaymentInfoData(data);
                disableMakeAPayment = false;
                loadingPayment = '';
                inProgress = false;
                if (typeof stopSpinner != 'undefined') {
                  stopSpinner();
                }

                if ((null != services.getPaymentsSuccess()) && (null != services.getPaymentsSuccess().editFlow) && services.getPaymentsSuccess().editFlow) {
                  if (services.getPaymentsSuccess().paymentType == 'onetime') {
                    services.trackAnalytics('edit payment', 'one time', '');
                  }
                  else {
                    services.trackAnalytics('edit payment', 'recurring', '');
                  }
                }
                else {
                  services.trackAnalytics('pay bill', '', '');
                }

                easeUIModalService.showModal({
                  templateUrl: paymentsFeatureTemplatePath + '/HomeLoans-PaymentsFlow.html',
                  controller : 'PaymentsController'
                }).then(function (modal) {
                  modal.close.then(function (moveState) {
                	  // Upon error while creating or editing a payment refresh the transactions on the screen correctly
                	  if ((null != services.getReloadOnError()) && (services.getReloadOnError())) {
                    	  services.performReload();
                    	  return;
                      }
                    if (moveState || typeof moveState == 'undefined') {
                      console.log('closing the map modal');
                      if (null != services.getMakeAPaymentModalFocus()) {
                        services.getMakeAPaymentModalFocus().focus();
                        services.setMakeAPaymentModalFocus(null);
                      }
                      if(!services.getIsConfirm()){
                        services.setPaymentSelectedOptions(null);
                      }
                      $state.go($state.current.parent.name);
                    }
                  });
                });
              },function (paymentInfoServiceEx) {
                // exception handling TODO .. failure of the UMMPayments call. and PaymentInfo failure call.
                disableMakeAPayment = false;
                loadingPayment = '';
                inProgress = false;
              });
            }, function (ex) {
              // exception handling TODO .. failure of the UMMPayments call. and PaymentInfo failure call.
              disableMakeAPayment = false;
              loadingPayment = '';
              inProgress = false;
            });
          }
        });
      };
      services.paymentSetupSuccess = function () {
        services.enableSpinner(false);
        services.setDisableMakeAPayment(false);
        services.setInProgress(false);
        //EaseModalService('/ease-ui/bower_components/HomeLoans/ver1490643033478/partials/HomeLoans-PaymentSuccess.html', {
        //  modalClass: 'modal fade modalFadeSlideUp successModal'
        //});
        if ((null != services.getPaymentsSuccess()) && (null != services.getPaymentsSuccess().paymentType) && (null != services.getPaymentsSuccess().editFlow)) {
          console.log('paymentType is : '+services.getPaymentsSuccess().paymentType);
          console.log('editFlow is : '+services.getPaymentsSuccess().editFlow);
          if (services.getPaymentsSuccess().paymentType == 'onetime') {
            if (services.getPaymentsSuccess().editFlow) {
              services.trackAnalytics('edit payment', 'one time', 'confirmation');
            }
            else {
              services.trackAnalytics('pay bill', 'one time', 'confirmation');
            }
          }
          else {
            if (services.getPaymentsSuccess().editFlow) {
              services.trackAnalytics('edit payment', 'recurring', 'confirmation');
            }
            else {
              services.trackAnalytics('pay bill', 'recurring', 'confirmation');
            }
          }
        }
        services.setIsConfirm(true);
        easeUIModalService.showModal({
          templateUrl: '/ease-ui/bower_components/HomeLoans/ver1490643033478/features/payments/partials/HomeLoans-PaymentsSuccess.html',// removed the ctrller declaration as we have it in the HTML .
          controller : 'PaymentsSuccessController'
        }).then(function (modal) {
          modal.close.then(function (reload) {
            if (reload || (typeof reload == 'undefined')) {
              services.setIsConfirm(false);
              services.setPaymentSelectedOptions(null);
              services.getPaymentsSuccess().editFlow=false;
              $state.go($state.current.name, {}, {reload: 'true'});
            }
          })
        });
      };
      services.paymentEditSetup = function () {
        services.setInProgress(false);
        //EaseModalService('/ease-ui/bower_components/HomeLoans/ver1490643033478/partials/HomeLoans-MakePayment.html', {
        //  modalClass: 'modal fade modalFadeSlideUp paymentModal'
        //});
        if ((null != services.getPaymentsSuccess()) && (null != services.getPaymentsSuccess().paymentType)) {
          if (services.getPaymentsSuccess().paymentType == 'onetime') {
            services.trackAnalytics('edit payment', 'one time', '');
          }
          else {
            services.trackAnalytics('edit payment', 'recurring', '');
          }
        }
        easeUIModalService.showModal({
          templateUrl: '/ease-ui/bower_components/HomeLoans/ver1490643033478/features/payments/partials/HomeLoans-PaymentsFlow.html', // removed the ctrller declaration as we have it in the HTML .
          controller : 'PaymentsController'
        }).then(function (modal) {
          modal.close.then(function (result) {
            console.log('closing the map modal');
            services.setInProgress(false);
            services.getPaymentsSuccess().editFlow=false;
            if ($state.reload) {
              $state.reload = false;
              if ($state.current.parent != null && $state.current.parent.name == 'HomeLoansDetails') {
                  // for the homloansdetails state the refresh state should be transactions.
                  $state.go('HomeLoansDetails.transactions', {}, {reload: 'true'});
                } else {
                  $state.go($state.current.name, {}, {reload: 'true'});
                }
            }
            else {
            	services.accountDetailsAnalyticsTracking();
            }
          })
        });
      };
      services.paymentCancel = function () {
        services.setInProgress(false);
        if (paymentInfo == null || typeof paymentInfo == "undefined") {
          services.paymentInfoService(accountRefId, productCategory).then(function (data) {
            services.setPaymentInfoData(data);
            easeUIModalService.showModal({
              templateUrl: '/ease-ui/bower_components/HomeLoans/ver1490643033478/features/payments/partials/HomeLoans-PaymentsCancelConfirm.html',
              controller : 'PaymentsCancelConfirmController'
            }).then(function (modal) {
              modal.close.then(function (result) {
                console.log('closing the map modal');
                services.setInProgress(false);
                services.setIsConfirm(false);
                if ($state.reload) {
                  $state.reload = false;
                  if ($state.current.parent != null && $state.current.parent.name == 'HomeLoansDetails') {
                      // for the homloansdetails state the refresh state should be transactions.
                      $state.go('HomeLoansDetails.transactions', {}, {reload: 'true'});
                    } else {
                      $state.go($state.current.name, {}, {reload: 'true'});
                    }
                }
                else if((null != services.getIsBackButtonFlag()) && (null != services.getBackTransactionFlag()) && services.getIsBackButtonFlag() && services.getBackTransactionFlag()) {
                	services.doNothing();
                }
                else if ((null != services.getCancelPaymentFlag()) && (services.getCancelPaymentFlag())) {
              	  services.doNothing();
              	  services.setCancelPaymentFlag(false);
                }
                else {
                	services.accountDetailsAnalyticsTracking();
                }
              });
            });
          });
        } else { // from success modal. the paymentInfo call has been made.

          if ((null != services.getPaymentsSuccess()) && (null != services.getPaymentsSuccess().paymentType)) {
            if (services.getPaymentsSuccess().paymentType == 'onetime') {
              services.trackAnalytics('cancel payment', 'one time', '');
            }
            else {
              services.trackAnalytics('cancel payment', 'recurring', '');
            }
          }
          services.setIsConfirm(true);
          easeUIModalService.showModal({
            templateUrl: '/ease-ui/bower_components/HomeLoans/ver1490643033478/features/payments/partials/HomeLoans-PaymentsCancelConfirm.html',
            controller : 'PaymentsCancelConfirmController'
          }).then(function (modal) {
            modal.close.then(function (result) {
              console.log('closing the map modal');
              services.setInProgress(false);
              services.setIsConfirm(false);
              if (($state.reload) && ((null != services.getCancelPaymentFlag()) && (!services.getCancelPaymentFlag()))) {
                $state.reload = false;
                if ($state.current.parent != null && $state.current.parent.name == 'HomeLoansDetails') {
                    // for the homloansdetails state the refresh state should be transactions.
                    $state.go('HomeLoansDetails.transactions', {}, {reload: 'true'});
                  } else {
                    $state.go($state.current.name, {}, {reload: 'true'});
                  }
              }
              else if((null != services.getIsBackButtonFlag()) && (null != services.getBackTransactionFlag()) && services.getIsBackButtonFlag() && services.getBackTransactionFlag()) {
              	services.doNothing();
              }
              else if ((null != services.getCancelPaymentFlag()) && (services.getCancelPaymentFlag())) {
            	  services.doNothing();
            	  services.setCancelPaymentFlag(false);
              }
              else {
            	  services.accountDetailsAnalyticsTracking();
              }
            });
          });
        }
      };
      services.paymentCancelSuccess = function () {
        services.setInProgress(false);
        //EaseModalService('/ease-ui/bower_components/HomeLoans/ver1490643033478/partials/HomeLoans-PaymentCancelConfirm.html',
        // { modalClass: 'modal fade modalFadeSlideUp successModal' });
        if ((null != services.getPaymentsSuccess()) && (null != services.getPaymentsSuccess().paymentType)) {
          if (services.getPaymentsSuccess().paymentType == 'onetime') {
            services.trackAnalytics('cancel payment', 'one time', 'confirmation');
          }
          else {
            services.trackAnalytics('cancel payment', 'recurring', 'confirmation');
          }
        }
        services.setIsConfirm(true);
        easeUIModalService.showModal({
          templateUrl: '/ease-ui/bower_components/HomeLoans/ver1490643033478/features/payments/partials/HomeLoans-PaymentsCancelSuccess.html',
          controller : 'PaymentsCancelSuccessController'
        }).then(function (modal) {
          modal.close.then(function (result) {
            services.setPaymentsSuccess(null);
            services.setPaymentSelectedOptions(null);
            services.setIsConfirm(false);
            if ($state.reload) {
              $state.reload = false;
              if ($state.current.parent != null && $state.current.parent.name == 'HomeLoansDetails') {
                  // for the homloansdetails state the refresh state should be transactions.
                  $state.go('HomeLoansDetails.transactions', {}, {reload: 'true'});
                } else {
                  $state.go($state.current.name, {}, {reload: 'true'});
                }
            }
          });
        });
      };
      services.showLoanDetailsHE = function () {
        services.setInProgress(false);
        easeUIModalService.showModal({
          templateUrl: loanDetailsFeatureTemplate + 'HomeLoans-LoanDetailsHE.html',
          controller : 'LoanDetailsController'
        }).then(function (modal) {
          modal.close.then(function () {
            console.log('closing the accountdetails HE modal');
            services.getLoanDetailsLinkFocus().focus();
            $state.go($state.current.parent.name);
          })
        });
      };
      services.showLoanDetailsMTG = function () {
        services.setInProgress(false);
        easeUIModalService.showModal({
          templateUrl: loanDetailsFeatureTemplate + 'HomeLoans-LoanDetailsMTG.html',
          controller : 'LoanDetailsController'
        }).then(function (modal) {
          modal.close.then(function () {
            console.log('closing the account details MTG modal');
            services.getLoanDetailsLinkFocus().focus();
            $state.go($state.current.parent.name);
          })
        });
      };
      services.showPaymentDetailsMTG = function () {
        //services.setInProgress(false);
        easeUIModalService.showModal({
          templateUrl: paymentDetailsFeatureTemplate + 'HomeLoans-PaymentDetailsL1-MTG.html',
          controller : 'PaymentDetailsController'
        }).then(function (modal) {
          modal.close.then(function () {
            console.log('closing the payment details MTG modal');
            services.getPaymentDetailsModalFocus().focus();
            $state.go($state.current.parent.name);
          })
        });
      };
      services.showPaymentDetailsHE = function () {
        //services.setInProgress(false);
        easeUIModalService.showModal({
          templateUrl: paymentDetailsFeatureTemplate + 'HomeLoans-PaymentDetailsL1-HE.html',
          controller : 'PaymentDetailsController'
        }).then(function (modal) {
          modal.close.then(function () {
            console.log('closing the payment details MTG modal');
            services.getPaymentDetailsModalFocus().focus();
            $state.go($state.current.parent.name);
          })
        });
      };
      services.throwSnag = function (header, message) {
        services.setInProgress(false);
        if (header == null) {
          header = "Oops, we've hit a snag. "
        }
        if (message == null) {
          message = "Looks like we need to fix something, " +
            "so we're working on it. Try again in a bit or give us a " +
            "call at 1-877-933-9100 (8:00 AM - 8:00 PM ET).";
        }
        $rootScope.$broadcast('error', {
          msgHeader: header,
          msgBody  : message
        });

        // Incase of error navigate back to parent state
        if (null != $state.current.parent){
          $state.go($state.current.parent.name, {}, {reload: 'true'});
        }
        else {
          $state.go($state.current.name, {}, {reload: 'true'});
        }
      };
      services.getEscrowDetails = function (accountRefId) {
        var deferred = $q.defer();
        var headers = {'BUS_EVT_ID': 50000, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
        //TODO check with PO on the valid header
        var url = 'HomeLoans/escrowDetails/' + encodeURIComponent(accountRefId);
        Restangular.all(url).get('', {}, headers).then(function (data) {
          deferred.resolve(data);
        }, function (ex) {
          services.throwSnag();
          deferred.resolve(error);
        });
        return deferred.promise;
      };
      services.docTypes = function (accountDetailsRefId, opendate) {
        var deferred = $q.defer();
        var headers = {EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()}; // {'BUS_EVT_ID': 50000};
        //TODO check with PO on the valid header
        var url = 'HomeLoans/requestDoc/' + encodeURIComponent(accountDetailsRefId);
        var queryParams = {
          'openDate'       : opendate,
          'productTypeCode': productCategory
        };
        Restangular.all(url).get('', queryParams, headers).then(function (data) {
          deferred.resolve(data);
        }, function (ex) {
          services.throwSnag();
          deferred.resolve(error);
        });
        return deferred.promise;
      };
      return services;
    });


});

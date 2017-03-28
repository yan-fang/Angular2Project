define(['angular', 'StatementModule', 'easeAccordion', 'angular-formly',
  'formlyBootstrap', 'slickCarousel'],
  function(angular) {

  'use strict';

  angular
      .module('BankModule', ['ui.router', 'restangular', 'oc.lazyLoad', 'EaseProperties', 'easeAppUtils', 'ngAnimate', 'StatementModule', 'pubsubServiceModule', 'slick', 'TransferModule', 'easeAccordion', 'formly'])
      .config(BankModuleConfig)
      .run(BankModuleRun);

  //----------------------------------- Bank Configuration -------------------------------------------------------------
  var basePath = '/ease-ui/bower_components/Bank/01.01.01.1210/';

  function BankModuleConfig($stateProvider, easeFilesProvider, transferStateProvider) {
    var timestamp = Date.now();
    var bankDetailsState = {
      params: {
        accountDetails: ''
      },
      name: 'BankDetails',
      url: '/{ProductName}/{accountReferenceId}',
      abstract: true,
      resolve: {
        /*
         * NOTE: We are lazyloading Debit module here
         * so we support deep linking to Debit feature
         * and not just force users to go through more
         * account Services to load the module. We are
         * also forcing caching busting with timestamp
         * so there is never an issue of a cached module.
         */
        'DebitModule': function getDebit($ocLazyLoad) {
          $ocLazyLoad.load({
            files: ['./ease-ui/bower_components/Debit/Debit-module.js?t=' + Date.now() ]
          }).then(function(response){
            return response;
          }).catch(function(){
            return {};
          });
        },
        'BankUtils': function getBankAccountUtils($ocLazyLoad) {
          return $ocLazyLoad.load({
            files: [basePath + 'features/utils/utils-account-service.js']
          })
        },
        'i18nBank' : function geti18nBank($ocLazyLoad, $injector) {
          return $ocLazyLoad.load({
            files: [basePath + 'Bank-services.js']
          }).then(function (){
            var factory = $injector.get('BankLocalization');
            return factory.getBundle();
          });
        },
        'BankController': function getBankController($ocLazyLoad) {
          return $ocLazyLoad.load({
            files: [basePath + 'Bank-controller.js']
          })
        },
        'BankDirective': function getBankDirectives($ocLazyLoad) {
          return $ocLazyLoad.load({
            files: [basePath + 'Bank-directives.js']
          })
        },
        'BankFilter': function getBankFilters($ocLazyLoad) {
          return $ocLazyLoad.load({
            files: [basePath + 'Bank-filters.js']
          });
        },
        'BankService': function getBankServices($ocLazyLoad, $injector) {
          return $ocLazyLoad.load({
            files: [basePath + 'Bank-services.js']
          }).then(function() {
            return $injector.get('BankAccountDetailsFactory');
          })
        },
        'BankPubSubService': function getBankServices($ocLazyLoad) {
          return $ocLazyLoad.load({
            files: [basePath + 'Bank-pubsubservices.js']
          });
        },
        'CheckImageComponent' : function getCheckImageComponent($ocLazyLoad) {
          return $ocLazyLoad.load({
            files: [
              basePath + 'features/components/checkImage/checkImage-directive.js',
              basePath + 'features/components/checkImage/checkImage-service.js'
            ]
          })
        },
        'BankEnvironmentProperties': function getBankFeature($ocLazyLoad) {
          return $ocLazyLoad.load({
            files: [
              basePath + 'Bank-constant.js']
          })
        },
        'BankExtensibilityBar': function getBankFeature($ocLazyLoad) {
          return $ocLazyLoad.load({
            files: [
              basePath + 'features/extensibilitybar/extensibilitybar-directive.js',
              basePath + 'features/extensibilitybar/extensibilitybar-controller.js',
              basePath + 'features/extensibilitybar/extensibilitybar-service.js'
            ]
          })
        },
        'accountDetailsData': function getAccountDetailsData(BankService, $stateParams, $q) {
          var deferred = $q.defer();
          BankService.getBankAccountDetailsFromOL($stateParams.accountReferenceId, $stateParams.accountDetails.lineOfBusiness, $stateParams.accountDetails.productId).then(function (data) {
            deferred.resolve(data);
          });
          return deferred.promise;
        },
        'memoComponent' : function getCheckImageComponent($ocLazyLoad) {
          return $ocLazyLoad.load({
            files: [
              basePath + 'features/components/memo/memo-directive.js'
            ]
          })
        },
        'formlyComponents' : function getFormlyComponents($ocLazyLoad) {
          return $ocLazyLoad.load({
            files: [
              basePath + 'features/components/formlyTemplates/money-input-directive.js'
            ]
          })
        },
        'characterCounterComponent' : function getCharacterCounterComponent($ocLazyLoad) {
          return $ocLazyLoad.load({
            files: [
              basePath + 'features/components/characterCounter/characterCounter-directive.js'
            ]
          })
        },
        'statementsDependencies': function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'StatementModule',
            files: [
              basePath + 'features/statements/statements-controller.js',
              basePath + 'features/statements/statements-service.js',
              easeFilesProvider.get('controller', 'Statement'),
              easeFilesProvider.get('service', 'Statement'),
              easeFilesProvider.get('directive', 'Statement')
          ]
          });
        },
        'transferDependencies': function ($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'TransferModule',
            files: [easeFilesProvider.get('services', 'Transfer'),
              easeFilesProvider.get('controller', 'Transfer'),
              easeFilesProvider.get('directives', 'Transfer')]
          });
        }
      },
      controller: 'BankController',
      controllerAs: 'BankDetails',
      templateUrl: basePath + 'partials/Bank-index.html'
    };

    var bankTransactionState = {
      name: 'BankDetails.transactions',
      url: '',
      parent: bankDetailsState,
      params: {
        actionableDebitCards: null
      },
      resolve: {
        'BillPayModule': function getBillPay($ocLazyLoad) {
          $ocLazyLoad.load({
            files: ['./ease-ui/bower_components/BillPay/BillPay-module.js?t=' + Date.now() ]
          }).then(function(response){
            return response;
          }).catch(function(){
            return {};
          });
        },
        'TransactionsComponent': function getTransactionsController($ocLazyLoad) {
          return $ocLazyLoad.load({
            files: [
              basePath + 'features/transactions/transactions-controller.js',
              basePath + 'features/transactions/transactions-service.js'
            ]
          })
        },
        'BankUpcomingTransactions': function getBankUpcomingController($ocLazyLoad) {
          return $ocLazyLoad.load({
            files: [
              basePath + 'features/upcomingTransactions/upcomingTransactions-controller.js',
              basePath + 'features/upcomingTransactions/upcomingTransactions-cardController.js',
              basePath + 'features/upcomingTransactions/upcomingTransactions-cardDetailController.js',
              basePath + 'features/upcomingTransactions/upcomingTransactions-cardDirective.js',
              basePath + 'features/upcomingTransactions/upcomingTransactions-directive.js',
              basePath + 'features/upcomingTransactions/upcomingTransactions-slickSlider.js',
              basePath + 'features/upcomingTransactions/upcomingTransactions-addMoreCardDirective.js',
              basePath + 'features/upcomingTransactions/upcomingTransactions-helpers.js',
              basePath + 'features/upcomingTransactions/upcomingTransactions-filters.js'
            ]
          })
        },
        'BankUpcomingService': function getBankUpcomingService($ocLazyLoad, $injector) {
          return $ocLazyLoad.load({
            files: [
              basePath + 'features/upcomingTransactions/upcomingTransactions-services.js'
            ]
          }).then(function injectFactories() {
            return $injector.get('BankUpcomingTransactionsFactory')
          })
        },
        'BankDisputeController': function getBankDisputeController ($ocLazyLoad) {
          return $ocLazyLoad.load({
            files: [
              basePath + 'features/dispute/dispute-controller.js',
              basePath + 'features/dispute/dispute-formly-configuration.js',
              basePath + 'features/dispute/retail/retail-dispute-formly-configuration.js',
              basePath + 'features/dispute/retail/retail-dispute-service.js',
              basePath + 'features/dispute/dispute-common-service.js',
              basePath + 'features/dispute/dispute-formly-util.js',
              basePath + 'features/dispute/dispute-service.js'
            ]
          });
        }
      },
      controller: 'BankTransactionController',
      controllerAs: 'BankTransaction',
      templateUrl: basePath + 'partials/Bank-transactions.html',
      title: 'Bank Details'
    };

    var bankViewDetailsModalState = {
      name: 'BankDetails.transactions.viewDetails',
      url: '/Details',
      parent: bankTransactionState,
      resolve : {
        'BankViewDetailsHelper': function getBankViewDetailsHelperService($ocLazyLoad) {
          return $ocLazyLoad.load({
            files: [
              basePath + 'Bank-viewDetailsHelper.js'
            ]
          });
        }
      },
      controller: 'BankViewDetailsController',
      controllerAs: 'bankViewDetails',
      templateUrl: basePath + 'partials/Bank-viewDetails.html'
    };

    var bankDisputeModalState = {
      name: 'disputeModel',
      url: '/Dispute',
      parent: bankTransactionState,
      controller: 'BankDisputeController',
      controllerAs: 'BankDispute',
      templateUrl: basePath + 'features/dispute/partials/Dispute-index.html',
      params: {
        disputeType: '',
        propertyPackage: '',
        transactionIndex : ''
      },
      resolve : {
        'loadFormlyConfiguration' : function loadFormlyConfiguration($injector) {
          var factory = $injector.get('DisputeFormlyFactory');
          return factory.initFormlyConfiguration();
        }
      }
    };

    var retailDisputeModalState = {
      name: 'BankDetails.transactions.retailDisputeModel',
      url: '/RetailDispute',
      parent: bankTransactionState,
      controller: 'RetailDisputeController',
      controllerAs: 'RetailDispute',
      templateUrl: basePath + 'features/dispute/retail/partials/Retail-Dispute-Index.html',
      params: {
        transactionId:'',
        disputeType: '',
        propertyPackage: '',
        transactionIndex : ''
      },
      resolve : {
        'loadFormlyConfiguration' : function loadFormlyConfiguration($injector) {
          var factory = $injector.get('RetailDisputeFormlyFactory');
          return factory.initFormlyConfiguration();
        },
        'RetailDisputeController': function getBankDisputeController ($ocLazyLoad) {
          return $ocLazyLoad.load({
            files: [basePath + 'features/dispute/retail/retail-dispute-controller.js']
          });
        }
      }
    };

    var bankDisclosuresModalState = {
      name: 'BankDetails.transactions.disclosures',
      url: '/Disclosures',
      resolve : {
        'BankViewDetailsHelper': function getBankViewDetailsHelperService($ocLazyLoad, $injector) {
          $ocLazyLoad.load({
            files: [
              basePath + 'Bank-viewDetailsHelper.js'
            ]
          }).then(function injectFactories() {
            return $injector.get('BankDisclosuresFactory')
          })
        },
        'agreementDetailsData': function getAgreementDetailsData(BankViewDetailsHelper, $stateParams, $q, accountDetailsData) {
          var deferred = $q.defer();
          BankViewDetailsHelper.getAgreementsFromOL($stateParams.accountReferenceId, accountDetailsData.accountDetails.productId).then(function (data) {
            deferred.resolve(data);
          });
          return deferred.promise;
        }
      },
      controller: 'BankDisclosuresController',
      controllerAs: 'bankDisclosuresCtrl',
      templateUrl: basePath + 'partials/Bank-disclosures.html'
    };

    var statementOpenModalState = {
      name: 'BankDetails.statementOpen',
      url: '/Statements',
      parent: bankTransactionState,
      resolve:{
        'BankStatementsService': function getBankStatementsService($ocLazyLoad, $injector) {
          return $ocLazyLoad.load({
            name: 'BankStatementsService'
          }).then(function injectFactories() {
            return $injector.get('BankStatementsFactory')
          })
        },
        lstStatementData: function(BankStatementsService, accountDetailsData) {
          console.log("Inside BankStatement Module");
          return BankStatementsService.getBankStatements(accountDetailsData.accountRefId);
        }
      },
      controller: 'BankStatementsController',
      controllerAs: 'stCtrl',
      templateUrl: basePath + 'features/statements/partial/Bank-statements.html'
    };

    var cardDetailsModalState = {
      name: 'BankDetails.transactions.cardDetails',
      url: '/cardDetails/:transactionRefId/:cardIndex',
      parent: bankTransactionState,
      controller: 'UpcomingCardDetailsController',
      controllerAs: 'upcomingCardDetailsCtrl',
      templateUrl: basePath + 'features/upcomingTransactions/partials/upcomingTransactions-cardDetails.html'
    };

    var moreServicesModalState = {
      name: 'BankDetails.moreServices',
      url: '/Services',
      parent: bankTransactionState,
      controller: 'BankMoreServicesController',
      controllerAs: 'bankMoreServicesCtrl',
      params: {
        returnFocusTo: null
      },
      templateProvider: function($templateFactory, BankAccountUtilities, BankAccountDetailsFactory) {
        if (BankAccountUtilities.isRetailAccount(BankAccountDetailsFactory.getAccountDetails().subCategory)) {
          return $templateFactory.fromUrl(basePath + 'features/moreServices/html/moreServices-retail-index.html');
        }
        return $templateFactory.fromUrl(basePath + 'features/moreServices/html/moreServices-index.html');
      },
      resolve: {
        'BankMoreServicesService': function getBankMoreServicesService($ocLazyLoad, $injector) {
          return $ocLazyLoad.load({
            files: [
              basePath + 'features/moreServices/moreServices-controller.js',
              basePath + 'features/moreServices/moreServices-service.js'
            ]
          }).then(function injectFactories() {
            return $injector.get('BankMoreServicesService')
          })
        }
      }
    };

    var billPayMakePaymentModalState = {
      name: 'BankDetails.MakePayment',
      url: '/makePay?subCategory&payeeReferenceId',
      parent: bankTransactionState,
      templateUrl: '/ease-ui/bower_components/Bank/features/billPay/html/make-payment.html',
      params: {
        payeeReferenceId: '',
        subCategory: ''
      },
      resolve: {
        getBillPayDependency: function getBillPayDependency ($ocLazyLoad) {
          return $ocLazyLoad.load({serie: true, name: 'BillPayModule',
            files: [
              './ease-ui/bower_components/BillPay/BillPay-module.js?t=' + timestamp,
              './ease-ui/bower_components/BillPay/directives/makePayment/makeModal-directive.js?t=' + timestamp,
              './ease-ui/bower_components/BillPay/features/Payment/MakePayment/MakePayment-controller.js?t=' + timestamp,
              easeFilesProvider.get('directives', 'BillPay', ['Payment']),
              easeFilesProvider.get('pubsubservices', 'BillPay'),
              easeFilesProvider.get('services', 'BillPay', ['Payment']),
              easeFilesProvider.get('services', 'BillPay', ['Payee']),
              easeFilesProvider.get('utils', 'BillPay'),
              easeFilesProvider.get('properties', 'BillPay'),
              easeFilesProvider.get('services', 'BillPay', ['ErrorHandler']),
              easeFilesProvider.get('controller', 'BillPay', 'ErrorHandler'),
              easeFilesProvider.get('payeeNameFilter', 'BillPay', ['utils'])
            ]
          });
        }
      }
    };

    //Setup Transfer Money States Dynamically
    transferStateProvider.set(bankTransactionState, 'BankDetails.transfer', 'BankDetails.transferSuccess', 'BankDetails.transferCancel', 'BankDetails.transferCancelConfirm', 'BankDetails.transferError', 'BankDetails.transferEdit', '/Transfer');
    var TransferMoneyStates = transferStateProvider.get();
    var TransferStart = TransferMoneyStates.transferStart ;
    var transferSuccess = TransferMoneyStates.transferSuccess;
    var transferEdit = TransferMoneyStates.transferEdit;
    var transferCancel = TransferMoneyStates.transferCancel;
    var transferCancelConfirm = TransferMoneyStates.transferCancelConfirm;
    var transferError = TransferMoneyStates.transferError;

    $stateProvider.state(bankDetailsState);
    $stateProvider.state(bankTransactionState);
    $stateProvider.state(bankViewDetailsModalState);
    $stateProvider.state(statementOpenModalState);
    $stateProvider.state(TransferStart);
    $stateProvider.state(transferSuccess);
    $stateProvider.state(transferEdit);
    $stateProvider.state(transferCancel);
    $stateProvider.state(transferError);
    $stateProvider.state(transferCancelConfirm);
    $stateProvider.state(cardDetailsModalState);
    $stateProvider.state(moreServicesModalState);
    $stateProvider.state(bankDisclosuresModalState);

    $stateProvider.state(bankDisputeModalState);
    $stateProvider.state(retailDisputeModalState);

  }

  function BankModuleRun(formlyConfig) {
    //Custom Formly templates
    formlyConfig.setType({
      name: 'datepicker',
      extends: 'input',
      templateUrl: basePath + 'features/components/formlyTemplates/datepicker.html',
      controller: ['$scope', '$filter', function($scope, $filter) {
        var vm = $scope;
        var today = new Date();

        vm.datePicker = {
          displayFormat : "MMM dd, y",
          isOpen: false,
          openPopup: function openPopup() {
            vm.datePicker.isOpen = true;
          },          
          selected: null
        };

        vm.calendarOptions = {
          format_day_header: 'EEEE',
          format_day_title: 'MMMM YYYY',
          placement: 'bottom-center',
          today : today,
          min_date: getMinDate(),
          max_date: getMaxDate()
        };

        function getMinDate() {
          return new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        }

        function getMaxDate() {
          return new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
        }

        $scope.$watch('datePicker.selected', function() {
           $scope.model[$scope.options.key] = $filter('date')(vm.datePicker.selected,  vm.datePicker.displayFormat);
            vm.datePicker.isOpen = false;
        });
      }]
    });

    formlyConfig.setType({
      name: 'moneyInput',
      extends: 'input',
      templateUrl: basePath + 'features/components/formlyTemplates/money-input.html'
    });

    formlyConfig.setType({
      name: 'textareaWithCountdown',
      extends : 'textarea',
      templateUrl: basePath + 'features/components/formlyTemplates/textarea-countdown.html',
      controller : ['$scope', function ($scope) {
        $scope.$watch("to.countdownOptions.isCountNegative", function(newValue) {
          $scope.fc.$setValidity('characterLimitExceeded', !newValue);
        })
      }]
    });

    formlyConfig.setType({
      name: 'phoneInput',
      extends: 'input',
      templateUrl: basePath + 'features/components/formlyTemplates/phone-input.html',
      controller: ['$scope', function ($scope) {
        $scope.id = 'phoneInput';
        $scope.inputType = 'phone';
        $scope.limit = 14;
        $scope.size = 30;
      }]
    });

    formlyConfig.setType({
      name: 'radioInput',
      extends: 'input',
      templateUrl: basePath + 'features/components/formlyTemplates/radio-input.html'
    });

    formlyConfig.setType({
      name: 'emailInput', extends: 'input',
      templateUrl: basePath + 'features/components/formlyTemplates/email-input.html',
      controller: ['$scope', function($scope) {
        $scope.id = 'emailInput';
        $scope.inputType = 'email';
        $scope.limit = 50;
        $scope.size = 30;
      }]
    });

    formlyConfig.setWrapper([{
      name: 'requiredField',
      templateUrl : basePath + 'features/components/formlyTemplates/required-wrapper.html'
    }]);

    formlyConfig.setWrapper([{
      name: 'tooltipLabel',
      templateUrl : basePath + 'features/components/formlyTemplates/tooltip-label-wrapper.html'
    }])
  }
});

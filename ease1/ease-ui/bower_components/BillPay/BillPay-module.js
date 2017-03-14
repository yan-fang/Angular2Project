define(['angular'], function(angular) {
  'use strict';

  var basePath = './ease-ui/bower_components/BillPay/@@version';
  var billPayModule = angular.module(
    'BillPayModule', [
      'ui.router',
      'EaseProperties',
      'easeAppUtils',
      'restangular',
      'oc.lazyLoad',
      'EaseExceptionsModule',
      'ngAria'
    ]);

  billPayModule.config(function($stateProvider) {
    var billPay = {
      name: 'BillPay',
      url: '/{productName}/{accountReferenceId}?subCategory',
      templateUrl: basePath + '/partials/BillPay-index.html',
      /*eslint-disable */
      abstract: true,
      /*eslint-enable */
      params: {
        subCategory: ''
      },
      resolve: {
        'billPayDependencies': getBillPayDependency,

        'featureToggleData': function getFeatureToggleData(billPayDependencies, FeatureToggleService) {
          return FeatureToggleService.getFeatureToggleDataFromOL();
        }
      }
    };

    var payeeList = {
      name: 'BillPay.PayeeList',
      url: '/ViewPayees',
      title: 'Sneak Peek | Bill Pay',
      parent: 'BillPay',
      controller: 'BillPayHubController',
      controllerAs: 'HubCtrl',
      templateUrl: basePath + '/features/hub/hub-partial.html'
    };

    var billPayRecurringPayment = {
      name: 'BillPay.RecurringPayment',
      url: '/Recurring-Pay',
      parent: 'BillPay.PayeeList',
      controller: 'RecurringPaymentController',
      controllerAs: 'RecurringCtl',
      templateUrl: basePath + '/features/Payment/recurringPayment/action/recurringPayment-partial.html',
      params: {
        returnFocusId: ''
      },
      resolve: {
        'getBillPayDependency': getBillPayDependency,
        'cleanServiceDate': function(getBillPayDependency, AccountsService, PaymentDetailService) {
          AccountsService.deleteEligibleAccounts();
          PaymentDetailService.deletePaymentDetail();
        },
        'getEligibleAccounts': function(getBillPayDependency, AccountsService, $stateParams) {
          return AccountsService.getEligibleAccountsRestCall($stateParams.subCategory);
        }
      }
    };

    var billPayConfirmRecurringPayment = {
      name: 'BillPay.ConfirmRecurringPayment',
      parent: 'BillPay.PayeeList',
      controller: 'ConfirmRecurringPaymentController',
      controllerAs: 'ConfirmRecurringPaymentCtl',
      templateUrl: basePath + '/features/Payment/recurringPayment/confirmation/confirmPayment-partial.html'
    };

    var billPayMakePayment = {
      name: 'BillPay.MakePayment',
      url: '/Pay',
      parent: 'BillPay.PayeeList',
      controller: 'OneTimePaymentController',
      controllerAs: 'MakePaymentCtl',
      templateUrl: basePath + '/features/Payment/oneTimePayment/action/OneTimePayment-partial.html',
      params: {
        returnFocusId: '',
        reloadData: true
      },
      resolve: {
        'getBillPayDependency': getBillPayDependency,
        'cleanServiceData': function($stateParams, getBillPayDependency, AccountsService, PaymentDetailService) {
          if ($stateParams.reloadData) {
            AccountsService.deleteEligibleAccounts();
            PaymentDetailService.deletePaymentDetail();
          }
        },
        'getEligibleAccounts': function($stateParams, getBillPayDependency, AccountsService) {
          if ($stateParams.reloadData) {
            return AccountsService.getEligibleAccountsRestCall($stateParams.subCategory);
          }
        }
      }
    };

    var billPayConfirmPayment = {
      name: 'BillPay.ConfirmPayment',
      parent: 'BillPay.PayeeList',
      controller: 'ConfirmPaymentController',
      controllerAs: 'ConfirmPaymentCtl',
      templateUrl: basePath + '/features/Payment/oneTimePayment/confirmation/ConfirmPayment-partial.html',
      params: {
        actionType: '',
        returnFocusId: ''
      }
    };

    var billPayError = {
      name: 'BillPay.error',
      parent: 'BillPay.PayeeList',
      controller: 'BillPayErrorHandlerController',
      controllerAs: 'error',
      templateUrl: basePath + '/features/Error/ErrorHandler-partial.html'
    };

    var bankBillPayError = {
      name: 'BankDetails.billpayError',
      parent: 'BankDetails.transactions',
      controller: 'BillPayErrorHandlerController',
      controllerAs: 'error',
      templateUrl: basePath + '/features/Error/ErrorHandler-partial.html'
    };

    var bankMakePayment = {
      name: 'BankDetails.MakePayment',
      url: '/makePay?subCategory&payeeReferenceId',
      parent: 'BankDetails.transactions',
      controller: 'OneTimePaymentController',
      controllerAs: 'MakePaymentCtl',
      templateUrl: basePath + '/features/Payment/oneTimePayment/action/OneTimePayment-partial.html',
      params: {
        payeeReferenceId: '',
        subCategory: '',
        unscheduledeBillReferenceId: '',
        upcomingFocusId: ''
      },
      resolve: {
        'getBillPayDependency': getBillPayDependency,
        'cleanServiceDate': function(getBillPayDependency, AccountsService, PayeeDetailService, PaymentDetailService) {
          AccountsService.deleteEligibleAccounts();
          PayeeDetailService.deletePayeeDetail();
          PaymentDetailService.deletePaymentDetail();
        },
        'getPayeeDetail': function(getBillPayDependency, PayeeDetailService, $stateParams) {
          return PayeeDetailService.initializePayeeDetail(
            $stateParams.payeeReferenceId,
            $stateParams.accountReferenceId
          );
        },
        'getEligibleAccounts': function(getBillPayDependency, AccountsService, $stateParams) {
          return AccountsService.getEligibleAccountsRestCall($stateParams.subCategory);
        }
      }
    };

    var bankConfirmPayment = {
      name: 'BankDetails.ConfirmPayment',
      parent: 'BankDetails.transactions',
      controller: 'ConfirmPaymentController',
      controllerAs: 'ConfirmPaymentCtl',
      templateUrl: basePath + '/features/Payment/oneTimePayment/confirmation/ConfirmPayment-partial.html',
      params: {
        subCategory: '',
        actionType: ''
      },
      resolve: {
        'getBillPayDependency': getBillPayDependency,
        'test': function() {
          return true;
        }
      }
    };

    var bankEditPaymentModalState = {
      name: 'BankDetails.EditPayment',
      url: '/editPay?subCategory&transactionReferenceId',
      parent: 'BankDetails.transactions',
      controller: 'OneTimePaymentController',
      controllerAs: 'MakePaymentCtl',
      templateUrl: basePath + '/features/Payment/oneTimePayment/action/OneTimePayment-partial.html',
      params: {
        transactionReferenceId: '',
        subCategory: '',
        upcomingFocusId: ''
      },
      resolve: {
        'getBillPayDependency': getBillPayDependency,
        'cleanServiceDate': function(getBillPayDependency, AccountsService, PayeeDetailService, PaymentDetailService) {
          AccountsService.deleteEligibleAccounts();
          PayeeDetailService.deletePayeeDetail();
          PaymentDetailService.deletePaymentDetail();
        },
        'getPaymentDetail': function(getBillPayDependency, PaymentDetailService, $stateParams) {
          return PaymentDetailService.getPaymentDetailRestCall(
            $stateParams.transactionReferenceId,
            $stateParams.accountReferenceId
          );
        },
        'getPayeeDetail': function(getPaymentDetail, PaymentDetailService, PayeeDetailService) {
          var paymentDetail = PaymentDetailService.getPaymentInfo();
          return PayeeDetailService.initializePayeeDetailFromPaymentDetail(paymentDetail);
        },
        'getEligibleAccounts': function(getBillPayDependency, AccountsService, $stateParams) {
          return AccountsService.getEligibleAccountsRestCall($stateParams.subCategory);
        }
      }
    };

    var searchPayee = {
      name: 'BillPay.searchPayee',
      url: '/search',
      parent: 'BillPay.PayeeList',
      controller: 'SearchPayeeController',
      controllerAs: 'searchPayeeCtrl',
      templateUrl: basePath + '/features/Payee/SearchPayee/SearchPayee.html'
    };

    var editPayee = {
      name: 'BillPay.editPayee',
      url: '/editPayee',
      parent: 'BillPay.PayeeList',
      controller: 'EditPayeeController',
      controllerAs: 'editPayeeCtrl',
      templateUrl: basePath + '/features/Payee/EditPayee/EditPayee.html',
      params: {
        returnFocusId: ''
      }
    };

    var addPayee = {
      name: 'BillPay.addPayee',
      url: '/addPayee',
      /*eslint-disable */
      abstract: true,
      /*eslint-enable */
      parent: 'BillPay.PayeeList',
      controller: 'AddPayeeController',
      controllerAs: 'addPayeeCtrl',
      template: '<div ui-view></div>'
    };

    var addPayeeAccountInfo = {
      name: 'BillPay.addPayee.accountInfo',
      url: '/accountInfo',
      controller: 'AddPayeeAcctInfoController',
      controllerAs: 'addPayeeAcctInfoCtrl',
      templateUrl: basePath + '/features/Payee/AddPayee/partials/AddPayee-accountInfo.html'
    };

    var addPayeeContactInfo = {
      name: 'BillPay.addPayee.contactInfo',
      url: '/contactInfo',
      controller: 'AddPayeeContactInfoController',
      controllerAs: 'addPayeeContactInfoCtrl',
      templateUrl: basePath + '/features/Payee/AddPayee/partials/AddPayee-contactInfo.html'
    };

    // This is for manual flow
    var addPayeeAcctNumberAsk = {
      name: 'BillPay.addPayee.acctNumberAsk',
      url: '/acctNumberAsk',
      controller: 'AddPayeeAcctNumberAskController',
      controllerAs: 'addPayeeAcctNumAskCtrl',
      templateUrl: basePath + '/features/Payee/AddPayee/partials/AddPayee-actNumberAsk.html'
    };

    var addPayeeSuccess = {
      name: 'BillPay.addPayee.success',
      url: '/success',
      controller: 'AddPayeeSuccessController',
      controllerAs: 'addPayeeSuccessCtrl',
      templateUrl: basePath + '/features/Payee/AddPayee/partials/AddPayee-success.html'
    };

    var deletePayee = {
      name: 'BillPay.DeletePayee',
      url: '/deletePayee',
      parent: 'BillPay.PayeeList',
      controller: 'DeletePayeeController',
      controllerAs: 'DeletePayeeCtl',
      templateUrl: basePath + '/features/Payee/DeletePayee/action/DeletePayee-partial.html',
      params: {
        returnFocusId: ''
      },
      resolve: {
        'getBillPayDependency': getBillPayDependency,
        'cleanServiceData': function(getBillPayDependency, DeletePayeeService) {
          DeletePayeeService.deletePaymentList();
        },
        'getPaymentListFromServer': function(getBillPayDependency, DeletePayeeService) {
          var payeeToDelete = DeletePayeeService.getPayeeToDelete();
          return DeletePayeeService.getPaymentListRestCall(payeeToDelete.payeeReferenceId);
        }
      }
    };

    var deletePayeeConfirm = {
      name: 'BillPay.ConfirmDeletePayee',
      parent: 'BillPay.PayeeList',
      controller: 'ConfirmDeletePayeeController',
      controllerAs: 'ConfirmDeletePayeeCtl',
      templateUrl: basePath + '/features/Payee/DeletePayee/confirmation/ConfirmDeletePayee-partial.html',
      params: {
        actionType: ''
      }
    };

    var bankCancelPayment = {
      name: 'BankDetails.cancelPayment',
      url: '/cancelRecurringPay?subCategory&transactionReferenceId',
      parent: 'BankDetails.transactions',
      template: '<cancel-payment></cancel-payment>',
      params: {
        transactionReferenceId: '',
        subCategory: '',
        upcomingFocusId: '',
        paymentPlanReferenceId: ''
      },
      resolve: {
        'getBillPayDependency': getBillPayDependency,
        'cleanServiceDate': function(
          getBillPayDependency,
          AccountsService,
          PaymentDetailService,
          RecurringPaymentDetailService) {
          AccountsService.deleteEligibleAccounts();
          PaymentDetailService.deletePaymentDetail();
          RecurringPaymentDetailService.deleteRecurringPaymentDetail();
        },
        'getPaymentDetail': function(getBillPayDependency, PaymentDetailService, $stateParams) {
          if (!$stateParams.transactionReferenceId) return;
          if ($stateParams.paymentPlanReferenceId) return;
          return PaymentDetailService.getPaymentDetailRestCall(
            $stateParams.transactionReferenceId,
            $stateParams.accountReferenceId
          );
        },
        'getRecurringPaymentDetail': function(getBillPayDependency, RecurringPaymentDetailService, $stateParams) {
          if (!$stateParams.paymentPlanReferenceId) return;
          return RecurringPaymentDetailService.getRecurringPaymentDetailRestCall(
            $stateParams.paymentPlanReferenceId,
            $stateParams.accountReferenceId
          );
        },
        'getEligibleAccounts': function(getBillPayDependency, AccountsService, $stateParams) {
          return AccountsService.getEligibleAccountsRestCall($stateParams.subCategory);
        }
      }
    };

    // states for bill pay hub
    $stateProvider.state(billPay);

    $stateProvider.state(payeeList);
    $stateProvider.state(billPayMakePayment);
    $stateProvider.state(billPayConfirmPayment);
    $stateProvider.state(billPayError);

    // recurring payment
    $stateProvider.state(billPayRecurringPayment);
    $stateProvider.state(billPayConfirmRecurringPayment);

    // Add Payee Flows
    $stateProvider.state(searchPayee);
    $stateProvider.state(addPayee);
    $stateProvider.state(addPayeeSuccess);
    $stateProvider.state(addPayeeAccountInfo);
    $stateProvider.state(addPayeeContactInfo);
    $stateProvider.state(addPayeeAcctNumberAsk);

    // Edit Payee Flow
    $stateProvider.state(editPayee);

    // states for modal reuse
    $stateProvider.state(bankMakePayment);
    $stateProvider.state(bankConfirmPayment);
    $stateProvider.state(bankEditPaymentModalState);
    $stateProvider.state(bankCancelPayment);
    $stateProvider.state(bankBillPayError);

    // Delete Payee Flows
    $stateProvider.state(deletePayee);
    $stateProvider.state(deletePayeeConfirm);

    /*eslint-disable */
    function getBillPayDependency($ocLazyLoad) {
      return $ocLazyLoad.load({
        name: 'BillPayModule',
        serie: false,
        files: [
          basePath + '/styles/bill-pay-override.css',
          basePath + '/BillPay-properties.js',
          basePath + '/BillPay-constant.js',

          basePath + '/components/common/BillPay-pubsubservices.js',
          basePath + '/components/common/ngEnter-directive.js',
          basePath + '/components/common/removeRole-directive.js',
          basePath + '/features/hub/hub-controller.js',
          basePath + '/features/Error/ErrorHandler-services.js',
          basePath + '/features/Error/ErrorHandler-controller.js',
          basePath + '/services/state-list-service.js',
          basePath + '/services/feature-toggle-service.js',

          basePath + '/components/common/utils-payeeNameFilter.js',
          basePath + '/components/common/utils-string.js',
          basePath + '/features/utils/restrict-directive.js',
          basePath + '/features/utils/disable-paste-directive.js',
          basePath + '/features/utils/input-masks-directive.js',
          basePath + '/BillPay-controller.js',

          // Add Payee Flows
          basePath + '/features/Payee/SearchPayee/SearchPayee-controller.js',
          basePath + '/features/Payee/SearchPayee/SearchPayee-service.js',
          basePath + '/features/Payee/payee-service.js',
          basePath + '/features/Payee/AddPayee/AddPayee-controller.js',
          basePath + '/features/Payee/AddPayee/AddPayee-AcctInfo-controller.js',
          basePath + '/features/Payee/AddPayee/AddPayee-AcctNumberAsk-controller.js',
          basePath + '/features/Payee/AddPayee/AddPayee-ContactInfo-controller.js',
          basePath + '/features/Payee/AddPayee/AddPayee-Success-controller.js',
          basePath + '/features/Payee/payee-list-service.js',
          basePath + '/features/Payee/PayeeDetail/PayeeDetail-service.js',

          // Edit Payee
          basePath + '/features/Payee/EditPayee/EditPayee-controller.js',

          basePath + '/features/Payment/oneTimePayment/action/OneTimePayment-controller.js',
          basePath + '/features/Payment/oneTimePayment/confirmation/ConfirmPayment-controller.js',
          basePath + '/features/Payment/oneTimePayment/oneTimePayment-Service.js',
          basePath + '/features/Payment/datePicker/datepicker-service.js',
          basePath + '/features/Payment/datePicker/paymentDate-Service.js',

          basePath + '/features/Payment/paymentDetail/paymentDetail-service.js',
          basePath + '/features/Payment/account/account-service.js',

          // Delete Payee Flows
          basePath + '/features/Payee/DeletePayee/action/DeletePayee-controller.js',
          basePath + '/features/Payee/DeletePayee/confirmation/ConfirmDeletePayee-controller.js',
          basePath + '/features/Payee/DeletePayee/DeletePayee-service.js',

          basePath + '/components/common/formatDate-directive.js',
          basePath + '/components/common/formatAmount-directive.js',
          basePath + '/components/common/memo-directive.js',

          // recurring payment dependency
          basePath + '/features/Payment/recurringPayment/recurringPayment-service.js',
          basePath + '/features/Payment/recurringPayment/action/recurringPayment-controller.js',
          basePath + '/features/Payment/recurringPayment/confirmation/confirmPayment-controller.js',
          basePath + '/features/Payment/recurringPaymentDetail/recurringPaymentDetail-service.js',

          // cancel payment dependency
          basePath + '/features/Payment/cancelPayment/cancelOneTime-service.js',
          basePath + '/features/Payment/cancelPayment/cancelRecurring-service.js',

          // components location
          basePath + '/components/payment/common/billpayAmount/billpayAmount.component.js',
          basePath + '/components/payment/cancelPayment/cancelPayment.component.js',
          basePath + '/components/payment/cancelOneTime/cancelOneTimeConfirmation/cancelOneTimeConfirmation.component.js',
          basePath + '/components/payment/cancelOneTime/cancelOneTimeAction/cancelOneTimeAction.component.js',
          basePath + '/components/payment/cancelRecurring/cancelRecurringConfirmation/cancelRecurringConfirmation.component.js',
          basePath + '/components/payment/cancelRecurring/cancelRecurringAction/cancelRecurringAction.component.js',
          basePath + '/components/common/submitButton/submitButton.component.js',
          basePath + '/components/common/radioGroup/radioGroup.component.js',
          basePath + '/components/common/infoList/infoList.component.js',
          basePath + '/components/payment/common/emailNotifications/emailNotifications.component.js',
          basePath + '/components/common/checkboxList/checkboxList.component.js',
          basePath + '/components/payment/common/lastPaymentAmount/lastPaymentAmount.component.js',
          basePath + '/components/payment/common/payFrom/payFrom.component.js',
          basePath + '/components/payment/common/amountInput/amountInput.component.js',
          basePath + '/components/payment/common/frequencySelection/frequencySelection.component.js',
          basePath + '/components/common/dropdown/dropdown.component.js',
          basePath + '/components/payment/common/numberInput/numberInput.component.js',
          basePath + '/components/payment/common/stopPayment/stopPayment.component.js',
          basePath + '/components/payment/common/dateInput/dateInput.component.js',

          // Payee Components
          basePath + '/components/payee/payeeList/payee-list.component.js',
          basePath + '/components/payee/payeeAccountInfo/payee-account-info.component.js',
          basePath + '/components/payee/payeeSuccess/payee-success.component.js',
          basePath + '/components/payee/editPayeeContactInfo/edit-payee-contact-info.component.js',

          // bill pay filter
          basePath + '/components/common/formatStringDate.filter.js'
        ]
      });
      /*eslint-enable */
    }
  });

  return billPayModule;
});

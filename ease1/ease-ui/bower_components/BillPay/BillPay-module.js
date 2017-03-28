define(['angular'], function(angular) {
  'use strict';

  var basePath = './ease-ui/bower_components/BillPay/ver01.01.01.2135';
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

    var billPayEBillMarkAsPaid = {
      name: 'BillPay.markAsPaid',
      url: '/Mark-as-paid',
      parent: 'BillPay.PayeeList',
      template: '<ebill-mark-as-paid></ebill-mark-as-paid>',
      params: {
        returnFocusId: ''
      },
      resolve: {
        'getBillPayDependency': getBillPayDependency
      }
    };

    var billPayConfirmRecurringPayment = {
      name: 'BillPay.ConfirmRecurringPayment',
      parent: 'BillPay.PayeeList',
      controller: 'ConfirmRecurringPaymentController',
      controllerAs: 'ConfirmRecurringPaymentCtl',
      templateUrl: basePath + '/features/Payment/recurringPayment/confirmation/confirmPayment-partial.html',
      params: {
        returnFocusId: ''
      }
    };

    // payment state
    var billPayOneTimePayment = {
      name: 'BillPay.MakePayment',
      url: '/makePayment',
      parent: 'BillPay.PayeeList',
      template: '<make-payment-hub mode="ONE_TIME"></make-payment-hub>',
      params: {
        upcomingFocusId: '',
        reloadData: true
      },
      resolve: {
        'getBillPayDependency': getBillPayDependency,
        'getEligibleAccounts': getEligibleAccounts
      }
    }; 

    var billPayRecurringPayment = {
      name: 'BillPay.RecurringPayment',
      url: '/recurringPayment',
      parent: 'BillPay.PayeeList',
      template: '<make-payment-hub mode="RECURRING"></make-payment-hub>',
      params: {
        upcomingFocusId: '',
        reloadData: true
      },
      resolve: {
        'getBillPayDependency': getBillPayDependency,
        'getEligibleAccounts': getEligibleAccounts
      }
    }; 

    var bankOneTimePayment = {
      name: 'BankDetails.MakePayment',
      url: '/makePayment',
      parent: 'BankDetails.transactions',
      template: '<make-payment-hub mode="ONE_TIME"></make-payment-hub>',
      params: {
        payeeReferenceId: '',
        subCategory: '',
        unscheduledeBillReferenceId: '',
        upcomingFocusId: ''
      },
      resolve: {
        'getBillPayDependency': getBillPayDependency,
        'getEligibleAccounts': getEligibleAccounts,
        'getPayeeDetail': getPayeeDetail
      }
    }; 

    var bankEditPayment = {
      // name: 'BillPay.EditPayment',
      name: 'BankDetails.EditPayment',
      url: '/editPayment?transactionReferenceId&paymentPlanReferenceId',
      // parent: 'BillPay.PayeeList',
      parent: 'BankDetails.transactions',
      template: '<edit-payment-hub></edit-payment-hub>',
      params: {
        transactionReferenceId: '',
        paymentPlanReferenceId: '',
        payeeReferenceId: '',
        upcomingFocusId: ''
      },
      resolve: {
        'getBillPayDependency': getBillPayDependency,
        'getPaymentDetail': getPaymentDetail,
        'getRecurringPaymentDetail': getRecurringPaymentDetail,
        'getEligibleAccounts': getEligibleAccounts,
        'getPayeeDetail': getPayeeDetailFromPaymentDetail
      }
    }; 

    var bankCancelPayment = {
      name: 'BankDetails.cancelPayment',
      // name: 'BillPay.cancelPayment',
      url: '/cancelRecurringPay?transactionReferenceId',
      parent: 'BankDetails.transactions',
      // parent: 'BillPay.PayeeList',
      template: '<cancel-payment-hub></cancel-payment-hub>',
      params: {
        transactionReferenceId: '',
        paymentPlanReferenceId: '',
        upcomingFocusId: ''
      },
      resolve: {
        'getBillPayDependency': getBillPayDependency,
        'getPaymentDetail': getPaymentDetail,
        'getRecurringPaymentDetail': getRecurringPaymentDetail,
        'getEligibleAccounts': getEligibleAccounts
      }
    };


    // payee
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

    
    // states for bill pay hub
    $stateProvider.state(billPay);

    $stateProvider.state(payeeList);
    $stateProvider.state(billPayError);
    $stateProvider.state(bankBillPayError);

    // payment
    $stateProvider.state(billPayOneTimePayment);
    $stateProvider.state(billPayRecurringPayment);
    $stateProvider.state(bankOneTimePayment);
    $stateProvider.state(bankEditPayment);
    $stateProvider.state(bankCancelPayment);

    // E-Bill
    $stateProvider.state(billPayEBillMarkAsPaid);

    // Add Payee Flows
    $stateProvider.state(searchPayee);
    $stateProvider.state(addPayee);
    $stateProvider.state(addPayeeSuccess);
    $stateProvider.state(addPayeeAccountInfo);
    $stateProvider.state(addPayeeContactInfo);
    $stateProvider.state(addPayeeAcctNumberAsk);
    // Edit Payee Flow
    $stateProvider.state(editPayee);
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

          basePath + '/services/ebill-service.js',

          basePath + '/components/common/utils-payeeNameFilter.js',
          basePath + '/components/common/utils-string.js',
          basePath + '/features/utils/restrict-directive.js',
          basePath + '/features/utils/disable-paste-directive.js',
          basePath + '/features/utils/input-masks-directive.js',
          basePath + '/BillPay-controller.js',
          basePath + '/features/hub/hub-service.js',

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

          // Delete Payee Flows
          basePath + '/features/Payee/DeletePayee/action/DeletePayee-controller.js',
          basePath + '/features/Payee/DeletePayee/confirmation/ConfirmDeletePayee-controller.js',
          basePath + '/features/Payee/DeletePayee/DeletePayee-service.js',

          basePath + '/components/common/formatDate-directive.js',
          basePath + '/components/common/formatAmount-directive.js',
          basePath + '/components/common/memo-directive.js',

          // components location
          basePath + '/components/payment/paymentForm/recurringPayment/recurringPaymentConfirmation/recurringPaymentConfirmation.component.js',
          // common
          basePath + '/components/common/submitButton/submitButton.component.js',
          basePath + '/components/common/radioGroup/radioGroup.component.js',
          basePath + '/components/common/infoList/infoList.component.js',
          basePath + '/components/common/checkboxList/checkboxList.component.js',
          basePath + '/components/common/dropdown/dropdown.component.js',
          // payment
          basePath + '/components/payment/common/selectFrequency/selectFrequency.component.js',
          basePath + '/components/payment/common/confirmationCode/confirmationCode.component.js',
          basePath + '/components/payment/common/emailNotifications/emailNotifications.component.js',
          basePath + '/components/payment/common/lastPaymentAmount/lastPaymentAmount.component.js',
          basePath + '/components/payment/common/numberInput/numberInput.component.js',
          basePath + '/components/payment/common/stopPayment/stopPayment.component.js',
          basePath + '/components/payment/common/dateInput/dateInput.component.js',
          basePath + '/components/payment/common/memoInput/memoInput.component.js',
          basePath + '/components/payment/common/billpayDatepicker/billpayDatepicker.component.js',
          basePath + '/components/payment/common/selectAccount/selectAccount.component.js',
          basePath + '/components/payment/common/billpayAmount/billpayAmount.component.js',
          basePath + '/components/payment/makePayment/makePaymentHub/makePaymentHub.component.js',
          basePath + '/components/payment/paymentForm/oneTimePayment/oneTimePayment/components/oneTimeMain/oneTimeMain.component.js',
          basePath + '/components/payment/paymentForm/oneTimePayment/oneTimePayment/oneTimePayment/oneTimePayment.component.js',
          basePath + '/components/payment/paymentForm/oneTimePayment/oneTimeConfirmation/oneTimeConfirmation.component.js',
          basePath + '/components/payment/paymentForm/recurringPayment/recurringPayment/components/recurringStopByPayments/recurringStopByPayments.component.js',
          basePath + '/components/payment/paymentForm/recurringPayment/recurringPayment/components/recurringStopByDate/recurringStopByDate.component.js',
          basePath + '/components/payment/paymentForm/recurringPayment/recurringPayment/components/recurringMain/recurringMain.component.js',
          basePath + '/components/payment/paymentForm/recurringPayment/recurringPayment/recurringPayment/recurringPayment.component.js',
          basePath + '/components/payment/editPayment/editRecurringHub/editRecurringHub.component.js',
          basePath + '/components/payment/editPayment/editPaymentHub/editPaymentHub.component.js',
          basePath + '/components/payment/cancelPayment/cancelPaymentHub/cancelPaymentHub.component.js',
          basePath + '/components/payment/cancelPayment/cancelOneTime/cancelOneTimeConfirmation/cancelOneTimeConfirmation.component.js',
          basePath + '/components/payment/cancelPayment/cancelOneTime/cancelOneTimeAction/cancelOneTimeAction.component.js',
          basePath + '/components/payment/cancelPayment/cancelRecurring/cancelRecurringConfirmation/cancelRecurringConfirmation.component.js',
          basePath + '/components/payment/cancelPayment/cancelRecurring/cancelRecurringAction/cancelRecurringAction.component.js',

          // services location
          basePath + '/services/common/state-list-service.js',
          basePath + '/services/common/feature-toggle-service.js',
          basePath + '/services/account/account.datasource.service.js',
          basePath + '/services/account/account.util.service.js',
          basePath + '/services/payment/paymentDate/paymentDate.util.service.js',
          basePath + '/services/payment/oneTimePayment/oneTimePayment.datasource.service.js',
          basePath + '/services/payment/oneTimePayment/oneTimePayment.util.service.js',
          basePath + '/services/payment/recurringPayment/recurringPayment.datasource.service.js',
          basePath + '/services/payment/recurringPayment/recurringPayment.util.service.js',

          // eBill Components
          basePath + '/components/ebill/markAsPaid/ebill-mark-as-paid.component.js',

          // Payee Components
          basePath + '/components/payee/payeeList/payee-list.component.js',
          basePath + '/components/payee/payeeAccountInfo/payee-account-info.component.js',
          basePath + '/components/payee/payeeSuccess/payee-success.component.js',
          basePath + '/components/payee/editPayeeContactInfo/edit-payee-contact-info.component.js',
          basePath + '/components/payee/manage/manage.component.js',

          // bill pay filter
          basePath + '/components/common/formatStringDate.filter.js'
        ]
      });
      /*eslint-enable */
    }

    function getPaymentDetail(getBillPayDependency, OneTimePaymentDSService, $stateParams) {
      OneTimePaymentDSService.deletePaymentInfo();
      if (!$stateParams.transactionReferenceId) return;
      return OneTimePaymentDSService.getOneTimePaymentDetail(
        $stateParams.transactionReferenceId,
        $stateParams.accountReferenceId
      );
    }

    function getRecurringPaymentDetail(getBillPayDependency, RecurringPaymentDSService, $stateParams) {
      RecurringPaymentDSService.deletePaymentInfo();
      if (!$stateParams.paymentPlanReferenceId) return;
      return RecurringPaymentDSService.getRecurringPaymentDetail(
        $stateParams.paymentPlanReferenceId,
        $stateParams.accountReferenceId
      );
    }
    
    function getEligibleAccounts(getBillPayDependency, AccountDSService, $stateParams) {
      AccountDSService.clearData();
      return AccountDSService.getAccountList($stateParams.subCategory);
    }

    function getPayeeDetail(getBillPayDependency, PayeeDetailService, $stateParams) {
      PayeeDetailService.deletePayeeDetail();
      return PayeeDetailService.initializePayeeDetail(
        $stateParams.payeeReferenceId,
        $stateParams.accountReferenceId
      );
    }

    function getPayeeDetailFromPaymentDetail(getBillPayDependency, getPaymentDetail, PayeeDetailService, OneTimePaymentDSService, $stateParams) {
      PayeeDetailService.deletePayeeDetail();
      var paymentDetail = OneTimePaymentDSService.getPaymentDetail();
      return PayeeDetailService.initializePayeeDetail(
        paymentDetail.payeeInfo.payeeReferenceId,
        $stateParams.accountReferenceId
      );
    }
  });

  return billPayModule;
});

define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').constant('BillPayConstants', {
    billPayAddPaymentUrl: 'BillPay/onetimepayment/',
    billPayRecurringPaymentUrl: 'BillPay/recurring-payment/',
    billPayPayeeListUrl: 'BillPay/payee',
    billPayCancelPaymentUrl: 'BillPay/onetimepayment/~/',
    billPayPaymentDetailUrl: 'BillPay/payment',
    billPayPayeeDetailUrl: 'BillPay/payee/',
    billPayEligibleAccountsUrl: 'BillPay/accountsummary',
    billPaySearchPayeeUrl: 'BillPay/payee-search',
    billPayAddPayeeUrl: 'BillPay/payee',
    billPayDeletePayeeUrl: 'BillPay/payee',
    billPayGetPaymentListUrl: 'BillPay/payment',
    billPayCancelRecurringPaymentUrl: 'BillPay/recurring-payment/',
    billPayRecurringPaymentDetailUrl: 'BillPay/recurring-payment',
    billPayFeatureToggleUrl: 'BillPay/featureToggle',


    cancelPaymentsQueryParam: '?cancelPayment=',
    profileRefIdQueryParam: '?profileReferenceId=',
    

    PAYEE_LIST_EVT_ID: '50062',
    CUSTOMER_ACC_EVT_ID: '50063',
    PAYMENT_ADD_EVT_ID: '50064',
    PAYMENT_RETRIEVE_EVT_ID: '50096',
    PAYMENT_EDIT_EVT_ID: '50097',
    PAYMENT_CANCEL_EVT_ID: '50098',
    PAYMENT_LIST_EVT_ID: '50122',
    PAYEE_SEARCH_EVT_ID: '50101',
    PAYEE_ADD_EVT_ID: '50102',
    PAYEE_DELETE_EVT_ID: '50121',
    PAYEE_EDIT_EVT_ID: '50120',
    PAYEE_DETAIL_EVT_ID: '50126',
    RECURRING_PAYMENT_ADD_EVT_ID: '50106',
    RECURRING_PAYMENT_CANCEL_EVT_ID: '50098',
    RECURRING_PAYMENT_RETRIEVE_EVT_ID: 'XXXXX',

    zipcodeRegex: /^\d{5}([\-]\d{4}|[\-]____){0,1}$/,
    zipcodeNineRegex: /^\d{5}\-\d{4}$/,

    //default feature toggle
    featureToggle: {
      "ease.billpay.360.rxp": false,
      "ease.billpay.builderv4.v1": true,
      "ease.billpay.retail.rxp": false,
      "ease.billpay.editpayee": true
    },
    
    // Fiserve errors the UI can recover from
    recoverableErrorCodes: [
      '202071',
      '202068',
      '201842',
      '202070'
    ],

    billPayDefaultErrorMsg:
    'We ran into a snag trying to retrieve your account details, ' +
    'but we\'re working on it. Try again in a bit, or give us a ' +
    'call at 1-866-750-0873.'
  });
});

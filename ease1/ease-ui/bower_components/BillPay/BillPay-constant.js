define(['angular'], function(angular) {
  'use strict';

  var BillPayModule = angular.module('BillPayModule');

  BillPayModule.constant('BillPayEnvironmentConstants', {
    payBillsUrl: 'https://secure-qa2.int.capitalone360qa.com' + 
                 '/myaccount/banking/ummPaymentsOverview' + 
                 '?stateId=displayUmmPaymentOverview&dnr=1',
    retailBillpayUrl: 'https://olbrqa1.kdc.capitalone.com/olb-web/bill-pay-schedule'
  });
});
define(['angular'], function(angular) {
  'use strict';

  angular
    .module('BillPayModule')
    .constant('BillPayEnvironmentConstants', {
      payBillsUrl: 'https://secure.capitalone360.com' +
      '/myaccount/banking/ummPaymentsOverview?stateId=displayUmmPaymentOverview&dnr=1',
      retailBillpayUrl: 'https://banking1.capitalone.com/olb-web/bill-pay-schedule'
    });

} //end define module function
); //end define
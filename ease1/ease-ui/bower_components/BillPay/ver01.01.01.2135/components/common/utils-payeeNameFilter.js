define(['angular'], function(angular) {
  'use strict';

  var billPayModule = angular.module('BillPayModule')

  billPayModule.filter('showPayeeName', [function() {
    return function(payeeObj, showName) {
			
      if (showName === 'displayName' && payeeObj) {
        if (payeeObj.displayName && payeeObj.displayName !== '') {
          return payeeObj.displayName;
        }else if (payeeObj.payeeNickname && payeeObj.payeeNickname !== '') {
          return payeeObj.payeeNickname;
        }else if (payeeObj.payeeName && payeeObj.payeeName !== '') {
          return payeeObj.payeeName;
        }else {
          return 'NO PAYEENAME';
        }
      }else if (!payeeObj) {
        return 'NO PAYEENAME';
      }
      return payeeObj.payeeName;
    }
  }]);
});
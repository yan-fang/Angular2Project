define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule')
    .service('RecurringPaymentService', RecurringPaymentService)

  RecurringPaymentService.$inject = [
    '$filter',
    'Restangular',
    'BillPayConstants',
    'EaseConstantFactory',
    'EASEUtilsFactory',
    'easeHttpInterceptor',
    'BillPayErrorHandlerService',
    '$q',
    'PaymentDateService',
    'PayeeListService',
    '$state'
  ];

  function RecurringPaymentService(
    $filter,
    Restangular,
    BillPayConstants,
    EaseConstantFactory,
    EASEUtilsFactory,
    easeHttpInterceptor,
    BillPayErrorHandlerService,
    $q,
    PaymentDateService,
    PayeeListService,
    $state
  ) {

    var recurringPaymentInfo = {};

    var api = {
      initPaymentInfo: initPaymentInfo,
      getPaymentInfo: getPaymentInfo,
      getDurationOptions: getDurationOptions,
      getFrequencyOptions: getFrequencyOptions,
      getNotificationOptions: getNotificationOptions,
      recurringPaymentRestCall: recurringPaymentRestCall,
      getDefaultEndPaymentDate: getDefaultEndPaymentDate
    };

    function getPaymentInfo() {
      return recurringPaymentInfo;
    }

    function getDurationOptions() {
      return ['Indefinitely',
              'NumberOfPayments',
              'FinalPaymentDate'];
    }

    function getFrequencyOptions() {
      return [{ display: 'Weekly', value: 'Weekly' },
              { display: 'Every 2 Weeks', value: 'Every2Weeks' },
              { display: 'Every 4 Weeks', value: 'Every4Weeks' },
              { display: 'Twice A Month', value: 'TwiceAMonth' },
              { display: 'Monthly', value: 'Monthly' },
              { display: 'Every 2 Months', value: 'Every2Months' },
              { display: 'Every 3 Months', value: 'Every3Months' },
              { display: 'Every 4 Months', value: 'Every4Months' },
              { display: 'Every 6 Months', value: 'Every6Months' },
              { display: 'Annually', value: 'Annually' }];
    }

    function getNotificationOptions() {
      return [{ display: 'When my payment is pending', field: 'paymentScheduled' },
              { display: 'When the payment has been sent', field: 'paymentSent' },
              { display: 'Before sending the last payment', field: 'priorToLastPayment' }];
    }

    function initPaymentInfo(
      payee,
      eligibleAccounts,
      earliestPaymentDate
    ) {
      deletePaymentInfo();
      recurringPaymentInfo.payee = payee;
      recurringPaymentInfo.firstPaymentDate = earliestPaymentDate;
      recurringPaymentInfo.account = eligibleAccounts.accounts[0];
      recurringPaymentInfo.paymentAmount = undefined;
      recurringPaymentInfo.frequency = getFrequencyOptions()[0];
      recurringPaymentInfo.duration = getDurationOptions()[0];
      recurringPaymentInfo.finalPaymentDate = undefined;
      recurringPaymentInfo.finalPaymentAmount = 0;
      recurringPaymentInfo.numberOfPayments = 0;
      recurringPaymentInfo.paymentScheduled = false;
      recurringPaymentInfo.paymentSent = false;
      recurringPaymentInfo.priorToLastPayment = false;
    }

    function deletePaymentInfo() {
      return angular.copy({}, recurringPaymentInfo);
    }

    function getDefaultEndPaymentDate(startPaymentDate, frequency) {
      var date = new Date(startPaymentDate);

      switch (frequency.value) {
        case 'Weekly':
          date.setDate(date.getDate() + 7);
          break;
        case 'Every2Weeks':
          date.setDate(date.getDate() + 7 * 2);
          break;
        case 'Every4Weeks':
          date.setDate(date.getDate() + 7 * 4);
          break;
        case 'TwiceAMonth':
          date.setDate(date.getDate() + 15);
          break;
        case 'Monthly':
          date.setMonth(date.getMonth() + 1);
          break;
        case 'Every2Months':
          date.setMonth(date.getMonth() + 2);
          break;
        case 'Every3Months':
          date.setMonth(date.getMonth() + 3);
          break;
        case 'Every4Months':
          date.setMonth(date.getMonth() + 4);
          break;
        case 'Every6Months':
          date.setMonth(date.getMonth() + 6);
          break;
        case 'Annually':
          date.setFullYear(date.getFullYear() + 1);
          break;
        default:
          break;
      }
      return PaymentDateService.getFirstAvailableDate(date);
    }

    function recurringPaymentRestCall() {
      if (!validFinalPaymentDate()) return;
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      easeHttpInterceptor.setBroadCastEventOnce('BillPay');

      var headers = {
        EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
        BUS_EVT_ID: BillPayConstants.RECURRING_PAYMENT_ADD_EVT_ID
      };

      var service = Restangular.all(BillPayConstants.billPayRecurringPaymentUrl);
      var deferred = $q.defer();
      service.customPOST(createRequestBody(), createSubURL(), '', headers)
        .then(function(data) {
          PayeeListService.updatePayeeList($state.params.accountReferenceId);
          deferred.resolve(data);
          recurringPaymentInfo.paymentPlanReferenceId = data.paymentPlanReferenceId;
          recurringPaymentInfo.adjustedNextPaymentDate = data.adjustedNextPaymentDate;
        }, function(err) {
          deferred.reject(err);
          BillPayErrorHandlerService.handleError(err);
        });
      return deferred.promise;
    }

    function validFinalPaymentDate() {
      if (!recurringPaymentInfo.finalPaymentDate) return true;
      
      var finalPaymentDate = new Date(recurringPaymentInfo.finalPaymentDate);
      var firstPaymentDate = new Date(recurringPaymentInfo.firstPaymentDate);

      if (finalPaymentDate <= firstPaymentDate)  {
        BillPayErrorHandlerService.handleError(
          null, 
          'Your final payment date is before the first payment date entered, please make it after.'
        );
        return false;
      }

      return true;
    }

    function createRequestBody() {
      var request = {};
      request.paymentAmount = getAmount(recurringPaymentInfo.paymentAmount);
      request.frequency = recurringPaymentInfo.frequency.value;
      request.firstPaymentDate = $filter('date')(recurringPaymentInfo.firstPaymentDate, 'yyyy-MM-dd');
      request.duration = recurringPaymentInfo.duration;
      request.numberOfPayments = recurringPaymentInfo.numberOfPayments;
      request.finalPaymentDate = $filter('date')(recurringPaymentInfo.finalPaymentDate, 'yyyy-MM-dd');
      request.finalPaymentAmount = getAmount(recurringPaymentInfo.finalPaymentAmount);
      request.payeeReferenceId = recurringPaymentInfo.payee.payeeReferenceId;
      request.accountReferenceId = recurringPaymentInfo.account.referenceId;
      request.paymentScheduled = recurringPaymentInfo.paymentScheduled;
      request.paymentSent = recurringPaymentInfo.paymentSent;
      request.priorToLastPayment = recurringPaymentInfo.priorToLastPayment;
      return request;
    }

    function getAmount(input) {
      if ((typeof input) === 'number') return input;
      input = input.replace(/[^\d|\.+]/g, '');
      return parseFloat(input);
    }

    function createSubURL() {
      var url = encodeURIComponent(recurringPaymentInfo.payee.payeeReferenceId);
      return url;
    }

    /* test-code */
    api.__testonly__ = {};
    api.__testonly__.getAmount = getAmount;
    api.__testonly__.createSubURL = createSubURL;
    api.__testonly__.deletePaymentInfo = deletePaymentInfo;
    api.__testonly__.setPaymentInfo = function(input) {
      recurringPaymentInfo = input;
    }
    /* end-test-code */

    return api;
  }

});

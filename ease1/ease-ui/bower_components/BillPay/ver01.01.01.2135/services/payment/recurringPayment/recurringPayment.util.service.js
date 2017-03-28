define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').factory('RecurringPaymentUtilService', RecurringPaymentUtilService);

  RecurringPaymentUtilService.$inject = [
    '$filter',
    'PaymentDateService',
    'RecurringPaymentDSService'
  ];

  function RecurringPaymentUtilService(
    $filter,
    PaymentDateService,
    RecurringPaymentDSService
  ) {
    var recurringForm = {};

    var api = {
      getForm: getForm,
      initForm: initForm,
      initEditForm: initEditForm,
      getDefaultEndPaymentDate: getDefaultEndPaymentDate,
      getCancelOptions: getCancelOptions,
      getDurationOptions: getDurationOptions,
      getFrequencyOptions: getFrequencyOptions,
      getFrequencyDisplayValue: getFrequencyDisplayValue,
      getNotificationOptions: getNotificationOptions,
    };

    function getForm() {
      return recurringForm;
    }

    function initForm(payee, account) {
      emptyForm();

      recurringForm = {
        paymentPlanReferenceId: undefined,
        payeeReferenceId: payee.payeeReferenceId,
        accountReferenceId: account.accounts[0].referenceId,
        paymentAmount: undefined,
        frequency: getFrequencyOptions()[0].value,
        firstPaymentDate: new Date(PaymentDateService.getEarliestPaymentDate(payee)),
        duration: getDurationOptions()[0],
        numberOfPayments: 0,
        finalPaymentDate: undefined,
        finalPaymentAmount: undefined,
        paymentScheduled: false,
        paymentSent: false,
        priorToLastPayment: false,
      }

      return recurringForm;
    }

    function initEditForm(payee, account) {
      var paymentDetail = RecurringPaymentDSService.getPaymentDetail();
      var finalPaymentDate = paymentDetail.paymentPlanDetailModel.finalPaymentDate;
      initForm(payee, account);

      recurringForm.paymentPlanReferenceId = paymentDetail.paymentPlanReferenceId;
      recurringForm.paymentAmount = paymentDetail.paymentPlanDetailModel.paymentAmount;
      recurringForm.frequency = paymentDetail.paymentPlanDetailModel.frequencyCode;
      recurringForm.firstPaymentDate = new Date(paymentDetail.adjustedNextPaymentDate);
      recurringForm.duration = paymentDetail.paymentPlanDetailModel.durationCode;
      recurringForm.numberOfPayments = paymentDetail.paymentPlanDetailModel.numberOfPayments;
      recurringForm.finalPaymentDate = finalPaymentDate ? new Date(finalPaymentDate) : finalPaymentDate;
      recurringForm.finalPaymentAmount = paymentDetail.paymentPlanDetailModel.finalPaymentAmount;
      recurringForm.paymentScheduled = paymentDetail.paymentNotification.paymentScheduled;
      recurringForm.paymentSent = paymentDetail.paymentNotification.paymentSent;
      recurringForm.priorToLastPayment = paymentDetail.paymentNotification.priorToLastPayment;

      return recurringForm;
    }

    function emptyForm() {
      angular.copy({}, recurringForm);
    }

    function getDefaultEndPaymentDate(startPaymentDate, frequency) {
      var date = new Date(startPaymentDate);

      switch (frequency) {
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

    function getCancelOptions(paymentDetail) {
      return [  
        { label: 'Cancel all future payments', value: 'all'},
        { label: 'Only Cancel ' + $filter('date')(paymentDetail.adjustedNextPaymentDate,'MMM dd, yyyy'), value: 'one'} 
      ];
    }

    function getDurationOptions() {
      return [
        'Indefinitely',
        'NumberOfPayments',
        'FinalPaymentDate'
      ];
    }

    function getFrequencyOptions() {
      return [
        { display: 'Weekly', value: 'Weekly' },
        { display: 'Every 2 Weeks', value: 'Every2Weeks' },
        { display: 'Every 4 Weeks', value: 'Every4Weeks' },
        { display: 'Twice A Month', value: 'TwiceAMonth' },
        { display: 'Monthly', value: 'Monthly' },
        { display: 'Every 2 Months', value: 'Every2Months' },
        { display: 'Every 3 Months', value: 'Every3Months' },
        { display: 'Every 4 Months', value: 'Every4Months' },
        { display: 'Every 6 Months', value: 'Every6Months' },
        { display: 'Annually', value: 'Annually' }
      ];
    }

    function getFrequencyDisplayValue(key) {
      var map = { 
        'Weekly'       :  'Weekly',
        'Every2Weeks'  :  'Every 2 Weeks',
        'Every4Weeks'  :  'Every 4 Weeks', 
        'TwiceAMonth'  :  'Twice A Month', 
        'Monthly'      :  'Monthly', 
        'Every2Months' :  'Every 2 Months',
        'Every3Months' :  'Every 3 Months', 
        'Every4Months' :  'Every 4 Months', 
        'Every6Months' :  'Every 6 Months', 
        'Annually'     :  'Annually'  
      };
      return map[key];     
    }

    function getNotificationOptions() {
      return [
        { display: 'When my payment is pending', field: 'paymentScheduled' },
        { display: 'When the payment has been sent', field: 'paymentSent' },
        { display: 'Before sending the last payment', field: 'priorToLastPayment' }
      ];
    }


    return api;
  }
});
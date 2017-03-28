define(['angular'], function(angular) {
  'use strict';
  var AutoLoanPayDownViewModule =  angular.module('AutoLoanPayDownViewModule');

  AutoLoanPayDownViewModule.service('autoLoanPayDownViewUtil',
    function($state, $filter, autoLoanModuleService,UmmPaymentFactory, Restangular, EASEUtilsFactory,
             $q, EaseConstantFactory, easeExceptionsService) {
      var COAF_ACCOUNT_DETAILS = '50003';

      var financialEvents;

      var disableScheduleRecurringPaymentsLink;

      var disableFinancialEventsLink;

      var paymentAmountWithDefaultSchedule;

      var increasedMonthlyPaymentAmount;

      var  payOffStatusForSiteCatalyst;

      this.getIncreasedMonthlyPaymentAmount = function() {
        return increasedMonthlyPaymentAmount;
      };

      this.setIncreasedMonthlyPaymentAmount = function(data) {
        increasedMonthlyPaymentAmount = data;
      };

      this.getPaymentAmountWithDefaultSchedule = function() {
        return paymentAmountWithDefaultSchedule;
      };

      this.setPaymentAmountWithDefaultSchedule = function(data) {
        paymentAmountWithDefaultSchedule = data;
      };

      this.getDisableFinancialEventsLink = function() {
        return disableFinancialEventsLink;
      };

      this.setDisableFinancialEventsLink = function(data) {
        disableFinancialEventsLink = data;
      };

      this.getDisableScheduleRecurringPaymentsLink = function() {
        return disableScheduleRecurringPaymentsLink;
      };

      this.setDisableScheduleRecurringPaymentsLink = function(data) {
        disableScheduleRecurringPaymentsLink = data;
      };

      this.getFinancialEvents = function() {
        return financialEvents;
      };
      this.setFinancialEvents = function(data) {
        financialEvents = data;
        financialEvents.accountNumber = autoLoanModuleService.
          getAccountDetailsData().accountDetails.displayAccountNumber;
      };

      this.getPayOffStatusForSiteCatalyst = function() {
        return payOffStatusForSiteCatalyst;
      };

      this.setPayOffStatusForSiteCatalyst = function(data) {
        payOffStatusForSiteCatalyst = data;
      };

      this.getProgressBarUpdates = function(accountRefId, requestParamsMap) {
        var url = 'AutoLoan/accounts/' + encodeURIComponent(accountRefId) + '/calculator';
        var headers = {'BUS_EVT_ID': COAF_ACCOUNT_DETAILS, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
        if (requestParamsMap) {
          var queryString = '';
          Object.keys(requestParamsMap).forEach(function(key) {
            var value = requestParamsMap[key];
            var queryPrefix = queryString.indexOf('?') === -1 ? '?' : '&';
            queryString = queryString + queryPrefix + key + '=' +  encodeURIComponent(value);
          });
          url = url + queryString;
        }

        var deferred = $q.defer();
        if (!requestParamsMap && paymentAmountWithDefaultSchedule
          && paymentAmountWithDefaultSchedule.accountNumber ===
          autoLoanModuleService.getAccountDetailsData().accountDetails.displayAccountNumber) {
          deferred.resolve(paymentAmountWithDefaultSchedule);
          return deferred.promise;
        }
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var getProgressBarUpdates = Restangular.all(url);
        getProgressBarUpdates.get('', {}, headers).then(function(data) {
          if (!requestParamsMap) {
            paymentAmountWithDefaultSchedule = data;
            paymentAmountWithDefaultSchedule.accountNumber = autoLoanModuleService
              .getAccountDetailsData().accountDetails.displayAccountNumber
          }
          deferred.resolve(data);
        }, function(ex) {
          throw easeExceptionsService.createEaseException({
            'module': 'GetProgressBarUpdates.services',
            'function': 'AutoLoanService.getProgressBarUpdates',
            'message': ex.statusText,
            'cause': ex
          });
        });
        return deferred.promise;
      };

      this.getEventsDetails=function(accountRefId) {
        var url = 'AutoLoan/accounts/' + encodeURIComponent(accountRefId) + '/events';

        var deferred = $q.defer();
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var getEventsDetais= Restangular.all(url);
        getEventsDetais.get('').then(function(data) {
          deferred.resolve(data);
        },function(ex) {
          throw easeExceptionsService.createEaseException({
            'module':'GetEventsDetails.services',
            'function':'AutoLoanService.getEventsDetails',
            'message':'ex.statusText',
            'cause':ex
          });
        });
        return deferred.promise;
      };
      this.getAutoLoanTrackerMessage = function(payoffStatus, date, amount) {
        switch (payoffStatus) {
          case 'early payoff' :
            return autoLoanModuleService.getI18n().coaf.accountSummary.accountDetails.earlyPayoffMessage
            .message.v1.replace(/{date}/, date);
          case 'balance at maturity' :
            return autoLoanModuleService.getI18n().coaf.accountSummary.accountDetails.balanceAtMaturityMessage
            .message.v1.replace(/{amount}/, amount);
          default :
            return null;
        }
      };
    });

  return AutoLoanPayDownViewModule;
});

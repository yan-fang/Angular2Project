var BASE_PATH = '/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/';

define(['angular',
  'moment',
    /* dependency to load CPA payment accounts*/
    'settingsModule',
    'coreProperty',
    /**/
  'noext!' + BASE_PATH + 'utils/i18n/localize.js?',
  'noext!' + BASE_PATH + 'features/calendar/calendar.js?',
  'noext!' + BASE_PATH + 'features/pubsub/pubsub-service.js?',
  'noext!' + BASE_PATH + 'features/payment/payment.js?'], function(angular,moment) {
  'use strict';

  var app = angular.module('UMMPaymentModule');
  app.factory('autoLoanModuleService',
    function($q, $injector, Restangular, EaseConstant, EaseConstantFactory, easeExceptionsService, EASEUtilsFactory,
             $ocLazyLoad, EaseModalService, UmmPaymentFactory, EaseLocalizeService, AutoLoanLocalizeService, easeCoreConstant) {
      var COAF_ACCOUNT_DETAILS = '50003';
      var COAF_PAYMENT    = '50004';
      var COAF_PAYMENT_AMOUNTS = '50005';
      var COAF_DELETE_ONE_TIME_PAYMENT = '50007';
      var COAF_CREATE_PAYMENT_PLAN = '50040';
      var COAF_DELETE_PAYMENT_PLAN = '50041';
      var COAF_GET_PAYMENT_PLAN = '50015';
      var COAF_GET_PAYMENT_PLAN_OPTIONS = '50046';
      var accountDetailsData;
      var i18core, i18n, paymentPlan, disableMakeAPayment, focusId, currentDate, oneTimePaymentObjToCancel,payoffDetails
        , spinnerEnabled, accountServiceFeatures;
      var services = {};
      AutoLoanLocalizeService.get('ease').then(function(i18nData) {
        i18n = i18nData;
      });
      EaseLocalizeService.get('accountSummary').then(function(data) {
        i18core = data;
      });

      services.fetchAccountDetailData = function(accountReferenceId, deferred) {
        var url = 'AutoLoan/getAccountById/' + encodeURIComponent(accountReferenceId)
        var headers = {'BUS_EVT_ID': COAF_ACCOUNT_DETAILS, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
        if (!deferred) {
          deferred = $q.defer();
        }

        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        Restangular.all(url).get('',{}, headers).then(
          function(data) {
            data.accountRefId = accountReferenceId;
            accountDetailsData = data;
            deferred.resolve(data);
          },
          function(ex) {
            deferred.reject();
            throw easeExceptionsService.createEaseException({
              'module': 'autoLoanModuleService',
              'function': 'getAccountDetailsData',
              'message': ex.statusText,
              'cause': ex
            });
          });
        return deferred.promise;
      };

      services.postPaymentInstruction = function(paymentInstruction, accountDetailsRefId,eventID) {

        var url = 'AutoLoan/paymentInstruction/' + encodeURIComponent(accountDetailsRefId) + '/createOneTimePayment';
        var headers = {'BUS_EVT_ID': eventID, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
        var deferred = $q.defer();
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var postPayment = Restangular.all(url);
        postPayment.post(paymentInstruction, {}, headers).then(
          function(data) {
            deferred.resolve(data);
          },
          function() {
            deferred.reject(easeExceptionsService.createEaseException({
              'module': 'PostPayment.services',
              'function': 'factory.paymentModal',
              'message': i18n.coaf.payment.paymentModal.paymentError.label.v1,
              'cause': ''
            }));
          });
        return deferred.promise;

      };

      services.deletePaymentInstruction = function(oneTimePaymentToDelete, accountDetailsRefId, paymentScheduleId) {

        var url = 'AutoLoan/paymentInstruction/' + encodeURIComponent(accountDetailsRefId) + '/deleteOneTimePayment/'
          + paymentScheduleId;
        var headers = {'BUS_EVT_ID': COAF_DELETE_ONE_TIME_PAYMENT, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
        var deferred = $q.defer();

        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var deletePayment = Restangular.all(url);
        deletePayment.remove(oneTimePaymentToDelete, headers).then(
          function(data) {
            deferred.resolve(data);
          },
          function(ex) {
            deferred.reject(easeExceptionsService.createEaseException({
              'module': 'DeletePayment.services',
              'function': 'factory.paymentModal',
              'message': i18n.coaf.payment.paymentModal.paymentError.label.v1,
              'cause': ex
            }));
          });
        return deferred.promise;

      };

      services.postPaymentPlan = function(paymentPlanToPost, accountDetailsRefId) {
        var headers = {'BUS_EVT_ID': COAF_CREATE_PAYMENT_PLAN, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
        var url = 'AutoLoan/paymentPlan/' + encodeURIComponent(accountDetailsRefId) + '/createPaymentPlan';
        var deferred = $q.defer();

        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var postPayment = Restangular.all(url);
        postPayment.post(paymentPlanToPost, {}, headers).then(
          function(data) {
            deferred.resolve(data);
          },
          function() {

            deferred.reject(easeExceptionsService.createEaseException({
              'module': 'PostPaymentPlan.services',
              'function': 'factory.paymentModal',
              'message': i18n.coaf.payment.paymentModal.paymentError.label.v1,
              'cause': ''
            }));
          });
        return deferred.promise;

      };

      services.deletePaymentPlan = function(accountDetailsRefId) {

        var url = 'AutoLoan/paymentPlan/' + encodeURIComponent(accountDetailsRefId) + '/deletePaymentPlan';
        var deferred = $q.defer();
        var headers = {'BUS_EVT_ID': COAF_DELETE_PAYMENT_PLAN, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};

        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var deletePayment = Restangular.all(url);
        deletePayment.remove('', headers).then(
          function(data) {
            deferred.resolve(data);
          },
          function(ex) {
            deferred.reject(easeExceptionsService.createEaseException({
              'module': 'DeletePaymentPlan.services',
              'function': 'factory.paymentModal',
              'message': i18n.coaf.payment.paymentModal.paymentError.label.v1,
              'cause': ex
            }));
          });
        return deferred.promise;

      };

      services.timestamp = function() {
        return new Date().getTime();
      };

      services.getPaymentPlanDetails = function(accountRefId) {

        var url = 'AutoLoan/paymentPlan/' + encodeURIComponent(accountRefId) +
              '/getPaymentPlan/' + services.timestamp();
        var deferred = $q.defer();

        var headers = {'BUS_EVT_ID': COAF_GET_PAYMENT_PLAN, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};

        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var getPaymentPlanDetails = Restangular.all(url);
        getPaymentPlanDetails.get('', {}, headers).then(
          function(data) {
            deferred.resolve(data);
          },
          function(ex) {

            throw easeExceptionsService.createEaseException({
              'module': 'GetPaymentPlan.services',
              'function': 'AutoLoanService.getPaymentPlan',
              'message': ex.statusText,
              'cause': ex
            });
          });
        return deferred.promise;
      };
      services.getPaymentPlanOptions = function(accountRefId) {

        var url = 'AutoLoan/paymentPlanOptions/' + encodeURIComponent(accountRefId) + '/getPaymentPlanOptions';
        var deferred = $q.defer();
        var headers = {'BUS_EVT_ID': COAF_GET_PAYMENT_PLAN_OPTIONS, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var getPaymentPlanOptions = Restangular.all(url);

        getPaymentPlanOptions.get('', {}, headers).then(
          function(data) {
            deferred.resolve(data);
          },
          function(ex) {
            throw easeExceptionsService.createEaseException({
              'module': 'GetPaymentPlanOptions.services',
              'function': 'AutoLoanService.getPaymentPlanOptions',
              'message': ex.statusText,
              'cause': ex
            });
          });
        return deferred.promise;
      };

      services.getPaymentPlanCurrentDate = function(accountRefId) {

        var url = 'AutoLoan/paymentPlan/' + encodeURIComponent(accountRefId) + '/getCurrentDate';
        var deferred = $q.defer();
        var headers = {'BUS_EVT_ID': COAF_GET_PAYMENT_PLAN, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var getPaymentPlanCurrentDate = Restangular.all(url);
        getPaymentPlanCurrentDate.get('', {}, headers).then(
          function(data) {
            deferred.resolve(data);
          },
          function(ex) {
            throw easeExceptionsService.createEaseException({
              'module': 'GetPaymentPlan.services',
              'function': 'AutoLoanService.getPaymentPlanCurrentDate',
              'message': ex.statusText,
              'cause': ex
            });
          });
        return deferred.promise;
      };


      services.getNewAvailableAmounts = function(date, accountRefId, callback) {

        var headers = {'BUS_EVT_ID': COAF_PAYMENT_AMOUNTS, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
        var url = 'AutoLoan/getPaymentAmounts/' + encodeURIComponent(accountRefId) + '/payment-dates/' + date +
          '/payment-amounts';

        var deferred = $q.defer();
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var getNewAvailablePaymentAmounts = Restangular.all(url);
        getNewAvailablePaymentAmounts.get('', {}, headers).then(function(data) {
          deferred.resolve(data);
          callback();
        }, function(ex) {
          throw easeExceptionsService.createEaseException({
            'module': 'GetNewPaymentAmount.services',
            'function': 'AutoLoanService.getNewPaymentAmounts',
            'message': ex.statusText,
            'cause': ex
          });
        });
        return deferred.promise;
      };

      services.getTransactionUpdates = function(accountRefId) {

        var url = 'AutoLoan/getAccountById/' + encodeURIComponent(accountRefId);
        var headers = {'BUS_EVT_ID': COAF_ACCOUNT_DETAILS, EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId()};
        var deferred = $q.defer();
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var getTransactionUpdates = Restangular.all(url);
        getTransactionUpdates.get('', {}, headers).then(function(data) {
          deferred.resolve(data);
        }, function(ex) {
          throw easeExceptionsService.createEaseException({
            'module': 'GetTransactionUpdates.services',
            'function': 'AutoLoanService.getTransactionUpdates',
            'message': ex.statusText,
            'cause': ex
          });
        });
        return deferred.promise;
      };
      services.addRequestParamsToUrl = function(url,requestParamsMap) {
        if (requestParamsMap) {
          var queryString = '';
          Object.keys(requestParamsMap).forEach(function(key) {
            var value = requestParamsMap[key];
            var queryPrefix = queryString.indexOf('?') === -1 ? '?' : '&';
            queryString = queryString + queryPrefix + key + '=' +  encodeURIComponent(value);
          });
          url += queryString;
        }
        return url;
      };

      services.addDaysToDate = function(date,inPutDateFormat,daysToAdd,outputDateFormat) {
        return moment(date,inPutDateFormat).add(daysToAdd, 'days').format(outputDateFormat);
      };

      services.formatDate = function(date,inputFormat,outputFormat) {
        return moment(date,inputFormat).format(outputFormat);
      };
      services.loadAccountServiceFeatures = function(accountReferenceId, deferred) {
        var deferred = deferred ? deferred : $q.defer();

        var url = 'AutoLoan/dynamicAccountService/' + encodeURIComponent(accountReferenceId) + '/getFeatures',
          getAccountServiceFeatures = Restangular.all(url);

        getAccountServiceFeatures.get('', {}).then(function(data) {
          deferred.resolve(data);
          services.setAccountServiceFeatures(data);
        }, function(error) {
          deferred.resolve(error);
        });
        return deferred.promise;
      };

      services.setAccountDetailsData = function(data) {
        accountDetailsData = data;
      };
      services.getAccountDetailsData = function() {
        return accountDetailsData;
      };
      services.setI18Core = function(data) {
        i18core = data;
      };
      services.getI18Core = function() {
        return i18core;
      };
      services.setI18n = function(data) {
        i18n = data;
      };
      services.getI18n = function() {
        return i18n;
      };
      services.getCurrentDate = function() {
        return currentDate;
      };
      services.setCurrentDate = function(date) {
        currentDate = date;
      };
      services.getPaymentPlan = function() {
        return paymentPlan;
      };
      services.setPaymentPlan = function(data) {
        paymentPlan = data;
      };

      services.setDisableMakeAPayment = function(data) {
        disableMakeAPayment = data;
      };

      services.getDisableMakeAPayment = function() {
        return disableMakeAPayment;
      };

      services.getAccountServiceFeatures = function() {
        return accountServiceFeatures;
      };

      services.setAccountServiceFeatures = function(data) {
        accountServiceFeatures = data;
      };

      var isFeatureAllowed = function(feature) {
        return (!accountServiceFeatures || (accountServiceFeatures[feature] &&
                (accountServiceFeatures[feature] !== 'NOT ALLOW')))
      };

      services.isMakeAPaymentAllowed = function() {
        return isFeatureAllowed('makeAPaymentEligibility');
      };

      services.isMakeAPaymentButtonVisible = function() {
        return services.isMakeAPaymentAllowed() && services.isFeatureEnabled('ease.coaf.makeapayment');
      };


      services.isSpinnerEnabled = function() {
        return spinnerEnabled;
      };
      services.enableSpinner = function(data) {
        spinnerEnabled = data;
      };
      services.disableMakeAPaymentSpinner = function() {
        disableMakeAPayment = false;
        spinnerEnabled = false;
      };
      services.setFocusId = function(id) {
        focusId = id;
      };
      services.getFocusId = function() {
        return focusId;
      };
      services.setOneTimePaymentObjToCancel = function(oneTimePaymentToCancel) {
        oneTimePaymentObjToCancel = oneTimePaymentToCancel;
      };
      services.getOneTimePaymentObjToCancel = function() {
        return oneTimePaymentObjToCancel;
      };

      services.setPayoffDetails = function(selectedPayoffDetails) {
        payoffDetails = selectedPayoffDetails;
      };
      services.getPayoffDetails = function() {
        return payoffDetails;
      };

      services.launchUmmPayment = function(modalDetails, isAccountDataAvailable,
                                           stopSpinner, toggleFeature) {
        if (!stopSpinner) {
          stopSpinner = services.disableMakeAPaymentSpinner;
        }
        var accountRefId = modalDetails.accountRefId;
        var self = this;

        var handleException = function(stopSpinnerFunction, exceptionObj) {
          if (stopSpinnerFunction) {
            stopSpinnerFunction();
          }
          throw easeExceptionsService.createEaseException(exceptionObj);
        };

        var loadUmmModal = function() {
          self.getPaymentPlanCurrentDate(accountRefId).then(function(dateData) {
            currentDate = dateData.currentDate;
          });

          modalDetails.header = COAF_PAYMENT;
          UmmPaymentFactory.getUmmPayment(modalDetails).then(function() {
            self.getPaymentPlanDetails(accountRefId).then(function(paymentPlanData) {
              $injector.get('autoLoanPaymentAddAccountService').registerPaymentAccountListeners();
              paymentPlan = paymentPlanData;
              services.updatePaymentAccounts(UmmPaymentFactory.getUmmData(), function() {
                EaseModalService(BASE_PATH + 'features/payment/partials/payment-parent.html', {
                  modalClass: 'modal fade modalFadeSlideUp paymentModal',
                  backdrop: true,
                  addToScope: {}
                });
                if (stopSpinner) {
                  stopSpinner();
                }
              });
            }, function(ex) {
              handleException(stopSpinner, {
                'module': 'UMMPaymentModule',
                'function': 'getPaymentPlanDetails',
                'message': ex.statusText,
                'cause': ex
              })
            });
          }, function(ex) {
            handleException(stopSpinner, {
              'module': 'UMMPaymentModule',
              'function': 'getUmmPayment',
              'message': ex.statusText,
              'cause': ex
            });
          });
        };

        if (!isAccountDataAvailable) {
          services.fetchAccountDetailData(modalDetails.accountRefId).then(function() {
            if (self.isFeatureEnabled('ease.coaf.makeapayment')) {
              loadUmmModal();
            } else {
              var toggleMsg = {
                'msgHeader': '',
                'msgBody': i18n.coaf.payment.paymentModal.makeAPaymentToggleMessage.label.v1
              };
              toggleFeature(toggleMsg);
            }
          }, function(ex) {
            throw easeExceptionsService.createEaseException({
              'module': 'AutoLoanModuleService',
              'function': 'fetchAccountDetailData',
              'message': ex.statusText,
              'cause': ex
            });
          });
        } else {
          loadUmmModal();
        }
      };

      services.makePaymentSuccess = function(isPayOff) {
        var partial = isPayOff ?
          BASE_PATH + 'features/payment/partials/payment-payoffSuccess.html' :
          BASE_PATH + 'features/payment/partials/payment-success.html';

        services.enableSpinner(false);
        EaseModalService(partial, {
          modalClass: 'modal successModal',
          backdrop: true,
          addToScope: {}
        });
      };

      services.createPaymentPlanSuccess = function() {
        EaseModalService(BASE_PATH + 'features/payment/partials/payment-paymentPlanSuccess.html', {
          modalClass: 'modal successModal'
        });
      };

      services.deletePaymentPlanConfirm = function() {
        EaseModalService(BASE_PATH + 'features/payment/partials/payment-paymentPlanDelete.html', {
          modalClass: 'modal'
        });
      };
      services.deletePaymentPlanSuccess = function() {
        EaseModalService(BASE_PATH + 'features/payment/partials/payment-paymentPlanDeleteSuccess.html', {
          modalClass: 'modal'
        });
      };

      services.payoffConfirm = function() {
        EaseModalService(BASE_PATH + 'features/payment/partials/payment-payoffSummary.html', {
          modalClass: 'modal'
        });
      };

      services.oneTimePaymentCancel = function() {
        EaseModalService(BASE_PATH + 'features/payment/partials/payment-oneTimePaymentCancel.html', {});
      };

      services.cancelPaymentSuccess = function() {
        services.enableSpinner(false);
        EaseModalService(BASE_PATH + 'features/payment/partials/payment-oneTimePaymentCancelSuccess.html', {});
      };

      services.isFeatureEnabled = function(featureName) {
        return accountDetailsData.enabledFeatures.entries.indexOf(featureName) > -1;
      };

      services.updatePaymentAccounts = function(ummData, callback) {
        if (ummData && ummData.availableAccounts) {
          ummData.availableAccounts.forEach(function(account) {
            if (!account.accountNumber && account.accountNumber_TLNPI && account.accountNumber_TLNPI.length > 4) {
              account.accountNumber = account.accountNumber_TLNPI;
            }
          });
        }

        if (services.isFeatureEnabled('ease.coaf.corepaymentaccounts')) {
          services.getPaymentAccounts().then(function(paymentAccounts) {
            if (paymentAccounts && paymentAccounts.length > 0) {
              ummData.availableAccounts = paymentAccounts;
            }
            callback();
          }, function() {
              callback();
          })
        } else {
          callback();
        }
      };

      services.getPaymentAccounts = function() {
        var deferred = $q.defer();

        try {
          $ocLazyLoad.load([
            '/ease-ui/bower_components/easeCustomerFeatures' + easeCoreConstant.kBuildVersionPath
            + '/CustomerSettings/Settings/Settings-services.js'
          ]).then(function() {
            var settingsFactory = $injector.get('settingsFactory');
            settingsFactory.getPaymentAccounts('kAcctPreferencesRetrievePaymentAccounts')
              .then(function(data) {
                var paymentAccounts = data.entries;
                for (var i = 0; i < paymentAccounts.length; i++) {
                  var paymentAccount = paymentAccounts[i];
                  paymentAccount.displayBalance = paymentAccount.availableBalance;
                  paymentAccount.displayName = paymentAccount.productDescription;
                  paymentAccount.accountNumber = paymentAccount.displayAccountNumber;
                }
                deferred.resolve(paymentAccounts);
              }, function(ex) {
                deferred.reject(ex);
              })
          });
        } catch (ex) {
          deferred.resolve();
        }
        return deferred.promise;
      };

      return services;
    });

  app.filter('formatDisplayAccountNumber', function() {
    return function(accountDetails) {
      var displayAccountNumber = accountDetails.displayAccountNumber;
      displayAccountNumber = displayAccountNumber.substring(
        displayAccountNumber.length-4, displayAccountNumber.length);
      return accountDetails.accountNickname + ' ...' + displayAccountNumber;
    };
  });

});

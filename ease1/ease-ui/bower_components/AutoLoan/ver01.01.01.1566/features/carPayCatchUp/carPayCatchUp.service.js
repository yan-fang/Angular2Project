define(['angular', 'moment'], function(angular, moment) {
  'use strict';
  carPayCatchUpService.$inject = ['$q','$injector', '$filter', '$state', 'Restangular',
    'easeExceptionsService', 'EaseConstantFactory', 'autoLoanModuleService', 'UmmPaymentFactory','EaseConstant'];

  function buildQueryString(url, planStatuses) {
    url += '?';
    for (var i = 0; i < planStatuses.length; i++) {
      url += 'planStatus=' + planStatuses[i] + '&';
    }
    return url;
  }

  function carPayCatchUpService($q,$injector,$filter, $state, Restangular,
                                easeExceptionsService, EaseConstantFactory, autoLoanModuleService,UmmPaymentFactory,
                                EaseConstant) {

    var self = this;

    self.exitWhatAboutByModal = function() {
      self.goBackModal = 'whatAboutByDate';
      $state.go('areYouSure');
    };

    self.setPaymentConfirmationData = function(payConfirmation) {
      self.paymentConfirmation = payConfirmation;
    };

    self.getPaymentConfirmationData = function() {
      return self.paymentConfirmation;
    };

    self.exitReviewPlanModal = function() {
      self.goBackModal = 'reviewPlan';
      $state.go('areYouSure');
    };

    self.exitPlanSummaryModal = function() {
      self.goBackModal = 'planSummary';
      $state.go('areYouSure');
    };


    self.goBackFromAreYouSure = function() {
      $state.go(self.goBackModal);
    };

    self.getPaymentCatchupPlans = function(accountRefId, planStatuses, limitDays) {
      var url = 'AutoLoan/accounts/' + encodeURIComponent(accountRefId) + '/payment-catchup/plans';
      // check for query params
      if (planStatuses && limitDays) {
        url = buildQueryString(url, planStatuses);
        url = url + 'limitDays=' + limitDays;
      } else if (planStatuses) {
        url = buildQueryString(url, planStatuses);
        url = url.substring(0, url.length - 1); // trim off the last &
      } else if (limitDays) {
        url = url + '?limitDays=' + limitDays;
      }
      var deferred = $q.defer();
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      var paymentCatchupPlans = Restangular.all(url);
      paymentCatchupPlans.get('').then(function(data) {
        deferred.resolve(data);
      }, function(ex) {
        throw easeExceptionsService.createEaseException({
          'module': 'GetPaymentCatchupPlansModule.services',
          'function': 'AutoLoanService.getPaymentCatchupPlans',
          'message': 'ex.statusText',
          'cause': ex
        });
      });
      return deferred.promise;
    };

    self.setPaymentCatchupElgiiblity = function(data) {
      self.paymentCatchupElgiiblity = false;
      if (data) {
        self.paymentCatchupElgiiblity = data.isEligible;
      }
    };

    self.getPaymentCatchupElgiiblity = function() {
      return self.paymentCatchupElgiiblity;
    };

    self.setRollAmount = function(data) {
      var rollAmountObject = $filter('filter')(data.availableAmounts, {paymentTerm: 'Minimum_Roll_Amount' })[0];
      self.rollAmount = rollAmountObject.value;
    };

    self.getRollAmount = function() {
      return self.rollAmount;
    };

    self.setPaymentDates = function(data) {
      self.paymentDates = data.entries;
    };

    self.getPaymentDatesList = function() {
      return self.paymentDates;
    };

    self.getUmmData = function() {
      return self.ummData;
    };

    self.setUmmData = function(data) {
      self.ummData = data;
    };

    self.getSelectedPaymentAccount = function() {
      return self.selectedPaymentAccount;
    };

    self.setSelectedPaymentAccount = function(data) {
      self.selectedPaymentAccount = data;
      self.selectedPaymentAccountLabel = this.getAccountLabelDisplay(data);
    };

    self.getSelectedPaymentAccountLabel = function() {
      return self.selectedPaymentAccountLabel;
    };

    self.setSelectedPaymentAccountLabel = function(data) {
      self.selectedPaymentAccountLabel = data;
    };


    self.getPaymentCatchupEligibility = function(accountRefId) {
      var url = 'AutoLoan/accounts/' + encodeURIComponent(accountRefId) + '/payment-catchup/eligibility';
      var deferred = $q.defer();
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      var determinePaymentCatchUpEligibility = Restangular.all(url);
      determinePaymentCatchUpEligibility.post('').then(function(data) {
        deferred.resolve(data);
      },function(ex) {
        throw easeExceptionsService.createEaseException({
          'module':'DeterminePaymentCatchUpEligibility.services',
          'function':'AutoLoanService.DeterminePaymentCatchUpEligibility',
          'message':'ex.statusText',
          'cause':ex
        });
      });
      return deferred.promise;
    };

    self.getPaymentAmountsWithRollAmount = function(accountRefId,date) {
      var deferred = deferred ? deferred : $q.defer();
      var url = 'AutoLoan/getPaymentAmounts/' + encodeURIComponent(accountRefId) + '/payment-dates/' + date +
        '/payment-amounts?includeRollAmount=true';
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      var getPaymentAmountsWithRollAmount = Restangular.all(url);
      getPaymentAmountsWithRollAmount.get('').then(function(data) {
        deferred.resolve(data);
      }, function(ex) {
        throw easeExceptionsService.createEaseException({
          'module': 'getPaymentAmountsWithRollAmount.services',
          'function': 'carPayCatchUpService.getPaymentAmountsWithRollAmount',
          'message': ex.statusText,
          'cause': ex
        });
      });
      return deferred.promise;
    };

    self.getPaymentDates = function(accountRefId,requestParamsMap,deferred) {
      var url = 'AutoLoan/accounts/' + encodeURIComponent(accountRefId) + '/payment-dates';
      url= autoLoanModuleService.addRequestParamsToUrl(url,requestParamsMap);
      var deferred = deferred ? deferred : $q.defer();
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      var getPaymentDates = Restangular.all(url);
      getPaymentDates.get('').then(function(data) {
        deferred.resolve(data);
      }, function(ex) {
        throw easeExceptionsService.createEaseException({
          'module': 'getPaymentDates.services',
          'function': 'carPayCatchUpService.getPaymentDates',
          'message': ex.statusText,
          'cause': ex
        });
      });
      return deferred.promise;
    };

    var hasOpenPaymentCatchupPlan = function(entries) {
      for (var i in entries) {
        if (entries[i].planStatus === 'Open') {
          return true;
        }
      }
      return false;
    };

    self.createPastDueMessage = function(entries) {
      var accountDetailsData = autoLoanModuleService.getAccountDetailsData().accountDetails;
      if (self.shouldShowPastDueMessage(entries)) {
        var pastDueAmountMessage = autoLoanModuleService.getI18n().coaf.carPayCatchUp.pastDuePaymentOptions
          .pastDueAmountMessage.label.v1;
        var pastDueAmount = accountDetailsData.unpaidPastDueAmount;
        pastDueAmountMessage = pastDueAmountMessage.replace('{pastDueAmount}', pastDueAmount + '');
        return pastDueAmountMessage;
      }
    };

    self.createPaymentCatchupPlanMessage = function(entries) {
      var paymentCatchupPlanMessage;
      if (hasOpenPaymentCatchupPlan(entries)) {
        paymentCatchupPlanMessage = autoLoanModuleService.getI18n().coaf.carPayCatchUp.pastDuePaymentOptions
          .paymentCatchupPlanMessage.label.v1;
      }
      return paymentCatchupPlanMessage;
    };

    self.shouldShowPastDueMessage = function(paymentCatchUpPlanEntries) {
      var isMatured = self.isLoanMatured(autoLoanModuleService.getAccountDetailsData().accountDetails.maturityDate);
      var accountDetailsData = autoLoanModuleService.getAccountDetailsData().accountDetails;
      var isPastDue = accountDetailsData.unpaidPastDueAmount > 0;
      var hardshipApprovalStatus = accountDetailsData.hardshipApprovalStatus;
      return !isMatured && !hasOpenPaymentCatchupPlan(paymentCatchUpPlanEntries)
        && !hardshipApprovalStatus && isPastDue;
    };

    self.isLoanMatured = function(maturityDate) {
      return moment(maturityDate).startOf('day') < moment().startOf('day');
    };

    self.setFirstPaymentDate = function(firstPaymentDate) {
      self.firstPaymentDate = firstPaymentDate;
    };

    self.getFirstPaymentDate = function() {
      return self.firstPaymentDate;
    };


    self.createPaymentCatchupDefaultOptionsRequest = function(initialCatchupPaymentDate, initialCatchupPaymentAmount,
                                                              monthlyPaymentAmount) {
      return {
        'initialCatchupDate': initialCatchupPaymentDate,
        'initialCatchupAmount': initialCatchupPaymentAmount,
        'monthlyPaymentAmount':monthlyPaymentAmount
      };
    };

    self.getPaymentCatchupDefaultOptions = function(paymentCatchupRequest, accountRefId) {
      var url = 'AutoLoan/accounts/' + encodeURIComponent(accountRefId) + '/payment-catchup/calculate-options';
      var deferred = $q.defer();
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      var paymentCatchUpDefaultOptions = Restangular.all(url);
      paymentCatchUpDefaultOptions.post(paymentCatchupRequest).then(function(data) {
        deferred.resolve(data);
      },function(ex) {
        throw easeExceptionsService.createEaseException({
          'module':'PaymentCatchUpDefaultOptions.services',
          'function':'AutoLoanService.PaymentCatchUpDefaultOptions',
          'message':'ex.statusText',
          'cause':ex
        });
      });
      return deferred.promise;
    };

    self.createOneTimePayments = function(paymentInstructions, accountRefId) {
      var url = 'AutoLoan/paymentInstruction/' + encodeURIComponent(accountRefId) + '/createOneTimePayments';
      var deferred = $q.defer();
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      var postPayments = Restangular.all(url);
      postPayments.post(paymentInstructions).then(function(data) {
        deferred.resolve(data);
      },
          function(ex) {
            throw easeExceptionsService.createEaseException({
              'module': 'CarPayCatchUpModule.services',
              'function': 'carPayCatchUpService.createOneTimePayments',
              'message': 'ex.statusText',
              'cause': ex
            });
          });
      return deferred.promise;
    };

    self.createCarPayCatchUpPlan = function(carPayCatchUpRequest, accountRefId) {
      var url = 'AutoLoan/accounts/' + encodeURIComponent(accountRefId) + '/payment-catchup/plans';
      var deferred = $q.defer();
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
      var carPayCatchUpPlan = Restangular.all(url);
      carPayCatchUpPlan.post(carPayCatchUpRequest).then(function(data) {
        deferred.resolve(data);
      },
        function(ex) {
          deferred.resolve();
        });
      return deferred.promise;
    };

    self.submitCarPayCatchup = function() {
      var totalCureAmount = 0;
      var accountDetailsData = autoLoanModuleService.getAccountDetailsData().accountDetails;
      var paymentInstructionsArray = [];
      angular.forEach(self.finalCatchupPaymentsData, function(payment) {
        var paymentInstruction = {'scheduleDate' : payment.paymentDate,
          'paymentAccountReferenceId' : payment.paymentAccountReferenceId,
          'bankDetail': {},
          'paymentAmount' : [{'paymentTerm' : 'Other_Amount',
          'paymentAmount' : payment.paymentAmount}]};
        totalCureAmount = totalCureAmount+payment.paymentAmount;
        paymentInstructionsArray.push(paymentInstruction);
      });
      var paymentInstructions = {'paymentInstructions' : paymentInstructionsArray};
      var cureDate = (paymentInstructionsArray.slice(-1).pop()).scheduleDate;
      var initiatedDate = autoLoanModuleService.getCurrentDate();
      var carPayCatchUpRequest = {'initiatedDate':initiatedDate,'planType':'Without Extensions',
        'cureDate':cureDate,'planStatus':'Open','totalCureAmount':totalCureAmount};
      self.createOneTimePayments(paymentInstructions,
          accountDetailsData.accountReferenceId).then(function(data) {
            if (!data.notificationMessage) {
              self.createCarPayCatchUpPlan(carPayCatchUpRequest,accountDetailsData.accountReferenceId);
              self.setPaymentConfirmationData(data.entries);
              $state.go('carPayCatchupConfirmation');
            }
          });
    };

    self.setPaymentCatchupDefaultOptionsData = function(data) {
      self.paymentCatchupDefaultOptionsList = [];
      var paymentsList = data.paymentCatchupPlanOptions.paymentWithoutExtensions.equalPayments.payments;
      angular.forEach(paymentsList, function(payment) {
        self.paymentCatchupDefaultOptionsList.push(payment);
      });
    };

    self.setFinalCatchupPaymentsData = function(data) {
      self.finalCatchupPaymentsData = data;
    };

    self.getFinalCatchupPaymentsData = function() {
      return self.finalCatchupPaymentsData;
    };

    self.getPaymentCatchupDefaultOptionsData = function() {
      return self.paymentCatchupDefaultOptionsList;
    };

    self.tryAgain = function() {
      if (self.errorModel) {
        if (self.errorModel.targetFunction === 'planSummary') {
          self.showPlanSummary();
        }
      }
    };

    self.showPlanSummary = function() {
      var accountDetailsData = autoLoanModuleService.getAccountDetailsData().accountDetails;
      var paymentCatchupRequest =
        self.createPaymentCatchupDefaultOptionsRequest(self.getFirstPaymentDate(),
          self.getRollAmount(),
          accountDetailsData.monthlyPaymentAmount);
      self.getPaymentCatchupDefaultOptions(paymentCatchupRequest,
        accountDetailsData.accountReferenceId).then(function(data) {
          if (data.notificationMessage) {
            self.errorModel = {'targetFunction': 'planSummary',
            'targetState': 'planSummary'};
            $state.go('AutoLoanDetails.transactions.carPayCatchupError');
          } else {
            self.setPaymentCatchupDefaultOptionsData(data);
            $state.go('planSummary');
          }
        })
    };

    self.exitSelectPaymentAccountModal = function() {
      self.goBackModal = 'selectPaymentAccount';
      $state.go('areYouSure');
    };

    self.showSelectPaymentAccount = function(paymentParams) {
      autoLoanModuleService.getPaymentAccounts().then(function(paymentAccounts) {
        var ummData = {};
        var defaultAccount = null;
        ummData.defaultBlankAccount =
          autoLoanModuleService.getI18n().coaf.carPayCatchUp.selectPaymentAccount.defaultBlankAccount.label.v1;
        if (paymentAccounts && paymentAccounts.length > 0) {
          ummData.availableAccounts = paymentAccounts;
          if (paymentParams && paymentParams.payment && paymentParams.payment.defaultPaymentAccountData) {
            var addedAccount = paymentParams.payment.defaultPaymentAccountData.accountNumber;
            if (addedAccount.length > 3) {
              var filterAccountNumber = addedAccount.substring(addedAccount.length-4, addedAccount.length);
              var defaultAccountList
                = $filter('filter')(paymentAccounts, filterAccountNumber);
              defaultAccount =  defaultAccountList ? defaultAccountList[0] : null;
            }
          }
        }
        UmmPaymentFactory.setUmmData(ummData);
        $injector.get('autoLoanPaymentAddAccountService').registerPaymentAccountListeners();
        $state.go('selectPaymentAccount', {defaultAccount: defaultAccount});
      });
    };

    self.getAccountLabelDisplay = function(from) {
      var displayAccountLabel = '';
      if (from.displayDefaultName) {
        displayAccountLabel = from.displayDefaultName;
      } else {
        displayAccountLabel = from.displayName;
        if (displayAccountLabel.length > EaseConstant.kDefaultLengthForDropDownItem) {
          displayAccountLabel = displayAccountLabel.substr(0, EaseConstant.kDefaultLengthForDropDownItem);
        }
      }
      displayAccountLabel = displayAccountLabel + ' ...' + from.accountNumber.substring(from.accountNumber.length-4,
          from.accountNumber.length);
      return displayAccountLabel;
    };

    self.setPaymentAccountInfo = function(paymentsList, paymentReferenceId) {
      angular.forEach(paymentsList, function(payment) {
        payment.paymentAccountReferenceId = paymentReferenceId;
      });
      return paymentsList;
    };

  }

  return carPayCatchUpService;
});

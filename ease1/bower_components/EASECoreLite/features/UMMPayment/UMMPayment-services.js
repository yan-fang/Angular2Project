define(['angular'], function (angular) {
  var UMMPaymentService = angular.module('UMMPaymentModule');

  UMMPaymentService.factory('UmmPaymentFactory', function (EaseConstant, EASEUtilsFactory, $q, Restangular,
    EaseConstantFactory, easeExceptionsService, $ocLazyLoad, $injector) {
    var UmmData = null;
    var accItem = null;
    var ummDataChanged = false;
    var successData = null;
    var selectedIdx = 0;
    var selectedActRefId = null;
    var accountDetailsData;
    var i18core;
    var i18n;
    var bankName;
    var addExternalContentOne;

    return {
      getSelectedIdx: function (dropdown) {
        if (selectedIdx == null) {
          var data = this.getData(dropdown);
          for (var i = 0; i < data.length; i++) {
            var acct = data[i];
            if (acct.referenceId === selectedActRefId) {
              selectedIdx = i;
            }
          }
        }
        return selectedIdx;
      },
      isDataChanged: function () {
        return ummDataChanged;
      },
      setUmmData: function (data) {
        if (UmmData != null) {
          ummDataChanged = !ummDataChanged;
        }
        UmmData = data;
      },
      getUmmData: function () {
        return UmmData;
      },
      getData: function (dropdown) {
        if (dropdown === 'accountDd') {
          return UmmData.availableAccounts;
        } else if (dropdown === 'amountDd') {
          return UmmData.availableAmounts;
        }
      },
      setSuccessData: function (data) {
        successData = data;
      },
      getSuccessData: function () {
        return successData;
      },
      setAccItem: function (data) {
        accItem = data;
      },
      getAccItem: function () {
        return accItem;
      },
      getLob: function (category) {
        if (category === "HIL" | category === "HLC" | category === "MLA") {
          category = "MLA"; // All homeloans belong to the same category
        }
        for (var item in EaseConstant.lineOfBusiness) {
          if (EaseConstant.lineOfBusiness[item] === category) {
            return item;
          }
        }
      },
      isOtherAmountValid: function (value) {
        var regex = /\d*\.?\d\d?/g;
        var num = parseFloat(regex.exec(value));
        if (isNaN(num)) {
          return {success: false, message: "is required"}
        }
        else if (num > 100000) {
          return {success: false, message: "(< $100,000)"};
        }
        else {
          return {success: true};
        }
      },
      getUmmPaymentInfo: function (category, accountRefId) {
        var deferred = $q.defer();
        var url = this.getLob(category) + '/UmmPayments/' + encodeURIComponent(accountRefId) + '/';
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());

        var getUmmPayemenyInfo = Restangular.all(url);
        getUmmPayemenyInfo.get('').then(function (data) {
          deferred.resolve(data);
        }, function (ex) {
          deferred.reject();
          throw easeExceptionsService.createEaseException({
            'module': 'UMMPaymentModule',
            'function': 'UMMPaymentService.getUmmPaymentInfo',
            'message': ex.statusText,
            'cause': ex
          });
        });
        return deferred.promise;
      },
      getUmmPayment: function (item) {
        selectedActRefId = item.accountRefId;
        var self = this,
          url = this.getLob(item.category) + '/UmmPayments/' + encodeURIComponent(item.accountRefId) + '/';
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        // return Restangular.all(url).get('');
        if (item.header) {
          EASEUtilsFactory.setCustomerActivityHeader(item.header);
        }
        else {
          EASEUtilsFactory.setCustomerActivityHeader('50013');
        }
        return Restangular.all(url).get('', {}).then(function(data) {
          // return data;
          self.setUmmData(data);
          self.setAccItem(item);
        }, function (ex) {
          throw easeExceptionsService.createEaseException({
            'module': 'UMMPaymentModule',
            'function': 'UMMPaymentService.getUmmPaymentInfo',
            'message': ex.statusText,
            'cause': ex
          });
        });
      },
      getNewAvailableAmounts: function (category, accountRefId) {
        var getLob = function (category) {
          for (var item in EaseConstant.lineOfBusiness) {
            if (EaseConstant.lineOfBusiness[item] === category) {
              return item;
            }
          }
        };
        var deferred = $q.defer();
        var url = this.getLob(category) + '/UmmPayments/' + encodeURIComponent(accountRefId) + '/getNewAvailableAmounts';
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());

        var getNewAvailableAmounts = Restangular.all(url);
        getNewAvailableAmounts.get('').then(function (data) {
          deferred.resolve(data);
        }, function (ex) {
          deferred.reject();
          throw easeExceptionsService.createEaseException({
            'module': 'UMMPaymentModule',
            'function': 'UMMPaymentService.getNewAvailableAmounts',
            'message': ex.statusText,
            'cause': ex
          });
        });
        return deferred.promise;
      },
      getUmmPaymentModal: function (modalDetails, stateParams) {
        function toggleFeature(togglemsg) {
          easeExceptionsService.displayErrorHadler(togglemsg.msgHeader, togglemsg.msgBody);
          stopSpinner();
        }

        switch (modalDetails.category) {
          case 'AL':
          {
            var dependencies = ['js!AutoLoan'];
            this.getLobUmmPayment(modalDetails, stateParams.isAccountDataAvailable, 'autoLoanModuleService', dependencies,
              stateParams.stopSpinner, toggleFeature, stateParams.refreshAccountSummary);
            break;
          }
          case 'CC': {
            var dependencies = [
              'js!StatementModule',
              'js!CreditCard'
            ];
            this.getLobUmmPayment(modalDetails, stateParams.isAccountDataAvailable, 'CC', dependencies, stateParams.stopSpinner,
              toggleFeature, stateParams.refreshAccountSummary);
            break;
          }
          case 'HIL':
          case 'HLC':
          case 'MLA':
          { //All the homeloans products
            var dependecies = ['js!HomeLoans','/ease-ui/bower_components/HomeLoans/HomeLoans-utils.js',
              '/ease-ui/bower_components/HomeLoans/HomeLoans-services.js'];
            this.getLobUmmPayment(modalDetails, stateParams.isAccountDataAvailable, 'homeLoansAccountDetailsService', dependecies,
              stateParams.stopSpinner, toggleFeature, stateParams.refreshAccountSummary);
            break;
          }
          default:
          {
            easeExceptionsService.displayErrorHadler();
          }
        }
      },
      getLobUmmPayment: function (modalDetails, isAccountDataAvailable, service, deps, stopSpinner, toggleFeature, refreshAccountSummary) {
        $ocLazyLoad.load(deps).then(function (path) {
          var loadUmmModule = $injector.get(service);
          loadUmmModule.launchUmmPayment(modalDetails, isAccountDataAvailable, stopSpinner, toggleFeature, refreshAccountSummary);
        });
      },
      populateAccountTypeValues: function (contentDataExt) {
        return [
          {'display': contentDataExt['ease.core.addacct.accttype.mnymrkt.label'],
            'value': 'MONEY_MARKET',
            'accountUseDescription' : 'CONSUMER'},
          {'display': contentDataExt['ease.core.addacct.accttype.persckg.label'],
            'value': 'CHECKING',
            'accountUseDescription' : 'CONSUMER'},
          {'display': contentDataExt['ease.core.addacct.accttype.perssav.label'],
            'value': 'SAVINGS',
            'accountUseDescription' : 'CONSUMER'},
          {'display': contentDataExt['ease.core.addacct.accttype.busckg.label'],
            'value': 'CHECKING',
            'accountUseDescription' : 'BUSINESS'},
          {'display': contentDataExt['ease.core.addacct.accttype.bussav.label'],
            'value': 'SAVINGS',
            'accountUseDescription' : 'BUSINESS'}]
      },
      setBankName: function (name) {
        bankName = name;
      },
      getBankName: function () {
        return bankName;
      },
      setContentOneData: function (contentOneData) {
        addExternalContentOne = contentOneData;
      },
      getContentOneData: function () {
        return addExternalContentOne;
      },
      getBankDetails: function (abanumber) {
        var deferred = $q.defer();
        var url = EaseConstant.kbankDetailsUrl + abanumber;
        EASEUtilsFactory.setCustomerActivityHeader('50042');
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var bankDetailsRest = Restangular.all(url);
        bankDetailsRest.get('').then(function (data) {
          deferred.resolve(data);
        }, function (ex) {
          deferred.reject();
          throw easeExceptionsService.createEaseException({
            'module': 'UMMPaymentModule',
            'function': 'UMMPaymentService.getBankDetails',
            'message': ex.statusText,
            'cause': ex
          });
        });
        return deferred.promise;
      },
      saveExternalAccount: function (formData) {
        var deferred = $q.defer();
        var url = EaseConstant.kSaveExtBankUrl;
        EASEUtilsFactory.setCustomerActivityHeader('50042');
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var saveExtBankRest = Restangular.all(url);
        saveExtBankRest.post(formData).then(function (data) {
          deferred.resolve(data);
        }, function (ex) {
          deferred.reject();
          throw easeExceptionsService.createEaseException({
            'module': 'UMMPaymentModule',
            'function': 'UMMPaymentService.saveExternalAccount',
            'message': ex.statusText,
            'cause': ex
          });
        });
        return deferred.promise;
      }
    };
  });

  return UMMPaymentService;
});

define(['angular'], function(angular) {
  'use strict';
  angular.module('AccountDetailsModule')
    .factory('accountDetailService', ["EaseConstant", "EASEUtilsFactory", "$q", "Restangular", "EaseConstantFactory", "$animate", "easeExceptionsService", "summaryService", "featureToggleFactory", function(EaseConstant, EASEUtilsFactory, $q, Restangular, EaseConstantFactory,
      $animate, easeExceptionsService, summaryService, featureToggleFactory) {

      var services = {};

      services.getAccountPosition = function(referenceId) {
        var deferred = $q.defer();
        getFeatureToggleData().then(function() {
          summaryService.get().then(function(data) {
            var accountList = data.accounts.filter(filterCarouselAccountList);
            var index = 0;
            while (index < accountList.length) {
              if (accountList[index].referenceId === referenceId) {
                break;
              }
              index++;
            }
            var leftAccount = true;
            var rightAccount = true;
            var leftIndex = index - 1;
            var rightIndex = index + 1;
            if (index === 0) {
              leftIndex = accountList.length - 1;
            } else if (index === accountList.length - 1) {
              rightIndex = 0;
            }

            leftAccount = {
              isLeftNavigable: false,
              account: accountList[leftIndex]
            }

            rightAccount = {
              isRightNavigable: false,
              account: accountList[rightIndex]
            }

            if (accountList.length === 1) {
              leftAccount.isLeftNavigable = true;
              rightAccount.isRightNavigable = true;
            }

            deferred.resolve({
              showLeftArrow: leftAccount,
              showRightArrow: rightAccount
            });
          });
        });

        return deferred.promise;
      };

      function getFeatureToggleData() {
        var deferred = $q.defer();
        var featureToggleData = featureToggleFactory.getFeatureToggleData();
        if (_.isEmpty(featureToggleData)) {
          featureToggleFactory.initializeFeatureToggleData().then(function(data) {
            deferred.resolve(data);
          })
        } else {
          deferred.resolve(featureToggleData);
        }
        return deferred.promise;
      }

      function filterCarouselAccountList(product) {
        var featureToggleData = featureToggleFactory.getFeatureToggleData();
        // Regression defect fix: adding retail accounts to carousel account list only if feature is enabled
        // Can't do this in easeUtils as featureToggleFactory has a dependency on it
        // we should remove below code once retail L2 is built into EASE
        if (product.subCategory && product.subCategory.toLowerCase() === 'retail' && featureToggleData &&
          featureToggleData[EaseConstant.features.enableRetailNavigation] && ['DDA', 'SA', 'MMA', 'CD'].indexOf(
            product.category) !== -1) {
          return true;
        }

        if (['COI'].indexOf(product.category) === 0) {
          return false;
        }
        return !EASEUtilsFactory.isInActiveProduct(product).isNotClickable;
      }

      services.getAccountDetailsData = function(urlParams, accountDetailsRefId) {
        return EASEUtilsFactory.getAccountDetailData(urlParams, accountDetailsRefId);
      };
      services.createUrl = function(urlParams, accountDetailsRefId) {
        return EASEUtilsFactory.createAccountDetailUrl(urlParams, accountDetailsRefId);
      };
      services.appendMoreTransactions = function(currentSet, newSet, lineOfBusiness) {
        newSet = this.processTransactions(lineOfBusiness, newSet);
        for (var i = 0; i < newSet.entries.length; i++) {
          currentSet.entries.push(newSet.entries[i]);
        }
        return currentSet;
      };

      services.getfilterResult = function(transactions, lineOfBusiness) {
        transactions = this.processTransactions(lineOfBusiness, transactions);
        return transactions;
      };
      return services;
    }])
    .factory('productTypeFactory', ["EaseConstant", "$locale", function(EaseConstant, $locale) {
      return {
        getProductType: function(data, lineOfBusiness) {
          return EaseConstant.partialFilePath[lineOfBusiness][0] + EaseConstant.partialFilePath[lineOfBusiness]
            [1];
        },
        getTransactionType: function(lineOfBusiness) {
          if (typeof lineOfBusiness !== 'undefined') {
            return EaseConstant.partialFilePath[lineOfBusiness][0] + EaseConstant.partialFilePath[
              lineOfBusiness][2];
          }
        },
        getCreditCardInfo: function(CreditCardNumber) {
          return CreditCardNumber.substring(CreditCardNumber.length - 4, CreditCardNumber.length);
        },
        processAutoLoan: function(accountDetails) {
          accountDetails.dteDueDate = new Date(accountDetails.dueDate);
          accountDetails.dteDueDateMonth = $locale.DATETIME_FORMATS.MONTH[accountDetails.dteDueDate.getMonth()];
          accountDetails.dteDueDateDay = accountDetails.dteDueDate.getDay();
          console.log(accountDetails.vehicleIdentificationNumber);
          accountDetails.strIDNumber = accountDetails.vehicleIdentificationNumber;
          return accountDetails;
        }
      };
    }])
})

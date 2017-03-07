define(['angular'], function(angular) {
  'use strict';
  var TransferService = angular.module('TransferModule');

  TransferService.factory('TransferFactory', ['EaseConstant', 'EASEUtilsFactory',
    '$q', '$sessionStorage', 'Restangular', 'EaseConstantFactory', '$filter',
    'easeExceptionsService', 'appCookie', 'TransferConstant', 'transferState',
    function(EaseConstant, EASEUtilsFactory, $q, $sessionStorage, Restangular,
      EaseConstantFactory, $filter, easeExceptionsService,
      appCookie, TransferConstant, transferState) {
      var transferData = null,
        accItem = {},
        dataChanged = false,
        successData = null,
        transferFrom = {},
        transferTo = {},
        errorResponse = {},
        selectedActRefIdTransferFrom = null,
        selectedIdx = 0,
        selectedIdxTransferTo = 0,
        transferFromList = [],
        currentTransferToList = [],
        editTransferData = {},
        dirty = false,
        serverTime = null,
        contentData = {},
        printClassName = 'transfer-print',
        body = angular.element(document.body),
        loadDependentStates = function() {
            var transferScheduleUnavailable = {
              params: {
                data: null
              },
              name: transferState.getCurrentLOB() + '.' + EaseConstant.stateNames.transferScheduleUnavailable,
              parent: transferState.getCurrentLOB(),
              url: '',
              controller: 'TransferScheduleUnavailableCtrl'
            };
          transferState.addTransferState(transferScheduleUnavailable);
        },
        getAccountType = function(accountType) {
          var result = accountType.toLowerCase();
          var types = EaseConstant.kTransferProductGroup;
          if (result === types.C1Retail) {
            return 'retail';
          } else if (result === types.C1Direct_360) {
            return '360';
          } else if (result === types.C1Direct_360_Ext || result === types.C1Reatil_Ext) {
            return 'external';
          } else if (result === types.C1HomeEquityCredit){
            return 'heloc';
          } else if (result === types.C1Investing){
            return 'investing';
          }
        },
        getAccountDisplayName = function(account) {
          var displayName = '';
          if (typeof account.accountNickName !== 'undefined' || typeof account.accountNickname !== 'undefined') {
            displayName = account.accountNickName || account.accountNickname;
          } else if (typeof account.productDescription !== 'undefined') {
            displayName = account.productDescription;
          } else {
            displayName = account.accountType;
          }
          return displayName;
        },
        getDisplayAccountNumber = function(accountNumber) {
          if (accountNumber.length > 4) {
            var displayNumber = $filter('limitTo')(accountNumber, -4) ;
            if (displayNumber.indexOf('X') === -1 && displayNumber.indexOf('.') === -1) {
              return '...' + displayNumber;
            }
          }
          return null;
      };

      loadDependentStates();

      return {
        getSelectedIdx: function(dropdown, toAccountRefId) {
          if (dropdown === 'transferFrom') {
            var data = this.getData(dropdown);
            for (var i = 0; i < data.length; i++) {
              var acct = data[i];
              if (acct.referenceId === selectedActRefIdTransferFrom ||
                  acct.externalAccountReferenceId === selectedActRefIdTransferFrom) {
                selectedIdx = i;
                break;
              }
            }
            return selectedIdx;
          } else if (dropdown === 'transferTo') {
              var data = this.getData(dropdown);
              for (var i = 0; i < data.length; i++) {
                var acct = data[i];
                if (acct.referenceId === toAccountRefId ||
                    acct.externalAccountReferenceId === toAccountRefId) {
                  selectedIdxTransferTo = i;
                  break;
                }
              }
            return selectedIdxTransferTo;
          }

        },
        transferAmount: function(transferData) {
          var deferred = $q.defer();
          var url = EaseConstant.kUmmMakeTransfer;

          Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
          var transferURL = Restangular.all(url);
          EASEUtilsFactory.setCustomerActivityHeader('50025');
          transferURL.post(transferData).then(function(data) {
            deferred.resolve(data);
          }, function(ex) {
            deferred.reject();
            throw easeExceptionsService.createEaseException({
              'module': 'TransferModule',
              'function': 'TransferFactory.transferAmount',
              'message': ex.statusText,
              'cause': ex
            });
          });
          return deferred.promise;
        },
        updateTransfer: function(transferData) {
          var deferred = $q.defer();
          var url = EaseConstant.kUmmUpdateMoneyTransfer;

          Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
          var updateTransferURL = Restangular.all(url);
          EASEUtilsFactory.setCustomerActivityHeader('50055');
          updateTransferURL.post(transferData).then(function(data) {
            deferred.resolve(data);
          }, function(ex) {
            deferred.reject();
            throw easeExceptionsService.createEaseException({
              'module': 'TransferModule',
              'function': 'TransferFactory.submitEditTransfer',
              'message': ex.statusText,
              'cause': ex
            });
          });
          return deferred.promise;
        },
        cancelTransfer: function(transferData) {
          var deferred = $q.defer();
          var url = EaseConstant.kUmmCancelTransfer;
          var objQuery = {
            'moneyTransferReferenceId' : transferData
          };

          Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
          var transferURL = Restangular.all(url);
          EASEUtilsFactory.setCustomerActivityHeader('50056');
          transferURL.post(objQuery).then(function(data) {
            deferred.resolve(data);
          }, function(ex) {
            deferred.reject();
            throw easeExceptionsService.createEaseException({
              'module': 'TransferModule',
              'function': 'TransferFactory.cancelTransfer',
              'message': ex.statusText,
              'cause': ex
            });
          });
          return deferred.promise;
        },

        isDataChanged: function() {
          return dataChanged;
        },
        getTransferFrom: function() {
          return transferFrom;
        },
        getTransferTo: function() {
          return transferTo;
        },
        setTransferData: function(data) {
          if (transferData !== null) {
            dataChanged = !dataChanged;
            transferFrom = null;
            transferTo = null;
          }
          transferData = data;
        },
        setEditTransferData: function(transferDetails) {
          transferDetails.fromAccount.accountType = getAccountType(transferDetails.fromAccount.groupCode);
          transferDetails.toAccount.accountType = getAccountType(transferDetails.toAccount.groupCode);
          transferDetails.fromAccount.displayName = getAccountDisplayName(transferDetails.fromAccount);
          transferDetails.toAccount.displayName = getAccountDisplayName(transferDetails.toAccount);
          transferDetails.fromAccount.accountNumber
						= getDisplayAccountNumber(transferDetails.fromAccount.accountNumber);
          transferDetails.toAccount.accountNumber = getDisplayAccountNumber(transferDetails.toAccount.accountNumber);
          editTransferData = transferDetails;
        },
        setContentData: function(contentOne) {
          if (contentOne && contentOne[TransferConstant.kCoreTransfer]) {
            contentData = contentOne[TransferConstant.kCoreTransfer];
          } else {
            contentData = {};
          }
        },
        getContentData: function() {
          return contentData;
        },
        getErrorResponse: function() {
          return errorResponse;
        },
        setErrorResponse: function(data) {
          errorResponse = data;
        },
        getTransferData: function() {
          return transferData;
        },
        getTransferFromList: function() {
          return transferFromList;
        },
        getTransferToList: function() {
          return currentTransferToList;
        },
        getEditTransferData: function() {
          return editTransferData;
        },
        getData: function(dropdown) {
          if (dropdown === 'transferFrom') {
            return transferFromList;
          } else if (dropdown === 'transferTo') {
            return currentTransferToList;
          }
        },
        setSuccessData: function(data) {
          successData = data;
        },
        getSuccessData: function() {
          return successData;
        },
        setAccItem: function(data) {
          selectedActRefIdTransferFrom = data.accountRefId;
          accItem = data;
        },
        getAccItem: function() {
          return accItem;
        },
        getLob: function(category) {
          for (var item in EaseConstant.lineOfBusiness) {
            if (EaseConstant.lineOfBusiness[item] === category) {
              return item;
            }
          }
        },
        setServerTime: function(time) {
          serverTime = time;
        },
        getServerTime: function() {
          return serverTime;
        },
        getTransferInfo: function() {
          var deferred = $q.defer();
          var self = this,
            url = EaseConstant.kUmmTransferGetAccounts,
            objQuery = {
              'customerReferenceId': ''
            };
          Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
          EASEUtilsFactory.setCustomerActivityHeader('50024');
          Restangular.all(url).post(objQuery).then(function(data) {
            dirty = true;
            self.setTransferFromList(data.entries);
            self.setTransferData(data.entries);
            self.setErrorResponse(data.errorResponse);
            self.setServerTime(data.easternTime);
            deferred.resolve(data);
          }, function(ex) {
            deferred.reject(ex);
            throw easeExceptionsService.createEaseException({
              'module': 'TransferModule',
              'function': 'TransferFactory.getTransferInfo',
              'message': ex.statusText,
              'cause': ex
            });
          });
          return deferred.promise;
        },
        getEditTransferInfo: function() {
          var deferred = $q.defer();
          var self = this,
            url = EaseConstant.kUmmTransferGetDetails,
            objQuery = {
              'customerReferenceId': ''
            };
          Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
          EASEUtilsFactory.setCustomerActivityHeader('50055');
          Restangular.all(url).post(objQuery).then(function(data) {
            self.setServerTime(data.easternTime);
            deferred.resolve(data);
          }, function(ex) {
            deferred.reject(ex);
            throw easeExceptionsService.createEaseException({
              'module': 'TransferModule',
              'function': 'TransferFactory.getEditTransferInfo',
              'message': ex.statusText,
              'cause': ex
            });
          });
          return deferred.promise;
        },
        setTransferFromList: function(transferApiResponse) {
          var self = this,
            length = transferApiResponse.length;
          if (dirty) {
            transferFromList = []
          }
          for (var i = 0; i < length; i++) {
            if (transferApiResponse[i].eligibleDebitOffsetAccounts.length > 0) {
              transferFromList.push(self.translateApiResponse(transferApiResponse[i]));
            }
          }
        },
        setCurrentTransferToList: function(transferFromAccount) {
          var self = this,
            lengthForData = transferData.length;
          if (dirty) currentTransferToList = [];
          var currentEligibleDebitOffsetAccounts = [];
          for (var i = 0; i < lengthForData; i++) {
            if (transferFromAccount.moneyReferenceId === transferData[i].moneyTransferAccountReferenceId) {
              currentEligibleDebitOffsetAccounts = transferData[i].eligibleDebitOffsetAccounts;
            }
          }
          var lengthForJ = currentEligibleDebitOffsetAccounts.length;
          for (var j = 0; j < lengthForJ; j++) {
            for (var k = 0; k < lengthForData; k++) {
              if (transferData[k].accountType !== 'HELOC' &&
                currentEligibleDebitOffsetAccounts[j].moneyTransferAccountReferenceId[0] ===
                transferData[k].moneyTransferAccountReferenceId) {
                currentTransferToList.push(self.translateApiResponse(transferData[k],
                  currentEligibleDebitOffsetAccounts[j]));
              }
            }
          }
        },
        setTransferToList: function(transferToAccounts) {
          currentTransferToList = transferToAccounts;
        },
        translateApiResponse: function(rawApiAccount, debitAccount) {
          var currentAccount = {};
          currentAccount.displayName = getAccountDisplayName(rawApiAccount);
          currentAccount.accountNumber = getDisplayAccountNumber(rawApiAccount.displayAccountNumber);
          currentAccount.accountType =getAccountType(rawApiAccount.productGroup);
          currentAccount.rawAccountType =rawApiAccount.accountType;
          currentAccount.category = rawApiAccount.productDescription;
          currentAccount.displayBalance = rawApiAccount.availableBalance;
          currentAccount.showRemainingLimit = (currentAccount.accountType === 'external') && !(currentAccount.accountType === '360');
          currentAccount.moneyReferenceId = rawApiAccount.moneyTransferAccountReferenceId;
          currentAccount.referenceId = rawApiAccount.accountReferenceId;
          currentAccount.externalAccountReferenceId = rawApiAccount.externalAccountReferenceId;
          currentAccount.message = rawApiAccount.message;
          currentAccount.minimumAdvance = rawApiAccount.minimumAdvance > 0 ? rawApiAccount.minimumAdvance : '';
          if (debitAccount && 'currentDayTransferAvailableAmount' in debitAccount) {
            currentAccount.dailyTransferLimit = debitAccount.currentDayTransferAvailableAmount;
          }
          if (debitAccount && 'currentMonthTransferAvailableAmount' in debitAccount) {
            currentAccount.monthlyTransferLimit = debitAccount.currentMonthTransferAvailableAmount;
          }
          return currentAccount;
        },
        setPrintClass: function() {
          body.addClass(printClassName);
        },
        removePrintClass: function() {
          body.removeClass(printClassName);
        },
        getPageType: function(page) {
          return (page === 'accountSummary') ? 'account summary' : 'account details';
        }
      };
    }
  ]);

  TransferService.factory('TransferAnalytics', ['pubsubService', function(pubsubService) {
      return {
        trackAnalytics: function(lob, value2, value3, value4, value5) {
          pubsubService.pubsubTrackAnalytics({
            taxonomy: {
              level1: 'ease',
              level2: formatValue(value2),
              level3: formatValue(value3),
              level4: formatValue(value4),
              level5: formatValue(value5),
              country: 'us',
              language: 'english',
              system: 'ease_web'
            },
            lob: lob
          });
          function formatValue(value) {
            return value || '';
          }
        },
        buildLOB: function(fromLOB, toLOB) {
          fromLOB = formatLOB(fromLOB);
          if(toLOB) {
            toLOB = formatLOB(toLOB);
            return fromLOB + ' | ' + toLOB;
          }
          return fromLOB;
          
          function formatLOB(lob) {
            if(lob === 'heloc') {
              return 'home loans'
            }
            return lob || '';
          }
        },
        trackAnalyticsByName: function(trackName) {
          pubsubService.pubsubTrackAnalytics({ name : trackName });
        }
      }
    }
  ]);

	TransferService.factory('CalendarService', ['$q', '$injector', function($q, $injector) {
      var service = {};

      service.getDates = function() {
        var TransferFactory = $injector.get('TransferFactory');
				var serverTime = TransferFactory.getServerTime() || new Date();
				var calendarDates = setMinMaxDates(serverTime);

        return $q.when(calendarDates);

        function setMinMaxDates(serverTime) {
          var currentDate = serverTime instanceof Date ? serverTime : new Date(serverTime);
					var currentDateCopy = angular.copy(currentDate);

					currentDateCopy.setFullYear(currentDateCopy.getFullYear() + 1);

          return { minDate: currentDate, maxDate: currentDateCopy, serverTime: currentDate };
        }
      }

      return service;

    }]);

  return TransferService;
});

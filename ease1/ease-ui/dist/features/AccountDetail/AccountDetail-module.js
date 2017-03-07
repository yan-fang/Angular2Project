define('AccountDetailModule',['angular'], function(angular) {
  'use strict';
  var accountDetailModule = angular.module('AccountDetailsModule', ['ui.router', 'restangular', 'oc.lazyLoad',
    'EaseProperties', 'easeAppUtils', 'ngAnimate', 'filterComponent', 'angular-lo-dash', 'ngLocale'
  ]);

  detailConfigFn.$inject = ['EaseConstant', 'easeFilesProvider'];

  function detailConfigFn(EaseConstant, easeFilesProvider) {
    var accountDetailsParentState = {
      name: 'accountDetails',
      url: '/accountDetails/:accountReferenceId/:lineOfBusiness',
      abstract: true,
      resolve: {
        i18nData: ['EaseLocalizeService', function(EaseLocalizeService) {
          return EaseLocalizeService.get('accountDetails');
        }],
      },
      controller: 'AccountDetailsParentController'
    };

    var accountDetailsTransactionState = {
      name: 'accountDetails.transactions',
      parent: accountDetailsParentState,
      controller: 'AccountDetailsTransactionController',
      controllerAs: 'AccountTransactions'
    };
  }
  accountDetailModule.config(detailConfigFn);
});

define('AccountDetailServices',['angular'], function(angular) {
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
      };

      function filterCarouselAccountList(product) {
        var featureToggleData = featureToggleFactory.getFeatureToggleData();
        // Regression defect fix: adding retail accounts to carousel account list only if feature is enabled, can't do this in easeUtils as featureToggleFactory has a dependency on it
        // we should remove below code once retail L2 is built into EASE
        if (product.subCategory && product.subCategory.toLowerCase() === 'retail' && featureToggleData &&
          featureToggleData[EaseConstant.features.enableRetailNavigation] && ['DDA', 'SA', 'MMA', 'CD'].indexOf(
            product.category) !== -1) {
          return true;
        }

        if (['COI'].indexOf(product.category) == 0) {
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
;
define('AccountDetailController',['angular'], function(angular) {
  'use strict';

  angular.module('AccountDetailsModule')
    .controller('AccountDetailsParentController', detailsParentController)
    .controller('AccountDetailsTransactionController', transactionsController)
    .controller('AccountDetailsSettingsController', ["$scope", "$stateParams", function($scope, $stateParams) {}])
    .constant('sortConstant', {
      'dateAscending': 0,
      'dateDescending': 1,
      'merchantAscending': 2,
      'merchantDescending': 3,
      'categoryAscending': 4,
      'categoryDescending': 5,
      'amountAscending': 6,
      'amountDescending': 7,
      'balanceAscending': 8,
      'balanceDescending': 9,
      'descriptionAscending': 10,
      'descriptionDescending': 11
    });

  function detailsParentController($scope, accountDetailsData, $state, $stateParams, productTypeFactory,
    EaseConstant, $window,
    accountDetailService, $animate, EASEUtilsFactory, EaseLocalizeService, easeTemplates) {
    require(['async!' + EaseConstant.googleMaps.urlEnhTransaction], function() {
      $window.gMapsLoaded = true;
    });
    document.body.scrollTop = 0;
    EaseConstant.sortConstantKeys.kTransactionDate = 'dteTransactionDate';
    EaseConstant.descendingSort.scheduled = true;
    EaseConstant.descendingSort.pending = true;
    EaseConstant.descendingSort.posted = true;
    EaseLocalizeService.get('accountDetails').then(function(response) {
      $scope.i18n = response;
    }, function(error) {
      console.error(error);
    });
    angular.extend($scope, {
      accountDetailsData: accountDetailsData,
      AccountType: $stateParams.accountDetails.lineOfBusiness,
      // IsCD360: accountDetailsData.accountDetails.easeProductName,
      on: true,
      //transactionType: productTypeFactory.getTransactionType($stateParams.businessLine),
      goToTransactions: function() {
        $state.go(EaseConstant.states.kAccountDetailTransactions, {
          accountReferenceId: $stateParams.accountReferenceId
        });
      },
      goToSettings: function() {
        $state.go(EaseConstant.states.kAccountDetailSettings);
      },
      goToAccountSummary: function(evt) {
        EASEUtilsFactory.IsFooterDisplaySet(false);
        var element = document.body.querySelector("#transactions");
        $animate.addClass(element, 'transactionAnimationBack');
        $animate.addClass(document.body.querySelector("[detail-animation]"), 'detailAnimationExit', function() {
          $state.go(EaseConstant.states.kAccountSummary);
        });
      },
      GetImage: function(src) {
        return '/ease-ui' + EaseConstant.kBuildVersionPath + '/dist/features/AccountSummary/images/' + src +
          '.png';
      },
      carouselClick: function(direction) {
        $scope.carouselLoadingClass = EaseConstant.loading;
        $state.go(EaseConstant.states.kAccountDetailTransactions, {
          accountReferenceId: (direction === 'prev') ? $scope.carouselControls.showLeftArrow.accountReferenceId : $scope
            .carouselControls.showRightArrow.accountReferenceId,
          lineOfBusiness: (direction === 'prev') ? $scope.carouselControls.showLeftArrow.lineOfBusiness : $scope
            .carouselControls.showRightArrow.lineOfBusiness
        });
      },
      openStatement: function(evt) {}
    });
    if ($stateParams.accountDetails.lineOfBusiness === EaseConstant.lineOfBusiness.CreditCard &&
      $scope.accountDetailsData.accountDetails !== null) {
      $scope.accountDetailsData.accountDetails.displayBalanceDollarAmt = Math.abs(accountDetailsData.accountDetails
        .presentBalanceDollorAmt);
      $scope.accountDetailsData.accountDetails.displayBalanceCentsAmt =
        Math.abs(accountDetailsData.accountDetails.presentBalanceCentsAmt);
      $scope.accountDetailsData.accountDetails.displayAvailableCredit =
        Math.abs(accountDetailsData.accountDetails.availableCredit);
      $scope.accountDetailsData.accountDetails.creditLimit =
        Math.abs(accountDetailsData.accountDetails.creditLimit);
    } else if ($stateParams.accountDetails.lineOfBusiness === EaseConstant.lineOfBusiness.AutoLoan && typeof $scope
      .accountDetailsData.accountDetails.vehicleType !== EaseConstant.kUndefined) {
      $scope.accountDetailsData.accountDetails =
        productTypeFactory.processAutoLoan($scope.accountDetailsData.accountDetails);
    }

    $scope.InitilizeTemplate = function() {
      accountDetailService.getAccountPosition($stateParams.accountReferenceId).then(function(data) {
        $scope.carouselControls = {
          showLeftArrow: data.showLeftArrow,
          showRightArrow: data.showRightArrow
        };
      });
      var lobType = EASEUtilsFactory.SelectDetailsTransaction($stateParams.accountDetails).lobType;
      $scope.productType = easeTemplates.get('template', lobType, 'detail');
      $scope.transactionType = easeTemplates.get('template', lobType, 'transactions');
    }
  }
  detailsParentController.$inject = ["$scope", "accountDetailsData", "$state", "$stateParams", "productTypeFactory", "EaseConstant", "$window", "accountDetailService", "$animate", "EASEUtilsFactory", "EaseLocalizeService", "easeTemplates"];

  function transactionsController(filterTransactionsFilter, $scope, $rootScope, accountDetailsData, $stateParams, _,
    sortConstant, EaseConstant, accountDetailService, EASEUtilsFactory, EaseLocalizeService) {

    EaseLocalizeService.get('accountDetails').then(function(response) {
      $scope.i18n = response;
    }, function(error) {
      console.error(error);
    })
    angular.extend($scope, {
      items: [
        { id: 30, name: 'Show Last 30 Days' },
        { id: 60, name: 'Show Last 60 Days' },
        { id: 90, name: 'Show Last 90 Days' }
      ],
      posted: accountDetailsData.transactions.entries ? accountDetailsData.transactions.entries : [],
      pending: accountDetailsData.transactions.pending ? accountDetailsData.transactions.pending : [],
      scheduled: accountDetailsData.transactions.scheduled ? accountDetailsData.transactions.scheduled : [],
      sortType: {
        sortDateDesc: true,
        sortMerchantDesc: true,
        sortCategoryDesc: true,
        sortDescriptionDesc: true,
        sortAmountDesc: true,
        sortBalanceDesc: true
      },
      filterText: '',
      searchProps: [] // this is used to customize parameters for Search Transactions
    });
    angular.extend($scope, {
      item: $scope.items[0],
      displayTransactionsList: ($scope.posted.length || $scope.pending.length || $scope.scheduled.length) ?
        true : false,
      displayTransactions: EASEUtilsFactory.mapSort($scope.posted, EaseConstant.sortConstantKeys.kTransactionDate,
        EaseConstant.descendingSort.posted),
      pendingTransactions: EASEUtilsFactory.mapSort($scope.pending, EaseConstant.sortConstantKeys.kTransactionDate,
        EaseConstant.descendingSort.pending),
      scheduledTransactions: EASEUtilsFactory.mapSort($scope.scheduled, EaseConstant.sortConstantKeys.kTransactionDate,
        EaseConstant.descendingSort.scheduled),
      sortIndex: sortConstant.dateDescending,
      accDetailSorter: function(sortBy, sortArrow) {
        if ($scope.sortIndex === sortConstant[sortBy + 'Descending']) {
          $scope.displayTransactions = EASEUtilsFactory.mapSort($scope.posted,
            EaseConstant.sortConstantKeys.kTransactionDate, EaseConstant.descendingSort.posted);
          $scope.pendingTransactions = EASEUtilsFactory.mapSort($scope.pending,
            EaseConstant.sortConstantKeys.kTransactionDate, EaseConstant.descendingSort.pending);
          $scope.scheduledTransactions = EASEUtilsFactory.mapSort($scope.scheduled,
            EaseConstant.sortConstantKeys.kTransactionDate, EaseConstant.descendingSort.scheduled);
          $scope.sortIndex = sortConstant[sortBy + 'Ascending'];
          $scope.sortType[sortArrow + 'Asc'] = false;
          $scope.sortType[sortArrow + 'Desc'] = true;
        } else {
          $scope.displayTransactions = EASEUtilsFactory.mapSort($scope.posted,
            EaseConstant.sortConstantKeys.kTransactionDate, !EaseConstant.descendingSort.posted);
          $scope.pendingTransactions = EASEUtilsFactory.mapSort($scope.pending,
            EaseConstant.sortConstantKeys.kTransactionDate, !EaseConstant.descendingSort.pending);
          $scope.scheduledTransactions = EASEUtilsFactory.mapSort($scope.scheduled,
            EaseConstant.sortConstantKeys.kTransactionDate, !EaseConstant.descendingSort.scheduled);
          $scope.sortIndex = sortConstant[sortBy + 'Descending'];
          $scope.sortType[sortArrow + 'Asc'] = true;
          $scope.sortType[sortArrow + 'Desc'] = false;
        }
      },
      changeItem: function(iem) {
        var days = iem.id;
        var urlParams = {
          filter: days,
          type: EaseConstant.urlPostFixerTransactions,
          ProductCategory: $stateParams.accountDetails.lineOfBusiness
        };
        $scope.$parent.transactionsloadingClass = EaseConstant.loading;
        accountDetailService.getAccountDetailsData(urlParams, $stateParams.accountReferenceId).then(function(
          data) {
          $scope.$parent.transactionsloadingClass = '';
          $scope = accountDetailService.getfilterResult(data, $stateParams.accountDetails.lineOfBusiness);
          $scope.displayTransactions = EASEUtilsFactory.mapSort($scope.posted, EaseConstant.sortConstantKeys
            .kTransactionDate, EaseConstant.descendingSort.posted);
          $scope.pendingTransactions = EASEUtilsFactory.mapSort($scope.pending, EaseConstant.sortConstantKeys
            .kTransactionDate, EaseConstant.descendingSort.pending);
          $scope.scheduledTransactions = EASEUtilsFactory.mapSort($scope.scheduled, EaseConstant.sortConstantKeys
            .kTransactionDate, EaseConstant.descendingSort.scheduled);
          $scope.sortIndex = sortConstant.dateDescending;
        });
      },
      loadMoreTransactions: function() {
        var urlParams = {
          type: EaseConstant.urlPostFixerTransactions,
          ProductCategory: $stateParams.accountDetails.lineOfBusiness
        };
        $scope.moreTransactionsloadingClass = EaseConstant.loading;
        accountDetailService.getAccountDetailsData(urlParams, $scope.nextURL.href).then(function(data) {
          $scope.moreTransactionsloadingClass = '';
          $scope =
            accountDetailService.appendMoreTransactions($scope, data, $stateParams.accountDetails.lineOfBusiness);
          $scope.displayTransactions = EASEUtilsFactory.mapSort($scope.posted, EaseConstant.sortConstantKeys
            .kTransactionDate, EaseConstant.descendingSort.posted);
          $scope.pendingTransactions = EASEUtilsFactory.mapSort($scope.pending, EaseConstant.sortConstantKeys
            .kTransactionDate, EaseConstant.descendingSort.pending);
          $scope.scheduledTransactions = EASEUtilsFactory.mapSort($scope.scheduled, EaseConstant.sortConstantKeys
            .kTransactionDate, EaseConstant.descendingSort.scheduled);
          $scope.sortIndex = sortConstant.dateDescending;

          if (typeof data.nextURL === EaseConstant.kUndefined) {
            $scope.nextURL = false;
          } else {
            $scope.nextURL = data.nextURL;
          }
          EASEUtilsFactory.IsFooterDisplaySet(true);
        });
      },
      haveSearchResults: function() {
        var filteredPending = filterTransactionsFilter($scope.pendingTransactions, $scope.filterText,
          $scope.searchProps);
        var filteredDisplay = filterTransactionsFilter($scope.displayTransactions, $scope.filterText,
          $scope.searchProps);
        return filteredPending.length > 0 || filteredDisplay.length > 0;
      }
    });
  }
  transactionsController.$inject = ["filterTransactionsFilter", "$scope", "$rootScope", "accountDetailsData", "$stateParams", "_", "sortConstant", "EaseConstant", "accountDetailService", "EASEUtilsFactory", "EaseLocalizeService"];

});

define('AccountDetailDirectives',['angular'], function(angular) {
  'use strict';
  angular.module('AccountDetailsModule')
    .directive('sampleDirective', ['EASEUtilsFactory', function(EASEUtilsFactory) {
      return {
        scope: { controllerFunction: '&callbackFn' },
        link: function(scope, element, attrs) {
          scope.controllerFunction({ arg1: 1 });
        }
      };

    }])
    .directive('accountDetailsNextAcct', ['EaseConstant', '$state', 'EASEUtilsFactory', 'pubsubService',
      function(EaseConstant, $state, EASEUtilsFactory, pubsubService) {
        return {
          restrict: 'AE',
          template: '<div><button aria-label="{{i18n.nextAriaLabel}}" class="next_prev next_acct"' +
            'ng-hide="carouselControls.showRightArrow.isRightNavigable"><img src="{{::nextButtonImg}}" ' +
            ' alt="{{i18n.nextImageAltText}}" ></button></div>',
          link: function(scope, elem) {
            scope.nextButtonImg = EaseConstant.nextButtonImg;
            elem.bind('click', function() {
              pubsubService.pubsubCarouselClicked({ 'name': 'next:carousel' });
              scope.carouselLoadingClass = EaseConstant.loading;
              var element = scope.carouselControls.showRightArrow.account;

              var stateObject = EASEUtilsFactory.getStateDetailsObject(element);

              $state.go(EASEUtilsFactory.SelectDetailsTransaction(element).lobType +
                'Details.transactions', stateObject);
            });
          }
        };
      }
    ])
    .directive('accountDetailsPrevAcct', ['EaseConstant', '$state', 'EASEUtilsFactory', 'pubsubService',
      function(EaseConstant, $state, EASEUtilsFactory, pubsubService) {
        return {
          restrict: 'AE',
          template: '<div><button aria-label="{{i18n.prevAriaLabel}}" class="next_prev prev_acct" ' +
            ' ng-hide="carouselControls.showLeftArrow.isLeftNavigable"><img src="{{::prevButtonImg}}" ' +
            ' alt="{{i18n.prevImageAltText}}" ></button></div>',
          link: function(scope, elem) {
            scope.prevButtonImg = EaseConstant.prevButtonImg;
            elem.bind('click', function() {
              pubsubService.pubsubCarouselClicked({ 'name': 'previous:carousel' });
              scope.carouselLoadingClass = EaseConstant.loading;

              var element = scope.carouselControls.showLeftArrow.account;

              var stateObject = EASEUtilsFactory.getStateDetailsObject(element);

              $state.go(EASEUtilsFactory.SelectDetailsTransaction(element).lobType +
                'Details.transactions', stateObject);
            });
          }
        };
      }
    ])
    .directive('transactionDate', ['dateFilter', function(dateFilter) {
      return {
        restrict: 'AE',
        template: '<span class="right-col month">{{month}}</span><span class="right-col day">{{day}}</span>',
        link: function(scope, element, attrs) {
          scope.month = dateFilter(attrs.transactionDate, 'MMM');
          scope.day = dateFilter(attrs.transactionDate, 'dd');
        }
      };
    }]);
});

define('AccountDetailFilters',['angular', 'c1Date'], function(angular) {
  'use strict';

  angular.module('AccountDetailsModule')
    .filter('filterTransactions', ['$locale', function($locale) {
      return function(items, filterText, searchProps, dateRange) {
        var output = [];
        if (items) {
          if (dateRange && dateRange.start && dateRange.end) { // filter by date range
            var date1 = c1Date(dateRange.start);
            var date2 = c1Date(dateRange.end);
            var transDate;
            for (var i = 0; i < items.length; i++) {
              if (items[i].displayDate) {
                transDate = c1Date(items[i].displayDate);
              } else {
                transDate = c1Date(items[i].paymentDate);
              }
              if (transDate.isBetween(date1, date2) || transDate.isBetween(date2, date1)) { // does not matter which date is earlier
                output.push(items[i]);
              }
            }
          } else {
            output = items;
          }
        }
        var searchArr = (searchProps && searchProps.length > 0) ?
          searchProps : ['transactionDate', 'merchantName', 'category', 'transactionAmount', 'accountBalance'];
        if (output.length > 0 && filterText) {
          output = output.filter(function(element) {
            if (filterText.substr(0, 3) === '...') { // remove '...' from start of search string, per card request
              filterText = filterText.substr(3);
            }
            var returnValue = true;
            var expected = filterText.toLowerCase();
            var searchArray = searchArr;
            returnValue = returnValue && searchArray.some(function(actual) {
              // TO-DO: if data contracts updated, revisit this code
              var elementVal = element;
              var actualFields = actual.split('.'); // for searches on nested objects, i.e. transaction.merchant.name
              for (var i = 0; i < actualFields.length; i++) {
                elementVal = elementVal[actualFields[i]]; // value of field/object
                if (!elementVal) { // trying to search on invalid field/object
                  return false;
                }
              }
              if (actual.toLowerCase().indexOf('date') !== -1) { // only want to check the date, not the time
                var date = new Date(elementVal);
                var month = date.getMonth();
                var day = date.getDate();
                var day2 = day < 10 ? '0' + day : day; // append 0 to dates 1-9 for consistency with mm/dd/yyyy search
                var year = date.getFullYear();
                var weekDay = date.getDay();
                var monthStr = $locale.DATETIME_FORMATS.MONTH[month].toLowerCase(); // month name
                var msStr = $locale.DATETIME_FORMATS.SHORTMONTH[month].toLowerCase(); // first three letters of month
                var weekDayStr = $locale.DATETIME_FORMATS.SHORTDAY[weekDay].toLowerCase(); // day of week name
                month = month < 9 ? '0' + (month + 1) : (month + 1); // add a 0 to months 1-9
                var dateStr = month + '/' + day + '/' + year;
                var dateStr2 = month + '/' + day2 + '/' + year;
                var mdShortStr = weekDayStr + ', ' + msStr + ' ' + day + ', ' + year; // eee, mmm dd, yyyy
                var mdShortStr2 = weekDayStr + ', ' + msStr + ' ' + day2 + ', ' + year;
                var mdFullStr = weekDayStr + ', ' + monthStr + ' ' + day + ', ' + year; // eee, monthName dd, yyyy
                var mdFullStr2 = weekDayStr + ', ' + monthStr + ' ' + day2 + ', ' + year;
                return angular.isDefined(elementVal) &&
                  (dateStr.indexOf(expected) !== -1 || dateStr2.indexOf(expected) !== -1 ||
                    mdShortStr.indexOf(expected) !== -1 || mdShortStr2.indexOf(expected) !== -1 ||
                    mdFullStr.indexOf(expected) !== -1 || mdFullStr2.indexOf(expected) !== -1);
              } else if (actual.toLowerCase().indexOf('amount') !== -1 ||
                actual.toLowerCase().indexOf('balance') !== -1) {
                var moneyStr1;
                var moneyStr2;
                if (typeof elementVal === 'number') {
                  var moneyVal = Math.abs(elementVal).toFixed(2); // allow search using XXX.XX input for money values
                  moneyStr1 = '-$' + moneyVal;
                  moneyStr2 = '$-' + moneyVal;
                } else {
                  moneyStr1 = '-$' + elementVal; // case where value is already stored as a string
                  moneyStr2 = '$-' + elementVal;
                }
                return angular.isDefined(elementVal) &&
                  (moneyStr1.indexOf(expected) !== -1 || moneyStr2.indexOf(expected) !== -1);
              } else {
                return angular.isDefined(elementVal) && elementVal.toString().toLowerCase().indexOf(
                  expected) !== -1;
              }
            });
            return returnValue;
          });
        }
        return output;
      };
    }]);
});

define('AccountDetailBundle',[
    'AccountDetailModule',
    'AccountDetailServices',
    'AccountDetailController',
    'AccountDetailDirectives',
    'AccountDetailFilters'
  ],
  function() {});


require(["AccountDetailBundle"]);

//# sourceMappingURL=AccountDetail-module.js.map
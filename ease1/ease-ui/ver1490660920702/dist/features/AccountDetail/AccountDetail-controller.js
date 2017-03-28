define(['angular'], function(angular) {
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
    EaseConstant,
    accountDetailService, $animate, EASEUtilsFactory, EaseLocalizeService, easeTemplates) {
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
        var element = document.body.querySelector('#transactions');
        $animate.addClass(element, 'transactionAnimationBack');
        $animate.addClass(document.body.querySelector('[detail-animation]'), 'detailAnimationExit', function() {
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
  detailsParentController.$inject = ["$scope", "accountDetailsData", "$state", "$stateParams", "productTypeFactory", "EaseConstant", "accountDetailService", "$animate", "EASEUtilsFactory", "EaseLocalizeService", "easeTemplates"];

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

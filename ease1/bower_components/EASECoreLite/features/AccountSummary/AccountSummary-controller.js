define(['angular'],
  function(angular) {
    'use strict';

    var summaryModule = angular.module('summaryModule');
    summaryModule.controller('AccountSummaryController', accountSummaryController);

    function accountSummaryController($scope, $rootScope, $state, $window, EaseConstant, ContentConstant,
      contentDataAccountSummary, EaseConstantFactory, accountSummaryData, i18nData, easeTemplates, easePartials,
      TemplateSelectionFactory, EASEUtilsFactory, pubsubService, easeExceptionsService, EaseModalService,
      EaseLocalizeService, messagingService, transferState, featureToggleFactory, RetailAccountLinks, $locale,
                                      SingleProdService, errorContentData) {

      var vm = this;
      TemplateSelectionFactory.setContentData(contentDataAccountSummary);
      vm.contentData = TemplateSelectionFactory.getContentData();

      var featureToggleData = featureToggleFactory.getFeatureToggleData();
      vm.cofiCTAButtonFeatureToggle = featureToggleData[EaseConstant.features.cofiCTAButton];

      function verifyFeatureToggle(item) {
        return !(item.category === 'COI' && !featureToggleData[EaseConstant.features.enableCofiTileDisplay]);
      }

      var accounts = accountSummaryData.accounts.filter(verifyFeatureToggle);

      //Prefetch with LOB specific account reference IDs
      if (typeof($window.sessionStorage.prefetchCheck) === "undefined") {
        EASEUtilsFactory.preFetchLOB(accounts);
        try {
          $window.sessionStorage.setItem("prefetchCheck", true);
          console.log('Your web browser does support storing settings locally');
        } catch (error) {
          console.log('Your web browser does not support storing settings locally');
        };
      };

      accountSummaryData.accounts = accounts;

      //Set the data from Resolve to the Scope
      angular.extend(vm, {
        i18n: i18nData,
        errorContentData:errorContentData,
        greeting: '',
        on: true,
        viewMoreDisabled: true,
        errorFlag: false,
        getAriaTileMsg: function() {
          var args = [];
          var isNegative = arguments[arguments.length - 1];
          if (isNegative) {
            arguments[2] = "negative " + arguments[2];
          }
          Array.prototype.push.apply(args, arguments);
          return arguments[0].format.apply(arguments[0], args.slice(1, arguments.length - 1));
        },
        getBankTransactionAmountClass: function(transaction) {
          var returnBankClass = false;
          if (!transaction.transactionAmount) {
            return returnBankClass;
          }
          if (transaction.debitCardType === 'Credit') {
            returnBankClass = true;
          }

          return returnBankClass;
        },
        getCreditTransactionAmountClass: function(transaction) {
          var returnCreditClass = false;
          if (!transaction.transactionAmount) {
            return returnCreditClass;
          }
          if (transaction.creditTransaction === 'creditTransaction') {
            returnCreditClass = true;
          }

          return returnCreditClass;
        },
        isScheduledTransaction: function(category, transaction) {
          var returnScheduledClass = false;
          if (!category.toLowerCase() === 'al') {
            return returnScheduledClass;
          }
          if (transaction.transactionState
            .toLowerCase() === 'scheduled') {
            returnScheduledClass = true;
          }

          return returnScheduledClass;
        },
        getAriaTransactionMsg: function(category, transItem) {
          if (transItem) {
            var transactionDate = new Date(transItem.transactionDate);
            var transactionDay = transactionDate.getDate() < 10 ? '0' + transactionDate.getDate() :
              transactionDate.getDate();
            return vm.getAriaTileMsg(
              vm.i18n.ariaMsg.transaction[category.toUpperCase()]
              [transItem.transactionState.toUpperCase()],
              vm.i18n.amountSymbol,
              transItem.transactionAmount,
              $locale.DATETIME_FORMATS.MONTH[transactionDate.getMonth()],
              transactionDay,
              transItem.transactionDescription,
              false
            );
          } else {
            return '';
          }
        },
        focusId: '',
        root: $rootScope,
        loadingButton: {},
        transfer: function(evt, item, index) {
          evt.stopImmediatePropagation();
          var subCategoryLob = EASEUtilsFactory.SelectDetailsTransaction(item).pubSubLob;
          vm.selectedModal = index;
          evt.cancelBubble = true;
          vm.loadingButton[index] = 'loading';
          vm.focusId = evt.currentTarget.id;
          //set the Transfer Money current LOB to Account Summary
          transferState.setCurrentLOB('accountSummary');
          $state.go('accountSummary.transfer', {
            'category': item.category,
            'subCategory': subCategoryLob,
            'referenceId': item.referenceId,
            'focusId': vm.focusId
          }).then(function() {
            vm.loadingButton[index] = '';
          });
        },
        payNow: function(evt, account, index) {
          function stopSpinner() {
            vm.loadingButton[index] = '';
            EaseConstant.isEnableActionButton = true;
          }
          function refreshAccountSummary() {
            $state.go('accountSummary', {}, {
              reload: true
            });
          }
          vm.selectedModal = index;
          evt.cancelBubble = true;
          vm.focusId = evt.currentTarget.id;
          vm.loadingButton[index] = 'loading';
          var subCategoryLob = EASEUtilsFactory.SelectDetailsTransaction(account).pubSubLob;
          var paymentData = {
            lineOfBusiness: account.category,
            isAccountDataAvailable: "",
            stopSpinner: stopSpinner,
            refreshAccountSummary: refreshAccountSummary
          }
          vm.paymentParam = {
            'accountReferenceId': account.referenceId,
            'payment': paymentData
          };

          TemplateSelectionFactory.payNow(vm.paymentParam);
          evt.stopImmediatePropagation();
        },
        goToLink: function(greetingMessage) {
          if (greetingMessage.path) {
            EASEUtilsFactory.redirectLinking(greetingMessage);
            pubsubService.pubsubTrackAnalytics({ name: "global messaging:link",  interactionMessage: { click : greetingMessage.messageAnalyticsTracker}});
            if (greetingMessage.responseUrlHref) {
              messagingService.responseMessageApi(greetingMessage.responseUrlHref, 'ACCEPT');
            }
          }
        },
        actionButton: function(evt, account, index) {
          switch (account.actionButton.action) {
            case 'payment':
              {
                evt.cancelBubble = true;
                if (EaseConstant.isEnableActionButton) {
                  EaseConstant.isEnableActionButton = false;
                  pubsubService.pubsubTrackAnalytics({ name: account.actionButton.buttonText+':link', interactionMessage: { click : account.actionButton.messageAnalyticsTracker}});
                  this.payNow(evt, account, index);
                }
                break;
              }
            case 'transfer':
              {
                pubsubService.pubsubTrackAnalytics({ name: account.actionButton.buttonText+':link', interactionMessage: { click : account.actionButton.messageAnalyticsTracker}});
                this.transfer(evt, account, index);
                break;
              }
            case 'accountdetails':
              {
                if (account.subCategory && account.subCategory.toLowerCase() === 'retail' && featureToggleData &&
                  !(featureToggleData[EaseConstant.features.enableRetailNavigation])) {
                  $window.open(RetailAccountLinks.urlRetail, '_blank');
                  evt.stopPropagation();
                } else if (account.subCategory && account.subCategory.toLowerCase() === 'retail' &&
                  featureToggleData &&
                  featureToggleData[EaseConstant.features.enableRetailNavigation] && ['DDA', 'SA', 'MMA'].indexOf(
                    account.category) === -1) {
                  $window.open(RetailAccountLinks.urlRetail, '_blank');
                  evt.stopPropagation();
                } else {
                  (account.actionButton.pubsub === 'default') ?
                  (pubsubService.pubsubTrackAnalytics({ name: 'Default View Accounts Button:link', interactionMessage: { click : account.actionButton.messageAnalyticsTracker}})) :
                  (pubsubService.pubsubTrackAnalytics({ name: 'View Accounts Button:link', interactionMessage: { click : account.actionButton.messageAnalyticsTracker} }));

                  this.goToDetail(evt, account, index);
                }
              }
          }
          if (account.actionButton.responseUrlHref) {
            messagingService.responseMessageApi(account.actionButton.responseUrlHref, 'ACCEPT');
          }
        },
        accountSummaryTransactionData: [],
        accountSummaryData: accountSummaryData.accounts,
        storageName: EaseConstantFactory.storageName(),
        currentFeature: 'AccountSummary',
        productType: 'default',
        accountNumber: '',
        selected: '',
        selectedModal: '',
        showSecondaryData: false,
        loadingModal: function(index) {
          return ((index === vm.selectedModal) ? 'loadingModal' : '');
        },
        isNotClikable: {},
        isideAccount: {},
        showHeaderTransaction: function(index, transItem) {
          if (index === 0 || (index > 0 &&
              vm.accountSummaryTransactionData[index - 1]
              .transactionState !== transItem.transactionState)) {
            return true;
          } else {
            return false;
          }
        },
        showTransactionStatus: function(transItem) {
          if (transItem.transactionState
            .toLowerCase() === 'pending') {
            return true;
          } else if (transItem.transactionState
            .toLowerCase() === 'scheduled') {
            return true;
          } else {
            return false;
          }
        },
        showTransactionDate: function(transItem) {
          if (transItem.transactionState.toLowerCase() === 'posted' ||
            transItem.transactionState.toLowerCase() === 'scheduled' ||
            (transItem.transactionState.toLowerCase() === 'pending' &&
              vm.accountSummaryData[0].category.toLowerCase() === 'al')) {
            return true;
          } else {
            return false;
          }
        },
        isLogoVisible: function(transItem) {
          if (transItem.categoryIconURL &&
            transItem.categoryIconURL !== '') {
            return '';
          } else {
            return 'noImg';
          }
        },
        showTransactionClass: function(transItem) {
          var status = transItem.transactionState && transItem.transactionState.toLowerCase() ?
            transItem.transactionState.toLowerCase() : null;
          switch (status) {
            case 'pending':
              {
                return 'pending';
              }
            case 'scheduled':
              {
                return 'scheduled';
              }
            case 'posted':
              {
                return 'posted';
              }
            default:
              {
                return '';
              }
          }
        },

        showNegativeSignAutoLoan: function(transItem) {
          var category = vm.accountSummaryData[0].category && vm.accountSummaryData[0].category.toUpperCase() ?
            vm.accountSummaryData[0].category.toUpperCase() : null;
          var status = transItem.transactionState && transItem.transactionState.toUpperCase() ?
            transItem.transactionState.toUpperCase() : null;
          var type = transItem.transactionType && transItem.transactionType.toUpperCase() ?
            transItem.transactionType.toUpperCase() : null;
          return (category === 'AL' && (status === 'SCHEDULED' || status === 'PENDING') && type === 'CREDIT');
        },
        alScheduledPendingTx: function(transItem) {
          var category = vm.accountSummaryData[0].category.toUpperCase();
          var status = transItem.transactionState && transItem.transactionState.toUpperCase() ?
          transItem.transactionState.toUpperCase() : null;
          return (category === 'AL' && (status === 'SCHEDULED' || status === 'PENDING'));
        },
        alPostedPaymentTx: function(transItem) {
          var category = vm.accountSummaryData[0].category.toUpperCase();
          var status = transItem.transactionState && transItem.transactionState.toUpperCase() ?
          transItem.transactionState.toUpperCase() : null;
          var type = transItem.transactionType && transItem.transactionType.toUpperCase() ?
            transItem.transactionType.toUpperCase() :
            null;
          return (category === 'AL' && status === 'POSTED' && type === 'CREDIT');
        },
        viewMoreTransactions: function(evt) {
          vm.goToDetail(evt, vm.accountSummaryData[0], 0);
        },
        goToDetail: function(evt, element, index) {
          if (evt != null) {
            vm.focusId = evt.currentTarget.id;
          }

          var target = evt.target.localName || evt.srcElement.localName;
          if ((typeof target != 'undefined' && evt.type === 'keypress' && target === 'button') || vm.isModalLoading()) {
            evt.stopPropagation();
          } else {
            if (element.subCategory && element.subCategory.toLowerCase() === 'retail' && featureToggleData && !
              (featureToggleData[
                EaseConstant.features.isRetailToggleRestricted]) &&
              evt.currentTarget.innerHTML !== "View More") {
              return;
            }
            if (element.subCategory && element.subCategory.toLowerCase() === 'retail' && featureToggleData && !
              (featureToggleData[
                EaseConstant.features.enableRetailNavigation])) {
              // enable OLBR navigation if feature flag is off
              $window.open(RetailAccountLinks.urlRetail, '_blank');
              evt.stopPropagation();
            } else if (element.subCategory && element.subCategory.toLowerCase() === 'retail' &&
              featureToggleData &&
              featureToggleData[EaseConstant.features.enableRetailNavigation] && ['DDA', 'SA', 'MMA', 'CD'].indexOf(
                element.category) ==
              -1) {
              $window.open(RetailAccountLinks.urlRetail, '_blank');
              evt.stopPropagation();
            } else {

              //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined
              // isNotClickable is undefined or false
              if (typeof element.isNotClickable === 'undefined' ||
                (element.isNotClickable !== 'undefined' && !element.isNotClickable)) {
                var stateObject = {
                  accountReferenceId: element.referenceId,
                  ProductName: element.originalProductName.replace(/\s+/g, ''),
                  accountDetails: { lineOfBusiness: element.category, accountNumber: element.accountNumberTLNPI }
                }

                if (element.category == "CC") {
                  stateObject.ProductName = "Card"
                }

                if (element.category === 'COI') {
                  pubsubService.pubsubTrackAnalytics({ name: 'COFI Tile:button' });
                  var cofiURL = '/ease-ui' + EaseConstant.kBuildVersionPath;
                  cofiURL += '/dist/features/AccountSummary/html/cofiLinkout-index.html';
                  cofiURL += '?accountReferenceId=' + element.referenceId;
                  cofiURL += '&customerRole=' + element.customerRole;
                  $window.open(cofiURL, '_blank');
                  evt.stopPropagation();
                }


                if (element.subCategory) {
                  stateObject.accountDetails.subCategory = element.subCategory;
                }

                if (element.productId) {
                  stateObject.accountDetails.productId = element.productId;
                }

                vm.selected = index;

                if (evt.currentTarget.innerHTML === "View More") {
                  pubsubService.pubsubTrackAnalytics({ name: 'singleAccount view more:link' });
                } else if (vm.isSingleProductViewData() === 'singleProduct') {
                  pubsubService.pubsubTrackAnalytics({ name: 'singleAccount transaction:link' });
                }
                $state.go(EASEUtilsFactory.SelectDetailsTransaction(element).lobType +
                  'Details.transactions', stateObject);
              }
            }
          }
        },
        isModalLoading: function() {
          for (var key in vm.loadingButton) {
            if (vm.loadingButton[key] === 'loading') {
              return true;
            }
          }
          return false;
        },
        trimmmedAccountNumber: function(accountNum) {
          return accountNum.substring(accountNum.length - 4, accountNum.length);
        },

        GetImage: function(src) {
          vm.ImagePath =
            '/ease-ui' + EaseConstant.kBuildVersionPath + '/dist/features/AccountSummary/images/' + src +
            '.png';
          return true;
        },
        getPointer: function(element) {
          return element.isDisplayAccount;
        },
        getSummaryTemplate: function(productObj, index) {

          var product = EASEUtilsFactory.isInActiveProduct(productObj);

          productObj.isNotClickable = product.isNotClickable;

          if (productObj.category && (productObj.category.toUpperCase() === 'COI')) {
            if (featureToggleData && !(featureToggleData[EaseConstant.features.enableCofiTileNavigation])) {
              productObj.isNotClickable = true;
            } else {
              productObj.isNotClickable = false;
            }
            productObj.hasNoLoadingClass = true;
          }
          if (productObj.subCategory && (productObj.subCategory.toLowerCase() === 'retail')) {
            if (featureToggleData && !(featureToggleData[EaseConstant.features.isRetailToggleRestricted])) {
              productObj.isNotClickable = true;
            } else if (productObj.subCategory && productObj.subCategory.toLowerCase() === 'retail' &&
              featureToggleData &&
              featureToggleData[EaseConstant.features.enableRetailNavigation] && ['DDA', 'SA', 'MMA', 'CD'].indexOf(
                productObj.category) ==
              -1) {
              productObj.isNotClickable = true;
            } else if (featureToggleData && (featureToggleData[EaseConstant.features.enableRetailNavigation])) {
              productObj.isNotClickable = false;
            }
            vm.viewMoreDisabled = true;
          }
          var htmlPartial = TemplateSelectionFactory.getSummaryTypeTemplate(product.category);
          if (htmlPartial.match("default.html$")) productObj.isNotClickable = true;
          return htmlPartial;
        },
        GetModalPaymentTemplate: function(product) {
          return TemplateSelectionFactory.getModalTemplate(product);
        },
        isSingleProductViewData: function() {
          if (vm.accountSummaryData.length === 1) {
            var featureToggleData = featureToggleFactory.getFeatureToggleData();

            if (!vm.accountSummaryData[0].singleAccountViewEnabled) {
              return 'toggleRestrictedMessage';

            } else {
              return 'singleProduct';
            }
          } else {
            return 'multipleProduct';
          }
        },
        isDetailAccessible: function(account) {
          var accessible = true;
          if (account.accountMessage) {
            if (account.accountMessage[0].level === 'closed' || account.accountMessage[0].level ===
              'restricted') {
              accessible = false;
            }
          }
          return accessible;
        },
        showViewMoreButton: true,
        getSingleProductViewData: function() {
          vm.transactionsloadingClass = EaseConstant.loading;
          vm.accountDetailloadingClass = EaseConstant.loading;
          vm.accountSummaryAccountDetail = {};
          vm.accountDetailFormatClass = 'formatLoading';

          if ((vm.accountSummaryData[0].category === 'HIL' || vm.accountSummaryData[0].category === 'HLC') &&
            parseFloat(vm.accountSummaryData[
              0].availableBalance) > 0) {
            vm.accountDetailloadingClass = '';
          }
          vm.accountSummaryAccountDetail.secondaryData =
            TemplateSelectionFactory.formatSecondaryData(vm.accountSummaryData[0], vm.accountSummaryAccountDetail,
              vm.i18n);
          vm.accountDetailloadingClass = '';
          vm.showSecondaryData = TemplateSelectionFactory
            .showSecondaryData(vm.accountSummaryAccountDetail.secondaryData);
          var urlParams = {
            lineOfBusiness: EASEUtilsFactory.SelectDetailsTransaction(vm.accountSummaryData[0]).lobType,
            ProductCategory: vm.accountSummaryData[0].category,
            accountNumber: vm.accountSummaryData[0].accountNumberTLNPI
          };
          if (vm.isDetailAccessible(vm.accountSummaryData[0])) {
            SingleProdService.getSingleProductViewData(urlParams, vm.accountSummaryData[0].referenceId).
            then(function(data) {
              vm.accountDetailloadingClass = '';
              if (data.displayMessage) {
                vm.transactionsloadingClass = 'noTransaction';
                vm.transactionerror = data.displayMessage;
                vm.errorFlag = true;
              } else if (data.transactionsResponse === undefined && data.accountDetails === undefined) {
                vm.accountSummaryAccountDetail.amountSymbol = vm.i18n.amountSymbol;
                vm.accountSummaryAccountDetail.percentage = vm.i18n.percentage;
                vm.transactionsloadingClass = 'noTransaction';
                vm.transactionerror = vm.i18n["noTransaction"];
                vm.errorFlag = true;
              } else {
                if (vm.accountSummaryData[0].category === 'DDA' || vm.accountSummaryData[0].category ===
                  'SA' || vm.accountSummaryData[
                    0].category === 'MMA' || vm.accountSummaryData[0].category === 'CC' || vm.accountSummaryData[
                    0].category ===
                  'AL' || vm.accountSummaryData[0].category === 'HLC' || vm.accountSummaryData[0].category ===
                  'HIL' || vm.accountSummaryData[
                    0].category === 'MLA' || vm.accountSummaryData[0].category === 'ILA') {
                  vm.accountSummaryAccountDetail = data.transactionsResponse.transactions;
                } else {
                  vm.accountSummaryAccountDetail = data.accountDetails;
                }
                vm.accountSummaryAccountDetail.amountSymbol = vm.i18n.amountSymbol;
                vm.accountSummaryAccountDetail.percentage = vm.i18n.percentage;
                vm.transactionsloadingClass = '';

                vm.accountSummaryAccountDetail.secondaryData = TemplateSelectionFactory
                  .formatSecondaryData(vm.accountSummaryData[0], vm.accountSummaryAccountDetail, vm.i18n);
                vm.accountDetailloadingClass = '';
                vm.showSecondaryData = TemplateSelectionFactory
                  .showSecondaryData(vm.accountSummaryAccountDetail.secondaryData);

                if (vm.accountSummaryData[0].category === 'DDA' || vm.accountSummaryData[0].category ===
                  'SA' || vm.accountSummaryData[
                    0].category === 'MMA' || vm.accountSummaryData[0].category === 'CC' || vm.accountSummaryData[
                    0].category ===
                  'AL' || vm.accountSummaryData[0].category === 'HLC' || vm.accountSummaryData[0].category ===
                  'HIL' || vm.accountSummaryData[
                    0].category === 'MLA' || vm.accountSummaryData[0].category === 'ILA') {
                  vm.accountSummaryTransactionData = SingleProdService
                    .formatDataForSingleProdView(data.transactionsResponse.transactions, urlParams.ProductCategory,
                      vm.i18n);
                } else {
                  vm.accountSummaryTransactionData = SingleProdService
                    .formatDataForSingleProdView(data, urlParams.ProductCategory, vm.i18n);
                }

                if (vm.accountSummaryTransactionData.length === 0) {
                  vm.transactionsloadingClass = 'noTransaction';
                  vm.transactionerror = vm.contentData["ease.core.acctsummary.single.norecent.label"];
                  vm.errorFlag = true;
                } else {
                  vm.transactionsloadingClass = 'yesTransaction';
                }
              }
            }, function(ex) {
              vm.accountDetailloadingClass = '';
              vm.transactionsloadingClass = 'noTransaction';
              vm.transactionerror = vm.i18n["errorTransaction"];
              vm.errorFlag = true;

              throw easeExceptionsService.createEaseException({
                'module': 'summaryModule.controller',
                'function': 'accountSummaryController' + '.getSingleProductViewData',
                'cause': ex
              });
            });
          } else {
            vm.showViewMoreButton = false;
            vm.showSecondaryData = false;
            vm.accountDetailloadingClass = '';
            vm.transactionsloadingClass = 'noTransaction';
            vm.transactionerror = vm.i18n["errorTransaction"];
            vm.errorFlag = true;
          }
        },
        reward: {
          display: function() {
            return (typeof vm.accountSummaryData[0] !== 'undefined' &&
              typeof vm.accountSummaryData[0].reward !== 'undefined' &&
              typeof vm.accountSummaryData[0].reward.rewardsBalanceDisplay !== 'undefined' &&
              vm.accountSummaryData[0].reward.rewardsBalanceDisplay);
          },
          isCash: function() {
            return (vm.reward.display() && typeof vm.accountSummaryData[0].reward.currency !== 'undefined' &&
              vm.accountSummaryData[0].reward.currency === vm.i18n.rwdCurrencyCash);
          },
          amount: function() {
            return (vm.reward.display() && typeof vm.accountSummaryData[0].reward.balance !== 'undefined') ?
              vm.accountSummaryData[0].reward.balance : '';
          },
          category: function() {
            var currency = (vm.reward.display() &&
                typeof vm.accountSummaryData[0].reward.currency !== 'undefined') ?
              vm.accountSummaryData[0].reward.currency : '';
            var categoryObj = {};
            categoryObj[vm.i18n.rwdCurrencyCash] = vm.i18n.rwdCash,
              categoryObj[vm.i18n.rwdCurrencyMiles] = vm.i18n.rwdMiles,
              categoryObj[vm.i18n.rwdCurrencyPoints] = vm.i18n.rwdPoints
            return currency === '' ? '' : categoryObj[currency];
          },
          ariaLabel: function() {
            return vm.reward.isCash() ? vm.getAriaTileMsg(vm.i18n.ariaMsg.tile.creditcardDetailData1, vm.i18n.rwdCash,
                vm.i18n.amountSymbol, arguments[0], arguments[1], arguments[2], false) :
              vm.getAriaTileMsg(vm.i18n.ariaMsg.tile.creditcardDetailDataMilesPoints, vm.reward.category(),
                arguments[0],
                arguments[2], false);
          }
        }
      });

      if (vm.accountSummaryData.length === 1) {
        if ((featureToggleData[EaseConstant.features.coafSingleAccountTransactionViewFeature]) &&
          (vm.accountSummaryData[0].category === 'AL')) {
          vm.getSingleProductViewData();
        } else if (vm.accountSummaryData[0].category !== 'AL') {
          vm.getSingleProductViewData();
        }
      }

      vm.greeting = messagingService.getGlobalMessage();
      $scope.$on('UPDATE_GLOBAL_MSG',
        function(e, globalMsg, subMsg, index) {
          if (globalMsg !== null) {
            vm.greeting = globalMsg;
          } else if (subMsg !== null) {
            vm.accountSummaryData[index].paymentdueMsg = subMsg;
          }
        });

      vm.isBankAccount = function() {
        return _.find(vm.accountSummaryData, function(account) {
          return account.category === 'MMA' || account.category === 'SA' || account.category === 'DDA';
        });
      };
    }

    accountSummaryController.$inject = ["$scope", "$rootScope", "$state", "$window", "EaseConstant",
      "ContentConstant",
      "contentDataAccountSummary", "EaseConstantFactory", "accountSummaryData", "i18nData", "easeTemplates",
      "easePartials",
      "TemplateSelectionFactory", "EASEUtilsFactory", "pubsubService", "easeExceptionsService", "EaseModalService",
      "EaseLocalizeService", "messagingService", "transferState", "featureToggleFactory", "RetailAccountLinks",
      "$locale", "SingleProdService", "errorContentData"
    ];

    summaryModule.controller('DisclaimerController', ['$state', 'contentDataAccountSummary',
      'TemplateSelectionFactory',
      'pubsubService',
      function($state, contentDataAccountSummary, TemplateSelectionFactory, pubsubService) {
        var vm = this;

        vm.contentData = TemplateSelectionFactory.getContentData();

        angular.extend(vm, {
          modalType: 'disclaimerModal',
          modalClass: 'icon-check',
          initClose: false,
          hello: 'hello',

          close: function() {
            pubsubService.pubsubPageView({
              scDLLevel1: 'ease',
              scDLLevel2: 'account summary',
              scDLLevel3: '',
              scDLLevel4: '',
              scDLLevel5: '',
              scDLCountry: 'us',
              scDLLanguage: 'english',
              scDLSystem: 'ease_web',
              scDLLOB: ''
            });
            $state.go("^");
          }
        });

        pubsubService.pubsubTrackAnalytics({
          taxonomy: {
            level1: 'ease',
            level2: 'accountSummary',
            level3: 'COFI terms and conditions',
            level4: '',
            level5: '',
            country: 'us',
            language: 'english',
            system: 'ease_web'
          },
          lob: 'investing'
        });

      }
    ]);
  });

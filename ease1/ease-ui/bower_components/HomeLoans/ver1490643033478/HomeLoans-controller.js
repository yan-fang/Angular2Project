define(['angular'], function (angular) {
  'use strict';
  var HomeLoansController = angular.module('HomeLoansModule.controller', ['EaseProperties', 'easeAppUtils',
    'angular-lo-dash', 'UMMPaymentModule', 'easeUIComponents', 'HomeLoansConstantsModule']);
  HomeLoansController.controller('HomeLoansController', ['$scope', '$state', 'accountDetailsData', '$controller',
    'HomeLoansProperties', 'UmmPaymentFactory', 'i18nData', 'EaseLocalizeService',
    'homeLoansAccountDetailsService', 'HomeLoansUtils', 'easeUIModalService', '$window','HomeLoansMoreServicesConstants' ,
    function (
      $scope, $state, accountDetailsData, $controller, HomeLoansProperties, UmmPaymentFactory
      , i18nData, EaseLocalizeService, homeLoansAccountDetailsService, HomeLoansUtils, easeUIModalService, $window, HomeLoansMoreServicesConstants) {
      homeLoansAccountDetailsService.setI18n(i18nData);
      $controller('AccountDetailsParentController', {
        $scope            : $scope,
        accountDetailsData: accountDetailsData
      });
      HomeLoansProperties.productSplit($state.params.accountDetails.lineOfBusiness, accountDetailsData.accountDetails);
      var productProperties = HomeLoansProperties.getProperties();
      var currentTransactionYear = HomeLoansProperties.getShownYear();
      var vm = this;
      angular.extend($scope, productProperties, {
        i18nHL                    : i18nData,
        focusId                   : '',
        hlController              : $scope,
        dynamicValues             : accountDetailsData.accountDetails.level1Values,
        dynamicLabels             : accountDetailsData.accountDetails.labels,
        UmmPaymentFactory         : UmmPaymentFactory,
        inProgress                : false,
        isRecurringPaymentEligible: (accountDetailsData.accountDetails.mortgageAccount != null) ? accountDetailsData.accountDetails.mortgageAccount.isRecurringPaymentEligible : accountDetailsData.accountDetails.homeEquityLoanAccount.isRecurringPaymentEligible,
        goToLoanDetailsModal      : function (evt) {
          console.log('goToLoanDetailsModal function called');
          // $scope.focusId = evt.target.id;
          var loanDetailsLink = document.getElementById('loanDetailsLink');
          homeLoansAccountDetailsService.setLoanDetailsLinkFocus(loanDetailsLink)
          $state.go(productProperties.loanDetailsModalState);
        },
        goToStatementsModal       : function (evt) {
          console.log('goToStatementsModal function called');
          //  $scope.focusId = evt.target.id;
          $state.go('HomeLoansDetails.transactions.statementOpen');
        },
        goToPaymentDetailsModal   : function (evt) {
          console.log('goToPaymentDetailsModal function called');
          // $scope.focusId = "paymentDetailsModal";
          var paymentDetailsModalIdFocus = document.getElementById('paymentDetailsModal');
          homeLoansAccountDetailsService.setPaymentDetailsModalFocus(paymentDetailsModalIdFocus)
          $state.go(productProperties.paymentDetailsModalState);
        },
        goToHelocTransfersModal   : function (evt) {
          console.log('goToHelocTransfersModal function called');
          $state.go("HomeLoansDetails.transfer");
        },
        PayNow                    : function (evt, start) {
          console.log(homeLoansAccountDetailsService.getProgress());
          if (!homeLoansAccountDetailsService.getProgress() && start) {
            $scope.inProgress = true;
            homeLoansAccountDetailsService.setDisableMakeAPayment(true);
            homeLoansAccountDetailsService.setLoadingPayment('loading');
            //Site Catalyst analytics
            homeLoansAccountDetailsService.buttonAnalyticsTracking('Home loans L2 Hero:button');
            homeLoansAccountDetailsService.setAccountDetailsData(accountDetailsData);
            var payment = {
              'category'   : $scope.AccountType,
              'referenceId': accountDetailsData.accountReferenceId
            };
            homeLoansAccountDetailsService.setPaymentSelectedOptions(null);
            var makeAPaymentButtonDoc = document.getElementById('makeAPaymentButton');
            homeLoansAccountDetailsService.setMakeAPaymentModalFocus(makeAPaymentButtonDoc);
            $state.go('HomeLoanPayment',
              {
                'lineOfBusiness'    : $scope.AccountType,
                'accountReferenceId': accountDetailsData.accountReferenceId,
                'payment'           : {isAccountDataAvailable: false, lineOfBusiness: $scope.AccountType}
              });
          }
        },
        loadingPayment            : function () {
          return homeLoansAccountDetailsService.getLoadingPayment();
        },
        goToEditPaymentModal      : function (transaction) {
          if (!homeLoansAccountDetailsService.getProgress()) {
            //homeLoansAccountDetailsService.launchUmmPayment(payment, true);
            var paymentConfimationMessage = {
              "paymentDate"               : transaction.effectiveDate,
              "totalPaymentReceivedAmount": transaction.transactionAmount,
              "additionalPrincipalAmount" : transaction.additionalPrincipalAmount,
              "recurringPaymentId"        : transaction.transactionId,
              "transactionId"             : transaction.transactionId, // TODO update after the OL change.
              "fromAccountNumber"         : transaction.fromAccountNumber,
              "accountName"               : transaction.bankName,
              "isExternal"                : transaction.externalPayment,
              "paymentType"               : (transaction.recurringPaymentDraft == true) ? 'recurring' : 'onetime',
              "fromTransactions"          : true,
              "editFlow"                  : true
            };
            var amntDuePrinc = (transaction.recurringPaymentDraft) ?i18nData.payment.monthlyAmntDuePrincipal:i18nData.payment.totDuePrinc;
            var principalExists = transaction.additionalPrincipalAmount != null && transaction.additionalPrincipalAmount > 0;
            var paymentSelectedOptions = {
              "fromAccount"    : transaction.fromAccountNumber,
              "additionalInput": transaction.additionalPrincipalAmount,
              "paymentType"    : (transaction.recurringPaymentDraft == true) ? 'recurring' : 'onetime',
              "fromTransactions" : true,
              "fromAbaNumber" : transaction.bankAbaNumber
            };
            if(principalExists){
              if(transaction.additionalPrincipalAmount == transaction.transactionAmount){
                paymentSelectedOptions.amountOption = 'principal_Only';
              } else {
                paymentSelectedOptions.amountOption = amntDuePrinc;
              }
            } else {
              paymentSelectedOptions.amountOption = (transaction.recurringPaymentDraft)?i18nData.payment.monthlyAmnt:i18nData.payment.amountDueOnly;
            }
            homeLoansAccountDetailsService.setPaymentSelectedOptions(paymentSelectedOptions);
            homeLoansAccountDetailsService.setPaymentsSuccess(paymentConfimationMessage);
            $state.go('HomeLoanPayment',
              {
                'lineOfBusiness'    : $scope.AccountType,
                'accountReferenceId': accountDetailsData.accountReferenceId,
                'payment'           : {isAccountDataAvailable: false, lineOfBusiness: $scope.AccountType}
              });
          }
        },
        goToCancelPaymentModal    : function (transaction, start) {
          console.log(homeLoansAccountDetailsService.getProgress());
          if (!homeLoansAccountDetailsService.getProgress()) {

            //paymentConfirmationMessage
            var paymentConfimationMessage = {
              "paymentDate"               : transaction.effectiveDate,
              "totalPaymentReceivedAmount": transaction.transactionAmount,
              "additionalPrincipalAmount" : transaction.additionalPrincipalAmount,
              "recurringPaymentId"        : transaction.transactionId,
              "transactionId"             : transaction.transactionId, // TODO update after the OL change.
              "fromAccountNumber"         : transaction.fromAccountNumber,
              "accountName"               : transaction.bankName,
              "isExternal"                : transaction.externalPayment,
              "paymentType"               : (transaction.recurringPaymentDraft == true) ? 'recurring' : 'onetime',
              "fromTransactions"          : true
            };
            homeLoansAccountDetailsService.setPaymentsSuccess(paymentConfimationMessage);
            homeLoansAccountDetailsService.paymentCancel();
          }
        },
        isMakeAPaymentDisabled    : function () {
          return homeLoansAccountDetailsService.getDisableMakeAPayment();
        },
        paymentInProgress         : function () {
          return homeLoansAccountDetailsService.setInProgress(true);
        },
        goToPayments              : function () {
          // make this below call and on success call easeUImOdal Service.
          $state.wannaPay = true;
          $state.go('HomeLoanPayment',
            {
              'lineOfBusiness'    : $scope.AccountType,
              'accountReferenceId': accountDetailsData.accountReferenceId,
              'payment'           : {isAccountDataAvailable: true, lineOfBusiness: $scope.AccountType}
            });
        }
      });
      //Initialize the template in the parent controller, AccountDetailsParentController
      $scope.InitilizeTemplate();
      var loandata=i18nData.extensibility.loanDetails;
      var featuresEnabled = accountDetailsData['features'];
      console.log(featuresEnabled);
      console.log($scope.AccountType );

      var dataItems = [];
      var loandetails=
      {
        "icon": "icon-info-circle",
        "shortTitle" : "Details",
        "title" : loandata,
        "attrs": [{"key": "id","val": "loanDetailsLink"},{"key": "aria-label","val": i18nData.extensibility.loanDetails},
          {"key": "data-ng-click","val": "goToLoanDetailsModal()"}]};
      var statmentdetails=
      {"icon": "icon-document","shortTitle" : i18nData.extensibility.downloadStatements,"title" : i18nData.extensibility.downloadStatements,
        "attrs": [{"key": "id","val": "statements"},
          {"key": "aria-label","val": i18nData.extensibility.downloadStatements},
          {"key": "data-ng-click","val": "goToStatementsModal()"}]};
      var heloctransfer=
      {"icon": "icon-cycle-hl","title" : i18nData.extensibility.helocPayment,
        "attrs": [{"key": "id","val": "HELOC Transfer"},{"key": "aria-label","val": i18nData.extensibility.helocPayment},
          {"key": "data-ng-click","val": "goToHelocTransfersModal()"}]};
      var moreacctservices=   {"icon": "icon-circle-add","title" : i18nData.extensibility.moreAccountServices,
        "attrs": [{"key": "id","val": "more-accout-services"},{"key": "aria-label","val":i18nData.extensibility.moreAccountServices},
          {"key": "ng-show","val": true }, {"key": "data-ng-click","val": "vm.handleMoreAccountServices()"}]};
      var moreacctservices2=   {"icon": "icon-circle-add","shortTitle" : "More" ,"title" : i18nData.extensibility.moreAccountServices,
        "attrs": [{"key": "id","val": "more-accout-services"},{"key": "aria-label","val": i18nData.extensibility.moreAccountServices},
          {"key": "ng-show","val": true }, {"key": "data-ng-click","val": "vm.handleMoreAccountServices()"}]};
      var escrow=  {"icon": "icon-moneybag","title" : i18nData.extensibility.escrowDetails,
        "attrs": [{"key": "id","val": "escrowDetailsLink"},{"key": "aria-label","val": "escrowDetails"},
          {"key": "data-ng-click","val": "escrow()"}]};
      var autopay=    {"icon": "icon-cycle","shortTitle" : "Pay",
        "title" : i18nData.extensibility.manageAutoPay,"attrs": [{"key": "id","val": "autoPay"},
          {"key": "aria-label","val": i18nData.extensibility.manageAutoPay},
          {"key": "data-ng-click","val": "autopayfn()"}]};
      if($scope.AccountType == 'HLC')
      {
        if(featuresEnabled.loanInformationEnabled)
        {
          dataItems.push(loandetails);
        }
        if(featuresEnabled.statementsEnabled)
        {
          dataItems.push(statmentdetails);
        }
        if(featuresEnabled.helocTransfersEnabled)
        {
          dataItems.push(heloctransfer);
        }
        else
        {
          dataItems.push(autopay);
        }



        dataItems.push(moreacctservices);
        dataItems.push(moreacctservices2);


      }
      else if($scope.AccountType == 'HIL')
      {
        if(featuresEnabled.loanInformationEnabled)
        {
          dataItems.push(loandetails);
        }
        if(featuresEnabled.statementsEnabled)
        {
          dataItems.push(statmentdetails);
        }

        dataItems.push(autopay);

        dataItems.push(moreacctservices);
        dataItems.push(moreacctservices2);

      }
      else
      {
        if(featuresEnabled.loanInformationEnabled)
        {
          dataItems.push(loandetails);
        }
        if(featuresEnabled.statementsEnabled)
        {
          dataItems.push(statmentdetails);
        }
        if(featuresEnabled.escrowDetailsEnabled)
        {
          dataItems.push(escrow);
        }
        else
        {
          dataItems.push(autopay);
        }

        dataItems.push(moreacctservices);
        dataItems.push(moreacctservices2);

      }

      $scope.json = {
        "categories": [{
          "name": "Loan Management",
          "links": [
            {
              "name" : "Manage Automatic Payments",
              "menu-attrs" : [{
                "key" : "id",
                "val" : "manageautopay"
              },{
                "key" : "ng-show",
                "val" : true
              }],
              "attrs": [

                {
                  "key": "data-ng-click",
                  "val": "autoPay()"
                }
              ]
            },
            {
              "name": " Add Payment Account",
              "attrs": [
                {
                  "key": "id",
                  "val": "Add Payment Account2"
                },
                {
                  "key" : "ng-show",
                  "val" : false
                },
                {
                  "key": "data-ng-click",
                  "val": "test()"
                }
              ]
            },
            {
              "name": "HELOC Transfer",
              "attrs": [
                {
                  "key": "id",
                  "val": "HELOC Transfer"
                },
                {
                  "key" : "ng-show",
                  "val" : $scope.AccountType == 'HLC' && featuresEnabled.helocTransfersEnabled
                },
                {
                  "key": "data-ng-click",
                  "val": "heloctransfer()"
                }
              ]
            },
            {
              "name": "Payment Assistance Information",
              "attrs": [
                {
                  "key": "id",
                  "val": "PaymentAssistanceInformation"
                },
                {
                  "key" : "ng-show",
                  "val" : true
                },
                {
                  "key": "data-ng-click",
                  "val": "paymentAssistanceInformation()"
                }
              ]
            }
          ]
        },
          {
            "name": "Documents",
            "links": [
              {
                "name": "Request Documents",
                "attrs": [
                  {
                    "key": "id",
                    "val": "Request Documents"
                  },
                  {
                    "key" : "ng-show",
                    "val" : featuresEnabled.requestDocsEnabled
                  },
                  {
                    "key": "data-ng-click",
                    "val": "requestDocs()"
                  }
                ]
              },
              {
                "name": "Request Payoff Quote",
                "attrs": [
                  {
                    "key": "id",
                    "val": "Request Payoff Quote"
                  },
                  {
                    "key" : "ng-show",
                    "val" : featuresEnabled.payoffQuotesEnabled
                  },
                  {
                    "key": "data-ng-click",
                    "val": "payOff()"
                  }
                ]
              },
              {
                "name": "View Statements",
                "attrs": [
                  {
                    "key": "id",
                    "val": "View Statements"
                  },
                  {
                    "key" : "ng-show",
                    "val" : featuresEnabled.statementsEnabled
                  },
                  {
                    "key": "data-ng-click",
                    "val": "statementGo()"
                  }
                ]
              }
              ,
              {
                "name": i18nData.extensibility.escrowDetails,
                "attrs": [
                  {
                    "key": "id",
                    "val": "escrow"
                  },
                  {
                    "key" : "ng-show",
                    "val" : $scope.AccountType == 'MLA' && featuresEnabled.escrowDetailsEnabled
                  },
                  {
                    "key": "data-ng-click",
                    "val": "escrow()"
                  }
                ]
              }
            ]
          },
          {
            "name": "Account Management:",
            "links": [
              {
                "name": "Get Access Code",
                "attrs": [
                  {
                    "key": "id",
                    "val": "GetAccessCode"
                  },
                  {
                    "key" : "ng-show",
                    "val" : true
                  },
                  {
                    "key": "data-ng-click",
                    "val": "getAccessCode()"
                  }
                ]
              },

              {
                "name": "Update Privacy Settings",
                "attrs": [
                  {
                    "key": "id",
                    "val": "UpdatePrivacySettings"
                  },
                  {
                    "key" : "ng-show",
                    "val" : true
                  },
                  {
                    "key": "data-ng-click",
                    "val": "getPrivacySettings()"
                  }
                ]
              },
              {
                "name": "Update Paperless Settings ",
                "attrs": [
                  {
                    "key": "id",
                    "val": "UpdatePaperlessSettings"
                  },
                  {
                    "key" : "ng-show",
                    "val" : true
                  },
                  {
                    "key": "data-ng-click",
                    "val": "getPaperLessSettings()"
                  }
                ]
              }
            ]
          }
        ],

        "extensibilityBarMenuItems": dataItems
      };

      $scope.autopayfn=function()
      {
        console.log('comging to auto pay')
        $state.go('HomeLoanPayment');
      }
      $scope.escrow = function(){
        // $scope.close();
        //  alert("coming to escrow")
        $state.go('HomeLoansDetails.transactions.escrowDetails');
      }
      $scope.productType = '/ease-ui/bower_components/HomeLoans/ver1490643033478/partials/HomeLoans-detail.html';
      $scope.transactionType = '/ease-ui/bower_components/HomeLoans/ver1490643033478/partials/HomeLoans-transactions.html';
      //Remove the loading animation when changing state. Also, log the page view when state is changed successfully.
      $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        // Special case to not log account details track analytics from make payment / edit payment confirmation pages
        if ((toState.name === 'HomeLoansDetails.transactions')
          && (fromState.name == 'HomeLoanPayment')
          && homeLoansAccountDetailsService.getIsConfirm()) {
          homeLoansAccountDetailsService.doNothing();
        }
        // Special case to not log account details track analytics from make payment / edit payment cancel pages
        else if ((toState.name === 'HomeLoansDetails.transactions')
          && (fromState.name == 'HomeLoansDetails.transactions')
          && homeLoansAccountDetailsService.getIsConfirm()) {
          homeLoansAccountDetailsService.doNothing();
        }
        else if (toState.name === 'HomeLoansDetails.transactions') {
          HomeLoansUtils.landingPageEvent();
        }
        else if (toState.name === 'HomeLoansDetails.transactions.pay') {
          $scope.loadingPayment = '';
        }
      });
    }]);
  HomeLoansController.controller('HomeLoansTransactionController', function ($scope, $controller) {
    $controller('AccountDetailsTransactionController', {
      $scope            : $scope,
      accountDetailsData: $scope.$parent.accountDetailsData
    });
  });
  HomeLoansController.controller('homeLoansErrorController', function ($scope, $state, $stateParams) {
    var vm = this;
    angular.extend(vm, {
      initClose  : false,
      modalType  : 'error',
      modalClass : 'icon-warning',
      errorReason: $stateParams.errorReason,
      close      : function () {
        $state.go('HomeLoansDetails.transactions');
      }
    });
  });
  HomeLoansController.controller('modalController', ['$scope','close','$state', '$window','$location', 'HomeLoansMoreServicesConstants', function($scope,close,$state,$window, $location, HomeLoansMoreServicesConstants) {
    $scope.close = close
    $scope.test = function(){
      alert("Dummy method from modal controller")
    }
    $scope.statementGo = function(){
      $scope.close();
      //alert("Dummy method from modal controller")
      $state.go('HomeLoansDetails.transactions.statementOpen');
    }
    $scope.autoPay = function(){
      $scope.close();
      //alert("Dummy method from modal controller")
      $state.go('HomeLoanPayment');
    }
    $scope.requestDocs = function(){
      $scope.close();
      //alert("Dummy method from modal controller")
      $state.go('HomeLoansDetails.transactions.requestDocumentServicesL2');
    }


    $scope.payOff = function(){
      $scope.close();
      //alert("Dummy method from modal controller")
      $state.go('HomeLoansDetails.transactions.payOffQuoteModal');
    }

    $scope.heloctransfer = function(){
      $scope.close();
      //alert("Dummy method from modal controller")
      $state.go("HomeLoansDetails.transfer");
    }
    $scope.paymentAssistanceInformation = function(){
      //$scope.close();
      $window.open("https://www.capitalone.com/home-loans/assistance/?Log=1&EventType=Link&ComponentType=T&LOB=MTS%3A%3ALCTMJBE8Z&PageName=Contact+Us+FAQ&PortletLocation=4%3B4-12-col%3B2-2-3-1-1&ComponentName=FAQ-olb-small-business-home-loans%3B20&ContentElement=7%3BHomeowner%27s+Assistance&TargetLob=MTS%3A%3ALM47OV15&TargetPageName=Home+Loan+Assistance&referer=https%3A%2F%2Fwww.capitalone.com%2Fcontact%2Ffaq");
    }
    $scope.getAccessCode = function(){
      $scope.close();
      var currentFullState = encodeURIComponent($location.path());
      var accessCodeURL = HomeLoansMoreServicesConstants.accessCodeUrl;
      var queryPrefix = accessCodeURL.indexOf('?') === -1 ? '?' : '&';
      console.log("******** currentFullState =" + currentFullState);
      console.log("******** queryPrefix =" + queryPrefix);
      console.log("****** HomeLoansMoreServicesConstants =" + HomeLoansMoreServicesConstants.accessCodeUrl);
      var completeURL = accessCodeURL + queryPrefix + 'easeReturnState='+ currentFullState;
      console.log("****** completeURL=" + completeURL);

      $window.open(completeURL, '_self');
    }
    $scope.getPaperLessSettings = function(){
      $scope.close();
      var currentFullState = encodeURIComponent($location.path());
      var paperlessUrl = HomeLoansMoreServicesConstants.paperlessUrl;
      console.log("******** currentFullState =" + currentFullState);
      console.log("****** HomeLoansMoreServicesConstants =" + HomeLoansMoreServicesConstants.paperlessUrl);
      var completeURL = paperlessUrl + '&easeReturnState='+ currentFullState;
      $window.open(completeURL, '_self');
    }
    $scope.getPrivacySettings = function(){
      $scope.close();
      var currentFullState = encodeURIComponent($location.path());
      var privacySettings = HomeLoansMoreServicesConstants.privacySettings;
      console.log("******** currentFullState =" + currentFullState);
      console.log("****** HomeLoansMoreServicesConstants =" + HomeLoansMoreServicesConstants.privacySettings);
      var completeURL = privacySettings + '&easeReturnState='+ currentFullState;
      $window.open(completeURL, '_self');
    }
    $scope.escrow = function(){
      // $scope.close();
      //  alert("coming to escrow")
      $state.go('HomeLoansDetails.transactions.escrowDetails');
    }
  }]);
  return HomeLoansController;
});

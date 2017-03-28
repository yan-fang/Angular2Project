define(['angular'], function (angular) {
  'use strict';
  var moreAccountServiceL2Module = angular.module('accountServicesModule');

  moreAccountServiceL2Module.controller('HLAccountServicesCtrl', function ($scope, $controller, accountDetailsData) {

    var vm = this;
    var featuresEnabled = accountDetailsData['features'];

    var extendedCtrl = angular.extend(this, $controller('AccountServicesCtrl', {$scope: $scope}));
    var i18n = $scope.i18nHL;
    var services = [];
    // adding the feature to the list only if its enabled.
    if(featuresEnabled.statementsEnabled) {
      services.push({
        'action'    : 'HomeLoansDetails.transactions.statementOpen',
        'name'      : i18n.moreAccountServices.statements,
        'isDisabled': false
      });
    }
    if(featuresEnabled.payoffQuotesEnabled) {
      services.push({
        'action': 'HomeLoansDetails.transactions.payOffQuoteModal',
        'name': i18n.moreAccountServices.requestPayoff,
        'isDisabled': false
      });
    }
    if(featuresEnabled.requestDocsEnabled) {
      services.push({
        'action': 'HomeLoansDetails.transactions.requestDocumentServicesL2',
        'name': i18n.moreAccountServices.requestDocs,
        'isDisabled': false
      });
    }
    if(featuresEnabled.recurringPaymentEnabled) {
      services.push({
        'action': 'HomeLoanPayment',
        'name': i18n.moreAccountServices.manageAutoPay,
        'isDisabled': false
      });
    }
    if(featuresEnabled.escrowDetailsEnabled) {
      services.push({
        'action': 'HomeLoansDetails.transactions.escrowDetails',
        'name': i18n.moreAccountServices.escrowDetails,
        'isDisabled': false
      });
    }
    if(featuresEnabled.helocTransfersEnabled) {
      services.push({
        'action': 'HomeLoansDetails.transfer',
        'name': i18n.moreAccountServices.helocTransfers,
        'isDisabled': false
      });
    }
    console.log(vm.services);

    extendedCtrl.accountServicesData = [{
      'title': '',
      'services': services
    }];

  });


  return moreAccountServiceL2Module;
});

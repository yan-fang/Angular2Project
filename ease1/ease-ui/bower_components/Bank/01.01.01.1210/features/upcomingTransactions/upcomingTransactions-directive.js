define(['angular'], function (angular) {
  'use strict';
  angular
    .module('BankModule')
    .directive('upcomingTransaction', ['BankUpcomingConstants', 'BankFiles', function upcomingTransaction(BankUpcomingConstants, BankFiles) {
      return {
        restrict: 'E',
        replace: false,
        bindToController: true,
        controller: 'UpcomingTransactionController',
        controllerAs: 'upcomingCtrl',
        scope: {
          i18nUpcomingTransactions: '='
        },
        link: function (scope, elem, attrs) {
          scope.transactions = [];
          scope.isCardClickable = false;
          scope.isUpcomingButtonActive = false;
          scope.upcomingCardTemplate = scope.upcomingCtrl.getUpcomingTemplate(scope.upcomingCtrl.i18nUpcomingTransactions['ease.bank.upcomingTransactions.card.status.default']);
          getResolvedTransactions(scope, elem);
        },
        templateUrl: BankFiles.getFilePath('features/upcomingTransactions/partials/upcomingTransactions.html')
      };

      function getResolvedTransactions(scope, elem) {
        scope.upcomingCtrl.getUpcomingTransactions().then(
          function upComingResponse(data) {
            scope.transactions = data;
            renderUpcomingTransactionCards(scope, elem);
          }
        );
      }

      function isUpcomingButtonActive(scope) {
        if(scope.transactions.upComingTransactions
          && scope.transactions.upComingListFeatureButtonStatus
          && scope.transactions.upComingTransactions.length > BankUpcomingConstants.defaultNoOfCardsDisplayedInWebView){
          scope.isUpcomingButtonActive = true;
        }
      }

      function renderUpcomingTransactionCards(scope, elem) {
        var upcomingCardTemplate = {};
          upcomingCardTemplate = verifyUpcomingTransactions(scope.upcomingCtrl.i18nUpcomingTransactions, scope.transactions.upcomingTransactionsCount);
          scope.isCardClickable = scope.transactions.upcomingTxnFeatureToggle.viewActionModal;
          scope.upcomingCardTemplate = scope.upcomingCtrl.getUpcomingTemplate(upcomingCardTemplate);
      }

      function verifyUpcomingTransactions(i18nUpcomingTransactions, upcomingTransactionsCount) {
        var upcomingTemplateName = i18nUpcomingTransactions['ease.bank.upcomingTransactions.card.status.addtransactions'];
        switch (upcomingTransactionsCount) {
          case -1:
            upcomingTemplateName = i18nUpcomingTransactions['ease.bank.upcomingTransactions.card.status.failure'];
            break;
          default:
            if (upcomingTransactionsCount > 0) {
              upcomingTemplateName = i18nUpcomingTransactions['ease.bank.upcomingTransactions.card.status.success'];
            }
            break;
        }
        return upcomingTemplateName;
      }

    }]);
});

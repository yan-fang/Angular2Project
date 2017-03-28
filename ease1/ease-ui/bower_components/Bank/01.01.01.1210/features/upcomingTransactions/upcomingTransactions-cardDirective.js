define(['angular'], function (angular) {
  'use strict';
  angular
      .module('BankModule')
      .directive('upcomingCardDirective', function upcomingCardDirective($state, BankFiles, $timeout) {
        return {
          restrict: 'E',
          replace: false,
          bindToController: true,
          controller: 'UpcomingCardController',
          controllerAs: 'upcomingCardCtrl',
          scope: {
            transactions: '=',
            isCardClickable: '=',
            cardIndex: '=',
            i18nUpcomingTransactions: '='
          },
          templateUrl: BankFiles.getFilePath('features/upcomingTransactions/partials/upcomingTransactions-card.html'),
          link: function (scope, elem, attrs, $event) {

            // IF UPCOMING FEATURE IS ENABLED - CHANGE THE CURSOR STYLE TO POINTER
            if (scope.upcomingCardCtrl.isCardClickable && scope.upcomingCardCtrl.transactions.transactionReferenceId) {
              var cardElement = elem[0].getElementsByClassName('upcoming-card-container')[0];
              cardElement.style.cursor = 'pointer';

              cardElement.onclick = function() {
                triggerModal();
              };
            }

            // observe keyboard event
            scope.keyPressedEvent = function(keyEvent) {
              // enter key
              if (keyEvent.which === 13){
                triggerModal();
              }
            };

            function triggerModal(){
              $state.go('BankDetails.transactions.cardDetails', {
                transactionRefId: scope.upcomingCardCtrl.transactions.transactionReferenceId,
                cardIndex : scope.upcomingCardCtrl.cardIndex
              });
            }

          }
        }
      });
});

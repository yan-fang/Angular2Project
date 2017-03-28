define(['angular'], function (angular) {
  'use strict';

  angular
    .module('BankModule')
    .controller('UpcomingCardController', UpcomingCardController);

//----------------------------------- Upcoming Card Controller --------------------------------------------------------

  function UpcomingCardController(UpcomingHelpersFactory) {

    var upComingTransactions = this.transactions;
    var vm = this;

    angular.extend(vm, {
      upComingTransactions: getUpcomingTransactions,
      UpcomingHelpers: UpcomingHelpersFactory
    });

    /**
     * The function returns upcoming transaction object
     * @returns {getUpcomingTransactions|Array|*|upComingTransactions}
     */
    function getUpcomingTransactions() {
      return upComingTransactions;
    }

  }
});

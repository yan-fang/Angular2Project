define(['angular'], function (angular) {
  'use strict';

  angular
    .module('BankModule')
    .controller('UpcomingTransactionController', upcomingTransactionController);

//----------------------------------- Upcoming Transactions Controller ------------------------------------------------

  upcomingTransactionController.$inject = ['BankUpcomingConstants', 'BankUpcomingTransactionsFactory', 'BankPubSubFactory', '$stateParams', '$q', 'BankFiles'];
  function upcomingTransactionController(BankUpcomingConstants, BankUpcomingTransactionsFactory, BankPubSubFactory, $stateParams, $q, BankFiles) {

    var transactions = {};
    var upcomingTransactions = {};
    var templateCollection = {
      'success' : BankFiles.getFilePath('features/upcomingTransactions/partials/upcomingTransactions-cardCarousel.html'),
      'failure' : BankFiles.getFilePath('features/upcomingTransactions/partials/upcomingTransactions-failure.html'),
      'addTransactions' : BankFiles.getFilePath('features/upcomingTransactions/partials/upcoming-addTransactions.html')
    };
    var cardLimit = 9;
    var responsiveCarousel =
      [
        {
          breakpoint: BankUpcomingConstants.tabletBreakpoint,
          settings: {
            draggable: true,
            slidesToShow: BankUpcomingConstants.slidesToShowTab,
            slidesToScroll: BankUpcomingConstants.slidesToShowTab
          }
        },
        {
          breakpoint: BankUpcomingConstants.mobileBreakpoint,
          settings: {
            draggable: true,
            slidesToShow: BankUpcomingConstants.slidesToShowMobile,
            slidesToScroll: BankUpcomingConstants.slidesToShowMobile
          }
        }
      ];

    var tooltipOptions = {
      position: {desktop: 'right', phone: 'top-right'},
      size: 'medium'
    };

    var vm = this;
    angular.extend(vm, {
      responsiveCarousel: responsiveCarousel,
      cardLimit: getCardLimit,
      getUpcomingTransactions: getUpcomingTransactions,
      getUpcomingTemplate: getUpcomingTemplate,
      tooltipOptions: tooltipOptions
    });

    /**
     * It fetches upcoming Transactions
     * @returns {*|deferred.promise|{then, always}}
     */
    function getUpcomingTransactions() {
      var deferred = $q.defer();
      BankUpcomingTransactionsFactory.getUpComingTransactionsRestCall($stateParams.accountReferenceId, BankUpcomingConstants.bankUpComingTransactionsProjectedDays, $stateParams.accountDetails).then(
        function promiseOnSuccess(data) {
          transactions = data;
          upcomingTransactions = transactions.upComingTransactions;
          hasUpcomingTransactions();
          deferred.resolve(data);
        },
        function promiseOnFailure(data) {
          deferred.resolve({});
        }
      );
      return deferred.promise;
    }

    /**
    * It accepts templateName and return respective template from the collection
    * @param templateName
    * @returns {*}
    */
    function getUpcomingTemplate(templateName) {
       if (templateCollection.hasOwnProperty(templateName)) {
          return templateCollection[templateName]
       }
       return BankFiles.getFilePath('features/upcomingTransactions/partials/upcomingTransactions-default.html');
    }

    //----------------------------------- "Private" Functions ------------------------------------------------------------

    /**
     * It verifies the given account number has upcoming transaction and return
     * true if it is available
     *
     * @returns {boolean} - true / false
     */
    function hasUpcomingTransactions(){
      if(upcomingTransactions && upcomingTransactions.length > 0) {
        cardLimit = transactions.upcomingTxnFeatureToggle.viewAddMoreCard ? BankUpcomingConstants.slidesToShowDesktop - 1 : BankUpcomingConstants.slidesToShowDesktop;
      }
    }

    function getCardLimit() {
      return cardLimit;
    }
  }
});

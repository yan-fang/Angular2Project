define([
  'angular'
], function(angular) {
  'use strict';

  angular.module('DebitModule')
         .service('DebitUnlockServices', DebitUnlockServices);

  DebitUnlockServices.$inject = ['$q', '$http', 'EaseConstantFactory', 'EASEUtilsFactory'];

  function DebitUnlockServices($q, $http, EaseConstantFactory, EASEUtilsFactory) {

    var UNLOCK_BUSINESS_EVENT_ID = '50068';

    var getLockedCards = function(accountRefId) {
      var params = _.assign({}, { accountReferenceId: accountRefId } || {}, {
        t: Date.now() // workaround for older IE browsers that cache
      });
      var deferred = $q.defer();
      var url = EaseConstantFactory.baseUrl() + '/Debit/customers/bank-cards';

      $http
        .get(url, {
          params: params,
          headers: {
            EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
            BUS_EVT_ID: UNLOCK_BUSINESS_EVENT_ID
          }
        })
        .then(function(results) {
          var lockedCards = [];
          _.each(results.data.entries, function(card) {
            if (
              card.cardState === 'Activatable' &&
              card.cardStatus === 'ACTIVE' &&
              card.isSuspendedByCustomer
            ) {
              lockedCards.push(card);
            }
          });
          lockedCards = accountRefId ? _.filter(lockedCards, {accountReferenceId: accountRefId}) : lockedCards;
          deferred.resolve(lockedCards);
        })
        .catch(function(error) {
          deferred.reject(error);
        });

      return deferred.promise;
    };

    /**
    * Unlocks card, so it can not be used
    *
    * @param options    {Object}
    *  - accountReferenceId   {string}  Account's reference id that card linked
    *  - cardReferenceId      {string}  Reference id of a card, which will be
    *                                   activated
    * @return {Promise}
    *  - status                       {integer} 201: Success, 400: Error
    *  - message                      {string}  Detailed explanation of the command result
    */
    var unlockCard = function(options) {
      // Heads up: `_.isObject()` is tricky as always
      if (!_.isObject(options)) {
        return $q.reject({message: 'Incorrect parameters', params: options});
      }

      var url = EaseConstantFactory.baseUrl() + '/Debit/card/unlock';

      return $http.post(url, options, {
        headers: {
          EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
          BUS_EVT_ID: UNLOCK_BUSINESS_EVENT_ID
        }
      });
    };

    return {
      getLockedCards: getLockedCards,
      unlockCard: unlockCard
    };
  }
});

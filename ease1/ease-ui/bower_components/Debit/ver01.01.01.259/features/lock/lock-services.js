define([
  'angular'
], function(angular) {
  'use strict';

  angular.module('DebitModule')
         .service('DebitLockServices', DebitLockServices);

  DebitLockServices.$inject = ['$q', '$http', 'EaseConstantFactory', 'EASEUtilsFactory'];

  function DebitLockServices($q, $http, EaseConstantFactory, EASEUtilsFactory) {
    var LOCK_BUSINESS_EVENT_ID = '50067';

    var getActivatedCards = function(accountRefId) {
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
            BUS_EVT_ID: LOCK_BUSINESS_EVENT_ID
          }
        })
        .then(function(results) {
          var activatedCards = [];
          _.each(results.data.entries, function(card) {
            if (
              card.cardState === 'Enabled' &&
              card.cardStatus === 'ACTIVE' &&
              !card.isSuspendedByCustomer
            ) {
              activatedCards.push(card);
            }
          });
          activatedCards = accountRefId ? _.filter(activatedCards, {accountReferenceId: accountRefId}) : activatedCards;
          deferred.resolve(activatedCards);
        })
        .catch(function(error) {
          deferred.reject(error);
        });

      return deferred.promise;
    };

    /**
     * Fetches all last N transactions of a given card
     *
     * @param cardReferenceId    {string}  Card's refenece id
     * @param filters            {object}  Parameters to filter results
     *   - filters.limit	        {Integer} Number of transactions to return.
     *
     * @return {Promise}
     *  {object[]}               Array of bankcardTransaction objects as defined
     *                           in https://pulse.kdc.capitalone.com/docs/DOC-110099
     */
    var getLastTransactions = function(accountReferenceId, filters) {
      var params = _.assign({}, filters || {}, {
        t: Date.now() // workaround for older IE browsers that cache
      });

      if (!accountReferenceId) {
        return $q.reject({
          message: 'Incorrect parameters'
        });
      }

      var url = EaseConstantFactory.baseUrl() +
                '/Debit/account/' +
                encodeURIComponent(accountReferenceId) +
                '/transactions';

      return $http
        .get(url, {
          params: params,
          headers: {
            EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
            BUS_EVT_ID: LOCK_BUSINESS_EVENT_ID
          }
        });
    };


    /**
     * Locks card, so it can not be used
     *
     * @param options    {Object}
     *  - accountReferenceId   {string}  Account's reference id that card linked
     *  - cardReferenceId      {string}  Reference id of a card, which will be
     *                                   activated
     * @return {Promise}
     *  - status                       {integer} 201: Success, 400: Error
     *  - message                      {string}  Detailed explanation of the command result
     */
    var lockCard = function(options) {
      // Heads up: `_.isObject()` is tricky as always
      if (!_.isObject(options)) {
        return $q.reject({message: 'Incorrect parameters', params: options});
      }

      var url = EaseConstantFactory.baseUrl() + '/Debit/card/lock';

      return $http.post(url, options, {
        headers: {
          EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
          BUS_EVT_ID: LOCK_BUSINESS_EVENT_ID
        }
      });
    };

    return {
      getActivatedCards: getActivatedCards,
      getLastTransactions : getLastTransactions,
      lockCard: lockCard
    };
  }
});

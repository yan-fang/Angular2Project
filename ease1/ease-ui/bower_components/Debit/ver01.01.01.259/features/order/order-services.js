define([
  'angular',
  'moment'
], function(angular, moment) {
  'use strict';

  angular.module('DebitModule')
         .service('DebitOrderServices', DebitOrderServices);

  DebitOrderServices.$inject = ['$q', '$http', 'debitConstants', 'EaseConstantFactory', 'EASEUtilsFactory'];

  function DebitOrderServices($q, $http, debitConstants, EaseConstantFactory, EASEUtilsFactory) {

    var ORDER_BUSINESS_EVENT_ID = '50107';

    var getActiveCard = function(accountRefId) {
      var params = _.assign({}, { accountReferenceId: accountRefId } || {}, {
        t: Date.now() // workaround for older IE browsers that cache
      });
      var deferred = $q.defer();
      if (!accountRefId) {
        deferred.reject('No Ref Id present');
      }

      $http
        .get(EaseConstantFactory.baseUrl() + '/Debit/customers/bank-cards', {
          params: params,
          headers: {
            EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
            BUS_EVT_ID: ORDER_BUSINESS_EVENT_ID
          }
        })
        .then(function(results) {
          var activeCard = _.find(results.data.entries, function(entry) {
            var eligibleCardStatus = ['ACTIVE', 'FROZEN', 'NOT ACTIVATED'];

            return entry.accountReferenceId === accountRefId &&
              eligibleCardStatus.indexOf(entry.cardStatus) !== -1;
          });

          deferred.resolve(activeCard);
        })
        .catch(function(error) {
          deferred.reject(error);
        });

      return deferred.promise;
    };

    var getMailingAddress = function(accountReferenceId, cardReferenceId) {
      var params = _.assign({}, {
        accountReferenceId: accountReferenceId,
        cardReferenceId: cardReferenceId,
        fetchMailingInfo: true
      }, {
        t: Date.now() // workaround for older IE browsers that cache
      });
      var deferred = $q.defer();

      $http
        .get(EaseConstantFactory.baseUrl() + '/Debit/card/details', {
          params: params,
          headers: {
            EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
            BUS_EVT_ID: ORDER_BUSINESS_EVENT_ID
          }
        })
        .then(function(result) {
          if (!result || !_.get(result, 'data.entries', []).length) {
            return deferred.reject({
              cause: {
                data: {
                  error: 'No data returned!'
                },
                status: 500
              }
            });
          }
          deferred.resolve(result.data.entries[0].mailingAddressTLNPI || result.data.entries[0].permanentAddressTLNPI);
        });

      return deferred.promise;
    };

    var orderCard = function(options, endpoint) {
      var deferred = $q.defer();
      var headers = {
        EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
        BUS_EVT_ID: ORDER_BUSINESS_EVENT_ID
      };

      $http.post(EaseConstantFactory.baseUrl() + endpoint, options, { headers : headers } )
           .then(function(results) {
             deferred.resolve(results);
           }).catch(function(error) {
             deferred.reject(error);
           });
      return deferred.promise;
    }

    var reissueCard = function(options) {
      return orderCard(options, '/Debit/card/order/reissue');
    };

    var reorderCard = function(options) {
      return orderCard(options, '/Debit/card/order/reorder');
    };

    var isOrderInProgress = function(card, action) {
      if (action === 'reissue' && card.isReissueInProgress) {
        return true;
      } else {
        var now = moment().utc();
        var lastReissueDate = moment(card.lastReissueDate, 'YYYY-MM-DD').utc();
        return now.diff(lastReissueDate, 'hours') <= 72;
      }
    };

    var isActivatedCard = function(card) {
      return !(card.cardState === 'Activatable' && !card.isSuspendedByCustomer);
    };

    return {
      getActiveCard: getActiveCard,
      getMailingAddress: getMailingAddress,
      reissueCard: reissueCard,
      reorderCard: reorderCard,
      isOrderInProgress: isOrderInProgress,
      isActivatedCard: isActivatedCard
    };
  }
});
/*global _:true*/
define(['angular',
        './services/tracking-activation.js',
        './services/tracking-change-pin.js'
      ], function(angular) {
  'use strict';

  angular
    .module('DebitModule')
    .service('DebitSharedServices', ['$window', function($window) {
      function isProd() {
        return $window.location.href.indexOf('myaccounts') !== -1;
      }

      return {
        isProd: isProd
      };
    }])
    .factory('$DebitHttpInterceptor', function() {
      /**
      * Paths & request types to intercept... We should intercept request if it
      * made against our OL, because we don't want to disrupt other modules.
      * paths are regular expressions.
      */
      var toIntercept = {
        GET: [
          /\/Debit\/customers\/bank-cards/gi,
          /\/Debit\/account/gi,
          /\/Debit\/otp/gi
        ],
        POST: [
          /\/Debit\/card/gi,
          /\/Debit\/otp/gi
        ]
      };

      return {
        request: function(config) {
          function testRoute(regexp) {
            return regexp.test(config.url);
          }

          // Match request with the paths to intercept...
          // TODO: correlation id might be something different
          if (toIntercept[config.method] && _.find(toIntercept[config.method], testRoute)) {
            config.headers.clientCorrelationId = _.shuffle(Date.now().toString()).join('');
          }

          return config;
        }
      };
    })
    .config(function($httpProvider) {
      // Immediately register our intercept...
      $httpProvider.interceptors.push('$DebitHttpInterceptor');
    })
    .factory('$DebitApi',['$q', '$http', 'EaseConstantFactory', 'EASEUtilsFactory',
      function($q, $http, EaseConstantFactory, EASEUtilsFactory) {
        var businessEventId = {
          ACTIVATE_CARD: '50038',
          LOCK_CARD: '50067',
          UNLOCK_CARD: '50068',
          CHANGE_PIN: '50071',
          ORDER_CARD: '50107'
        };

        var ret = {
          // Default API Server
          apiServer: EaseConstantFactory.baseUrl()
        };

        /**
        * Sets the API server
        * @param addr {string}  Address of the server
        * @return {object}      $DebitApi's itself
        */
        ret.setApiServer = function(addr) {
          ret.apiServer = addr;
          return ret;
        };

        /**
        * Fetches all debit cards associated with user
        *
        * @param accountRefId          {string}  Filter cards by accountRefId
        * @param featureName           {string}  Feature calling get debit cards
        *
        * @return {Promise}
        *  {object[]}
        *     - availableActions        {array}   array of available action strings
        *     - accountReferenceId      {string}  account reference id
        *     - cardNetworkType         {string}  card type (Visa, Mastercard)
        *     - cardNumberTLNPI         {string}  card number
        *     - cardReferenceId         {string}  card reference id
        *     - cardStatus              {string}  card status (ACTIVE, CLOSED, LOST,
        *                                         STOLEN, FRAUD AUTHPROHIBITED, NOT ACTIVATED)
        *     - cardState               {string}  card state (ENABLED, ACTIVATABLE)
        *     - embossedCustomerName    {string}  customer name
        *     - isActivationFailureLimitExceeded {boolean}
        *     - isNewCustomer           {boolean} indicating if the customer is new or existing
        *     - isSuspendedByCustomer   {boolean} indicating if card is suspended by customer
        *     - isReissueInProgress     {boolean} indicating if card is currently being reissued
        *                                         (from Profile, has a 30-60 hour lag)
        *     - lastReissueDate         {string}  date of last reissue (still need to figure out if
        *                                         null is possible value)
        *     - permanentAddressTLNPI   {object}  address object
        */
        ret.getAllCards = function(accountRefId, featureName) {
          var params = _.assign({}, { accountReferenceId: accountRefId } || {}, {
            t: Date.now() // workaround for older IE browsers that cache
          });
          var deferred = $q.defer();

          $http
            .get(ret.apiServer + '/Debit/customers/bank-cards', {
              params: params,
              headers: {
                EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
                BUS_EVT_ID: businessEventId[featureName]
              }
            })
            .then(function(results) {
              var groupedCards = {};

              _.each(results.data.entries, function(card) {
                card.cardType = card.isNewCustomer === undefined ? 'Retail' : '360';
                _.each(card.availableActions, function(action) {
                  groupedCards[action] = groupedCards[action] || [];
                  groupedCards[action].push(card);
                });
              });

              results.data.groupedEntries = groupedCards;

              deferred.resolve(results);
            })
            .catch(function(error) {
              deferred.reject(error);
            });

          return deferred.promise;
        };

        /**
        * Returns card details for a given cardReferenceID.
        *
        * @param cardReferenceID  {string} Card's reference id
        *
        * @return {Promise}
        *  {object}
        *     - availableActions        {array}   array of available action strings
        *     - accountReferenceId      {string}  account reference id
        *     - cardNetworkType         {string}  card type (Visa, Mastercard)
        *     - cardNumberTLNPI         {string}  card number
        *     - cardReferenceId         {string}  card reference id
        *     - cardStatus              {string}  card status (ACTIVE, CLOSED, LOST,
        *                                         STOLEN, FRAUD AUTHPROHIBITED, NOT ACTIVATED)
        *     - cardState               {string}  card state (ENABLED, ACTIVATABLE)
        *     - embossedCustomerName    {string}  customer name
        *     - isActivationFailureLimitExceeded {boolean}
        *     - isNewCustomer           {boolean} indicating if the customer is new or existing
        *     - isSuspendedByCustomer   {boolean} indicating if card is suspended by customer
        *     - isReissueInProgress     {boolean} indicating if card is currently being reissued
        *                                         (from Profile, has a 30-60 hour lag)
        *     - lastReissueDate         {string}  date of last reissue (still need to figure out if
        *                                         null is possible value)
        *     - permanentAddressTLNPI   {object}  address object
        */
        ret.getCard = function(cardReferenceId) {
          return ret
            .getAllCards()
            .then(function(response) {
              return $q.when({
                data: _.find(response.data.entries, {cardReferenceId: cardReferenceId})
              });
            });
        };

        /**
        * If no PIN is sent, activates card of presumably existing customer,
        * if PIN is present, sets pin and activates card of presumably new
        * customer.
        *
        * @param options    {Object}
        *  - accountReferenceId   {string}  Account's reference id that card linked
        *  - cardReferenceId      {string}  Reference id of a card, which will be
        *                                   activated
        *  - expirationDate       {string}  Expiration date of a card. Format: MM/YY
        *  - cardPinNumberTLPCI   {string}  Card PIN
        *
        * @return {Promise}
        *  - status                       {integer} 201: Success, 400: Error
        *  - message                      {string}  Detailed explanation of the command result
        *  - activationFailureLimitExceed {boolean}
        */
        ret.activateCard = function(options) {
          // Heads up: `_.isObject()` is tricky as always
          if (!_.isObject(options)) {
            return $q.reject({message: 'Incorrect parameters', params: options});
          }

          var headers = {
            EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
            BUS_EVT_ID: businessEventId['ACTIVATE_CARD']
          };
          var url = options.cardPinNumberTLPCI ?
                      ret.apiServer + '/Debit/card/activate/new' :
                      ret.apiServer + '/Debit/card/activate/existing';

          return $http.post(url , options, { headers: headers });
        };

        /**
        * Validates the expiration date of a card.
        *
        * @param options    {Object}
        *  - accountReferenceId   {string}  Account's reference id that card linked
        *  - cardReferenceId      {string}  Reference id of a card, which will be
        *                                   validated
        *  - expirationDate       {string}  Expiration date of a card. Format: MM/YY
        *
        * @return {Promise}
        *  - status                       {integer} 201: Success, 400: Error
        *  - message                      {string}  Detailed explanation of the command result
        *  - activationFailureLimitExceed {boolean}
        */
        ret.validateExpirationDate = function(options) {
          // Heads up: `_.isObject()` is tricky as always
          if (!_.isObject(options)) {
            return $q.reject({message: 'Incorrect parameters', params: options});
          }

          return $http.post(ret.apiServer + '/Debit/card/validation', options, {
            headers: {
              EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
              BUS_EVT_ID: businessEventId['ACTIVATE_CARD']
            }
          });
        };

        /**
        * Changes the pin of the user's debit card via orchestration layer
        *
        * @param options {Object}
        *  - accountReferenceId   {string}  Account's reference id that card linked
        *  - cardReferenceId      {string}  Reference id of a card, which it's pin will
        *                                   be changed.
        *  - cardPinNumber        {string}  New pin - Property must be sanitized before passing through
        *  - from                 {string}  The source (activation or changePin) so we know what CAL event to use
        *
        * @return {Promise}
        *  - status                       {integer} 201: Success, 400: Error
        *  - message                      {string}  Detailed explanation of the command result
        *  - activationFailureLimitExceed {boolean}
        */
        ret.changePin = function(options) {
          // Heads up: `_.isObject()` is tricky as always
          if (!_.isObject(options)) {
            return $q.reject({message: 'Incorrect parameters', params: options});
          }

          // TeaLeaf requires redaction of the PIN which is PCI data
          var sanitizedOptions = options;

          sanitizedOptions.cardPinNumberTLPCI = options.cardPinNumber;
          delete sanitizedOptions.cardPinNumber;

          return $http.post(ret.apiServer + '/Debit/card/changePin', sanitizedOptions, {
            headers: {
              EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
              BUS_EVT_ID: businessEventId['CHANGE_PIN']
            }
          });
        };

        return ret;
      }])
    .factory('DebitPubSubService', ['pubsubService', function(pubsubService) { // NOTE: pubsub, not pubSub, in this case
      var defaultData = {
        taxonomy: {
          level1: 'ease',
          // Regardless of where the modal shows, this is always the level2
          level2: 'account details',
          level3: '',
          level4: '',
          level5: '',
          language: 'english',
          country: 'us',
          system: 'ease_web'
        },
        lob: '360',
        accountAction: 'capital one bank:debit'
      };

      /**
       * This page view is required whenever a user exits a Debit feature
       * and returns back to the account details page.
       *
       * @public
       * @method trackDefaultPageView
       */
      function trackDefaultPageView() {
        var data = _.cloneDeep(defaultData);
        delete data.accountAction;

        pubsubService.pubsubTrackAnalytics(data);
      }

      /**
       * Takes a string hierarchy (foo/bar), building up the data object to be
       * sent to the pubSub system. This abstracts out the naming of the
       * properties from the implementation. Assumes that level 1 is ease and
       * level 2 is debit, since this is the debit application.
       *
       * @public
       * @method trackPageView
       *
       * @param  {String} hierarchy  The slash-delimited tracking levels (3-5)
       */
      function trackPageView(hierarchy) {
        var tokens = (hierarchy || '').split('/');
        var data = { taxonomy: {} };

        _.each(_.take(tokens, 3), function(t, i) {
          data.taxonomy['level' + (i + 3)] = t;
        });

        pubsubService.pubsubTrackAnalytics(_.merge(_.cloneDeep(defaultData), data));
      }

      /**
       * Tracks an event given a name, and optionally, a data object as second
       * parameter (for use in cases like sending dropdown values, etc)
       *
       * @public
       * @method trackEvent
       *
       * @param  {String} name  The event name to track
       * @param  {Object} data  (optional) Additional data to send
       */
      function trackEvent(name, data) {
        var defaultObj = { name: name };

        pubsubService.pubsubTrackAnalytics(_.assign({}, defaultObj, data));
      }

      return {
        trackDefaultPageView: trackDefaultPageView,
        trackPageView: trackPageView,
        trackEvent: trackEvent
      };
    }])
    .factory('DebitTemplatePathProvider', ['debitConstants', function(debitConstants) {
      return {
        getBaseTemplateUrl : function(featureName) {
          return debitConstants.BASE_URL + '/partials/'  + featureName + '/';
        },
        getTemplateUrl : function(featureFile, featureFolder) {
          var featureFolderPath = featureFolder ? featureFolder + '/' : '';
          return debitConstants.BASE_URL + '/partials/' + featureFolderPath  + featureFile + '.html';
        },
        getFeatureTemplateUrl : function(feature, fileName) {
          var file = fileName ? fileName : 'index';
          return debitConstants.BASE_URL + '/features/' + feature  + '/template/' + file + '.html';
        },
        getComponentTemplateUrl : function(component, fileName) {
          var file = fileName ? fileName : 'index';
          return debitConstants.BASE_URL + '/components/' + component  + '/template/' + file + '.html';
        }
      }
    }])
    .factory('DebitLocalization', ['$http', 'debitConstants', function($http, debitConstants) {
      return {
        get: function() {
          return $http.get(debitConstants.BASE_URL + '/utils/i18n/resources-locale_en-us.json');
        }
      }
    }]);
});

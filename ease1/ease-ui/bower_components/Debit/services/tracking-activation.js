/*
  Provides a service with methods for tracking debit activation. Communicates
  with the "pubsub" framework, which sends events to SiteCatalyst. Eventually
  could interact with other tracking third parties.

  NOTE: See Bank's code for BR# BANK-3.00, because it's the click to get into
  this modal.
*/

define([
  'angular'
], function(angular) {
  'use strict';

  angular
    .module('DebitModule')
    .factory('DebitActivationTracking', function(DebitPubSubService) {

      /**
       * The user submits after entering an expiration date.
       * Matches BR# BANK-3.01 and BR# BANK-3.07.
       * This activates the card for all cards, but takes new cards to the set
       * pin page.
       *
       * @public
       * @method submitExpirationDate
       *
       * @param {Object}  data                 Data about the event
       * @param {Boolean} data.isNewCustomer   Is this activation for a new customer?
       * @param {String} data.cardType         What is the card type?
       */
      function submitExpirationDate(data) {
        // Check what the button type is
        var buttonType = data.isNewCustomer || data.cardType === 'Retail'  ? 'next' : 'activate';
        DebitPubSubService.trackEvent(data.cardType + ':debit card activation:' + buttonType + ':button');
      }


      /**
       * Retail Stub for activation
       *
       * @public
       * @method activateRetail
       *
       * @param {Number}  pinValue                 Determine if the request will have a pin
       */
      function activateRetail(pinValue) {
        // Check what the action type is
        var actionType = pinValue ? 'change' : 'keep';
        DebitPubSubService.trackEvent('Retail:debit card activation:' + actionType);
      }

      /**
       * Retail Stub for setting the page
       * @public
       * @method activateRetail
       */
      function setAskRetailPage() {
        DebitPubSubService.trackPageView('Retail:debit card ask retail pin');
      }
      

      /**
       * User sets pin, which to the user appears to be activating the card.
       * Actually, the card was activated when the expiration date was entered.
       * Matches BR# BANK-3.03.
       *
       * @public
       * @method setPin
       */
      function setPin() {
        DebitPubSubService.trackEvent('360:debit card activation:activate:button');
      }

      /**
       * User visits the card selection pane (if they have more than one card).
       * Matches BR# BANK-3.08
       *
       * @public
       * @method selectCardPage
       */
      function selectCardPage() {
        DebitPubSubService.trackPageView('debit card activation/select card');
      }

      /**
       * User visits the expiration date pane (which activates the card).
       * Matches BR# BANK-3.04
       *
       * @public
       * @method expirationDatePage
       * @param {String}  cardType                 Determine the card type
       */
      function expirationDatePage(cardType) {
        DebitPubSubService.trackPageView(cardType + ':debit card activation/enter expiration date');
      }

      /**
       * User visits the set pin modal pane.
       * Matches BR# BANK-3.05.
       *
       * @public
       * @method setPinPage
       * @param {String}  cardType                 Determine the card type
       */
      function setPinPage(cardType) {
        DebitPubSubService.trackPageView(cardType + ':debit card activation/set pin');
      }

      /**
       * User sees the activation confirmation modal pane.
       * Matches BR# BANK-3.06.
       *
       * @public
       * @method confirmationPage
       * @param {String}  cardType                 Determine the card type
       */
      function confirmationPage(cardType) {
        DebitPubSubService.trackPageView(cardType + ':debit card activation/confirmation');
      }

      return {
        submitExpirationDate: submitExpirationDate,
        setPin: setPin,
        activateRetail: activateRetail,
        setAskRetailPage: setAskRetailPage,
        selectCardPage: selectCardPage,
        expirationDatePage: expirationDatePage,
        setPinPage: setPinPage,
        confirmationPage: confirmationPage
      };

    });
});

/*
  Provides a service with methods for tracking debit order. Communicates
  with the "pubsub" framework, which sends events to SiteCatalyst. Eventually
  could interact with other tracking third parties.

  NOTE: See Bank's code for BR# BANK-14.00 because it's the click to get here.
*/

define([
  'angular'
], function(angular) {
  'use strict';

  angular
    .module('DebitModule')
    .factory('DebitOrderTracking', function(DebitPubSubService) {
// page view events
      /**
       * User sees the initial pane to get a new reissued card.
       * Matches BR# BANK-14.01.
       *
       * @public
       * @method getNewCardPage
       */
      function getNewCardPage() {
        DebitPubSubService.trackPageView('order debit card');
      }

      /**
       * User sees the pane to select a reason why they need a reissued card.
       * Matches BR# BANK-14.04.
       *
       * @public
       * @method reissueReasonPage
       */
      function reissueReasonPage() {
        DebitPubSubService.trackPageView('order debit card/reason');
      }

      /**
       * User is asked to confirm their address.
       * Matches BR# BANK-14.06 & BR# BANK-14.29.
       *
       * @public
       * @method confirmAddressPage
       */
      function confirmAddressPage(action) {
        if (action === 'reissue') {
          DebitPubSubService.trackPageView('order debit card/address confirmation');
        } else {
          DebitPubSubService.trackPageView('report missing or damaged card/send your new card');
        }
      }

      /**
       * User is asked to confirm their standard order.
       * Matches BR# BANK-14.22 & BR# BANK-14-37.
       *
       * @public
       * @method standardConfirmationPage
       */
      function standardConfirmationPage(action) {
        if (action === 'reissue') {
          DebitPubSubService.trackPageView('order debit card/standard delivery');
        } else {
          DebitPubSubService.trackPageView('report missing or damaged card/confirm your order/standard');
        }
      }

      /**
       * User is asked to confirm their expedited order.
       * Matches BR# BANK-14.13 & BR# BANK-14.38.
       *
       * @public
       * @method expeditedConfirmationPage
       */
      function expeditedConfirmationPage(action) {
        if (action === 'reissue') {
          DebitPubSubService.trackPageView('order debit card/expedited delivery');
        } else {
          DebitPubSubService.trackPageView('report missing or damaged card/confirm your order/expedite');
        }
      }

      /**
       * User is successful in order for standard delivery.
       * Matches BR# BANK-14.09 & BR# BANK-14.33.
       *
       * @public
       * @method standardSuccessPage
       */
      function standardSuccessPage(action) {
        if (action === 'reissue') {
          DebitPubSubService.trackPageView('order debit card/standard success');
        } else {
          DebitPubSubService.trackPageView('report missing or damaged card/success/standard');
        }
      }

      /**
       * User is successful in order for expedited delivery.
       * Matches BR# BANK-14.24 & BR# BANK-14.34.
       *
       * @public
       * @method expeditedSuccessPage
       */
      function expeditedSuccessPage(action) {
        if (action === 'reissue') {
          DebitPubSubService.trackPageView('order debit card/expedited success');
        } else {
          DebitPubSubService.trackPageView('report missing or damaged card/success/expedite');
        }
      }

      /**
       * User is asked to confirm they want to reorder while a reissue is in progress.
       * Matches BR# BANK-14.43.
       *
       * @public
       * @method reorderWhileReissuePage
       */
      function reorderWhileReissuePage() {
        DebitPubSubService.trackPageView('report missing or damaged card/are you sure/need activation');
      }

      /**
       * User is told they're almost done, but still need to call us (if they
       * are using a different address than what we have on file).
       * Matches BR# BANK-14.12 & BR# BANK-14.35.
       *
       * @public
       * @method almostDonePage
       */
      function almostDonePage(action) {
        if (action === 'reissue') {
          DebitPubSubService.trackPageView('order debit card/almost done');
        } else {
          DebitPubSubService.trackPageView('report missing or damaged card/give us a call');
        }
      }

      /**
       * User is told they have insufficient funds to expedite card,
       * but can proceed with standard delivery.
       * Matches BR# BANK-14.15 & BR# BANK-14.40.
       *
       * @public
       * @method insufficientFundsPage
       */
      function insufficientFundsPage(action) {
        if (action === 'reissue') {
          DebitPubSubService.trackPageView('order debit card/insufficient funds');
        } else {
          DebitPubSubService.trackPageView('report missing or damaged card/insufficient funds');
        }
      }

      /**
       * User is told they are already in progress for order a card.
       * Matches BR# BANK-14.41.
       *
       * @public
       * @method inProgressPage
       */
      function inProgressPage(action) {
        if (action === 'reissue') {
          // currently no event
        } else {
          DebitPubSubService.trackPageView('report missing or damaged card/were on it');
        }
      }


      /**
       * User is told to review their transactions
       * Matches BR# BANK-14.26.
       *
       * @public
       * @method transactionsPage
       */
      function transactionsPage() {
        DebitPubSubService.trackPageView('report missing or damaged card/check transactions');
      }

// below be button click events

      /**
       * User selects the "Yes I have it" (their card) link.
       * Matches BR# BANK-14.02.
       *
       * @public
       * @method haveCard
       */
      function haveCard() {
        DebitPubSubService.trackEvent('yes I have it:button');
      }

      /**
       * User selects the "No I don't have it" (their card) link.
       * Matches BR# BANK-14.03.
       *
       * @public
       * @method dontHaveCard
       */
      function dontHaveCard() {
        DebitPubSubService.trackEvent('no I dont have it:button');
      }

      /**
       * User selects the reason they need to reissue from the dropdown.
       * Matches BR# BANK-14.05.
       *
       * @public
       * @method reasonFilter
       */
      function reasonFilter(reason) {
        DebitPubSubService.trackEvent('filter', {filter: reason});
      }

      /**
       * User selects the "Yes, Use these address" link.
       * Matches BR# BANK-14.07.
       *
       * @public
       * @method useThisAddress
       */
      function useThisAddress() {
        DebitPubSubService.trackEvent('yes this address:button');
      }

      /**
       * User selects the "No, I'm in a different address" link.
       * Matches BR# BANK-14.08.
       *
       * @public
       * @method useDifferentAddress
       */
      function useDifferentAddress() {
        DebitPubSubService.trackEvent('no different address:button');
      }

      /**
       * User selects the "Cancel order" link. (on several screens)
       * Matches BR# BANK-14.14/23/51/52.
       *
       * @public
       * @method cancelOrder
       */
      function cancelOrder() {
        DebitPubSubService.trackEvent('cancel order:button');
      }

      return {
        getNewCardPage: getNewCardPage,
        reissueReasonPage: reissueReasonPage,
        confirmAddressPage: confirmAddressPage,
        standardConfirmationPage: standardConfirmationPage,
        expeditedConfirmationPage: expeditedConfirmationPage,
        standardSuccessPage: standardSuccessPage,
        expeditedSuccessPage: expeditedSuccessPage,
        reorderWhileReissuePage: reorderWhileReissuePage,
        almostDonePage: almostDonePage,
        insufficientFundsPage: insufficientFundsPage,
        inProgressPage: inProgressPage,
        transactionsPage: transactionsPage,
        haveCard: haveCard,
        dontHaveCard: dontHaveCard,
        reasonFilter: reasonFilter,
        useThisAddress: useThisAddress,
        useDifferentAddress: useDifferentAddress,
        cancelOrder: cancelOrder
      };

    });
});

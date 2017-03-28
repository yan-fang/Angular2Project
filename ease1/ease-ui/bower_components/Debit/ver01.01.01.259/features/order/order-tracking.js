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
       * User sees the initial pane to report a missing or damaged card.
       * Matches BR# BANK-14.01.
       *
       * @public
       * @method getNewCardPage
       */
      function getNewCardPage() {
        DebitPubSubService.trackPageView('report a missing or damaged card');
      }

      /**
       * User sees the pane to select a reason why they need a reissued card.
       * Matches BR# BANK-14.04.
       *
       * @public
       * @method reissueReasonPage
       */
      function reissueReasonPage() {
        DebitPubSubService.trackPageView('reissue card/reason');
      }

      /**
       * User is asked to confirm their address
       * Matches BR# BANK-14.06 & BR# BANK-14.32.
       *
       * @public
       * @method confirmAddressPage
       */
      function confirmAddressPage(action) {
        DebitPubSubService.trackPageView(action + ' card/address confirmation');
      }

      /**
       * User is asked to confirm their standard order.
       * Matches BR# BANK-14.09 & BR# BANK-14.33.
       *
       * @public
       * @method standardConfirmationPage
       */
      function standardConfirmationPage(action) {
        DebitPubSubService.trackPageView(action + ' card/confirm your order/standard delivery');
      }

      /**
       * User is asked to confirm their expedited order.
       * Matches BR# BANK-14.10 & BR# BANK-14.34.
       *
       * @public
       * @method expeditedConfirmationPage
       */
      function expeditedConfirmationPage(action) {
        DebitPubSubService.trackPageView(action + ' card/confirm your order/expedited delivery');
      }

      /**
       * User is successful in order for standard delivery.
       * Matches BR# BANK-14.12 & BR# BANK-14.36.
       *
       * @public
       * @method standardSuccessPage
       */
      function standardSuccessPage(action) {
        DebitPubSubService.trackPageView(action + ' card/success/standard delivery');
      }

      /**
       * User is successful in order for expedited delivery.
       * Matches BR# BANK-14.13 & BR# BANK-14.37.
       *
       * @public
       * @method expeditedSuccessPage
       */
      function expeditedSuccessPage(action) {
        DebitPubSubService.trackPageView(action + ' card/success/expedited delivery');
      }

      /**
       * User is told they're almost done, but still need to call us (if they
       * are using a different address than what we have on file).
       * Matches BR# BANK-14.11 & BR# BANK-14.35.
       *
       * @public
       * @method almostDonePage
       */
      function almostDonePage(action) {
        DebitPubSubService.trackPageView(action + ' card/verify address error');
      }

      /**
       * User is told they have insufficient funds to expedite card,
       * but can proceed with standard delivery.
       * Matches BR# BANK-14.17 & BR# BANK-14.38.
       *
       * @public
       * @method insufficientFundsPage
       */
      function insufficientFundsPage(action) {
        DebitPubSubService.trackPageView(action + ' card/insufficient funds');
      }

      /**
       * User is told they are already in progress for order a card.
       * Matches BR# BANK-14.26 & BR# BANK-14.39.
       *
       * @public
       * @method inProgressPage
       */
      function inProgressPage(action) {
        DebitPubSubService.trackPageView(action + ' card/card on the way error');
      }

      /**
       * User is told to review their transactions
       * Matches BR# BANK-14.29.
       *
       * @public
       * @method transactionsPage
       */
      function transactionsPage() {
        DebitPubSubService.trackPageView('reorder card/have you looked at your transactions');
      }

      /**
       * User is shown early exit modal.
       * Matches BR# BANK-14.25 & BR# BANK-14.40.
       *
       * @public
       * @method earlyExitPage
       */
      function earlyExitPage(action) {
        DebitPubSubService.trackPageView(action + ' card/early exit error');
      }

      /**
       * User is shown confirm order although an unactivated card exists.
       * Matches BR# BANK-14.27 & BR# BANK-14.41.
       *
       * @public
       * @method confirmUnactivatedPage
       */
      function confirmUnactivatedPage(action) {
        DebitPubSubService.trackPageView(action + ' card/unactivated card error');
      }

      /**
       * User is shown "We hit a snag" modal.
       * Matches BR# BANK-14.28 & BR# BANK-14.42.
       *
       * @public
       * @method errorPage
       */
      function errorPage(action) {
        DebitPubSubService.trackPageView(action + ' card/we hit a snag screen');
      }

      /**
       * User closes the modal (feature) and returns to account details page
       *
       * @public
       * @method accountDetailsPage
       */
      function accountDetailsPage() {
        DebitPubSubService.trackDefaultPageView();
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
       * User selects the "No it's missing" (their card) link.
       * Matches BR# BANK-14.03.
       *
       * @public
       * @method missingCard
       */
      function missingCard() {
        DebitPubSubService.trackEvent('no its missing:button');
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
       * User selects the "Send it to the address on file" link.
       * Matches BR# BANK-14.07.
       *
       * @public
       * @method useThisAddress
       */
      function useThisAddress() {
        DebitPubSubService.trackEvent('send it to the address on file:button');
      }

      /**
       * User selects the "Send it to a different address" link.
       * Matches BR# BANK-14.08.
       *
       * @public
       * @method useDifferentAddress
       */
      function useDifferentAddress() {
        DebitPubSubService.trackEvent('send it to a different address:button');
      }

      /**
       * User clicks the "standard delivery" button from the insufficient funds modal.
       * Matches BR# BANK-14.18.
       *
       * @public
       * @method standardDeliveryOrder
       */
      function standardDeliveryOrder() {
        DebitPubSubService.trackEvent('use standard delivery:button');
      }

      /**
       * User selects the "Cancel order" link. (on several screens)
       * Matches BR# BANK-14.14-16.
       *
       * @public
       * @method cancelOrder
       */
      function cancelOrder() {
        DebitPubSubService.trackEvent('cancel order:button');
      }

      /**
       * User selects "I Already Reviewed" link.
       * Matches BR# BANK-14.30.
       *
       * @public
       * @method transactionsAlreadyReviewed
       */
      function transactionsAlreadyReviewed() {
        DebitPubSubService.trackEvent('everything looks fine:button');
      }

      /**
       * User selects "Let Me See My Transactions" link.
       * Matches BR# BANK-14.31.
       *
       * @public
       * @method reviewTransactions
       */
      function reviewTransactions() {
        DebitPubSubService.trackEvent('let me see my transactions:button');
      }

      return {
        getNewCardPage: getNewCardPage,
        reissueReasonPage: reissueReasonPage,
        confirmAddressPage: confirmAddressPage,
        standardConfirmationPage: standardConfirmationPage,
        expeditedConfirmationPage: expeditedConfirmationPage,
        standardSuccessPage: standardSuccessPage,
        expeditedSuccessPage: expeditedSuccessPage,
        almostDonePage: almostDonePage,
        insufficientFundsPage: insufficientFundsPage,
        inProgressPage: inProgressPage,
        transactionsPage: transactionsPage,
        earlyExitPage: earlyExitPage,
        confirmUnactivatedPage: confirmUnactivatedPage,
        errorPage: errorPage,
        accountDetailsPage: accountDetailsPage,
        haveCard: haveCard,
        missingCard: missingCard,
        reasonFilter: reasonFilter,
        useThisAddress: useThisAddress,
        useDifferentAddress: useDifferentAddress,
        standardDeliveryOrder: standardDeliveryOrder,
        cancelOrder: cancelOrder,
        transactionsAlreadyReviewed: transactionsAlreadyReviewed,
        reviewTransactions: reviewTransactions
      };

    });
});

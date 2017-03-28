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
    .factory('DebitLockTracking', function(DebitPubSubService) {

      /**
       * User sees the lock modal pane.
       * Matches BR# BANK-5.01.
       *
       * @public
       * @method lockPage
       */
      function lockPage() {
        DebitPubSubService.trackPageView('lock my card');
      }

      /**
       * User sees the lock modal pane.
       * Matches BR# BANK-5.03.
       *
       * @public
       * @method lockPage
       */
      function emptyLockPage() {
        DebitPubSubService.trackPageView('no cards to lock');
      }

      /**
       * User sees the lock confirmation modal pane (card is now locked).
       * Matches BR# BANK-5.02.
       *
       * @public
       * @method lockConfirmationPage
       */
      function lockConfirmationPage() {
        DebitPubSubService.trackPageView('your card is locked');
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

      return {
        lockPage: lockPage,
        emptyLockPage: emptyLockPage,
        lockConfirmationPage: lockConfirmationPage,
        accountDetailsPage: accountDetailsPage
      };

    });
});

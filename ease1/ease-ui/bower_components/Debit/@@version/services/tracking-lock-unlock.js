/*
  Provides a service with methods for tracking debit lock/unlock. Communicates
  with the "pubsub" framework, which sends events to SiteCatalyst. Eventually
  could interact with other tracking third parties.

  NOTE: See Bank's code for the clicks to get into this modal, which aren't
  built as of 5/22/16.
*/

define([
  'angular'
], function(angular) {
  'use strict';

  angular
    .module('DebitModule')
    .factory('DebitLockUnlockTracking', function(DebitPubSubService) {

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
       * User sees the lock confirmation modal pane (card is now locked).
       * Matches BR# BANK-5.02.
       *
       * @public
       * @method lockConfirmationPage
       */
      function lockConfirmationPage() {
        DebitPubSubService.trackPageView('lock my card/your card is locked');
      }

      /**
       * User sees the unlock modal pane.
       * Matches BR# BANK-5.03.
       *
       * @public
       * @method unlockPage
       */
      function unlockPage() {
        DebitPubSubService.trackPageView('unlock my card');
      }

      /**
       * User sees the unlock confirmation modal pane (card is now unlocked).
       * Matches BR# BANK-5.04.
       *
       * @public
       * @method unlockConfirmationPage
       */
      function unlockConfirmationPage() {
        DebitPubSubService.trackPageView('unlock my card/your card is now on');
      }

      return {
        lockPage: lockPage,
        lockConfirmationPage: lockConfirmationPage,
        unlockPage: unlockPage,
        unlockConfirmationPage: unlockConfirmationPage
      };

    });
});

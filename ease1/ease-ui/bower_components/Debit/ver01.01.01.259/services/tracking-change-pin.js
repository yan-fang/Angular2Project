/*
  Provides a service with methods for tracking debit activation. Communicates
  with the "pubsub" framework, which sends events to SiteCatalyst. Eventually
  could interact with other tracking third parties.

  NOTE: See Bank's code for BR# BANK-8.00, because it's the click to get here.
*/

define([
  'angular'
], function(angular) {
  'use strict';

  angular
    .module('DebitModule')
    .factory('DebitChangePinTracking', function(DebitPubSubService) {

      /**
       * User is cleared with OTP and sees the page to enter their new PIN.
       * Matches BR# BANK-8.11.
       *
       * @public
       * @method setPinPage
       */
      function setPinPage() {
        DebitPubSubService.trackPageView('change pin/set a new pin');
      }

      /**
       * User is cleared with OTP and sees the page to enter their new PIN.
       * Matches BR# BANK-8.11.
       *
       * @public
       * @method changePinPage
       */
      function changePinPage() {
        DebitPubSubService.trackPageView('change pin new pin');
      }

      /**
       * User is successful and sees the confirmation page.
       * Matches BR# BANK-8.16.
       *
       * @public
       * @method confirmationPage
       */
      function confirmationPage() {
        DebitPubSubService.trackPageView('change pin/success');
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
        setPinPage: setPinPage,
        changePinPage: changePinPage,
        confirmationPage: confirmationPage,
        accountDetailsPage: accountDetailsPage
      };

    });
});

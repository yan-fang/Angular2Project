/*
  Provides a service with methods for tracking debit otp. Communicates
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
    .factory('DebitOtpTracking', function(DebitPubSubService) {

      var FEATURES = {
        changePin: 'change pin',
        order: 'order debit card'
      }

      /**
       * User sees the initial pane to request sending a one time pin (OTP).
       * Matches BR# BANK-8.01.
       *
       * @public
       * @method sendOtpPage
       */
      function sendOtpPage(feature) {
        DebitPubSubService.trackPageView(FEATURES[feature] + '/send one time pin');
      }

      /**
       * User has no valid contact points so can't proceed
       * Matches BR# BANK-8.02.
       *
       * @public
       * @method noValidContactsPage
       */
      function noValidContactsPage() {
        DebitPubSubService.trackPageView('No valid contact points');
      }
      /**
       * User sees the pane to enter the OTP which they received.
       * Matches BR# BANK-8.06.
       *
       * @public
       * @method enterOtpPage
       */
      function enterOtpPage(feature) {
        DebitPubSubService.trackPageView(FEATURES[feature] + '/enter code');
      }

      /**
       * User requests the OTP be sent.
       * Matches BR# BANK-8.04.
       *
       * @public
       * @method sendOtp
       */
      function sendOtp() {
        DebitPubSubService.trackEvent('Send Verification Code:link');
      }

      /**
       * User requests the OTP be sent.
       * Matches BR# BANK-8.0.
       *
       * @public
       * @method sendOtp
       */
      function sendOtp() {
        DebitPubSubService.trackEvent('Send Verification Code:link');
      }

      /**
       * User selects the "already have an otp" link.
       * Matches BR# BANK-8.05.
       *
       * @public
       * @method alreadyHaveOtp
       */
      function alreadyHaveOtp() {
        DebitPubSubService.trackEvent('I Already Have a Code:link');
      }

      /**
       * User asks for the OTP to be resent.
       * Matches BR# BANK-8.10.
       *
       * @public
       * @method resendOtp
       */
      function resendOtp() {
        DebitPubSubService.trackEvent('Resend Verification Code:link');
      }

      return {
        noValidContactsPage: noValidContactsPage,
        sendOtpPage: sendOtpPage,
        enterOtpPage: enterOtpPage,
        sendOtp: sendOtp,
        alreadyHaveOtp: alreadyHaveOtp,
        resendOtp: resendOtp
      };

    });
});

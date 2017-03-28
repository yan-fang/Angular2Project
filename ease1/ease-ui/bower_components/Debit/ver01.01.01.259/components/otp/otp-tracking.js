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
        order: 'report a missing or damaged card'
      };

      /**
       * User sees the initial pane to request sending a one time pin (OTP).
       * Matches BR# BANK-14.23.
       *
       * @public
       * @method sendOtpPage
       */
      function sendOtpPage(feature) {
        DebitPubSubService.trackPageView(FEATURES[feature] + '/otp');
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
       * Matches BR# BANK-14.24.
       *
       * @public
       * @method enterOtpPage
       */
      function enterOtpPage(feature) {
        DebitPubSubService.trackPageView(FEATURES[feature] + '/enter code');
      }

      /**
       * User requests the OTP be sent.
       * Matches BR# BANK-14.19.
       *
       * @public
       * @method sendOtp
       */
      function sendOtp() {
        DebitPubSubService.trackEvent('send code:link');
      }

      /**
       * User selects the "already have an otp" link.
       * Matches BR# BANK-14.20.
       *
       * @public
       * @method alreadyHaveOtp
       */
      function alreadyHaveOtp() {
        DebitPubSubService.trackEvent('already have code:link');
      }

      /**
       * User asks for the OTP to be resent.
       * Matches BR# BANK-14.22.
       *
       * @public
       * @method resendOtp
       */
      function resendOtp() {
        DebitPubSubService.trackEvent('resend code:link');
      }

      /**
       * User clicks "submit code" link.
       * Matches BR# BANK-14.21.
       *
       * @public
       * @method validateOtp
       */
      function validateOtp() {
        DebitPubSubService.trackEvent('submit code:link');
      }

      return {
        noValidContactsPage: noValidContactsPage,
        sendOtpPage: sendOtpPage,
        enterOtpPage: enterOtpPage,
        sendOtp: sendOtp,
        alreadyHaveOtp: alreadyHaveOtp,
        resendOtp: resendOtp,
        validateOtp: validateOtp
      };
    });
});

define([
  'angular'
], function(angular) {
  'use strict';

  angular.module('DebitModule')
         .service('DebitOtpServices', DebitOtpServices);

  DebitOtpServices.$inject = ['$q', '$http', '$window', 'debitConstants', 'EaseConstantFactory',
                              'DebitSharedServices', 'EASEUtilsFactory'];
  function DebitOtpServices($q, $http, $window, debitConstants, EaseConstantFactory,
                            DebitSharedServices, EASEUtilsFactory) {
    var url = EaseConstantFactory.baseUrl();
    /**
    * Check if user is authorized to access a feature
    * Endpoint is feature-specific GET route. In non-production
    * we check local storage for key:otp value:skip and skip
    * OTP for the purposes of testing.
    *
    * @param featureName {string}  Name of feature, used in CAL
    *
    * @return {Promise}
    *  {object}
    *     - status {integer} 200: Success, 400: Unauthorized
    */
    var validateAccess = function(featureName, businessEventId) {
      var options = {
        params: {
          t : Date.now(),
          skip: $window.localStorage.getItem('otp') === 'skip' ? true : undefined
        },
        headers: {
          EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
          BUS_EVT_ID: businessEventId
        }
      };
      return $http.get(url + '/Debit/card/' + featureName, options);
    };

    /**
    * Get contact points of user
    *
    * @return {Promise}
    *  {object}
    *     - sms                 {array}   list of phone numbers
    *     - email               {array}   list of emails
    */

    var getContactPoints = function(businessEventId) {
      return $http.get(url + '/Debit/otp/contactPoints', {
        params: {
          t : Date.now()
        },
        headers: {
          EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
          BUS_EVT_ID: businessEventId
        }
      });
    };

    /**
    * Get OTP (one time passcode)
    *
    * @param email                  {string} Email address of customer
    * @param featureName          {string}  feature making call for OTP
    *
    * @return {Promise}
    *  {object}
    *     - pinAuthenticationToken {string}  authentication token to be used when verifying
    */

    var getOtp = function(contactPoint, businessEventId) {
      return $http.post(url + '/Debit/otp/send', {
        contactPointType: contactPoint.type,
        contactPoint: contactPoint.value
      }, {
        headers: {
          EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
          BUS_EVT_ID: businessEventId
        }
      });
    };

    /**
    * Verify OTP (one time passcode)
    *
    * @param otp                  {object}  One Time Passcode
    *   - pinAuthenticationToken  {string}  Auth token generated when OTP is generated
    *   - pin                     {string}  one time passcode entered by user
    * @param featureName          {string}  feature making call for OTP
    *
    * @return {Promise}
    *  {object}
    *     - pin                    {string}  encrypted pin (decrypted emailed to customer)
    *     - pinAuthenticationToken {string}  authentication token to be used when verifying
    */

    var verifyOtp = function(otp, businessEventId) {
      return $http.post(url + '/Debit/otp/verify', otp, {
        headers: {
          EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
          BUS_EVT_ID: businessEventId
        }
      });
    };

    var challengerRedirect = function(feature, productName, accountRefId) {
      var host = DebitSharedServices.isProd() ? debitConstants.CHALLENGER_URL.HOST.PROD :
                                                  debitConstants.CHALLENGER_URL.HOST.NONPROD;
      return host + debitConstants.CHALLENGER_URL.URL + '?client=EASEDEBIT' +
                                feature.toUpperCase() + '&channelType=WEB&eventType=SECAUTH&dp_1=' +
                                productName + '&dp_2=' + encodeURIComponent(accountRefId);
    };

    return {
      validateAccess: validateAccess,
      getContactPoints: getContactPoints,
      getOtp: getOtp,
      verifyOtp: verifyOtp,
      challengerRedirect: challengerRedirect
    }
  }
});

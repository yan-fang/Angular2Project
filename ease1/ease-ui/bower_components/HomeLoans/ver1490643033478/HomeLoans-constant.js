define(['angular'], function(angular) {
  'use strict';
  angular
    .module('HomeLoansConstantsModule', [])
    .constant('HomeLoansMoreServicesConstants', {
      accessCodeUrl: 'https://secure-qa2.int.capitalone360qa.com/' +
      'myaccount/banking/accessCode?execution=e5s1&stateId=accessCodeView&dnr=-1',
      paperlessUrl: 'https://secure-qa2.int.capitalone360qa.com/' +
      'myaccount/banking/paperlessSignup?execution=e3s1&stateId=paperlessMainPage&dnr=-1',
      privacySettings: 'https://secure-qa2.int.capitalone360qa.com/' +
      'myaccount/banking/privacy?execution=e3s1&stateId=viewPrivacy&dnr=-1'
    });
}); //end define

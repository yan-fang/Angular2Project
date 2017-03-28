define(['angular'], function(angular) {
  'use strict';

  angular
          .module('AutoLoanConstantsModule', [])
            .constant('AutoLoanMoreServicesConstants', {
              externalAccountsUrl: 'https://secure.capitalone360.com/' +
              'myaccount/banking/externalLink?execution=e6s1&stateId=displayIndividualLinks&dnr=-1',
              accessCodeUrl: 'https://secure.capitalone360.com/' +
              'myaccount/banking/accessCode?execution=e5s1&stateId=accessCodeView&dnr=-1',
              documentsUrl: 'https://secure.capitalone360.com/' +
              'myaccount/banking/accountDetailForms?execution=e5s1&stateId=accountDetailForms&dnr=1',
              statementsUrl: 'https://secure.capitalone360.com/' +
              'myaccount/banking/estatements.vm',
              paperlessUrl: 'https://secure.capitalone360.com/' +
              'myaccount/banking/paperlessSignup?execution=e3s1&stateId=paperlessMainPage&dnr=-1',
              transferActivityUrl: 'https://secure.capitalone360.com/' +
              'myaccount/banking/transferDepositOverview?execution=e7s1&stateId=displayTransferDepositOverview&dnr=1',
              paymentActivityUrl: 'https://secure.capitalone360.com/' +
              'myaccount/banking/ummPaymentsOverview?execution=e8s1&stateId=displayUmmPaymentOverview&dnr=1',
              viewMessagesUrl: 'https://secure.capitalone360.com/' +
              'myaccount/banking/autoloanSecureMessage',
              textCommandsUrl: 'https://secure.capitalone360.com/' +
              'myaccount/banking/textCommands?execution=e9s1&stateId=textCommandsView&dnr=1',
              titleHelpCenterUrl:'https://www.capitalone.com/auto-learning-center/#faqs'
            })
            .constant('ALTUsabillaConstants',{
              WidgetId:'58747ca9917233f3d765f91d'
            });
});

define(['angular'], function(angular) {
  'use strict';
  angular
      .module('AutoLoanConstantsModule', [])
      .constant('AutoLoanMoreServicesConstants', {
        externalAccountsUrl: 'https://secure-qa2.int.capitalone360qa.com/' +
        'myaccount/banking/externalLink?execution=e6s1&stateId=displayIndividualLinks&dnr=-1',
        accessCodeUrl: 'https://secure-qa2.int.capitalone360qa.com/' +
        'myaccount/banking/accessCode?execution=e5s1&stateId=accessCodeView&dnr=-1',
        documentsUrl: 'https://secure-qa2.int.capitalone360qa.com/' +
        'myaccount/banking/accountDetailForms?execution=e5s1&stateId=accountDetailForms&dnr=1',
        statementsUrl: 'https://secure-qa2.int.capitalone360qa.com/' +
        'myaccount/banking/estatements.vm',
        paperlessUrl: 'https://secure-qa2.int.capitalone360qa.com/' +
        'myaccount/banking/paperlessSignup?execution=e3s1&stateId=paperlessMainPage&dnr=-1',
        transferActivityUrl: 'https://secure-qa2.int.capitalone360qa.com/' +
        'myaccount/banking/transferDepositOverview?execution=e7s1&stateId=displayTransferDepositOverview&dnr=1',
        paymentActivityUrl: 'https://secure-qa2.int.capitalone360qa.com/' +
        'myaccount/banking/ummPaymentsOverview?execution=e8s1&stateId=displayUmmPaymentOverview&dnr=1',
        viewMessagesUrl: 'https://secure-qa2.int.capitalone360qa.com/' +
        'myaccount/banking/autoloanSecureMessage',
        textCommandsUrl: 'https://secure-qa2.int.capitalone360qa.com/' +
        'myaccount/banking/textCommands?execution=e9s1&stateId=textCommandsView&dnr=1',
        titleHelpCenterUrl:'https://helpcenter.ingqa.com/Topic.aspx?category=AUTOTITLRE'
      })
      .constant('ALTUsabillaConstants',{
        WidgetId:'58640a769172336ada1fd66a'
      });
}); //perf

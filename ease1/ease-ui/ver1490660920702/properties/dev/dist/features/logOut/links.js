define(['angular'], function(angular) {
  angular.module('LogOutLinks', []).constant('LogOutLinks', {
    url360Summary: 'https://secure-qa2.int.capitalone360qa.com/myaccount/ease/logout_ease.htm?erdr=%2FaccountSummary',
    logoutUrl: 'https://www-staging.capitalone.com/sign-out/?service=e',
    eSICUrl: 'https://cidswaf-it.cloud.capitalone.com/sic-ui/#/esignin?Product=ENTERPRISE'
  });
});
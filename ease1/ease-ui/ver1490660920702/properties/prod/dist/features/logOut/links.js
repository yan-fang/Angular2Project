define(['angular'], function(angular) {
  angular.module('LogOutLinks', []).constant('LogOutLinks', {
    url360Summary: 'https://secure.capitalone360.com/myaccount/ease/logout_ease.htm?erdr=%2FaccountSummary',
    logoutUrl: 'https://www.capitalone.com/sign-out/?service=e',
    eSICUrl: 'https://verified.capitalone.com/sic-ui/#/esignin?Product=ENTERPRISE'
  })
})

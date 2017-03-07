define(['angular'], function(angular) {
  angular.module('EscapeHatchLinks', []).constant('EscapeHatchLinks', {
    urlBankLogin: 'https://banking.capitalone.com/',
    urlCardLogin: 'https://servicing.capitalone.com/c1/Login.aspx',
    url360Login: 'https://secure.capitalone360.com/myaccount/banking/login.vm?escapeHatch=true',
    urlAutoLogin: 'https://secure.capitalone360.com/myaccount/banking/login.vm?escapeHatch=true',
    urlHomeLogin: 'https://secure.capitalone360.com/myaccount/banking/login.vm?escapeHatch=true',
    urlBankAuth: 'https://banking1.capitalone.com/olb-web/accountSummary',
    urlCardAuth: 'https://services.capitalone.com/accounts',
    url360Auth: 'https://secure.capitalone360.com/myaccount/banking/account_summary.vm?escapeHatch=true',
    urlAutoAuth: 'https://secure.capitalone360.com/myaccount/banking/account_summary.vm?escapeHatch=true',
    urlHomeAuth: 'https://secure.capitalone360.com/myaccount/banking/account_summary.vm?escapeHatch=true'
  })
})

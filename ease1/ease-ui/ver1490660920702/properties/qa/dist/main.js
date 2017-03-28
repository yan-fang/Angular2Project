'use strict';

require.config({
  waitSeconds: 0,
  paths: {
    'lodash':                           '../bower_components/lodash/lodash.min',
    'jsencrypt':                        '../bower_components/jsencrypt/bin/jsencrypt.min',
    'jquery':                           '../bower_components/jquery/dist/jquery.min',
    'angular':                          '../bower_components/angular/angular.min',
    'ease':                             './ease',
    'ui.router.extras.core':            '../bower_components/ui-router-extras/release/modular/ct-ui-router-extras.core.min',
    'ui.router.extras.future':          '../bower_components/ui-router-extras/release/modular/ct-ui-router-extras.future.min',
    'angular-formly':                   '../bower_components/angular-formly/dist/formly.min',
    'formlyBootstrap':                  '../bower_components/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap',
    'api-check':                        '../bower_components/api-check/dist/api-check.min',
    'text':                             '../bower_components/requirejs-text/text',
    'noext':                            '../bower_components/requirejs-plugins/src/noext',
    'async':                            '../bower_components/requirejs-plugins/src/async',
    'domReady':                         '../bower_components/requirejs-domready/domReady',
    'pdfjs' :                           '../bower_components/pdfjs-dist/build/pdf.combined',
    'compatibilityPdf':                 '../bower_components/pdfjs-dist/web/compatibility',
    'c1Date':                           '../bower_components/c1Date/min/c1Date.min',
    'easeUIComponents':                 '../bower_components/easeUIComponents/dist/ease-ui-components.min',
    'adobeTarget':                      '../bower_components/adobe-target/at',
    'Chat247':                          '../bower_components/Chat247/247tag',
    'slick':                            '../bower_components/angular-slick/dist/slick.min',
    'slickCarousel':                    '../bower_components/slick-carousel/slick/slick.min',
    'easeCoreUtils':                    './utils/easeCoreUtils-module',
    'AccountDetailModule':              './features/AccountDetail/AccountDetail-module',
    'WelcomeModule':                    './features/Welcome/Welcome-module',
    'RetailAccountLinks' :              './features/AccountSummary/links',
    'ContentAccountLinks' :             './features/cdn/links',
    'CreditCardCosLink':                './features/CreditCard/link',
    'EscapeHatchLinks' :                './features/EscapeHatch/links',
    'PhysicalAddressLink' :             './features/CustomerSettings/PersonalInformation/links',
    'LogOutLinks' :                     './features/logOut/links',
    'LogoutModule':                     './features/logOut/Logout-module',
    'customerSettings':                 './features/CustomerSettings/CustomerSettings-module',
    'UMMModule':                        './features/UMMPayment/UMMPayment-module',
    'GlobalFooterModule':               './features/GlobalFooter/GlobalFooter-module',
    'SummaryHeaderModule':              './features/SummaryHeader/SummaryHeader-module',
    'TransferModule':                   './features/Transfer/Transfer-module',
    'SessionTimeoutModule':             './features/SessionTimeout/SessionTimeout-module',
    'StatementModule' :                 './features/Statement/Statement-module',
    'EscapeHatchModule':                './features/EscapeHatch/EscapeHatch-module',
    'LanguageToggleModule':             './features/LanguageToggle/LanguageToggle-module',
    'LanguageToggleDirective':          './features/LanguageToggle/LanguageToggle-directive',
    'LanguageToggleService':            './features/LanguageToggle/LanguageToggle-service',
    'usabilla':                         './features/Usabilla/Usabilla',
    'SecurityModule':                   './features/Security/Security-module',
    'easeTemplates':                    './templates/easeTemplateCache',
    'AlertsModule':                     './features/Alerts/Alerts-module',
    'pubSubBootstrap':                   'https://nexus.ensighten.com/capitalone/dev/Bootstrap',
    'AutoLoan':                   '/ease-ui/bower_components/AutoLoan/AutoLoan-module.js?t=' + Date.now(),
    'Bank':                   '/ease-ui/bower_components/Bank/Bank-module.js?t=' + Date.now(),
    'BillPay':                   '/ease-ui/bower_components/BillPay/BillPay-module.js?t=' + Date.now(),
    'Checkbook':                   '/ease-ui/bower_components/Checkbook/Checkbook-module.js?t=' + Date.now(),
    'CreditCard':                   '/ease-ui/bower_components/CreditCard/CreditCard-module.min.js?t=' + Date.now(),
    'Debit':                   '/ease-ui/bower_components/Debit/Debit-module.js?t=' + Date.now(),
    'FundsForecast':                   '/ease-ui/bower_components/FundsForecast/FundsForecast-module.js?t=' + Date.now(),
    'HomeLoans':                   '/ease-ui/bower_components/HomeLoans/HomeLoans-module.js?t=' + Date.now(),
    'app':                              './app',
    'coreProperty':                     '/ease-ui/bower_components/easeCustomerFeatures/ver1490660920702/utils/easeCustomerProperty', 
    'coreUtils':                        '/ease-ui/bower_components/easeCustomerFeatures/ver1490660920702/utils/easeCustomerUtils', 
    'coreFeatures':                     '/ease-ui/bower_components/easeCustomerFeatures/ver1490660920702/customerFeaturesApp', 
    'settingsModule':                   '/ease-ui/bower_components/easeCustomerFeatures/ver1490660920702/CustomerSettings/Settings/Settings-module' ,
    'personalInformationModule':        '/ease-ui/bower_components/easeCustomerFeatures/ver1490660920702/CustomerSettings/PersonalInformation/PersonalInformation-module',
    'MigrateModule':                    '/ease-ui/bower_components/easeCustomerFeatures/ver1490660920702/Migrate/Migrate-module' ,
    'AccountSummaryModule':             '/ease-ui/bower_components/easeCustomerFeatures/ver1490660920702/AccountSummary/AccountSummary-module',
    'AtmFinderModule':                  '/ease-ui/bower_components/easeCustomerFeatures/ver1490660920702/AtmFinder/AtmFinder-module',
    'microajax':                        './lib/microajax',
    'coreloader':                       './core/coreloader'
  },
  shim: {
    'angular': {
      'exports':      'angular'
    },
    'ease':                             ['angular', 'lodash', 'jquery'],
    'ui.router.extras.core':            ['ease'],
    'ui.router.extras.future':          ['ui.router.extras.core'],
    'angular-formly':                   ['ease', 'api-check'],
    'formlyBootstrap':                  ['angular-formly'],
    'easeCoreUtils':                    ['ease'],
    'compatibilityPdf':                 ['pdfjs'],
    'EscapeHatchLinks':                 ['ease'],
    'PhysicalAddressLink':              ['ease'],
    'LogOutLinks':                      ['ease'],
    'RetailAccountLinks':               ['ease'],
    'ContentAccountLinks':              ['ease'],
    'CreditCardCosLink':                ['ease'],
    'easeUIComponents':                 ['ease', 'moment'],
    'easeTemplates' :                   ['angular'],
    'AtmFinderModule':                  ['easeCoreUtils'],
    'TransferModule':                   ['easeCoreUtils'],
    'UMMModule':                        ['easeCoreUtils'],
    'AccountSummaryModule':             ['easeCoreUtils', 'AtmFinderModule', 'UMMModule', 'TransferModule',
                                          'RetailAccountLinks', 'ContentAccountLinks', 'PhysicalAddressLink'],
    'AccountDetailModule':              ['easeCoreUtils'],
    'AlertsModule':                     ['easeCoreUtils'],
    'slick':                            ['ease'],
    'LanguageToggleService':            ['ease', 'LanguageToggleModule'],
    'LanguageToggleModule':             ['ease'],
    'slickCarousel':                    ['slick'],
    'ContentProperties':                ['ease'],
    'easeDropdownModule':               ['EaseProperties', 'easeUtils', 'pubsubServiceModule' ],
    'dropdown':                         ['easeDropdownModule'],
    'commonModule':                     ['EaseProperties'],
    'app':                              ['easeCoreUtils'],
    'coreFeatures':                     ['easeCoreUtils'],
    'Chat247':                          ['coreFeatures']
  },
  packages: [{
    name: 'moment',
    location: '../bower_components/moment',
    main: 'moment'
  }],
  priority: ['coreloader','angular']
});

require([ 'require', 'coreloader', 'angular', 'ease', 'ui.router.extras.future', 'LogOutLinks', 'CreditCardCosLink',
'EscapeHatchLinks','PhysicalAddressLink', 'RetailAccountLinks', 'ContentAccountLinks', 'easeTemplates',
 'easeCoreUtils', 'app'
], function (require, coreloader, ng) {
  var options = {
    url: window.location.origin + '/ease-app-web' + '/customer/language',
    timeout: 2000,
    customerActivityHeader: '50115'
  };
  var mycore = coreloader.callPreferenceLanguage(options)
  .success(function scFn (data, xhr) {
    var lg = xhr.getResponseHeader('accept-language');
    initNgFn(lg);
  })
  .error(function erFn(){
    console.error('error calling Pref.Lang. ....');
    initNgFn(null);
  });

  function initNgFn(language) {
    require(['domReady!', 'noext'], function (document) {
      if (top !== self ) {
        top.location.replace( window.location.origin + '/ease-ui/redirect.html')
        alert('Please wait, you are being redirected to Capital One website...');
      } else {
        configureLanguagePrefs(language, document);
        document.body.style.display = 'block';
        ng.bootstrap(document, ['EASEApp']);
      }
    });
  }

  function configureLanguagePrefs(value, dom) {
    coreloader.setLocale(value);
    if (value) {
      dom.querySelector('html').setAttribute('lang', value.substr(0,2));
    }
  }
  
});

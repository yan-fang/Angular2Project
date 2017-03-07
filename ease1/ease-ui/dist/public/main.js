
'use strict';

require.config({
  waitSeconds: 0,
  paths: {
    'lodash':                           '/bower_components/lodash/index',
    'jquery':                           '/bower_components/jquery/dist/jquery.min',
    'angular':                          '/bower_components/angular/angular.min',
    'ease':                             '/bower_components/EASECoreLite/ease',
    'ui.router.extras.core':            '/bower_components/ui-router-extras/release/modular/ct-ui-router-extras.core.min',
    'ui.router.extras.future':          '/bower_components/ui-router-extras/release/modular/ct-ui-router-extras.future.min',
    'angular-formly':                   '/bower_components/angular-formly/dist/formly.min',
    'formlyBootstrap':                  '/bower_components/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap',
    'api-check':                        '/bower_components/api-check/dist/api-check.min',
    'text':                             '/bower_components/requirejs-text/text',
    'noext':                            '/bower_components/requirejs-plugins/src/noext',
    'async':                            '/bower_components/requirejs-plugins/src/async',
    'domReady':                         '/bower_components/requirejs-domready/domReady',
    'pdfjs' :                           '/bower_components/pdfjs-dist/build/pdf.combined',
    'compatibilityPdf':                 '/bower_components/pdfjs-dist/web/compatibility',
    'c1Date':                           '/bower_components/c1Date/min/c1Date.min',
    'easeUIComponents':                 '/bower_components/easeUIComponents/dist/ease-ui-components.min',
    'moment':                           '/bower_components/moment/min/moment.min',
    'slick':                            '/bower_components/angularslick/dist/slick.min',
    'slickCarousel':                    '/bower_components/slick-carousel/slick/slick.min',
    'easeCoreUtils':                    '/bower_components/EASECoreLite/utils/easeCoreUtils-module',
    'AccountSummaryModule':             '/bower_components/EASECoreLite/features/AccountSummary/AccountSummary-module',
    'AccountDetailModule':              '/bower_components/EASECoreLite/features/AccountDetail/AccountDetail-module',
    'RetailAccountLinks' :              '/bower_components/EASECoreLite/features/AccountSummary/links',
    'EscapeHatchLinks' :                '/bower_components/EASECoreLite/features/EscapeHatch/links',
    'UMMModule':                        '/bower_components/EASECoreLite/features/UMMPayment/UMMPayment-module',
    'GlobalFooterModule':               '/bower_components/EASECoreLite/features/GlobalFooter/GlobalFooter-module',
    'SummaryHeaderModule':              '/bower_components/EASECoreLite/features/SummaryHeader/SummaryHeader-module',
    'TransferModule':                   '/bower_components/EASECoreLite/features/Transfer/Transfer-module',
    'StatementModule' :                 '/bower_components/EASECoreLite/features/Statement/Statement-module',
    'EscapeHatchModule':                '/bower_components/EASECoreLite/features/EscapeHatch/EscapeHatch-module',
    'LanguageToggleModule':             '/bower_components/EASECoreLite/features/LanguageToggle/LanguageToggle-module',
    'LanguageToggleDirective':          '/bower_components/EASECoreLite/features/LanguageToggle/LanguageToggle-directive',
    'LanguageToggleService':            '/bower_components/EASECoreLite/features/LanguageToggle/LanguageToggle-service',
    'usabilla':                         '/bower_components/EASECoreLite/features/Usabilla/Usabilla',
    'pubSubBootstrap':                  'https://nexus.ensighten.com/capitalone/Bootstrap',
    'Bank':                             '/src/Bank-module',
    'HomeLoans':                        '/src/HomeLoans-module',
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
    'RetailAccountLinks':               ['ease'],
    'easeUIComponents':                 ['ease', 'moment'],
    'TransferModule':                   ['easeCoreUtils'],
    'UMMModule':                        ['easeCoreUtils'],
    'AccountSummaryModule':             ['easeCoreUtils','UMMModule', 'TransferModule',
                                          'RetailAccountLinks'],
    'AccountDetailModule':              ['easeCoreUtils'],
    'slick':                            ['ease'],
    'LanguageToggleService':            ['ease', 'LanguageToggleModule'],
    'LanguageToggleModule':             ['ease'],
    'slickCarousel':                    ['slick'],
    'ContentProperties':                ['ease'],
    'easeDropdownModule':               ['EaseProperties', 'easeUtils', 'pubsubServiceModule' ],
    'dropdown':                         ['easeDropdownModule'],
    'commonModule':                     ['EaseProperties']
  },
  priority: ['angular']
});

require([
  'require', 'angular', 'ease',
  'ui.router.extras.future', 'EscapeHatchLinks',
  'RetailAccountLinks',
  'easeCoreUtils',
  './app'
], function (require, angular) {
  require(['domReady!', 'noext'], function (document) {
    angular.bootstrap(document, ['EASEApp']);
  });
});

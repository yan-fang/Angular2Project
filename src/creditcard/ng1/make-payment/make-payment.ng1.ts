import 'requirejs/require';

import { showDialog } from '@c1/shared';

const requirejs: any = (<any>window).requirejs;

export function prepareMakePayment($injector: any): void {
  requirejs(['angular', 'CreditCard'], (angular: any) => {
    const ccModule = angular.module('cc.make.payment.ng2', ['CreditCardDetailModule']);

    // TODO: Remove location.pathname parsing
    // Ticket link: https://jira.kdc.capitalone.com/browse/EWE-2354
    const pathname = window.location.pathname;
    const accountReferenceId = pathname.split('/')[2];

    // TODO: Make ease1 module config/run blocks exportable
    // Ticket link: https://jira.kdc.capitalone.com/browse/EWE-2355
    ccModule.config(config()).run(run());

    return showDialog(ccModule, $injector, 'creditcard-root-accountSummary.ccMakePayment', {
      accountReferenceId: accountReferenceId
    });
  });
}

function config(): Function {
  function configFn($stateProvider: any) {

    // TODO: Use a single parent route definition for all L3s being launch from L1 in ease-web-v2
    // Ticket link: https://jira.kdc.capitalone.com/browse/EWE-2356
    const accountSummaryState = {
      name: 'creditcard-root-accountSummary',
      url: '/account-summary',
      template: `<div class="container" ui-view></div>`
    };

    $stateProvider.state(accountSummaryState);

    $stateProvider.state({
      name: 'creditcard-root-accountSummary.ccMakePayment',
      url: ':accountReferenceId/pay',
      parent: 'creditcard-root-accountSummary',
      onEnter: ['CC', '$stateParams', function _onEnter(CC: any, $stateParams: any) {
        let details = {
          'category': 'CC',
          'accountRefId': $stateParams.accountReferenceId
        };

        CC.launchUmmPayment(details, '', () => { /* NOOP */ });
      }]
    });
  }
  (<any>configFn).$inject = ['$stateProvider'];

  return configFn;
}

function run(): Function {
  function runFn($rootScope: any, $translate: any) {
    $rootScope.$on('$translatePartialLoaderStructureChanged', () => {
      $translate.refresh();
    });
  };
  (<any>runFn).$inject = ['$rootScope', '$translate'];

  return runFn;
}

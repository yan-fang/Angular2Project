import { requirejs } from './ng1-connector';
import { addEnvDeps } from './env.ng1';
import { Injector } from '@angular/core';

/**
 * Returns a module name that can be bootstrapped with NgUpgrade
 */
export function prepareTransferDialog(injector: Injector): Promise<string> {
  let resolve: Function;
  const res = new Promise(r => resolve = r);

  const {requireDeps, angularDeps, runFunctions} = addEnvDeps(
    ['require', 'angular', 'ease', 'easeCoreUtils', 'easeUIComponents', 'TransferModule'],
    [
      'ui.router', 'oc.lazyLoad', 'EaseLocalizeModule', 'restangular',
      'EaseProperties', 'ContentProperties', 'easeAppUtils', 'TransferModule',
      'EaseExceptionsModule', 'pubsubServiceModule', 'easeUIComponents'
    ],
    injector
  );

  configureRequireJS();
  requirejs(requireDeps, (_require: any, angular: any) => {
    const m = angular.module('TransferDialog', angularDeps).config(configFunction()).run(navigate(angular));
    runFunctions.map(r => m.run(r));

    resolve('TransferDialog');
  });

  return res;
}

// TODO: EWE-1912 - Configure ease-ui-v1 requirejs in one place
function configureRequireJS() {
  requirejs.config({
    waitSeconds: 0,
    paths: {
      angularMocks: '/public/static/js/angular-mocks',

      lodash: '/bower_components/lodash/index',
      jquery: '/bower_components/jquery/dist/jquery.min',
      angular: '/bower_components/angular/angular.min',
      ease: '/bower_components/EASECoreLite/ease',
      'ui.router.extras.core': '/bower_components/ui-router-extras/release/modular/ct-ui-router-extras.core.min',
      text: '/bower_components/requirejs-text/text',
      noext: '/bower_components/requirejs-plugins/src/noext',
      async: '/bower_components/requirejs-plugins/src/async',
      domReady: '/bower_components/requirejs-domready/domReady',
      c1Date: '/bower_components/c1Date/min/c1Date.min',
      easeUIComponents: '/bower_components/easeUIComponents/dist/ease-ui-components.min',
      moment: '/bower_components/moment/min/moment.min',
      easeCoreUtils: '/bower_components/EASECoreLite/utils/easeCoreUtils-module',
      TransferModule: '/bower_components/EASECoreLite/features/Transfer/Transfer-module'
    },
    shim: {
      angular: {
        exports: 'angular'
      },
      ease: ['angular', 'lodash', 'jquery'],
      'ui.router.extras.core': ['ease'],
      easeCoreUtils: ['ease'],
      easeUIComponents: ['ease', 'moment'],
      TransferModule: ['easeCoreUtils']
    },
    priority: ['angular']
  });
}

function configFunction(): Function {
  function configFn($stateProvider: any, $ocLazyLoadProvider: any, $locationProvider: any, transferStateProvider: any) {
    $locationProvider.html5Mode(true);
    $ocLazyLoadProvider.config({
      jsLoader: requirejs
    });

    const accountSummaryState = {
      name: 'accountSummary',
      url: '/accountSummary',
      template: `<div class='container' ui-view></div>`
    };

    $stateProvider.state(accountSummaryState);

    transferStateProvider.set(accountSummaryState, 'accountSummary.transfer',
      'accountSummary.transferSuccess', 'accountSummary.transferCancel',
      'accountSummary.transferCancelConfirm', 'accountSummary.transferError',
      'accountSummary.transferEdit', ':transferId/Transfer');

    const transferMoneyStates = transferStateProvider.get();
    const transferStart = transferMoneyStates.transferStart;
    const transferSuccess = transferMoneyStates.transferSuccess;
    const transferEdit = transferMoneyStates.transferEdit;
    const transferCancel = transferMoneyStates.transferCancel;
    const transferCancelConfirm = transferMoneyStates.transferCancelConfirm;
    const transferError = transferMoneyStates.transferError;

    $stateProvider.state(transferStart);
    $stateProvider.state(transferSuccess);
    $stateProvider.state(transferEdit);
    $stateProvider.state(transferCancel);
    $stateProvider.state(transferError);
    $stateProvider.state(transferCancelConfirm);
  }
  (<any>configFn).$inject = ['$stateProvider', '$ocLazyLoadProvider', '$locationProvider', 'transferStateProvider'];
  return configFn;
}

function navigate(angular: any) {
  function runFn($state: any, $rootScope: any, $log: any) {
    setTimeout(() => $state.go('accountSummary.transfer', {}, { location: false }), 0);

    $rootScope.close = () => {
      const modal = document.querySelector('ease-ui-modal');
      if (modal) {
        const modalScope: any = angular.element(modal).scope();
        modalScope.close();
      } else {
        $log.error(`Failed to close TransferDialog. No 'ease-ui-modal' element found.`);
      }
    };
  }
  (<any>runFn).$inject = ['$state', '$rootScope', '$log'];
  return runFn;
}

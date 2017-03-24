import 'requirejs/require';
import { showDialog } from '@c1/shared';
export const requirejs: any = (<any>window).requirejs;

export function prepareTransferDialog($injector: any): void {
  requirejs(['angular', 'TransferModule'], (angular: any) => {
    const m = angular.module('TransferDialog', ['TransferModule']).config(configFn);
    return showDialog(m, $injector, 'transferDialog.transfer');
  });
}

function configFn($stateProvider: any, transferStateProvider: any) {
  const accountSummaryState = {
    name: 'transferDialog',
    url: '/account-summary',
    template: `<div class='container' ui-view></div>`
  };

  $stateProvider.state(accountSummaryState);

  transferStateProvider.set(accountSummaryState, 'transferDialog.transfer',
    'transferDialog.transferSuccess', 'transferDialog.transferCancel',
    'transferDialog.transferCancelConfirm', 'transferDialog.transferError',
    'transferDialog.transferEdit', ':transferId/Transfer');

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

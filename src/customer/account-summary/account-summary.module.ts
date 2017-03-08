import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';

import { C1ComponentsModule } from '@c1/components';
import { AccountSummaryComponent } from './account-summary.component';
import { AccountSummaryEffects } from './account-summary.effects';
import { accountSummary } from './account-summary.reducer';
import { AccountSummaryRepository } from './account-summary.repository';
import { State } from './state';

import { StateManagerService } from '@c1/shared';
import { accountSummaryRoutes } from './account-summary.routes';

@NgModule({
  imports: [
    CommonModule,
    C1ComponentsModule,
    RouterModule.forChild(accountSummaryRoutes)
  ],
  declarations: [
    AccountSummaryComponent
  ],
  exports: [
    AccountSummaryComponent
  ],
  providers: [
    AccountSummaryEffects,
    AccountSummaryRepository
  ]
})
export class AccountSummaryModule {
  constructor(store: Store<State>, stateManager: StateManagerService, effects: AccountSummaryEffects) {
    stateManager.addReducer('customer', {accountSummary}, [effects]);
    store.dispatch({ type: 'FetchAccountSummary' });
  }
}

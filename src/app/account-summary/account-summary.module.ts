import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Store } from '@ngrx/store';

import { C1ComponentsModule } from '@c1/components';
import { AccountSummaryComponent } from './account-summary.component';
import { AccountSummaryEffects } from './account-summary.effects';
import { accountSummary } from './account-summary.reducer';
import { AccountSummaryRepository } from './account-summary.repository';
import { State } from './state';

import { StateManagerService } from '../state-manager-service';

@NgModule({
  imports: [
    CommonModule,
    C1ComponentsModule
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

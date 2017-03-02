import { Effect, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { AccountSummaryRepository } from './account-summary.repository';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class AccountSummaryEffects {

  @Effect() fetchAccountSummary = this.actions.ofType('FetchAccountSummary')
    .mergeMap(() => this.repo.fetchAccountSummary())
    .map(payload => ({ type: 'ShowAccountSummary', payload }));

  constructor(private actions: Actions, private repo: AccountSummaryRepository) { }
}

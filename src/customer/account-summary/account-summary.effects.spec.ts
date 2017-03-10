import { TestBed, inject } from '@angular/core/testing';
import { EffectsTestingModule, EffectsRunner } from '@ngrx/effects/testing';

import { AccountSummaryEffects } from './account-summary.effects';
import { AccountSummaryRepository } from './account-summary.repository';
import { of } from 'rxjs/observable/of';

describe('Testing AccountSummaryEffects', () => {
  let runner: EffectsRunner;
  let effects: AccountSummaryEffects;
  let response: any = null;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      EffectsTestingModule
    ],
    providers: [
      AccountSummaryEffects,
      { provide: AccountSummaryRepository, useValue: ({fetchAccountSummary: () => response}) }
    ]
  }));

  beforeEach(inject([EffectsRunner, AccountSummaryEffects],
    (_runner: EffectsRunner, _effects: AccountSummaryEffects) => {
    runner = _runner;
    effects = _effects;
  }));

  it('should emit ShowAccountSummary after the data is fetched', () => {
    response = of('expectedPayload');
    runner.queue({ type: 'FetchAccountSummary' });

    effects.fetchAccountSummary.subscribe(result => {
      expect(result).toEqual({ type: 'ShowAccountSummary', payload: 'expectedPayload' });
    });
  });
});

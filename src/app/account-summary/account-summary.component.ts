import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Accounts } from './account.model';
import { State } from './state';

@Component({
  selector: 'c1-account-summary',
  styleUrls: ['./account-summary.component.scss'],
  templateUrl: './account-summary.component.html'
})
export class AccountSummaryComponent implements OnInit {
  public accounts: Observable<Accounts>;

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.accounts = this.store.select(m => m.customer ? m.customer.accountSummary : null);
  }
}

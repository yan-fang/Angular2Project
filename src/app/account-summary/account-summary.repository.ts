import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

import { Accounts } from './account.model';

@Injectable()
export class AccountSummaryRepository {
  private accountsUrl = '/api/customer/accountSummary';

  constructor(private http: Http) { }

  fetchAccountSummary(): Observable<Accounts> {
    return this.http.get(this.accountsUrl).map(r => r.json());
  }
}

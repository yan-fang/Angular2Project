import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class ToggleRepositoryService {
  private toggleUrl: string = '/api/ease/card_details_toggles';

  constructor(private http: Http) {}

  public getToggles(toggleName: string): Observable<boolean> {
    // TODO: (JIRA# EWE-960) Use NgRx for state management and caching.
    return this.http.get(this.toggleUrl)
      .map((response: Response) => response.json()[toggleName] === true);
  }
}

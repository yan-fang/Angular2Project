import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs';

import { ToggleRepositoryService } from './toggle-repository.service';
import { CardRouteData } from 'creditcard/models';

@Injectable()
export class ToggleGuard implements CanLoad {
  constructor(private toggleRepositoryService: ToggleRepositoryService) {}

  public canLoad(route: Route): Observable<boolean> {
    const routeData = route.data as CardRouteData;

    return this.toggleRepositoryService
      .getToggles(routeData.toggle);
  }
}

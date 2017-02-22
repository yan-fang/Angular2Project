import { Routes } from '@angular/router';

import { CloseAccountComponent } from './close-account.component';
import { ToggleGuard } from 'creditcard/toggle';

export const closeAccountEntryRoutes: Routes = [
  {
    path: 'close-account',
    loadChildren: './close-account.module#CloseAccountModule',
    canLoad: [ ToggleGuard ],
    data: {
      toggle: 'closeAccountLink'
    }
  }
];

export const closeAccountRoutes: Routes = [
  { path: '', component: CloseAccountComponent }
];

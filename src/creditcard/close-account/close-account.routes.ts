import { Routes } from '@angular/router';

import { CloseAccountComponent } from './close-account.component';

export const closeAccountEntryRoutes: Routes = [
  {
    path: 'close-account',
    loadChildren: './close-account.module#CloseAccountModule'
  }
];

export const closeAccountRoutes: Routes = [
  { path: '', component: CloseAccountComponent }
];

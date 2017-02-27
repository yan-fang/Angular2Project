import { Routes } from '@angular/router';

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

import { Routes } from '@angular/router';

import { ToggleGuard } from '../toggle';

export const closeAccountEntryRoutes: Routes = [
  {
    path: 'close-account',
    loadChildren: '@c1/creditcard/close-account/close-account.module#CloseAccountModule',
    canLoad: [ ToggleGuard ],
    data: {
      toggle: 'closeAccountLink'
    }
  }
];

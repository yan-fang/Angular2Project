import { Routes } from '@angular/router';

import { creditCardEntryRoutes } from '@c1/creditcard';
import { accountSummaryEntryRoutes } from '@c1/app/account-summary';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/accountSummary',
    pathMatch: 'full'
  },
  ...creditCardEntryRoutes,
  ...accountSummaryEntryRoutes
];

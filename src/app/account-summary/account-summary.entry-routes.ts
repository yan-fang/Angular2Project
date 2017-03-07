import { Routes } from '@angular/router';

export const accountSummaryEntryRoutes: Routes = [
  {
    path: 'account-summary',
    loadChildren: '@c1/app/account-summary/account-summary.module#AccountSummaryModule'
  }
];

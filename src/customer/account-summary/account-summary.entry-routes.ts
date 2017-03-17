import { Routes } from '@angular/router';

export const accountSummaryEntryRoutes: Routes = [
  {
    path: 'account-summary',
    loadChildren: '@c1/customer/account-summary/account-summary.module#AccountSummaryModule'
  }
];

import { Routes } from '@angular/router';

// import { creditCardEntryRoutes } from '../creditcard';
// import { accountSummaryEntryRoutes } from './account-summary';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/accountSummary',
    pathMatch: 'full'
  },
  {
    path: 'creditcard',
    loadChildren: '@c1/creditcard/creditcard.module#CreditCardModule'
  },
  {
    path: 'accountSummary',
    loadChildren: '@c1/app/account-summary/account-summary.module#AccountSummaryModule'
  }
  // TODO: Research: The spread operator seem to break chunk generation when running in JIT mode
  // ...creditCardEntryRoutes,
  // ...accountSummaryEntryRoutes
];

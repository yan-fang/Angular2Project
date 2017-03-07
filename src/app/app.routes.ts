import { Routes } from '@angular/router';

// import { creditCardEntryRoutes } from '../creditcard';
// import { accountSummaryEntryRoutes } from './account-summary';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/account-summary',
    pathMatch: 'full'
  },
  {
    path: 'credit-card',
    loadChildren: '@c1/creditcard/creditcard.module#CreditCardModule'
  },
  {
    path: 'account-summary',
    loadChildren: '@c1/app/account-summary/account-summary.module#AccountSummaryModule'
  }
  // TODO: Research: The spread operator seem to break chunk generation when running in JIT mode
  // ...creditCardEntryRoutes,
  // ...accountSummaryEntryRoutes
];

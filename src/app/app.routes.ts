import { Routes } from '@angular/router';

// TODO: EWE-1911 - figure out how to import routes from other modules
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
    path: '360Checking/:accountReferenceId',
    loadChildren: '@c1/bank/L2/bank.module#BankModule'
  },
  {
    path: 'account-summary',
    loadChildren: '@c1/customer/account-summary/account-summary.module#AccountSummaryModule'
  },
  {
    path: 'examples',
    loadChildren: '@c1/examples/examples.module#ExamplesModule'
  }
];

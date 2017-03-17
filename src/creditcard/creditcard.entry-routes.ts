import { Routes } from '@angular/router';

export const creditCardEntryRoutes: Routes = [
  {
    path: 'credit-card',
    loadChildren: '@c1/creditcard/creditcard.module#CreditCardModule'
  }
];

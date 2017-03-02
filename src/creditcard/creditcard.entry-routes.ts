import { Routes } from '@angular/router';

export const creditCardEntryRoutes: Routes = [
  {
    path: 'creditcard',
    loadChildren: '@c1/creditcard/creditcard.module#CreditCardModule'
  }
];

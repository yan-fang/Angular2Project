import { Routes } from '@angular/router';

export const creditCardEntryRoutes: Routes = [
  {
    path: 'credit-card',
    loadChildren: './creditcard.module#CreditCardModule'
  }
];

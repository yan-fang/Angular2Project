import { Routes } from '@angular/router';

import { CreditCardComponent } from './creditcard.component';
import { closeAccountEntryRoutes } from './close-account/close-account.routes';

export const creditCardEntryRoutes: Routes = [
  {
    path: 'creditcard',
    loadChildren: './creditcard.module#CreditCardModule'
  }
];

export const creditCardRoutes: Routes = [
  {
    path: '',
    component: CreditCardComponent,
    children: [
      ...closeAccountEntryRoutes
    ]
  }
];

import { Routes } from '@angular/router';

import { CreditCardComponent } from './creditcard.component';
import { closeAccountEntryRoutes } from './close-account/close-account.entry-routes';
import { changePaymentDueDateEntryRoutes } from './change-payment-due-date/change-payment-due-date.entry-routes';

export const creditCardRoutes: Routes = [
  {
    path: '',
    component: CreditCardComponent,
    children: [
      ...closeAccountEntryRoutes,
      ...changePaymentDueDateEntryRoutes
    ]
  }
];

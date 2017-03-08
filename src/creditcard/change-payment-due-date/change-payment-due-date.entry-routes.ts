import { Routes } from '@angular/router';

import { ToggleGuard } from '@c1/creditcard/toggle';

export const changePaymentDueDateEntryRoutes: Routes = [
  {
    path: 'change-payment-due-date',
    loadChildren: '@c1/creditcard/change-payment-due-date/change-payment-due-date.module#ChangePaymentDueDateModule',
    canLoad: [ ToggleGuard ],
    data: {
      toggle: 'changePaymentDueDateLink'
    }
  }
];

import { Routes } from '@angular/router';

import { AccountSummaryComponent } from './account-summary.component';

export const accountSummaryRoutes: Routes = [
  {
    path: '',
    component: AccountSummaryComponent,
    children: [
      {
        path: ':id/Transfer',
        loadChildren: '@c1/bank/transfer-dialog/transfer-dialog.module#TransferDialogModule'
      }
    ]
  }
];

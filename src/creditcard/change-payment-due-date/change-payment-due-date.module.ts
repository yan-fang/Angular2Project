import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ChangePaymentDueDateComponent } from './change-payment-due-date.component';
import { changePaymentDueDateRoutes } from './change-payment-due-date.routes';

@NgModule({
  declarations: [
    ChangePaymentDueDateComponent
  ],
  imports: [
    RouterModule.forChild(changePaymentDueDateRoutes)
  ]
})
export class ChangePaymentDueDateModule {}

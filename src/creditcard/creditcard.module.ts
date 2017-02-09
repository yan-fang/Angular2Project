import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CreditCardComponent } from 'creditcard/creditcard.component';
import { creditCardRoutes } from 'creditcard/creditcard.routes';

@NgModule({
  declarations: [
    CreditCardComponent
  ],
  entryComponents: [
    CreditCardComponent
  ],
  imports: [
    RouterModule.forChild(creditCardRoutes)
  ]
})
export class CreditCardModule {}

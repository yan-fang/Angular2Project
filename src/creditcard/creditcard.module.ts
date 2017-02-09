import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CreditCardComponent } from './creditcard.component';
import { creditCardRoutes } from './creditcard.routes';

@NgModule({
  declarations: [
    CreditCardComponent
  ],
  entryComponents: [
    CreditCardComponent
  ],
  exports: [
    CreditCardComponent
  ],
  imports: [
    RouterModule.forChild(creditCardRoutes)
  ]
})
export class CreditCardModule {}

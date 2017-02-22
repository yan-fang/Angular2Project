import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ToggleModule } from './toggle';
import { CreditCardComponent } from './creditcard.component';
import { creditCardRoutes } from './creditcard.routes';

@NgModule({
  declarations: [
    CreditCardComponent
  ],
  imports: [
    ToggleModule,
    RouterModule.forChild(creditCardRoutes)
  ]
})
export class CreditCardModule {}

import 'angular';

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UpgradeModule } from '@angular/upgrade/static';

import { MakePaymentComponent } from './make-payment.component';

@NgModule({
  declarations: [
    MakePaymentComponent
  ],
  imports: [
    UpgradeModule,
    RouterModule.forChild([
      { path: '', component: MakePaymentComponent }
    ])
  ]
})
export class MakePaymentModule {}

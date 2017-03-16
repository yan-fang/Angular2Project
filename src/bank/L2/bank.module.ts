import 'angular'; // imports angular 1.3

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UpgradeModule } from '@angular/upgrade/static';

import { BankComponent } from './bank.component';
import { bankRoutes } from './bank.routes';

@NgModule({
  declarations: [BankComponent],
  imports: [
    UpgradeModule,
    RouterModule.forChild(bankRoutes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BankModule { }

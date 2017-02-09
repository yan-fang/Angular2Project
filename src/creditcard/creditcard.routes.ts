import { Routes } from '@angular/router';
import { CreditCardComponent } from './creditcard.component';
import { CloseAccountComponent } from './close-account/close-account.component';

export const creditCardRoutes: Routes = [
  { path: ':accountReferenceId?', component: CreditCardComponent }
];

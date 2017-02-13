import { Routes } from '@angular/router';
import { CreditCardComponent } from './creditcard.component';

export const creditCardEntryRoutes: Routes = [
  { path: 'creditcard', loadChildren: 'creditcard/creditcard.module#CreditCardModule' }
];

export const creditCardRoutes: Routes = [
  { path: '', component: CreditCardComponent }
];

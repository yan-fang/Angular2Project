import { Component } from '@angular/core';

@Component({
  selector: 'c1-creditcard',
  template: `
    <h2>{{title}}</h2>
    <a routerLink="close-account" routerLinkActive="active">Close Account L3 (CC)</a>
    <a routerLink="change-payment-due-date" routerLinkActive="active">Change Payment Due Date L3 (CC)</a>
    <router-outlet></router-outlet>
  `
})
export class CreditCardComponent {
  public title: string = 'CreditCard Title (L2)';
}

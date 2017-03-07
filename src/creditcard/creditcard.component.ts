import { Component } from '@angular/core';

@Component({
  selector: 'c1-creditcard',
  template: `
    <h2>{{title}}</h2>
    <router-outlet></router-outlet>
    <a routerLink="close-account" routerLinkActive="active">Close Account (CC)</a>
    <a routerLink="change-payment-due-date" routerLinkActive="active">Change Payment Due Date (CC)</a>
  `
})
export class CreditCardComponent {
  public title: string = 'CreditCard Title (L2)';
}

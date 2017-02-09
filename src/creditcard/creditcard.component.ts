import { Component } from '@angular/core';

@Component({
  selector: 'c1-creditcard',
  template: `
    <h2>{{title}}</h2>
  `
})
export class CreditCardComponent {
  public title: string = 'CreditCard Title';
}

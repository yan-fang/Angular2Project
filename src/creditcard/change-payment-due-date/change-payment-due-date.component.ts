import { Component } from '@angular/core';

@Component({
  selector: 'c1-creditcard-change-payment-due-date',
  template: `
    <h2>{{ title }}</h2>
  `
})
export class ChangePaymentDueDateComponent {
  public title: string = 'Change Payment Due Date Title (L3)';
}

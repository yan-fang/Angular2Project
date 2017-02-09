import { Component } from '@angular/core';

@Component({
  selector: 'c1-creditcard-close-account',
  template: `
    <h2>{{title}}</h2>
  `
})
export class CloseAccountComponent {
  public title: string = 'Close Account Title';
}

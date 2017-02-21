import { Component } from '@angular/core';

@Component({
  selector: 'c1-web-example',
  styleUrls: ['example.component.scss'],
  template: `
    <nav>
      <a routerLink="/" routerLinkActive="active">Example (L1)</a>
      <a routerLink="/creditcard" routerLinkActive="active">CreditCard</a>
      <a routerLink="/creditcard/close-account" routerLinkActive="active">Close Account (CC)</a>
    </nav>

    <h1>{{title}}</h1>
    <div>
      <button (click)="toggleCheck()">
          click me <span *ngIf="showCheck">to hide</span>
      </button>
      <span *ngIf="showCheck">
          <b>{{intro}}</b>
      </span>
    </div>
    <p class="example--color-red">Nested SCSS Sample</p>
  `
})
export class ExampleComponent {
  public title: String = 'Example Page';
  public intro: String = 'Hello World!';
  public showCheck: Boolean = false;

  public toggleCheck() {
    this.showCheck = !this.showCheck;
  }
}

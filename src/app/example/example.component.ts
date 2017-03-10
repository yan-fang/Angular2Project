import { Component } from '@angular/core';

@Component({
  selector: 'c1-web-example',
  styleUrls: ['./example.component.scss'],
  template: `
    <nav>
      <a routerLink="/" routerLinkActive="active">Example (L1)</a>
      <a routerLink="/credit-card" routerLinkActive="active">CreditCard</a>
      <a routerLink="/account-summary" routerLinkActive="active">Account Summary</a>
    </nav>

    <h1>{{title}}</h1>
    <p>Example of <em>some</em> kind of <strong>text</strong></p>
    <div>
      <button (click)="toggleCheck()">
          click me <span *ngIf="showCheck">to hide</span>
      </button>
      <span *ngIf="showCheck">
          <b>{{intro}}</b>
      </span>
    </div>
    <p class="example--color-red">Responsive Nested SCSS Sample</p>
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

import { Component } from '@angular/core';

@Component({
  selector: 'c1-web-example',
  template: `
    <h1>{{title}}</h1>
    <div>
      <button (click)="toggleCheck()">
          click me <span *ngIf="showCheck">to hide</span>
      </button>
      <span *ngIf="showCheck">
          <b>{{intro}}</b>
      </span>
    </div>
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

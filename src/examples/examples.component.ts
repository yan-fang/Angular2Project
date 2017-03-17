import { Component } from '@angular/core';
import { MenuComponent } from '@c1/components';

@Component({
  selector: 'c1-web-example',
  styleUrls: ['./examples.component.scss'],
  template: `
    <h2>{{title}}</h2>
    <div class="menu-example">
      <c1-button [c1MenuTriggerFor]="menu">Menu Trigger</c1-button>
        <c1-menu #menu="c1Menu">
          <a c1MenuItem>Item 1</a>
          <a c1MenuItem>Item 2</a>
          <a c1MenuItem>Item 2</a>
      </c1-menu>
    </div>
    <p class="sample--color-blue">SCSS Sample</p>
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
    <c1-i18n-example></c1-i18n-example>
  `
})
export class ExamplesComponent {
  public title: String = 'Example Page';
  public intro: String = 'Hello World!';
  public showCheck: Boolean = false;
  public menu: MenuComponent;

  public toggleCheck() {
    this.showCheck = !this.showCheck;
  }
}

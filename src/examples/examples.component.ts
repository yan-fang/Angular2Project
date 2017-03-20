import { Component } from '@angular/core';
import { MenuComponent } from '@c1/components';

@Component({
  selector: 'c1-web-example',
  styleUrls: ['./examples.component.scss'],
  template: `
    <h2>{{title}}</h2>
    <h3>Buttons</h3>
    <div>
      <h4>Default</h4>
      <c1-button [type]="'action'">Action</c1-button>
      <c1-button [type]="'progressive'">Progressive</c1-button>
      <c1-button [type]="'regressive'">Regressive</c1-button>
      <c1-button [type]="'destructive'">Destructive</c1-button>
    </div>
    <div>
      <h4>Default Disabled</h4>
      <c1-button [type]="'action'" [disabled]="true">Action</c1-button>
      <c1-button [type]="'progressive'" [disabled]="true">Progressive</c1-button>
      <c1-button [type]="'regressive'" [disabled]="true">Regressive</c1-button>
      <c1-button [type]="'destructive'" [disabled]="true">Destructive</c1-button>
    </div>
    <div>
      <h4>Default Ghost</h4>
      <c1-button [type]="'action'" [ghost]="true">Action</c1-button>
      <c1-button [type]="'progressive'" [ghost]="true">Progressive</c1-button>
      <c1-button [type]="'regressive'" [ghost]="true">Regressive</c1-button>
      <c1-button [type]="'destructive'" [ghost]="true">Destructive</c1-button>
    </div>
    <div>
      <h4>Default Disabled Ghost</h4>
      <c1-button [type]="'action'" [disabled]="true" [ghost]="true">Action</c1-button>
      <c1-button [type]="'progressive'" [disabled]="true" [ghost]="true">Progressive</c1-button>
      <c1-button [type]="'regressive'" [disabled]="true" [ghost]="true">Regressive</c1-button>
      <c1-button [type]="'destructive'" [disabled]="true" [ghost]="true">Destructive</c1-button>
    </div>

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

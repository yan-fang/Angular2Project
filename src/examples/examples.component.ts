import { Component } from '@angular/core';
import { MenuComponent } from '@c1/components';

@Component({
  selector: 'c1-web-example',
  styleUrls: ['./examples.component.scss'],
  template: `
    <h2>{{title}}</h2>
    <h3>OneUI Core Styles</h3>
    <form class="form-group" style="width: 30%">
      <div class="form-group">
        <label class="form-label" for="exampleTextInput">Label</label>
        <input type="text" id="exampleTextInput" name="exampleTextInput" />
      </div>
      <fieldset class="form-group">Radios
        <div class="radio">
          <input type="radio" id="freq0" name="frequency" value="daily">
          <label for="freq0">Daily</label>
        </div>
        <div class="radio">
          <input type="radio" id="freq1" name="frequency" value="weekly">
          <label for="freq1">Weekly</label>
        </div>
        <div class="radio">
          <input type="radio" id="freq2" name="frequency" value="monthly">
          <label for="freq2">Monthly</label>
        </div>
        <div class="radio">
          <input type="radio" id="freq3" name="frequency" value="yearly">
          <label for="freq3">Yearly</label>
        </div>
      </fieldset>
      <div class="form-group">
        <input type="checkbox" id="toggle_field" name="toggle_field">
        <label for="toggle_field" class="toggle"><span></span>Toggle Example</label>
      </div>
      <div class="form-group">
        <input type="checkbox" id="checkbox_field" name="checkbox_field">
        <label for="checkbox_field" class="checkbox"><span></span>Checkbox Example</label>
      </div>
    </form>
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

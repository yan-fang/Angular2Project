import { Component } from '@angular/core';

@Component({
  selector: 'c1-toolbar',
  styleUrls: ['./toolbar.component.scss'],
  template: `
    <ng-content></ng-content>
  `
})
export class ToolbarComponent {}

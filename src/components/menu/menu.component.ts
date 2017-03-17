import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'c1-menu',
  styleUrls: ['./menu.component.scss'],
  template: `
    <div class="c1-menu" *ngIf="showMenu">
      <ng-content></ng-content>
    </div>
  `,
  exportAs: 'c1Menu'
})
export class MenuComponent {
  public showMenu: boolean = false;
  @HostBinding('attr.role') role = 'menu';
}


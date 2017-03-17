import { Component } from '@angular/core';
import { MenuComponent } from '@c1/components';

@Component({
  selector: 'c1-user-menu',
  styleUrls: ['./user-menu.component.scss'],
  templateUrl: './user-menu.component.html',
})
export class UserMenuComponent {
  public menu: MenuComponent;
}

import { Component } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'c1-user-menu',
  styleUrls: ['./user-menu.component.scss'],
  templateUrl: './user-menu.component.html',
})
export class UserMenuComponent {
  public menu: MenuComponent;
}

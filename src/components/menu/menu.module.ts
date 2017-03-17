import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { MenuItemDirective } from './menu-item.directive';
import { MenuTriggerDirective } from './menu-trigger.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    MenuComponent,
    MenuItemDirective,
    MenuTriggerDirective
  ],
  declarations: [
    MenuComponent,
    MenuItemDirective,
    MenuTriggerDirective
  ],
})
export class MenuModule {}

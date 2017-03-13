import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@c1/shared';
import { ButtonComponent } from './button/button.component';
import { AccountTileComponent } from './account-tile/account-tile.component';
import { MenuComponent } from './menu/menu.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  declarations: [
    ButtonComponent,
    AccountTileComponent,
    MenuComponent,
    ToolbarComponent
  ],
  exports: [
    ButtonComponent,
    AccountTileComponent,
    MenuComponent,
    ToolbarComponent
  ],
  imports: [
    SharedModule,
    CommonModule
  ]
})
export class C1ComponentsModule {}

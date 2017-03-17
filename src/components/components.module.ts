import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@c1/shared';
import { MenuModule } from './menu';

import { ButtonComponent } from './button/button.component';
import { AccountTileComponent } from './account-tile/account-tile.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  declarations: [
    ButtonComponent,
    AccountTileComponent,
    ToolbarComponent
  ],
  exports: [
    ButtonComponent,
    AccountTileComponent,
    ToolbarComponent,
    MenuModule
  ],
  imports: [
    SharedModule,
    CommonModule,
    MenuModule
  ]
})
export class C1ComponentsModule {}

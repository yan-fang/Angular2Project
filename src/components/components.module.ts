import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@c1/shared';
import { MenuModule } from './menu';

import { ButtonComponent } from './button/button.component';
import { AccountTileComponent } from './account-tile/account-tile.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { CheckboxComponent } from './checkbox/checkbox.component';

@NgModule({
  declarations: [
    ButtonComponent,
    AccountTileComponent,
    ToolbarComponent,
    CheckboxComponent
  ],
  exports: [
    ButtonComponent,
    AccountTileComponent,
    ToolbarComponent,
    CheckboxComponent,
    MenuModule
  ],
  imports: [
    SharedModule,
    CommonModule,
    MenuModule,
    RouterModule
  ]
})
export class C1ComponentsModule {}

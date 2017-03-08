import { NgModule } from '@angular/core';

import { SharedModule } from '@c1/shared';
import { ButtonComponent } from './button/button.component';
import { AccountTileComponent } from './account-tile/account-tile.component';

@NgModule({
  declarations: [
    ButtonComponent,
    AccountTileComponent
  ],
  exports: [
    ButtonComponent,
    AccountTileComponent
  ],
  imports: [
    SharedModule
  ]
})
export class C1ComponentsModule {}

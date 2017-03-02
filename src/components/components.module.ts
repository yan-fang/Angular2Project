import { NgModule } from '@angular/core';

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
  ]
})
export class C1ComponentsModule {}

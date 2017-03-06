import { NgModule } from '@angular/core';

import { CoreModule } from '@c1/core';
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
    CoreModule
  ]
})
export class C1ComponentsModule {}

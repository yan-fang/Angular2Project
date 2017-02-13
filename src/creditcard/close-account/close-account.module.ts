import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CloseAccountComponent } from './close-account.component';
import { closeAccountRoutes } from './close-account.routes';

@NgModule({
  declarations: [
    CloseAccountComponent
  ],
  imports: [
    RouterModule.forChild(closeAccountRoutes)
  ]
})
export class CloseAccountModule {}

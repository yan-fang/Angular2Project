import 'angular'; // imports angular 1.3

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UpgradeModule } from '@angular/upgrade/static';
import { TransferDialogComponent } from './transfer-dialog.component';

@NgModule({
  declarations: [TransferDialogComponent],
  imports: [
    UpgradeModule,
    RouterModule.forChild([
      { path: '', component: TransferDialogComponent }
    ])
  ]
})
export class TransferDialogModule {
}

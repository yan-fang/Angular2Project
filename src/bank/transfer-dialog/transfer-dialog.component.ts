import { Component, ElementRef } from '@angular/core';
import { setUpLocationSync } from '@angular/router/upgrade';
import { UpgradeModule } from '@angular/upgrade/static';
import { prepareTransferDialog } from './transfer-dialog.ng1';

@Component({
  selector: 'c1-transfer-dialog',
  template: `
    <div ui-view></div>
  `,
  styles: [`
    @import '/bower_components/EASECoreLite/styles/main.css';
    @import '/bower_components/easeUIComponents/dist/ease-ui-components.css';
  `]
})
export class TransferDialogComponent {
  constructor(el: ElementRef, upgrade: UpgradeModule) {
    prepareTransferDialog().then((moduleName: string) => {
      upgrade.bootstrap(el.nativeElement, [moduleName]);
      setUpLocationSync(upgrade);
    });
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { prepareTransferDialog } from './transfer-dialog.ng1';
import { prepareAngular1Ease } from '../../app/angular1ease/angular1ease.ng1';
import { Angular1Ease } from '../../app/angular1ease/angular1ease.service'; // fix this import

@Component({
  selector: 'c1-transfer-dialog',
  template: ``,
  styles: [`
    @import '/bower_components/EASECoreLite/styles/main.css';
    @import '/bower_components/easeUIComponents/dist/ease-ui-components.css';
  `]
})
export class TransferDialogComponent implements OnInit, OnDestroy {
  constructor(private upgrade: UpgradeModule, private angular1Ease: Angular1Ease) {}

  ngOnInit() {
    prepareAngular1Ease(this.upgrade).then(() => {
      prepareTransferDialog(this.angular1Ease.angular1injector);
    });
  }

  ngOnDestroy() {
    this.angular1Ease.angular1injector.get('$rootScope').close();
  }
}

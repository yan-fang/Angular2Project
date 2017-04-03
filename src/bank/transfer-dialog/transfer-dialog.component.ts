import { Component, OnDestroy, OnInit } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { prepareTransferDialog } from './transfer-dialog.ng1';
import { Angular1Ease, prepareAngular1Ease } from '@c1/app';

@Component({
  selector: 'c1-transfer-dialog',
  template: '',
  styles: [`
    @import '/ease-ui/ver1490660920702/dist/styles/main.min.css';
    @import '/ease-ui/ver1490660920702/bower_components/easeUIComponents/dist/ease-ui-components.css';
  `]
})
export class TransferDialogComponent implements OnInit, OnDestroy {
  constructor(private upgrade: UpgradeModule, private angular1Ease: Angular1Ease) { }

  ngOnInit() {
    prepareAngular1Ease(this.upgrade).then(() => {
      prepareTransferDialog(this.angular1Ease.angular1injector);
    });
  }

  ngOnDestroy() {
    this.angular1Ease.angular1injector.get('$rootScope').close();
  }
}

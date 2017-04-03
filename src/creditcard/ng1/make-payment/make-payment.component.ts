import { Component, OnDestroy, OnInit } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { prepareMakePayment } from './make-payment.ng1';

import { Angular1Ease, prepareAngular1Ease } from '@c1/app';

@Component({
  selector: 'c1-creditcard-make-payment',
  template: '',
  styles: [`
    @import '/ease-ui/ver1490660920702/dist/styles/main.min.css';
    @import '/ease-ui/ver1490660920702/bower_components/easeUIComponents/dist/ease-ui-components.css';
  `]
})
export class MakePaymentComponent implements OnInit, OnDestroy {
  constructor( private upgrade: UpgradeModule, private angular1Ease: Angular1Ease ) {}

  ngOnInit() {
    prepareAngular1Ease(this.upgrade).then(() => prepareMakePayment(this.angular1Ease.angular1injector));
  }

  ngOnDestroy() {
    this.removeModals();
  }

  protected removeModals(): void {
    this.angular1Ease.angular1injector.get('$rootScope').close();
  }
}

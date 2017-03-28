import { Component, NgModule, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import 'angular'; // imports angular 1.3
import { UpgradeModule } from '@angular/upgrade/static';
import { prepareAngular1Ease } from './angular1ease.ng1';

@Component({
  selector: 'c1-angular1ease',
  template: '',
  styles: [`
    @import '/ease-ui/ver1490660920702/dist/styles/main.min.css';
    @import '/ease-ui/ver1490660920702/bower_components/easeUIComponents/dist/ease-ui-components.css';
  `]
})
export class Angular1EaseComponent implements OnInit {
  constructor(private upgrade: UpgradeModule) { }

  ngOnInit() {
    prepareAngular1Ease(this.upgrade);
  }
}


@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '**', component: Angular1EaseComponent }
    ]),
    UpgradeModule
  ],
  declarations: [
    Angular1EaseComponent,
  ]
})
export class Angular1EaseModule {
}

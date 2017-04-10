import 'angular'; // imports angular 1.3

import { Component, NgModule, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UpgradeModule } from '@angular/upgrade/static';

import { prepareAngular1Ease, angular1EaseStyles } from './angular1ease.ng1';

@Component({
  selector: 'c1-angular1ease',
  template: '',
  styles: angular1EaseStyles
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

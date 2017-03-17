import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@c1/shared';
import { C1ComponentsModule } from '@c1/components';

import { ExamplesComponent } from './examples.component';
import { examplesRoutes } from './examples.routes';
import { I18nExampleComponent } from './i18n-example/i18n-example.component';

@NgModule({
  declarations: [
    ExamplesComponent,
    I18nExampleComponent
  ],
  imports: [
    C1ComponentsModule,
    SharedModule,
    CommonModule,
    RouterModule.forChild(examplesRoutes)
  ]
})
export class ExamplesModule {}

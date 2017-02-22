import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { ExampleComponent } from './example/example.component';
import { C1ComponentsModule } from 'components/components.module';

import { MockabilityModule } from 'mockability';
import { mocks } from 'mocks';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    C1ComponentsModule,
    MockabilityModule.forRoot(mocks),
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [
    AppComponent,
    ExampleComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}

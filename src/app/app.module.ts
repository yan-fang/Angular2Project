import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { routerReducer, RouterStoreModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { C1ComponentsModule } from '@c1/components';
import { PerfMeasureModule } from '@c1/perf-measure';
import { environment, NoOpModule, Environments, StateManagerService } from '@c1/shared';
import { MockabilityModule } from '@c1/mockability';
import { mocks } from '@c1/mocks';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { ExampleComponent } from './example/example.component';
import { I18nExampleComponent } from './i18n-example/i18n-example.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    environment === Environments.Production ? NoOpModule : MockabilityModule.forRoot(mocks),

    C1ComponentsModule,

    RouterModule.forRoot(appRoutes),
    StoreModule.provideStore({router: routerReducer}),
    RouterStoreModule.connectRouter(),
    EffectsModule,
    environment === Environments.Production ? NoOpModule : StoreDevtoolsModule.instrumentOnlyWithExtension(),
    PerfMeasureModule
  ],
  declarations: [
    AppComponent,
    ExampleComponent,
    I18nExampleComponent
  ],
  providers: [
    StateManagerService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}

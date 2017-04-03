import '../components/core/global.scss';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule, UrlSerializer } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { routerReducer, RouterStoreModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { C1ComponentsModule } from '@c1/components';
import { PerfMeasureModule } from '@c1/perf-measure';
import { environment, Environments, NoOpModule, StateManagerService } from '@c1/shared';
import { MockabilityModule } from '@c1/mockability';
import { mocks } from '@c1/mocks';

import { AppComponent } from './app.component';
import { ShellComponent } from './shell.component';
import { appRoutes } from './app.routes';
import { HeaderComponent } from './header/header.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { Angular1Ease } from './angular1ease/angular1ease.service';
import { UrlSerializerHandlingIds } from './url_serializer';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    environment === Environments.Production ? NoOpModule : MockabilityModule.forRoot(mocks),

    C1ComponentsModule,

    RouterModule.forRoot(appRoutes, {enableTracing: true}),
    StoreModule.provideStore({router: routerReducer}),
    RouterStoreModule.connectRouter(),
    EffectsModule,
    environment === Environments.Production ? NoOpModule : StoreDevtoolsModule.instrumentOnlyWithExtension(),
    PerfMeasureModule
  ],
  declarations: [
    AppComponent,
    ShellComponent,
    HeaderComponent,
    UserMenuComponent
  ],
  providers: [
    StateManagerService,
    Angular1Ease,
    { provide: UrlSerializer, useClass: UrlSerializerHandlingIds }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}

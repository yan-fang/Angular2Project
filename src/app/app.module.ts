import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { routerReducer, RouterStoreModule } from '@ngrx/router-store';
import { C1ComponentsModule } from '@c1/components';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { ExampleComponent } from './example/example.component';
import { I18nExampleComponent } from './i18n-example/i18n-example.component';
import { AccountSummaryModule } from './account-summary/account-summary.module';
import { StateManagerService } from './state-manager-service';

import { MockabilityModule } from '@c1/mockability';
import { mocks } from '@c1/mocks';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MockabilityModule.forRoot(mocks),

    C1ComponentsModule,
    AccountSummaryModule,

    RouterModule.forRoot(appRoutes),
    StoreModule.provideStore({router: routerReducer}),
    RouterStoreModule.connectRouter(),
    EffectsModule,
    StoreDevtoolsModule.instrumentOnlyWithExtension()
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

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routes';
import { ExampleComponent } from 'app/example/example.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(appRoutes)
    ],
    declarations: [
      AppComponent,
      ExampleComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}

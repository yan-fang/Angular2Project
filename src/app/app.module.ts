import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {
  HeaderComponent, NotesComponent,
  NoteMakerComponent,
  NoteCardsComponent,
  ColorPickerComponent
} from './ui';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NotesComponent,
    NoteMakerComponent,
    NoteCardsComponent,
    ColorPickerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

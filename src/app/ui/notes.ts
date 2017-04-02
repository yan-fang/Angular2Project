import { Component } from '@angular/core';

@Component({
  selector: 'app-notes',
  styles: [`
    .notes {
      padding-top: 50px;
    }
    .creator {
      margin-bottom: 40px; 
    }
  `],
  template: `
    <div class="row center-xs notes">
      <div class="col-xs-6 creator">
        <app-note-maker (createNote)="onCreateNote($event)"></app-note-maker>
      </div>
      <div class="notes col-xs-8">
        <div class="row between-xs">
          <app-note-card
            class="col-xs-4"
            [note]="note"
            *ngFor="let note of notes; let i = index"
            (checked)="onNoteChecked($event, i)"
          >
          </app-note-card>
        </div>
      </div>
    </div>
  `
})
export class NotesComponent {
  notes = [
    {title: 'Chores', value: 'Don\'t forget to clean up', color: 'lighblue'},
    {title: 'Food', value: 'meal prep tonight please!', color: 'seagreen'},
    {title: 'Shipping Number', value: '#234654hhd88', color: 'pink'}
  ];

  onNoteChecked(note, i) {
    this.notes.splice(i, 1);
  }

  onCreateNote(note) {
    this.notes.push(note);
  }
}

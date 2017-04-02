import { Component } from '@angular/core';

@Component({
  selector: 'app-notes',
  styleUrls: ['./notes.css'],
  templateUrl: './notes.html'
})
export class NotesComponent {
  notes = [
    { title: 'Chores', value: 'Don\'t forget to clean up', color: 'lighblue' },
    { title: 'Food', value: 'meal prep tonight please!', color: 'seagreen' },
    { title: 'Shipping Number', value: '#234654hhd88', color: 'pink' }
  ];

  onNoteChecked(note, i) {
    if (note) {
      this.notes.splice(i, 1);
    }
  }

  onCreateNote(note) {
    this.notes.push(note);
  }
}

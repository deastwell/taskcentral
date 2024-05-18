import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemReorderEventDetail, ModalController } from '@ionic/angular';
import { Note } from 'src/app/models/note.model';
import { Item, Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NavParams } from '@ionic/angular';
import { collection, doc, getFirestore } from '@angular/fire/firestore';
import { addDoc } from 'firebase/firestore';


@Component({
  selector: 'app-add-update-note',
  templateUrl: './add-update-note.component.html',
  styleUrls: ['./add-update-note.component.scss'],
})
export class AddUpdateNoteComponent implements OnInit {

  newNote: Note = {
    id: '', // Might be needed depending on your Firestore setup
    title: '',
    content: '',
  };

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService 
  ) { }

  ngOnInit() {
    const noteData = this.navParams.get('note');
    if (noteData) {
      this.newNote = noteData;
    }
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  async saveNote() {
    console.log('saveNote method called');
    if (this.newNote.title.trim() !== '' && this.newNote.content.trim() !== '') {
      try {
        console.log('Fetching user from local storage');
        let user = this.utilsSvc.getElementFromLocalStorage('user');
        console.log('User:', user);

        if (user) {
          try {
            await this.firebaseSvc.addNoteToUser(this.newNote);
            console.log('Note saved successfully:', this.newNote);
            this.modalCtrl.dismiss({ savedNote: this.newNote });
          } catch (err) {
            console.error('Error saving note:', err);
            // Handle errors appropriately (e.g., show error message using a toast)
          }
        } else {
          console.error('No user found in local storage');
        }
      } catch (error) {
        console.error('Error during note saving process:', error);
      }
    } else {
      console.log('Note title or content is empty');
    }
  }

}

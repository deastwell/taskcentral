import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { Note } from 'src/app/models/note.model';
import { AddUpdateNoteComponent } from 'src/app/shared/components/add-update-note/add-update-note.component';  // Replace with your actual component name
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {

  user = {} as User
  notes: Note[] = [];
  loading: boolean = false;
  newNote: any;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    

    this.getNotes();
  }




  async editNote(note?: Note) {
    const res = await this.utilsSvc.presentModal({
      component: AddUpdateNoteComponent,
      componentProps: { note },
      cssClass: 'add-update-modal'
    });

    if (res && res.data && res.data.savedNote) {
      console.log('Note edited or added successfully:', res.data.savedNote);
      this.getNotes();
    } else {
      console.log('Modal dismissed without saving note');
    }
  }


  getNotes() {
    let user: User = this.utilsSvc.getElementFromLocalStorage('user');
    if (!user) {
      console.error("No user found in local storage");
      return;
    }

    let path = `users/${user.uid}`;
    this.loading = true;

    let sub = this.firebaseSvc.getSubcollection(path, 'notes').subscribe({
      next: (res: Note[]) => {
        console.log('Notes retrieved:', res);
        this.notes = res;
        sub.unsubscribe();
        this.loading = false;
      },
      error: (err) => {
        console.error("Error getting notes:", err);
        this.loading = false;
      }
    });
  }

  async addNewNote() {
    const modal = await this.modalCtrl.create({
      component: AddUpdateNoteComponent,
      componentProps: { note: {} as Note }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data && data.savedNote) {
      console.log('New note added successfully:', data.savedNote);
      this.getNotes();
    } else {
      console.log('Modal dismissed without saving new note');
    }
  }
}



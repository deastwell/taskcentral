import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Note } from 'src/app/models/note.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-note',
  templateUrl: './add-update-note.component.html',
  styleUrls: ['./add-update-note.component.scss'],
})
export class AddUpdateNoteComponent implements OnInit {

  newNote: Note = {
    id: '', 
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
          if (this.newNote.id) {
            // Update existing note
            try {
              await this.firebaseSvc.updateNoteForUser(user.uid, this.newNote);
              console.log('Note updated successfully:', this.newNote);
              this.utilsSvc.presentToast({
                message: 'Nota actualizada existosamente',
                color: 'success',
                icon: 'checkmark-circle-outline',
                duration: 1500
              });
              this.modalCtrl.dismiss({ savedNote: this.newNote });
            } catch (err) {
              console.error('Error updating note:', err);
              this.utilsSvc.presentToast({
                message: 'Error actualizando la nota',
                color: 'warning',
                icon: 'alert-circle-outline',
                duration: 5000
              });
            }
          } else {
            // Create new note
            try {
              await this.firebaseSvc.addNoteToUser(this.newNote);
              console.log('Note saved successfully:', this.newNote);
              this.utilsSvc.presentToast({
                message: 'Nota actualizada existosamente',
                color: 'success',
                icon: 'checkmark-circle-outline',
                duration: 1500
              });
              this.modalCtrl.dismiss({ savedNote: this.newNote });
            } catch (err) {
              console.error('Error saving note:', err);
              this.utilsSvc.presentToast({
                message: 'Error guardando la nota',
                color: 'warning',
                icon: 'alert-circle-outline',
                duration: 5000
              });
            }
          }
        } else {
          console.error('No user found in local storage');
          this.utilsSvc.presentToast({
            message: 'No se encontró usuario en el almacenamiento local',
            color: 'warning',
            icon: 'alert-circle-outline',
            duration: 5000
          });
        }
      } catch (error) {
        console.error('Error during note saving process:', error);
        this.utilsSvc.presentToast({
          message: 'Error en el proceso de guardado de la nota',
          color: 'warning',
          icon: 'alert-circle-outline',
          duration: 5000
        });
      }
    } else {
      console.log('Note title or content is empty');
      this.utilsSvc.presentToast({
        message: 'El título o contenido de la nota está vacío',
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 3000
      });
    }
  }
}

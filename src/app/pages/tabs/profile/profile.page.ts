import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user = {} as User;
  profilePictureUrl: string | null = null;
  defaultProfilePicture = 'assets/icon/avatar.png';

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    console.log('ngOnInit called');
    this.user = this.utilsSvc.getElementFromLocalStorage('user');
    console.log('User loaded from local storage:', this.user);
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter called');
    this.getUser();
    this.loadProfilePicture();
  }

  getUser() {
    console.log('getUser called');
    this.user = this.utilsSvc.getElementFromLocalStorage('user');
    console.log('User loaded from local storage:', this.user);
  }

  loadProfilePicture() {
    console.log('loadProfilePicture called');
    console.log('Current user object:', this.user);
    this.profilePictureUrl = this.user.profilePictureUrl ? this.user.profilePictureUrl : this.defaultProfilePicture;
    console.log('Profile picture URL set to:', this.profilePictureUrl);
  }

  async uploadProfilePicture(event: any) {
    console.log('uploadProfilePicture called with event:', event);
    const file: File = event.target.files[0];
    if (file) {
      const filePath = `profile_pictures/${this.user.uid}_${file.name}`;
      console.log('File path for upload:', filePath);
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // Show loading indicator
      console.log('Presenting loading indicator');
      this.utilsSvc.presentLoading();

      task
        .snapshotChanges()
        .pipe(
          finalize(async () => {
            try {
              this.profilePictureUrl = await fileRef.getDownloadURL().toPromise();
              console.log('File uploaded, download URL:', this.profilePictureUrl);
              await this.updateUserProfilePicture(this.profilePictureUrl);
              console.log('Profile picture URL updated');
              this.utilsSvc.presentToast({
                message: 'Profile picture updated successfully!',
                color: 'success',
                duration: 2000,
              });
            } catch (error) {
              console.error('Error uploading profile picture:', error);
              this.utilsSvc.presentToast({
                message: 'Failed to upload profile picture. Please try again.',
                color: 'danger',
                duration: 2000,
              });
            } finally {
              console.log('Dismissing loading indicator');
              this.utilsSvc.dismissLoading();
            }
          })
        )
        .subscribe();
    } else {
      console.log('No file selected for upload');
    }
  }

  async updateUserProfilePicture(url: string) {
    console.log('updateUserProfilePicture called with URL:', url);
    const userUpdate = { profilePictureUrl: url };
    try {
      await this.firebaseSvc.updateUserProfile(this.user.uid, userUpdate);
      console.log('User profile updated in Firestore');
      this.user.profilePictureUrl = url;
      this.utilsSvc.setElementInLocalstorage('user', this.user);
      console.log('User profile updated in local storage:', this.user);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  signOut() {
    console.log('signOut called');
    this.utilsSvc.presentAlert({
      header: 'Cerrar Sesión',
      message: '¿Quieres cerrar sesión?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Si, cerrar',
          handler: () => {
            console.log('Sign out confirmed');
            this.firebaseSvc.signOut();
          }
        }
      ]
    });
  }
}

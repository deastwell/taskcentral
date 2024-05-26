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
  user: User;
  profilePictureUrl: string | null = null;
  defaultProfilePicture = 'assets/icon/avatar.png'; 

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.user = this.utilsSvc.getElementFromLocalStorage('user');
    this.loadProfilePicture();
  }

  ionViewWillEnter() {
    this.getUser();
  }

  getUser() {
    this.user = this.utilsSvc.getElementFromLocalStorage('user');
    this.loadProfilePicture();
    this.fetchUserFromFirebase();
  }

  loadProfilePicture() {
    this.profilePictureUrl = this.user?.profilePictureUrl || this.defaultProfilePicture;
  }

  fetchUserFromFirebase() {
    this.firebaseSvc.getUser(this.user.uid).subscribe((userData: User) => {
      if (userData) {
        this.user = { ...this.user, ...userData };
        this.utilsSvc.setElementInLocalstorage('user', this.user);
        this.loadProfilePicture();
      }
    });
  }

  async uploadProfilePicture(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const filePath = `profile_pictures/${this.user.uid}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // Show loading indicator
      this.utilsSvc.presentLoading();

      task
        .snapshotChanges()
        .pipe(
          finalize(async () => {
            try {
              this.profilePictureUrl = await fileRef.getDownloadURL().toPromise();
              await this.updateUserProfilePicture(this.profilePictureUrl);
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
              this.utilsSvc.dismissLoading();
            }
          })
        )
        .subscribe();
    }
  }

  async updateUserProfilePicture(url: string) {
    const userUpdate = { profilePictureUrl: url };
    try {
      await this.firebaseSvc.updateUserProfile(this.user.uid, userUpdate);
      this.user.profilePictureUrl = url;
      this.utilsSvc.setElementInLocalstorage('user', this.user);
      this.loadProfilePicture(); // Ensure the profile picture is updated
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  signOut() {
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
            this.firebaseSvc.signOut();
          }
        }
      ]
    });
  }
}

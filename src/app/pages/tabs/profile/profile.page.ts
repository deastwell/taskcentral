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
  defaultProfilePicture = 'assets/icon/userIcon.jpg'; 

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.user = this.utilsSvc.getElementFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getUser();
    this.loadProfilePicture();
  }

  getUser() {
    this.user = this.utilsSvc.getElementFromLocalStorage('user');
  }

  loadProfilePicture() {
    if (this.user.profilePictureUrl) {
      this.profilePictureUrl = this.user.profilePictureUrl;
    } else {
      this.profilePictureUrl = this.defaultProfilePicture;
    }
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
            this.profilePictureUrl = await fileRef.getDownloadURL().toPromise();
            this.updateUserProfilePicture(this.profilePictureUrl);
            this.utilsSvc.dismissLoading();
          })
        )
        .subscribe();
    }
  }

  updateUserProfilePicture(url: string) {
    const userUpdate = { profilePictureUrl: url };
    this.firebaseSvc.updateUserProfile(this.user.uid, userUpdate).then(() => {
      this.user.profilePictureUrl = url;
      this.utilsSvc.setElementInLocalstorage('user', this.user);
      this.utilsSvc.presentToast({
        message: 'Profile picture updated successfully!',
        color: 'success',
        duration: 2000,
      });
    });
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

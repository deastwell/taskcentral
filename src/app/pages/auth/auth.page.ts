import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private firestore: AngularFirestore
  ) { }

  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {
      this.utilsSvc.presentLoading({ message: 'Autenticando...' });
      try {
        const res = await this.firebaseSvc.login(this.form.value as User);
        console.log('Login response:', res);

        // Fetching additional user data from Firestore
        const userRef = this.firestore.collection('users').doc<User>(res.user.uid);
        const userDoc = await userRef.get().toPromise();

        let user: User = {
          uid: res.user.uid,
          name: res.user.displayName,
          email: res.user.email,
          profilePictureUrl: null
        };

        if (userDoc.exists) {
          const userData = userDoc.data();
          console.log('User data fetched from Firestore:', userData);

          // Merging Firestore data with auth data
          user = {
            ...user,
            ...userData
          };
        } else {
          console.error('User document not found');
        }

        // Storing user data in local storage
        this.utilsSvc.setElementInLocalstorage('user', user);
        this.utilsSvc.routerLink('/tabs/home');

        this.utilsSvc.dismissLoading();

        this.utilsSvc.presentToast({
          message: `Te damos la bienvenida ${user.name}`,
          duration: 1500,
          color: 'primary',
          icon: 'person-outline'
        });

        this.form.reset();
      } catch (error) {
        console.error('Login error:', error);
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 5000,
          color: 'warning',
          icon: 'alert-circle-outline'
        });
      }
    }
  }
}

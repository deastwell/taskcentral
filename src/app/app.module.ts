import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, ToastController } from '@ionic/angular'; // Import ToastController

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// ====== Firebase ======
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot({ mode: 'md' }), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideFirebaseApp(() => initializeApp(
    {"projectId":"taskcentral-a1e6f",
    "appId":"1:892865859562:web:708d92b49bce90ef93ec93",
    "databaseURL":"https://taskcentral-a1e6f-default-rtdb.firebaseio.com",
    "storageBucket":"taskcentral-a1e6f.appspot.com",
    "apiKey":"AIzaSyBx9gItn3pUb8ljcxnSuXfZLAWu0FXXLEA",
    "authDomain":"taskcentral-a1e6f.firebaseapp.com",
    "messagingSenderId":"892865859562",
    "measurementId":"G-0XQKKF6670"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()), provideStorage(() => getStorage())],  bootstrap: [AppComponent],
})
export class AppModule {}

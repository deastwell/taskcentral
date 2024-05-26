import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

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

// Import IonicStorageModule
import { IonicStorageModule } from '@ionic/storage-angular';
import { TutorialService } from './services/tutorial.service';  // Ensure correct path
import { TutorialComponent } from './tutorial/tutorial.component';

@NgModule({
  declarations: [AppComponent, TutorialComponent], // Declare the TutorialComponent
  imports: [
    BrowserModule, 
    IonicModule.forRoot({ mode: 'md' }), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    IonicStorageModule.forRoot()  // Initialize Ionic Storage
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()), 
    provideDatabase(() => getDatabase()), 
    provideStorage(() => getStorage()),
    TutorialService  // Provide TutorialService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  // Add this line
  bootstrap: [AppComponent],
})
export class AppModule {}

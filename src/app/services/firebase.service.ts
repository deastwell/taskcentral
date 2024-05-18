import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { getAuth, updateProfile } from "firebase/auth";
import { UtilsService } from './utils.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firestore(firestore: any, arg1: string, uid: string) {
    throw new Error('Method not implemented.');
  }
  getActiveUser() {
    throw new Error('Method not implemented.');
  }

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private utilsSvc: UtilsService
    
  ) { }

  //========= Autenticación ==========

  login(user: User) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password)
  }


  signUp(user: User) {
    return this.auth.createUserWithEmailAndPassword(user.email, user.password)
  }

  updateUser(user: any) {
    const auth = getAuth();
    return updateProfile(auth.currentUser, user)
  }

  getAuthState(){
    return this.auth.authState
  }

  async signOut(){
    await this.auth.signOut();
    this.utilsSvc.routerLink('/auth');
    localStorage.removeItem('user');
  }
  


  //============= Firestore (Base de Datos) ==============

  getSubcollection(path: string, subcollectionName: string){
    return this.db.doc(path).collection(subcollectionName).valueChanges({ idField: 'id' })
  }

  addToSubcollection(path: string, subcollectionName: string, object: any){
    return this.db.doc(path).collection(subcollectionName).add(object)
  }

  updateDocument(path: string, object: any){
    return this.db.doc(path).update(object);
  }

  deleteDocument(path: string){
    return this.db.doc(path).delete()
  }


//========== Note ==========

async addNoteToUser(note: any) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  note.userId = user.uid;
  note.createdAt = firebase.firestore.FieldValue.serverTimestamp();

  const userDocPath = `users/${user.uid}/notes`;
  const notesRef = this.db.collection(userDocPath);
  return notesRef.add(note);
}
}

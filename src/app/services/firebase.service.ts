import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { getAuth, updateProfile } from "firebase/auth";
import { UtilsService } from './utils.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { updateDoc, doc, Firestore } from '@angular/fire/firestore';
import { Note } from '../models/note.model';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private utilsSvc: UtilsService,
    private firestore: AngularFirestore, 
    private afAuth: AngularFireAuth
  ) { }

  //========= Autenticación ==========

  login(user: User) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  signUp(user: User) {
    return this.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  updateUser(user: any) {
    const auth = getAuth();
    return updateProfile(auth.currentUser, user);
  }

  getAuthState() {
    return this.auth.authState;
  }

  async signOut() {
    await this.auth.signOut();
    localStorage.clear(); 
    this.utilsSvc.routerLink('/auth');
    localStorage.removeItem('user');
  }

  getSubcollection(path: string, subcollectionName: string) {
    return this.db.doc(path).collection(subcollectionName).valueChanges({ idField: 'id' });
  }

  addToSubcollection(path: string, subcollectionName: string, object: any) {
    return this.db.doc(path).collection(subcollectionName).add(object);
  }

  updateDocument(path: string, object: any) {
    return this.db.doc(path).update(object);
  }

  deleteDocument(path: string) {
    return this.db.doc(path).delete();
  }

  async addNoteToUser(note: Note) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not authenticated");
    }

    note['userId'] = user.uid;
    note['createdAt'] = firebase.firestore.FieldValue.serverTimestamp();

    const userDocPath = `users/${user.uid}/notes`;
    const notesRef = this.db.collection(userDocPath);
    return notesRef.add(note);
  }

  async updateNoteForUser(userId: string, note: Note) {
    const noteDocRef = this.db.doc(`users/${userId}/notes/${note.id}`).ref;
    return await updateDoc(noteDocRef, {
      title: note.title,
      content: note.content
    });
  }

  async deleteNoteById(userId: string, noteId: string) {
    const notePath = `users/${userId}/notes/${noteId}`;
    console.log('Deleting note with path:', notePath);
    try {
      await this.db.doc(notePath).delete();
      console.log('Note deleted from Firestore:', notePath);
    } catch (error) {
      console.error('Error deleting note from Firestore:', error);
      throw error;
    }
  }


  updateUserProfile(uid: string, data: any) {
    return this.firestore.collection('users').doc(uid).update(data);
  }


}

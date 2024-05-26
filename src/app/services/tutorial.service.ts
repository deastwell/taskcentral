import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  private tutorialSeenKey = 'tutorialSeen';

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  async setTutorialSeen(seen: boolean = true) {
    await this.storage.set(this.tutorialSeenKey, seen);
  }

  async hasSeenTutorial(): Promise<boolean> {
    const value = await this.storage.get(this.tutorialSeenKey);
    return value === true;
  }
}

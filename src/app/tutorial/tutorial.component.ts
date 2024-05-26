import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TutorialService } from '../services/tutorial.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
export class TutorialComponent {

  constructor(private navCtrl: NavController, private tutorialService: TutorialService) {}

  finishTutorial() {
    this.tutorialService.setTutorialSeen(true);
    this.navCtrl.navigateRoot('/tabs/home'); // Navigate to the first tab directly
  }
}

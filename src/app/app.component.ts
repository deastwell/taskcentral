import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { register } from 'swiper/element/bundle';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  tutorialService: any;
  navCtrl: any;
  constructor(
    private themeSvc: ThemeService
  ) {

    this.themeSvc.setInitialTheme()
  }

  async initializeApp() {
    const hasSeenTutorial = await this.tutorialService.hasSeenTutorial();
    if (!hasSeenTutorial) {
      this.navCtrl.navigateRoot('/tutorial');
    } else {
      this.navCtrl.navigateRoot('/tabs');
    }
  }
}

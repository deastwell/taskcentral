import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  darkMode = new BehaviorSubject(false);

  constructor() { 
    this.setInitialTheme();
  }

  setInitialTheme() {
    let darkMode = JSON.parse(localStorage.getItem('darkMode'));

    if (darkMode === null) {
      darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    this.setTheme(darkMode);
  }

  setTheme(darkMode: boolean) {
    if (darkMode) {
      document.body.setAttribute('color-theme', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');
    }

    this.darkMode.next(darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }

  toggleTheme() {
    const currentTheme = this.darkMode.value;
    this.setTheme(!currentTheme);
  }
}

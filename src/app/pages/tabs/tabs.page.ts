import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  tabs = [
    {name: 'Inicio', icon: 'home-outline', tab: 'home'},
    {name: 'Perfil', icon: 'person-outline', tab: 'profile'}
  ]

  constructor() { }

  ngOnInit() {
  }

}

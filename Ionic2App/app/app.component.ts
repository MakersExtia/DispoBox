import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home.component';
import { FloorPage } from '../pages/floor/floor.component';
import { CalendarPage } from '../pages/calendar/calendar.component';

import { DEFAULT_PAGE } from '../config/app.config';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = DEFAULT_PAGE === 'floor' ? FloorPage : HomePage;
  pages: Array<{ title: string, component: any }>;

  constructor(
    private platform: Platform,
    private menuCtrl: MenuController
  ) {
    this.initializeApp();
    this.pages = [
      { title: 'Boxes', component: HomePage },
      { title: 'Salles', component: CalendarPage }
    ];
  }

  openPage(page) {
    this.nav.setRoot(page.component);
    this.menuCtrl.close();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}

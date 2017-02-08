import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home.component';
import { FloorPage } from '../pages/floor/floor.component';

import { DEFAULT_PAGE } from '../config/app.config';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = DEFAULT_PAGE === 'floor' ? FloorPage : HomePage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}

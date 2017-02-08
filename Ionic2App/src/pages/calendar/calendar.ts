import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  http://nishanthkabra.com/ionic2GoogleCalandar.html
  https://github.com/NishanthKabra/Ionic2_GoogleCalendar/blob/master/app/pages/GoogleCalendar/googleCalendar.ts
  https://developers.google.com/google-apps/calendar/quickstart/js
*/
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})
export class CalendarPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarPage');
  }
}

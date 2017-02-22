import { Component } from '@angular/core';
import { Nav, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home.component';
import {
  GoogleService,
  CalendarService
} from '../../services/index';
import {
  Event,
  Room
} from '../../models/index';
import { Utils } from '../../utilities/Utils';
import { RESERVABLE_ROOMS } from '../../config/app.config';
import {
  RESPONSE_CODES,
  CALENDAR_STATUS
} from '../../config/return-codes.config';
import {
  CURRENT_ENVIRONMENT,
  ENVIRONMENT_DEVELOPMENT,
  ENVIRONMENT_PRODUCTION,
  CALENDAR_DEV_MIN_DATE
} from '../../config/app.config';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.component.html'
})
export class CalendarPage {
  public loading: boolean = true;
  private authenticated: boolean = false;
  private userCalendar: any;
  private events: Event[];
  private rooms: Room[];

  constructor(
    private nav: Nav,
    private navParams: NavParams,
    private googleService: GoogleService,
  	private calendarService: CalendarService 
  ) {}

  ionViewWillEnter() {
    if (this.navParams.get('loading') !== undefined) {
      this.loading = this.navParams.get('loading');
      this.rooms = this.navParams.get('rooms');
    }
    console.log('loading');

    this.subscribeGoogleService();
    this.subcribeCalendarService();
    if (this.loading) this.googleService.checkToken();
  }

  isAuthenticated() {
    return this.authenticated;
  }

  isLoading() {
    return this.loading;
  }

  getRooms() {
    return this.rooms;
  }

  setRooms(rooms: Room[]) {
    this.rooms = rooms;
  }

  getGoogleService() {
    return this.googleService;
  }

  getCalendarService() {
    return this.calendarService;
  }

  getUserCalendar() {
    return this.userCalendar;
  }

  setUserCalendar(calendar: any) {
    this.userCalendar = calendar;
  }

  getEvents() {
    return this.events;
  }

  setEvents(events: Event[]) {
    this.events = events;
  }

  subscribeGoogleService() {
    this.googleService.getStatus().subscribe(data => this.treatGoogleServiceData(data));
  }

  subcribeCalendarService() {
    this.calendarService.getStatus().subscribe(data => this.treatCalendarServiceData(data));
  }

  treatGoogleServiceData(data: any) {
    if (data === RESPONSE_CODES.TOKEN_CHECKED) {
      if (!this.googleService.isAuthenticated) {
        this.authenticated = false;
        this.googleService.getAuthorization();
      } else {
        this.googleService.getToken().then(token => {
          this.calendarService.setToken(token);
          this.authenticated = true;
          this.calendarService.getAllCalendars();
        });
      }
    }
  }

  treatCalendarServiceData(data: any) {
    switch (data) {
      case CALENDAR_STATUS.GOT_ALL:
        this.retrieveUserCalendar(this.calendarService.getData());
        break;
      case CALENDAR_STATUS.GOT_EVENTS:
        this.formatEventsOfCalendar(this.calendarService.getData());
        break;
    }
  }

  retrieveUserCalendar(calendarList: any) {
    if (calendarList.items) {
      this.userCalendar = calendarList.items.filter(calendar => {
        return !calendar.id.match(/google\.com/);
      });
      this.userCalendar = this.userCalendar[0];
      this.getUserCalendarEvents();
    }
  }

  getUserCalendarEvents() {
    let minDate = new Date();
    if (CURRENT_ENVIRONMENT === ENVIRONMENT_DEVELOPMENT)
      minDate = CALENDAR_DEV_MIN_DATE;
    let maxDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate() + 1);
    this.calendarService.getAllEventsOfCalendar(this.userCalendar.id, {timeMin: Utils.ISODateString(minDate), timeMax: Utils.ISODateString(maxDate) });
  }

  formatEventsOfCalendar(calendarEvents: any) {
    this.events = [];
    calendarEvents.items.forEach(item => {
      let event = new Event();
      event.buildFromJSON({
        summary: item.summary,
        location: item.location,
        start: new Date(item.start.dateTime),
        end: new Date(item.end.dateTime)
      });
      this.events.push(event);
    });
    this.calculateRoomsAvailabilityAndRefreshPage();
  }

  calculateRoomsAvailabilityAndRefreshPage() {
    this.initRooms();
    this.events.forEach(event => {
      for (let i = 0; i < this.rooms.length; ++i) {
        if (this.rooms[i].name === event.location) {
          this.rooms[i].events.push(event);
          break;
        }
      }
    });
    this.loading = false;
    this.nav.setRoot(CalendarPage, { loading: false, rooms: this.rooms });
  }

  initRooms() {
    this.rooms = [];
    RESERVABLE_ROOMS.forEach(reservableRoom => {
      let room = new Room();
      room.name = reservableRoom;
      room.events = [];
      this.rooms.push(room);
    });
  }

  disconnect() {
    this.googleService.deleteToken().then(() => {
      this.nav.setRoot(HomePage);
    });
  }
}

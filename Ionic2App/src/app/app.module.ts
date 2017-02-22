import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {
  HTTPService,
  DevHTTPService,
  DataService,
  GoogleService,
  CalendarService
} from '../services/index';
import { HomePage } from '../pages/home/home.component';
import { FloorPage } from '../pages/floor/floor.component';
import { CalendarPage } from '../pages/calendar/calendar.component';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FloorPage,
    CalendarPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FloorPage,
    CalendarPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DevHTTPService,
    HTTPService,
    DataService,
    GoogleService,
    CalendarService
  ]
})
export class AppModule {}

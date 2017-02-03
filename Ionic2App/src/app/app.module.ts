import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HTTPService } from '../services/http.service';
import { DevHTTPService } from '../services/dev-http.service';
import { DataService } from '../services/data.service';
import { HomePage } from '../pages/home/home.component';
import { FloorPage } from '../pages/floor/floor.component';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FloorPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FloorPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DevHTTPService,
    HTTPService,
    DataService
  ]
})
export class AppModule {}

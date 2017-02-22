import { Component, OnInit } from '@angular/core';
import { Nav } from 'ionic-angular';
import { DataService } from '../../services/data.service';
import { FloorPage } from '../floor/floor.component';
import { CalendarPage } from '../calendar/calendar.component';
import { RESPONSE_CODES } from '../../config/return-codes.config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.component.html'
})
export class HomePage implements OnInit {
  public floors;
  private allOccupied: boolean = true;

  constructor(
    public nav: Nav,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.subscribeDataService();
  }

  ionViewWillEnter() {
    this.getFloors(false);
  }

  areAllOccupied() {
    return this.allOccupied;
  }

  getDataService() {
    return this.dataService;
  }

  doRefresh(refresher) {
    this.floors = [];
    this.getFloors(true);
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  subscribeDataService() {
    this.dataService.status.subscribe(data => {
      if (data.status === RESPONSE_CODES.READY) {
        this.fetchData(data.data);
      }
    });
  }

  fetchData(data: any) {
    this.floors = data;
    this.floors.forEach(floor => {
      if (floor.numberAvailableBoxes > 0)
        this.allOccupied = false;
    });
  }

  getFloors(doRefresh: boolean) {
    this.dataService.getFloors(doRefresh ? doRefresh : false);
  }

  goToFloor(floorNumber: number) {
    this.nav.setRoot(FloorPage, { floor: floorNumber, floors: this.floors });
  }

  goToCalendar() {
    this.nav.setRoot(CalendarPage);
  }
}

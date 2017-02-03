import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataService } from '../../services/data.service';
import { FloorPage } from '../floor/floor.component';
import { RESPONSE_CODES } from '../../config/return-codes.config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.component.html'
})
export class HomePage implements OnInit {
  public floors;

  constructor(
    public nav: NavController,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.subscribeDataService();
  }

  ionViewWillEnter() {
    this.getFloors(false);
  }

  doRefresh(refresher) {
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
  }

  getFloors(doRefresh: boolean) {
    this.dataService.getFloors(doRefresh ? doRefresh : false);
  }

  goToFloor(floorNumber: number) {
    this.nav.push(FloorPage, { floor: floorNumber, floors: this.floors });
  }
}

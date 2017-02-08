import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataService } from '../../services/data.service';
import { Box } from '../../models/box.model';
import { Floor } from '../../models/floor.model';
import { RESPONSE_CODES } from '../../config/return-codes.config';
import { DEFAULT_FLOOR_NUMBER } from '../../config/app.config';

@Component({
  selector: 'page-floor',
  templateUrl: 'floor.component.html',
})
export class FloorPage implements OnInit {
  public floorNumber: number;
  public floors: any;
  public floorData: any;
  private isDefault: boolean;
  private floorsDifferentFromCurrent: any;

  constructor(
    private nav: NavController,
    private navParams: NavParams,
    private dataService: DataService
  ) {
    this.floorNumber = navParams.get('floor');
    if (this.floorNumber !== undefined) {
      this.isDefault = false;
      this.floors = navParams.get('floors');
      this.floorsDifferentFromCurrent = this.floors.filter(floor => floor.floorNumber !== this.floorNumber);
    } else {
      this.floorNumber = DEFAULT_FLOOR_NUMBER;
      this.isDefault = true;
    }
  }

  ngOnInit() {
    this.subscribeDataService();
  }

  ionViewWillEnter() {
    this.getFloorData(false);
  }

  doRefresh(refresher) {
    this.getFloorData(true);
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  subscribeDataService() {
    this.dataService.status.subscribe(data => {
      if (data.status === RESPONSE_CODES.READY) {
        this.fetchData(data.data, data.floors);
      }
    });
  }

  fetchData(data: Box[], floors: Floor[]) {
    this.floorData = data;
    if (this.isDefault) {
      this.floors = floors;
      this.floorsDifferentFromCurrent = this.floors.filter(floor => floor.floorNumber !== this.floorNumber);
    }
  }

  getFloorData(doRefresh: boolean) {
    this.dataService.getFloorData(this.floorNumber, this.isDefault, doRefresh ? doRefresh : false);
  }

  goToFloor(floorNumber: number) {
    this.nav.push(FloorPage, { floor: floorNumber, floors: this.floors });
  }
}

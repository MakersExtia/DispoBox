import { Component, OnInit } from '@angular/core';
import { Nav, NavParams } from 'ionic-angular';
import { DataService } from '../../services/index';
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
  public floorsDifferentFromCurrent: any;
  private default: boolean;

  constructor(
    private nav: Nav,
    private navParams: NavParams,
    private dataService: DataService
  ) {
    this.floorNumber = navParams.get('floor');
    if (this.floorNumber !== undefined) {
      this.default = false;
      this.floors = navParams.get('floors');
      this.floorsDifferentFromCurrent = this.floors.filter(floor => floor.floorNumber !== this.floorNumber);
    } else {
      this.floorNumber = DEFAULT_FLOOR_NUMBER;
      this.default = true;
    }
  }

  ngOnInit() {
    this.subscribeDataService();
  }

  ionViewWillEnter() {
    this.getFloorData(false);
  }

  isDefault() {
    return this.default;
  }

  setDefault(def: boolean) {
    this.default = def;
  }

  getDataService() {
    return this.dataService;
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
    if (this.default) {
      this.floors = floors;
      this.floorsDifferentFromCurrent = this.floors.filter(floor => floor.floorNumber !== this.floorNumber);
    }
  }

  getFloorData(doRefresh: boolean) {
    this.dataService.getFloorData(this.floorNumber, this.default, doRefresh ? doRefresh : false);
  }

  goToFloor(floorNumber: number) {
    this.nav.setRoot(FloorPage, { floor: floorNumber, floors: this.floors });
  }
}

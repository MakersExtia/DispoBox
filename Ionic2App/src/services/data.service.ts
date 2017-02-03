import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DevHTTPService } from './dev-http.service';
import { HTTPService } from './http.service';
import { Box } from '../models/box.model';
import { Floor } from '../models/floor.model';
import {
  CURRENT_ENVIRONMENT,
  ENVIRONMENT_DEVELOPMENT,
  ENVIRONMENT_PRODUCTION
} from '../config/app.config';
import { REQUEST_TYPES } from '../config/api.config';
import { RESPONSE_CODES } from '../config/return-codes.config';

@Injectable()
export class DataService {
  public status = new EventEmitter();
  private areDataLoaded: boolean = false;
  private requestType: string;
  private dataService: any;
  private boxes: Box[];
  private requestedFloor: number;

  constructor(
    private httpService: HTTPService,
    private devHttpService: DevHTTPService
  ) {
    this.boxes = [];
    if (CURRENT_ENVIRONMENT === ENVIRONMENT_PRODUCTION) {
      this.dataService = this.httpService;
    } else {
      this.dataService = this.devHttpService;
    }
    this.subscribeHTTPService();
  }

  getDataService() {
    return this.dataService;
  }

  subscribeHTTPService() {
    this.dataService.fetched.subscribe(code => {
      this.treatFetchedData(code);
    });
  }

  treatFetchedData(code: number) {
    if (code === RESPONSE_CODES.OK) {
      this.mapData(this.dataService.data);
    }
  }

  mapData(data: any) {
    data.forEach(jsonBox => {
      if (parseInt(jsonBox.id, 10) !== 0) {
        let box = new Box();
        box.buildFromJSON(jsonBox);
        this.boxes.push(box); 
      }
    });
    this.areDataLoaded = !this.areDataLoaded;
    this.buildResponse();
  }

  getFloors(doRefresh: boolean) {
    if (doRefresh) this.areDataLoaded = false;
    this.requestType = REQUEST_TYPES.FLOORS;
    this.loadData();
  }

  getFloorData(floorNumber: number, doRefresh: boolean) {
    if (doRefresh) this.areDataLoaded = false;
    this.requestType = REQUEST_TYPES.FLOOR;
    this.requestedFloor = floorNumber;
    this.loadData();
  }

  loadData() {
    if (!this.areDataLoaded)
      this.dataService.getAllBoxes();
    else
      this.buildResponse();
  }

  buildResponse() {
    switch (this.requestType) {
      case REQUEST_TYPES.FLOORS:
        this.notifyObservers({ status: RESPONSE_CODES.READY, data: this.retrieveFloorsFromBoxes() });
        break;
      case REQUEST_TYPES.FLOOR:
        this.notifyObservers({ status: RESPONSE_CODES.READY, data: this.retrieveFloorData() });
        break;
    }
  }

  retrieveFloorData() {
    return this.boxes.filter(box => this.requestedFloor === Math.floor(box.name/10));
  }

  retrieveFloorsFromBoxes() {
    let floors = [];
    this.boxes.forEach(box => {
      let doesFloorExist = floors.filter(floor => floor.floorNumber === Math.floor(box.name/10));
      if (doesFloorExist.length === 0) {
        let newFloor = new Floor();
        newFloor.floorNumber = Math.floor(box.name/10);
        floors.push(newFloor);
      }
    });
    return this.countAvailableAndTotalBoxesForFloors(floors);
  }

  countAvailableAndTotalBoxesForFloors(floors) {
    this.boxes.forEach(box => {
      let floor = floors.filter(floor => floor.floorNumber === Math.floor(box.name/10));
      if (box.state === -1)
        ++floor[0].numberAvailableBoxes;
      ++floor[0].numberTotalBoxes;
    });
    return floors;
  }

  notifyObservers(data: any) {
    this.status.emit(data);
  }
}

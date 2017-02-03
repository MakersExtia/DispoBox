import { Injectable, EventEmitter } from '@angular/core';
import { mockData } from '../assets/mock.data';
import { RESPONSE_CODES } from '../config/return-codes.config';

@Injectable()
export class DevHTTPService {
  public data: any;
  public fetched = new EventEmitter();

  constructor() {}

  getAllBoxes() {
    this.treatResponse(mockData);
  }

  treatResponse(dataToTreat: any) {
    if (parseInt(dataToTreat.code) === RESPONSE_CODES.OK) {
      this.data = dataToTreat.data;
      this.notifyObservers(RESPONSE_CODES.OK);
    }
  }

  notifyObservers(status: number) {
    this.fetched.emit(status);
  }
}

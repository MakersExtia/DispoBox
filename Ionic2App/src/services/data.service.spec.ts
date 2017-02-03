import { EventEmitter } from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { HTTPService } from './http.service';
import { DevHTTPService } from './dev-http.service';
import { DataService } from './data.service';
import { Box } from '../models/box.model';
import { Floor } from '../models/floor.model';
import { RESPONSE_CODES } from '../config/return-codes.config';
import { REQUEST_TYPES } from '../config/api.config';
import { mockData } from '../assets/mock.data';

class MockHTTPService extends HTTPService {
  constructor() {
    super(null);
  }
}

class MockDevHTTPService extends DevHTTPService {
  getAllBoxes() {
    return mockData;
  }
}

class MockEventEmitter<T> extends EventEmitter<T> {
  constructor() {
    super();
  }

  emit(event: any) {
    return event;
  }
}

describe('Service: DataService', () => {
  let service;

  beforeEach(() => {
    service = new DataService(new MockHTTPService(), new MockDevHTTPService());
  });

  describe('Constructor', () => {
    beforeEach(() => {
      spyOn(DataService.prototype, 'subscribeHTTPService');
    });

    it('should build a service', () => {
      service = new DataService(new MockHTTPService(), new MockDevHTTPService());
      expect(service.getDataService() instanceof DevHTTPService).toBeTruthy;
      expect(DataService.prototype.subscribeHTTPService).toHaveBeenCalled();
    });
  });

  describe('treatFetch', () => {
    beforeEach(() => {
      spyOn(DataService.prototype, 'mapData');
    });

    it('should treat fetched data and call map data if return code is ok', () => {
      service.treatFetchedData(RESPONSE_CODES.OK);
      expect(DataService.prototype.mapData).toHaveBeenCalled();
    });
  });

  describe('mapData', () => {
    beforeEach(() => {
      spyOn(DataService.prototype, 'buildResponse');
    });

    it('should map data and set boxes property and notify observers that it is ready', () => {
      service.mapData(mockData.data);
      expect(service.boxes.length).toEqual(15);
      expect(DataService.prototype.buildResponse).toHaveBeenCalled();
    });
  });

  describe('getFloors & getFloorData', () => {
    beforeEach(() => {
      spyOn(DataService.prototype, 'loadData');
    });

    it('should initialize get floors logic', () => {
      service.getFloors(false);
      expect(service.requestType).toEqual(REQUEST_TYPES.FLOORS);
      expect(DataService.prototype.loadData).toHaveBeenCalled();
    });

    it('should should initialize get flors logic to refresh', () => {
      service.getFloors(true);
      expect(service.areDataLoaded).toEqual(false);
      expect(service.requestType).toEqual(REQUEST_TYPES.FLOORS);
      expect(DataService.prototype.loadData).toHaveBeenCalled();
    });

    it('should initialize get a floor logic', () => {
      service.getFloorData(4);
      expect(service.requestType).toEqual(REQUEST_TYPES.FLOOR);
      expect(service.requestedFloor).toEqual(4);
      expect(DataService.prototype.loadData).toHaveBeenCalled();
    });
  });

  describe('loadData', () => {
    describe('when data have not been fetched yet', () => {
      beforeEach(() => {
        spyOn(MockDevHTTPService.prototype, 'getAllBoxes');
      });

      it('should call getAllBoxes from HTTP service', () => {
        service.loadData();
        expect(MockDevHTTPService.prototype.getAllBoxes).toHaveBeenCalled();
      });
    });

    describe('when data have already been loaded', () => {
      beforeEach(() => {
        service.areDataLoaded = true;
        spyOn(DataService.prototype, 'buildResponse');
      });

      it('should call buildResponse', () => {
        service.loadData();
        expect(DataService.prototype.buildResponse).toHaveBeenCalled();
      });
    });
  });

  describe('buildResponse', () => {
    beforeEach(() => {
      spyOn(DataService.prototype, 'retrieveFloorsFromBoxes');
      spyOn(DataService.prototype, 'retrieveFloorData');
    });

    it('should call method to retrieve floors from boxes data', () => {
      service.requestType = REQUEST_TYPES.FLOORS;
      service.buildResponse();
      expect(DataService.prototype.retrieveFloorsFromBoxes).toHaveBeenCalled();
    });

    it('should call method to retrieve floor data', () => {
      service.requestType = REQUEST_TYPES.FLOOR;
      service.buildResponse();
      expect(DataService.prototype.retrieveFloorData).toHaveBeenCalled();
    });
  });

  describe('retrieveFloorData', () => {
    beforeEach(() => {
      service.boxes = [];
      mockData.data.forEach(jsonBox => {
        let box = new Box();
        box.buildFromJSON(jsonBox);
        service.boxes.push(box);
      });
      service.requestedFloor = 4;
    });

    it('should retrieve floor data', () => {
      let floorData = service.retrieveFloorData();
      expect(floorData.length).toEqual(7);
    });
  });

  describe('retrieveFloorsFromBoxes', () => {
    beforeEach(() => {
      service.boxes = [];
      mockData.data.forEach(jsonBox => {
        let box = new Box();
        box.buildFromJSON(jsonBox);
        service.boxes.push(box);
      });
      spyOn(DataService.prototype, 'countAvailableAndTotalBoxesForFloors').and.callFake(floors => {
        return floors;
      });
    });

    it('should return available floors', () => {
      let floors = service.retrieveFloorsFromBoxes();
      expect(floors.length).toEqual(3);
      expect(floors[1].floorNumber).toEqual(4);
      expect(floors[2].floorNumber).toEqual(6);
    });
  });

  describe('countAvailableAndTotalBoxesForFloors', () => {
    let floors = [];

    beforeEach(() => {
      service.boxes = [];
      mockData.data.forEach(jsonBox => {
        let box = new Box();
        box.buildFromJSON(jsonBox);
        service.boxes.push(box);
      });
      mockData.data.forEach(box => {
        let doesFloorExist = floors.filter(floor => floor.floorNumber === Math.floor(box.name/10));
        if (doesFloorExist.length === 0) {
          let newFloor = new Floor();
          newFloor.floorNumber = Math.floor(box.name/10);
          floors.push(newFloor);
        }
      });
    });

    it('should count available and total boxes by floor', () => {
      let floorsWithBoxes = service.countAvailableAndTotalBoxesForFloors(floors);
      expect(floorsWithBoxes[1].numberAvailableBoxes).toEqual(6);
      expect(floorsWithBoxes[1].numberTotalBoxes).toEqual(7);
      expect(floorsWithBoxes[2].numberAvailableBoxes).toEqual(6);
      expect(floorsWithBoxes[2].numberTotalBoxes).toEqual(8);
    });
  });

  describe('notifyObservers', () => {
    beforeEach(() => {
      service.status = new MockEventEmitter();
      spyOn(MockEventEmitter.prototype, 'emit');
    });

    it('should notifyObservers', () => {
      service.notifyObservers();
      expect(MockEventEmitter.prototype.emit).toHaveBeenCalled();
    });
  });
});
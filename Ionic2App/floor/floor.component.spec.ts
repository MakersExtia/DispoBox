import { TestBed, inject, async } from '@angular/core/testing';
import { Component, Input, EventEmitter } from '@angular/core';
import { Nav, NavParams } from 'ionic-angular';
import { IonicModule } from 'ionic-angular';
import { FloorPage } from '../floor/floor.component';
import { Floor } from '../../models/floor.model';
import { Box } from '../../models/box.model';
import { DataService } from '../../services/data.service';
import { RESPONSE_CODES } from '../../config/return-codes.config';

class MockDataService extends DataService {
  public status = new EventEmitter();

  constructor() {
    super(null, null);
  }

  subscribeHTTPService() { }

  getFloorData() { }

  notifyObservers(data: any) {
    this.status.emit(data);
  }
}

class MockNavParams {
  static returnParam = {};

  public get(key): any {
    if (MockNavParams.returnParam) {
      return MockNavParams.returnParam[key];
    }
    return 'default';
  }

  static setParams(values) {
    for (let key in values) {
      MockNavParams.returnParam[key] = values[key];
    }
  }
}

class MockNav {
  setRoot(page: any, options?: any) { }
}

describe('Page: FloorPage', () => {
  let floors = [];

  beforeEach(async(() => {
    floors.push(new Floor(4, 6, 7));
    floors.push(new Floor(6, 6, 8));
    MockNavParams.setParams({ floor: 4, floors: floors });

    TestBed.configureTestingModule({
      declarations: [
        FloorPage
      ],
      imports: [
        IonicModule.forRoot(FloorPage)
      ],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: Nav, useClass: MockNav },
        { provide: NavParams, useClass: MockNavParams }
      ]
    });
    TestBed.compileComponents();
  }));

  describe('Constructor', () => {
    beforeEach(() => {
      spyOn(FloorPage.prototype, 'ngOnInit');
    });

    it('should render projects component', () => {
      const fixture = TestBed.createComponent(FloorPage);
      fixture.detectChanges();
      const floorComponent: FloorPage = fixture.componentInstance;
      expect(FloorPage.prototype.ngOnInit).toHaveBeenCalled();
      expect(floorComponent.floorNumber).toEqual(4);
      expect(floorComponent.floors.length).toEqual(2);
      expect(floorComponent.isDefault()).toBeFalsy;
    });

    it('should render projects component with default params', () => {
      MockNavParams.setParams({ floor: undefined });
      const fixture = TestBed.createComponent(FloorPage);
      fixture.detectChanges();
      const floorComponent: FloorPage = fixture.componentInstance;
      expect(FloorPage.prototype.ngOnInit).toHaveBeenCalled();
      expect(floorComponent.floorNumber).toEqual(6);
      expect(floorComponent.isDefault()).toBeTruthy;
    });
  });

  describe('OnInit', () => {
    beforeEach(() => {
      spyOn(FloorPage.prototype, 'subscribeDataService');
    });

    it('should subcribe to data service events', () => {
      const fixture = TestBed.createComponent(FloorPage);
      const floorComponent: FloorPage = fixture.componentInstance;
      floorComponent.ngOnInit();
      expect(FloorPage.prototype.subscribeDataService).toHaveBeenCalled();
    });
  });

  describe('ionViewWillEnter', () => {
    beforeEach(() => {
      spyOn(FloorPage.prototype, 'getFloorData');
    });

    it('should get floor data when enter page', () => {
      const fixture = TestBed.createComponent(FloorPage);
      const floorComponent: FloorPage = fixture.componentInstance;
      floorComponent.ionViewWillEnter();
      expect(FloorPage.prototype.getFloorData).toHaveBeenCalled();
    });
  });

  describe('doRefresh', () => {
    let mockRefresher = {
      complete: () => { }
    }

    beforeEach(() => {
      spyOn(FloorPage.prototype, 'getFloorData');
    });

    it('should refresh component', () => {
      const fixture = TestBed.createComponent(FloorPage);
      const floorComponent: FloorPage = fixture.componentInstance;
      floorComponent.doRefresh(mockRefresher);
      expect(FloorPage.prototype.getFloorData).toHaveBeenCalled();
    });
  });

  describe('subscribeDataService', () => {
    beforeEach(() => {
      spyOn(FloorPage.prototype, 'fetchData');
    });

    it('should subscribe to data service', () => {
      const fixture = TestBed.createComponent(FloorPage);
      const floorComponent: FloorPage = fixture.componentInstance;
      floorComponent.subscribeDataService();
      floorComponent.getDataService().notifyObservers({ status: RESPONSE_CODES.READY });
      expect(FloorPage.prototype.fetchData).toHaveBeenCalled();
    });
  });

  describe('fetchData', () => {
    let data = [];
    let fetchedFloors = [];
    let fixture;
    let floorComponent;

    beforeEach(() => {
      data = [];
      fetchedFloors = [];
      data.push(new Box(41, 1, 41));
      data.push(new Box(42, -1, 42));
      fetchedFloors.push(new Floor(4, 6, 7));
      fetchedFloors.push(new Floor(6, 6, 8));
      fixture = TestBed.createComponent(FloorPage);
      floorComponent = fixture.componentInstance;
    });

    it('should fetch data', () => {
      floorComponent.fetchData(data, []);
      expect(floorComponent.floorData.length).toEqual(2);
    });

    it('should fetch data when it is default floor', () => {
      floorComponent.floors = [];
      floorComponent.setDefault(true);
      floorComponent.fetchData([], fetchedFloors);
      expect(floorComponent.floors.length).toEqual(2);
      expect(floorComponent.floorsDifferentFromCurrent.length).toEqual(1);
    });
  });

  describe('getFloorData', () => {
    beforeEach(() => {
      spyOn(MockDataService.prototype, 'getFloorData');
    });

    it('should call get floors method of service', () => {
      const fixture = TestBed.createComponent(FloorPage);
      const floorComponent: FloorPage = fixture.componentInstance;
      floorComponent.getFloorData(false);
      expect(MockDataService.prototype.getFloorData).toHaveBeenCalled();
    });

    it('should call get floors method of service with refresh', () => {
      const fixture = TestBed.createComponent(FloorPage);
      const floorComponent: FloorPage = fixture.componentInstance;
      floorComponent.getFloorData(true);
      expect(MockDataService.prototype.getFloorData).toHaveBeenCalled();
    });
  });

  describe('goToFloor', () => {
    beforeEach(() => {
      spyOn(MockNav.prototype, 'setRoot');
    });

    it('should call nav to change page', () => {
      const fixture = TestBed.createComponent(FloorPage);
      const floorComponent: FloorPage = fixture.componentInstance;
      floorComponent.goToFloor(4);
      expect(MockNav.prototype.setRoot).toHaveBeenCalled();
    });
  });

  describe('Rendering', () => {
    let data = [];

    beforeEach(() => {
      data.push(new Box(41, 1, 41));
      data.push(new Box(42, -1, 42));
    });

    it('should render a floor', () => {
      const fixture = TestBed.createComponent(FloorPage);
      const floorComponent: FloorPage = fixture.componentInstance;
      floorComponent.floorData = data;
      floorComponent.floorsDifferentFromCurrent = [new Floor(6, 6, 8)];
      fixture.detectChanges();
      const floorView = fixture.nativeElement;
      expect(floorView.querySelectorAll('.box-marker').length).toEqual(2);
      expect(floorView.querySelectorAll('.button').length).toEqual(1);
      expect(true).toBeTruthy;
    });
  });
});

import { TestBed, inject, async } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IonicModule } from 'ionic-angular';
import { FloorPage } from '../floor/floor.component';
import { Floor } from '../../models/floor.model';
import { Box } from '../../models/box.model';
import { DataService } from '../../services/data.service';
import { RESPONSE_CODES } from '../config/return-codes.config';

class MockDataService extends DataService {
  constructor() {
    super(null, null);
  }

  subscribeHTTPService() { }

  getFloorData() { }
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
        NavController,
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
      const homeView = fixture.nativeElement;
      const floorComponent: FloorPage = fixture.componentInstance;
      expect(FloorPage.prototype.ngOnInit).toHaveBeenCalled();
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

  describe('fetchData', () => {
    let data = [];

    beforeEach(() => {
      data.push(new Box(41, 1, 41));
      data.push(new Box(42, -1, 42));
    });

    it('should fetch data', () => {
      const fixture = TestBed.createComponent(FloorPage);
      const floorComponent: FloorPage = fixture.componentInstance;
      floorComponent.fetchData(data, []);
      expect(floorComponent.floorData.length).toEqual(2);
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
  });

  describe('Rendering', () => {
    it('should WRITE the test', () => {
      expect(true).toBeTruthy;
    });
  });
});

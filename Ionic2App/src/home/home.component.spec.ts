import { TestBed, inject, async } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IonicModule } from 'ionic-angular';
import { HomePage } from './home.component';
import { FloorPage } from '../floor/floor.component';
import { Floor } from '../../models/floor.model';
import { DataService } from '../../services/data.service';
import { RESPONSE_CODES } from '../config/return-codes.config';

class MockFloorPage extends FloorPage {
  constructor() {
    super(null, null, null);
  }
}

class MockDataService extends DataService {
  constructor() {
    super(null, null);
  }

  subscribeHTTPService() { }

  getFloors() { }
}

describe('Page: HomePage', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomePage
      ],
      imports: [
        IonicModule.forRoot(HomePage)
      ],
      providers: [
        { provide: DataService, useClass: MockDataService },
        NavController
      ]
    });
    TestBed.compileComponents();
  }));

  describe('Constructor', () => {
    beforeEach(() => {
      spyOn(HomePage.prototype, 'ngOnInit');
    });

    it('should render projects component', () => {
      const fixture = TestBed.createComponent(HomePage);
      fixture.detectChanges();
      const homeView = fixture.nativeElement;
      const homeComponent: HomePage = fixture.componentInstance;
      expect(HomePage.prototype.ngOnInit).toHaveBeenCalled();
    });
  });

  describe('OnInit', () => {
    beforeEach(() => {
      spyOn(HomePage.prototype, 'subscribeDataService');
    });

    it('should subcribe to data service events', () => {
      const fixture = TestBed.createComponent(HomePage);
      const homeComponent: HomePage = fixture.componentInstance;
      homeComponent.ngOnInit();
      expect(HomePage.prototype.subscribeDataService).toHaveBeenCalled();
    });
  });

  describe('fetchData', () => {
    let data = [];

    beforeEach(() => {
      data.push(new Floor(4, 6, 7));
      data.push(new Floor(4, 6, 8));
    });

    it('should fetch data', () => {
      const fixture = TestBed.createComponent(HomePage);
      const homeComponent: HomePage = fixture.componentInstance;
      homeComponent.fetchData(data);
      expect(homeComponent.floors.length).toEqual(2);
    });
  });

  describe('getFloors', () => {
    beforeEach(() => {
      spyOn(MockDataService.prototype, 'getFloors');
    });

    it('should call get floors method of service', () => {
      const fixture = TestBed.createComponent(HomePage);
      const homeComponent: HomePage = fixture.componentInstance;
      homeComponent.getFloors(false);
      expect(MockDataService.prototype.getFloors).toHaveBeenCalled();
    });
  });

  describe('Rendering', () => {
    it('should WRITE the test', () => {
      expect(true).toBeTruthy;
    });
  });
});

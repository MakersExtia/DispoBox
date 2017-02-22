import { TestBed, inject, async } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { Nav, IonicModule } from 'ionic-angular';
import { HomePage } from './home.component';
import { FloorPage } from '../floor/floor.component';
import { Floor } from '../../models/floor.model';
import { DataService } from '../../services/data.service';
import { RESPONSE_CODES } from '../../config/return-codes.config';

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

  notifyObservers(data: any) {
    this.status.emit(data);
  }
}

class MockNav {
  setRoot(page: any, options?: any) { }
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
        { provide: Nav, useClass: MockNav }
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

  describe('ionViewWillEnter', () => {
    beforeEach(() => {
      spyOn(HomePage.prototype, 'getFloors');
    });

    it('should get floor data when enter page', () => {
      const fixture = TestBed.createComponent(HomePage);
      const homeComponent: HomePage = fixture.componentInstance;
      homeComponent.ionViewWillEnter();
      expect(HomePage.prototype.getFloors).toHaveBeenCalled();
    });
  });

  describe('doRefresh', () => {
    let mockRefresher = {
      complete: () => { }
    }

    beforeEach(() => {
      spyOn(HomePage.prototype, 'getFloors');
    });

    it('should refresh component', () => {
      const fixture = TestBed.createComponent(HomePage);
      const homeComponent: HomePage = fixture.componentInstance;
      homeComponent.doRefresh(mockRefresher);
      expect(HomePage.prototype.getFloors).toHaveBeenCalled();
    });
  });

  describe('subscribeDataService', () => {
    beforeEach(() => {
      spyOn(HomePage.prototype, 'fetchData');
    });

    it('should subscribe to data service', () => {
      const fixture = TestBed.createComponent(HomePage);
      const homeComponent: HomePage = fixture.componentInstance;
      homeComponent.subscribeDataService();
      homeComponent.getDataService().notifyObservers({ status: RESPONSE_CODES.READY });
      expect(HomePage.prototype.fetchData).toHaveBeenCalled();
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
      expect(homeComponent.areAllOccupied()).toBeFalsy;
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

  describe('goToFloor', () => {
    beforeEach(() => {
      spyOn(MockNav.prototype, 'setRoot');
    });

    it('should call nav to change page', () => {
      const fixture = TestBed.createComponent(HomePage);
      const homeComponent: HomePage = fixture.componentInstance;
      homeComponent.goToFloor(4);
      expect(MockNav.prototype.setRoot).toHaveBeenCalled();
    });
  });

  describe('goToCalendar', () => {
    beforeEach(() => {
      spyOn(MockNav.prototype, 'setRoot');
    });

    it('should call nav to change page', () => {
      const fixture = TestBed.createComponent(HomePage);
      const homeComponent: HomePage = fixture.componentInstance;
      homeComponent.goToCalendar();
      expect(MockNav.prototype.setRoot).toHaveBeenCalled();
    });
  });

  describe('Rendering', () => {
    let data = [];

    beforeEach(() => {
      data.push(new Floor(4, 6, 7));
      data.push(new Floor(6, 6, 8));
    });

    it('should render two cards for floors', () => {
      const fixture = TestBed.createComponent(HomePage);
      const homeComponent: HomePage = fixture.componentInstance;
      homeComponent.floors = data;
      fixture.detectChanges();
      const homeView = fixture.nativeElement;
      expect(homeView.querySelectorAll('.card').length).toEqual(2);
      expect(true).toBeTruthy;
    });
  });
});

import { EventEmitter } from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { DevHTTPService } from './dev-http.service';
import { mockData } from '../assets/mock.data';

class MockEventEmitter<T> extends EventEmitter<T> {
  constructor() {
    super();
  }

  emit(event: any) {
    return event;
  }
}

describe('Service: DevHTTPService', () => {
  let service;

  beforeEach(() => {
    service = new DevHTTPService();
  });

  describe('getAllBoxes', () => {
    beforeEach(() => {
      spyOn(DevHTTPService.prototype, 'treatResponse');
    });

    it('get all boxes and call treatResponse', () => {
      service.getAllBoxes();
      expect(DevHTTPService.prototype.treatResponse).toHaveBeenCalledWith(mockData);
    });
  });

  describe('treatResponse', () => {
    beforeEach(() => {
      spyOn(DevHTTPService.prototype, 'notifyObservers');
    });

    it('should fetch data and call notifyObservers', () => {
      service.treatResponse(mockData);
      expect(service.data).toBe(mockData.data);
      expect(DevHTTPService.prototype.notifyObservers).toHaveBeenCalled();
    });
  });

  describe('notifyObservers', () => {
    beforeEach(() => {
      service.fetched = new MockEventEmitter();
      spyOn(MockEventEmitter.prototype, 'emit');
    });

    it('should notifyObservers', () => {
      service.notifyObservers();
      expect(MockEventEmitter.prototype.emit).toHaveBeenCalled();
    });
  });
});
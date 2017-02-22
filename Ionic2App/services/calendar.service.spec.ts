import { TestBed, inject, async } from '@angular/core/testing';
import { Platform } from 'ionic-angular';
import { HTTPService } from './http.service';
import { GoogleService } from './google.service';
import { CalendarService } from './calendar.service';
import { Utils } from '../utilities/Utils';
import { RESPONSE_CODES } from '../config/return-codes.config';
import { CALENDAR_STATUS } from '../config/return-codes.config';

class MockHTTPService extends HTTPService {
  constructor() {
    super(null);
  }

  validateGoogleToken(token) { }

  mapDataAndNotify(data: any, code: number) {
    this.fetched.emit(code);
  }
}

class MockGoogleService extends GoogleService {
  constructor() {
    super(null, new MockHTTPService());
  }
}

class MockPlatform extends Platform { }

describe('Service: CalendarService', () => {
  let googleService;
  let platform;
  let service: CalendarService;

  beforeEach(async(() => {
    googleService = new MockGoogleService();
    platform = new MockPlatform();
  }));

  describe('Constructor', () => {
    it('should build a new CalendarService', () => {
      expect(new CalendarService(platform, googleService)).not.toThrowError;
    });
  });

  describe('Methods', () => {
    beforeAll(() => {
      service = new CalendarService(platform, googleService);
    });

    describe('send request methods', () => {
      beforeAll(() => {
        spyOn(CalendarService.prototype, 'sendGetRequest').and.callFake(() => { });
      });

      it('should send get all calendars request', () => {
        service.getAllCalendars();
        expect(CalendarService.prototype.sendGetRequest).toHaveBeenCalledWith('/calendar/v3/users/me/calendarList', CALENDAR_STATUS.GOT_ALL);
      });

      it('should send get one calendar request', () => {
        service.getCalendar('usertest@extia.fr');
        expect(CalendarService.prototype.sendGetRequest).toHaveBeenCalledWith('/calendar/v3/users/me/calendarList/usertest@extia.fr', CALENDAR_STATUS.GOT_ONE);
      });

      it('should send get one calendar events request', () => {
        let minDate = new Date(2017, 1, 17);
        let maxDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate() + 1);
        service.getAllEventsOfCalendar('usertest@extia.fr', {timeMin: Utils.ISODateString(minDate), timeMax: Utils.ISODateString(maxDate) });
        expect(CalendarService.prototype.sendGetRequest).toHaveBeenCalledWith('/calendar/v3/calendars/usertest@extia.fr/events?timeMin=2017-02-16T23:00:00Z&timeMax=2017-02-17T23:00:00Z', CALENDAR_STATUS.GOT_EVENTS);
      });
    });
  });
});
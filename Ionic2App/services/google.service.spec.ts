import { TestBed, inject, async } from '@angular/core/testing';
import { Platform } from 'ionic-angular';
import {
  InAppBrowser,
  InAppBrowserEvent,
  NativeStorage
} from 'ionic-native';
import { HTTPService } from './http.service';
import { GoogleService } from './google.service';
import { RESPONSE_CODES } from '../config/return-codes.config';

class MockHTTPService extends HTTPService {
  constructor() {
    super(null);
  }

  validateGoogleToken(token) { }

  mapDataAndNotify(data: any, code: number) {
    this.fetched.emit(code);
  }
}

class MockPlatform extends Platform { }

describe('Service: GoogleService', () => {
  let httpService;
  let platform;
  let service: GoogleService;

  beforeEach(async(() => {
    httpService = new MockHTTPService();
    platform = new MockPlatform();
  }));

  describe('Constructor', () => {
    beforeEach(() => {
      spyOn(GoogleService.prototype, 'subscribeHTTPService');
    });

    it('should build a new GoogleService', () => {
      expect(new GoogleService(platform, httpService)).not.toThrowError;
    });
  });

  describe('Methods', () => {
    beforeAll(() => {
      service = new GoogleService(platform, httpService);
    });

    describe('subscribeHTTPService', () => {
      beforeEach(() => {
        spyOn(GoogleService.prototype, 'treatHTTPServiceResponse');
      });

      it('should subscribe to HTTP service', () => {
        service.subscribeHTTPService();
        service.getHttpService().mapDataAndNotify(null, RESPONSE_CODES.CHECK_TOKEN);
        expect(GoogleService.prototype.treatHTTPServiceResponse).toHaveBeenCalled();
      });
    });

    describe('treatHTTPServiceResponse', () => {
      it('should treat http service response when check token is invalid', () => {
        service.getHttpService().data = { error_description: 'Invalue value' };
        service.treatHTTPServiceResponse(RESPONSE_CODES.CHECK_TOKEN);
        expect(service.isAuthenticated).toBeFalsy;
      });

      it('should treat http service response when check token is valid', () => {
        service.getHttpService().data = {};
        service.treatHTTPServiceResponse(RESPONSE_CODES.CHECK_TOKEN);
        expect(service.isAuthenticated).toBeTruthy;
      });
    });

    describe('getToken', () => {
      beforeAll(() => {
        spyOn(NativeStorage, 'getItem').and.callFake(key => {
          return new Promise((resolve, reject) => {
            resolve('abc');
          });
        });
      });

      it('should get token', done => {
        service.getToken().then(token => {
          expect(token).toEqual('abc');
          done();
        });
      });
    });

    describe('checkToken', () => {
      beforeAll(() => {
        spyOn(GoogleService.prototype, 'getToken').and.callFake(() => {
          return new Promise((resolve, reject) => {
            resolve('abc');
          });
        });
      });

      it('should checkToken', () => {
        service.checkToken();
        expect(GoogleService.prototype.getToken).toHaveBeenCalled();
      });
    });

    describe('saveToken', () => {
      beforeAll(() => {
        spyOn(NativeStorage, 'setItem').and.callFake(() => {
          return new Promise((resolve, reject) => { resolve() });
        });
      });

      it('should saveToken', () => {
        service.saveToken('abc');
        expect(NativeStorage.setItem).toHaveBeenCalled();
      });
    });

    describe('deleteToken', () => {
      beforeAll(() => {
        spyOn(NativeStorage, 'remove').and.callFake(() => {
          return new Promise((resolve, reject) => { resolve() });
        });
      });

      it('should deleteToken', done => {
        service.deleteToken().then(() => {
          expect(NativeStorage.remove).toHaveBeenCalled();
          done();
        });
      });
    });
  });
});
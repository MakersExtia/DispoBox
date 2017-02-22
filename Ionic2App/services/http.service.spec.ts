import { TestBed, inject, async } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { HTTPService } from './http.service';
import { mockData } from '../assets/mock.data';

describe('Service: HTTPService', () => {
  let httpService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http, useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
    TestBed.compileComponents();
  }));

  describe('getAllBoxes', () => {
    beforeEach(() => {
      spyOn(HTTPService.prototype, 'mapDataAndNotify');
    });

    it('should get all boxes', inject([MockBackend, BaseRequestOptions], (mockBackend: MockBackend, defaultOptions: BaseRequestOptions) => {
      httpService = new HTTPService(new Http(mockBackend, defaultOptions));
      let conn: MockConnection;
      const response = new Response(new ResponseOptions({body: mockData}));
      mockBackend.connections.subscribe((connection: MockConnection) => {
        conn = connection;
      });
      httpService.getAllBoxes();
      conn.mockRespond(response);
      expect(HTTPService.prototype.mapDataAndNotify).toHaveBeenCalled();
    }));
  });

  describe('validateGoogleToken', () => {
    beforeEach(() => {
      spyOn(HTTPService.prototype, 'mapDataAndNotify');
    });

    it('should validate google token', inject([MockBackend, BaseRequestOptions], (mockBackend: MockBackend, defaultOptions: BaseRequestOptions) => {
      httpService = new HTTPService(new Http(mockBackend, defaultOptions));
      let conn: MockConnection;
      const response = new Response(new ResponseOptions({body: {error_description: 'Invalid value'}}));
      mockBackend.connections.subscribe((connection: MockConnection) => {
        conn = connection;
      });
      httpService.validateGoogleToken('abc');
      conn.mockRespond(response);
      expect(HTTPService.prototype.mapDataAndNotify).toHaveBeenCalled();
    }));
  });

  describe('getHeaders', () => {
    it('should get headers', inject([MockBackend, BaseRequestOptions], (mockBackend: MockBackend, defaultOptions: BaseRequestOptions) => {
      httpService = new HTTPService(new Http(mockBackend, defaultOptions));
      const headers = httpService.getHeaders();
      expect(headers.get('Content-Type')).toBe('application/json');
    }));
  });

  describe('mapDataAndNotify', () => {
    it('should get map data and notify ', done => {
      const response = new Response(new ResponseOptions({body: mockData}));
      httpService = new HTTPService(null);
      httpService.fetched.subscribe(code => {
        expect(code).toEqual(1);
        expect(httpService.data.data.length).toEqual(16);
        done();
      });
      httpService.mapDataAndNotify(response, 1);
    });
  });
});
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { 
  HOST,
  GET_ALL_BOXES_ACTION,
  GOOGLE_VALIDATION_TOKEN_ENDPOINT
} from '../config/api.config';
import { RESPONSE_CODES } from '../config/return-codes.config';

@Injectable()
export class HTTPService {
  public data: any;
  public fetched = new EventEmitter();

  constructor(private http: Http) {}

  getAllBoxes() {
    this.http.get(HOST + GET_ALL_BOXES_ACTION, new RequestOptions({ headers: this.getHeaders() }))
      .subscribe(
        data => this.mapDataAndNotify(data, RESPONSE_CODES.OK)
      );
  }

  validateGoogleToken(token: string) {
    this.http.get(GOOGLE_VALIDATION_TOKEN_ENDPOINT + token, new RequestOptions({ headers: this.getHeaders() }))
      .subscribe(response => {
        this.mapDataAndNotify(response, RESPONSE_CODES.CHECK_TOKEN);
      }, error => {
        this.mapDataAndNotify(error, RESPONSE_CODES.CHECK_TOKEN);
      });
  }

  getHeaders() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    return headers;
  }

  mapDataAndNotify(data: Response, code: number) {
    this.data = data.json();
    this.fetched.emit(code);
  }
}

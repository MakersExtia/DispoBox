import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { 
  HOST,
  GET_ALL_BOXES_ACTION
} from '../config/api.config';

@Injectable()
export class HTTPService {
  public data: any;
  public fetched = new EventEmitter();

  constructor(private http: Http) {}

  getAllBoxes() {
    this.http.get(HOST + GET_ALL_BOXES_ACTION, new RequestOptions({ headers: this.getHeaders() }))
      .subscribe(
        data => this.mapDataAndNotify(data)
      );
  }

  getHeaders() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    return headers;
  }

  mapDataAndNotify(data: Response) {
    this.data = data.json();
    this.fetched.emit('event');
  }
}

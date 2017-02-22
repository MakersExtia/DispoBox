import { Injectable, EventEmitter } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { GoogleService } from './google.service';
import { Platform } from 'ionic-angular';
import {
	InAppBrowser,
	InAppBrowserEvent,
	NativeStorage
} from 'ionic-native';
import {
	GOOGLE_CALENDAR_API_KEY
} from '../config/api.config';
import { CALENDAR_STATUS } from '../config/return-codes.config';

declare var gapi: any;

@Injectable()
export class CalendarService {
	private status = new EventEmitter();
	private browserRef: InAppBrowser;
	private data: any;
	private token: string;

	constructor(
		private platform: Platform,
		private googleService: GoogleService
	) {	}

	getStatus() {
		return this.status;
	}

	getData() {
		return this.data;
	}

	getToken() {
		return this.token;
	}

	setToken(token: string) {
		this.token = token;
		if (gapi !== undefined) gapi.client.setApiKey(GOOGLE_CALENDAR_API_KEY);
	}

	getAllCalendars() {
		this.sendGetRequest('/calendar/v3/users/me/calendarList', CALENDAR_STATUS.GOT_ALL);
	}

	getCalendar(calendarId: string) {
		this.sendGetRequest('/calendar/v3/users/me/calendarList/' + calendarId, CALENDAR_STATUS.GOT_ONE);
	}

	getAllEventsOfCalendar(calendarId: string, { timeMin, timeMax }: any) {
		let params = '';
		if ((timeMin && timeMin.length > 0) || (timeMax && timeMax.length > 0))
			params += '?';
		if (timeMin && timeMin.length > 0)
			params += 'timeMin=' + timeMin;
		if (timeMax && timeMax.length > 0) {
			if (params.match(/timeMin/))
				params += '&';
			params += 'timeMax=' + timeMax;
		}
		this.sendGetRequest('/calendar/v3/calendars/' + calendarId + '/events' + params, CALENDAR_STATUS.GOT_EVENTS);
	}

	sendGetRequest(path: string, status: number) {
		gapi.client.request({
      'path': path,
      'method': 'GET',
      'headers': this.getRequestHeaders(),
      'callback': (jsonR, rawR) => {
        this.data = jsonR;
        this.status.emit(status);
      }
    });
	}
	
	getRequestHeaders() {
		return { 'Authorization': 'Bearer ' + this.token };
	}
}
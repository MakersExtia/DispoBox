import { Injectable, EventEmitter } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { HTTPService } from './http.service';
import { Platform } from 'ionic-angular';
import {
	InAppBrowser,
	InAppBrowserEvent,
	NativeStorage
} from 'ionic-native';

import {
	GOOGLE_OAUTH_ENDPOINT,
	GOOGLE_CALENDAR_TOKEN_KEY,
	GOOGLE_CALENDAR_CLIENT_ID,
	GOOGLE_CALENDAR_API_KEY,
	GOOGLE_CALENDAR_API_SCOPE,
	REDIRECTURL
} from '../config/api.config';
import { RESPONSE_CODES } from '../config/return-codes.config';

@Injectable()
export class GoogleService {
	public isAuthenticated: boolean;
	private status = new EventEmitter();
	private browserRef: InAppBrowser;

	constructor(
		private platform: Platform,
		private httpService: HTTPService,
	) {
		this.isAuthenticated = false;
		this.subscribeHTTPService();
	}

	getHttpService() {
		return this.httpService;
	}

	getStatus() {
		return this.status;
	}

  subscribeHTTPService() {
    this.httpService.fetched.subscribe(response => {
      this.treatHTTPServiceResponse(response);
    });
  }

  treatHTTPServiceResponse(response: number) {
  	if (response === RESPONSE_CODES.CHECK_TOKEN) {
  		if (this.httpService.data['error_description']) {
  			this.isAuthenticated = false;
  			this.status.emit(RESPONSE_CODES.TOKEN_CHECKED);
  		} else {
  			this.isAuthenticated = true;
  			this.status.emit(RESPONSE_CODES.TOKEN_CHECKED);
  		}
  	}
  }

	getToken() {
		return NativeStorage.getItem(GOOGLE_CALENDAR_TOKEN_KEY).then(token => {
			return token;
		}).catch(e => {
			this.saveToken('initialization token');
		});
	}

	saveToken(token: string) {
		NativeStorage.setItem(GOOGLE_CALENDAR_TOKEN_KEY, token).then(() => {
			this.isAuthenticated = true;
  		this.status.emit(RESPONSE_CODES.TOKEN_CHECKED);
		});
	}

	deleteToken(): Promise<any> {
		return NativeStorage.remove(GOOGLE_CALENDAR_TOKEN_KEY).then(() => {
			return null;
		});
	}

	checkToken() {
		this.getToken().then(token => {
			this.httpService.validateGoogleToken(token);
		}).catch(e => {
			throw new Error(e);
		});
	}

	getAuthorization() {
		this.platform.ready().then(() => {
			this.browserRef = new InAppBrowser(
				GOOGLE_OAUTH_ENDPOINT + '?client_id=' + GOOGLE_CALENDAR_CLIENT_ID + '&redirect_uri=' + REDIRECTURL + '&scope=' + GOOGLE_CALENDAR_API_SCOPE + '&approval_prompt=force&response_type=token', 
	      '_blank',
	      'location=no'
			);
			this.browserRef.on('loadstart')
				.subscribe(event => {
					if ((event['url']).indexOf(REDIRECTURL) === 0) {
						this.saveToken(event['url'].split('access_token=')[1].split('&token_type')[0]);
						this.browserRef.close();
					}
				});
		});
	}
}

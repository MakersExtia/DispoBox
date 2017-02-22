'use strict';

export const HOST_DEV: string = 'http://localhost:3000';
export const HOST: string = 'http://localhost:3000';
export const GET_ALL_BOXES_ACTION: string = '/?action=getAllBoxes';

export const REQUEST_BOXES: number = 1;
export const REQUEST_FLOORS: number = 2;
export const REQUEST_FLOOR: number = 3;
export const REQUEST_TYPES: any = { BOXES: REQUEST_BOXES, FLOORS: REQUEST_FLOORS, FLOOR: REQUEST_FLOOR };

export const GOOGLE_CALENDAR_TOKEN_KEY: string = 'gcalendar_token';
export const GOOGLE_CALENDAR_CLIENT_ID: string = '622389115745-d62at47cfevsujlan4q7cukccb8voo2q.apps.googleusercontent.com';
export const GOOGLE_CALENDAR_API_KEY = "WSeQOnsbck2MlNRvNM-3me86";
export const GOOGLE_CALENDAR_API_SCOPE: string = 'https://www.googleapis.com/auth/calendar';
export const REDIRECTURL: string = 'http://localhost/callback';

export const GOOGLE_OAUTH_ENDPOINT: string = 'https://accounts.google.com/o/oauth2/auth';
export const GOOGLE_VALIDATION_TOKEN_ENDPOINT: string = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=';
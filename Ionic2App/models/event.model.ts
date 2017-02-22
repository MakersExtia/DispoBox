'use strict';

import { Utils } from '../utilities/Utils';

export class Event {
  constructor(
    public summary?: string,
    public location?: string,
    public start?: Date,
    public startTime?: string,
    public end?: Date,
    public endTime?: string
  ) {}

  buildFromJSON({summary, location, start, end}: any) {
    this.summary = summary;
    this.location = location;
    this.start = start;
    this.startTime = Utils.extractTime(this.start);
    this.end = end;
    this.endTime = Utils.extractTime(this.end);
  }
}
'use strict';

export class Box {
  constructor(
    public id?: number,
    public state?: number,
    public name?: number
  ) {}

  buildFromJSON({id, state, name}: any) {
    this.id = parseInt(id);
    this.state = state;
    this.name = parseInt(name);
  }
}
'use strict';

export class Floor {
  constructor(
    public floorNumber?: number,
    public numberAvailableBoxes?: number,
    public numberTotalBoxes?: number
  ) {
    this.numberAvailableBoxes = 0;
    this.numberTotalBoxes = 0;
  }

  buildFromJSON({ floorNumber, numberAvailableBoxes, numberTotalBoxes }: any) {
    this.floorNumber = floorNumber;
    this.numberAvailableBoxes = numberAvailableBoxes;
    this.numberTotalBoxes = numberTotalBoxes;
  }
}
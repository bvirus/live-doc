const xAxis = {
  position: { start: 'left', end: 'right' },
  dimension: 'width',
  client: 'clientWidth',
  inner : 'innerWidth'
}

const yAxis = {
  position: { start: 'top', end: 'bottom' },
  dimension: 'height',
  client: 'clientHeight',
  inner : 'innerHeight'
}

export const dimensions = {
  x: { primary: xAxis, secondary: yAxis },
  y: { primary: yAxis, secondary: xAxis }
}

export class Orientation {
  constructor(axis) {
    this.axis = axis;
    this.primary = dimensions[axis].primary;
  }
  getPositionOnAxis(ev) { return this.axis === 'x' ? ev.clientX : ev.clientY; }
  getMin(el) {
    if (el instanceof Window) { return window[this.primary.inner] / 3; } 
    else return el.getBoundingClientRect()[this.primary.position.start];
  }
  getMax(el) {
    if (el instanceof Window) {
      return 2 * window[this.primary.inner] / 3
    } else return el[this.primary.client]
    
  }
}
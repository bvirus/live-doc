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

export function createOrientation(axis) {
  let { primary } = dimensions[axis]
  return {
    getPositionOnAxis: (o) => axis === 'x' ? o.clientX : o.clientY,
    getMin: (el) => {
      if (el instanceof Window) { return window[primary.inner] / 3; } 
      else return el.getBoundingClientRect()[primary.position.start];
    },
    getMax: (el) => {
      if (el instanceof Window) {
        return 2 * window[primary.inner] / 3
      } else return el[primary.client]
      
    }
  }
}
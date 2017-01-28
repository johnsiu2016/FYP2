import uuid from 'node-uuid';

export function saveToLS(key, value) {
  if (localStorage) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  }
}

export function getFromLS(key) {
  if (localStorage) {
    try {
      return JSON.parse(localStorage.getItem(key)) || null;
    } catch (e) {
      console.log(e);
    }
  }
}

export function initialWaveformLayoutAndItems() {
  const i1 = uuid.v4();
  const i2 = uuid.v4();
  const i3 = uuid.v4();
  const i4 = uuid.v4();
  const i5 = uuid.v4();

  return {
    waveformLayout: [
      {
        i: i1,
        x: 0,
        y: 0,
        w: 12,
        h: 1
      },
      {
        i: i2,
        x: 0,
        y: 1,
        w: 12,
        h: 1
      },
      {
        i: i3,
        x: 0,
        y: 2,
        w: 12,
        h: 1
      },
      {
        i: i4,
        x: 0,
        y: 3,
        w: 12,
        h: 1
      },
      {
        i: i5,
        x: 0,
        y: 4,
        w: 12,
        h: 1
      }
    ],
    waveformItems: {
      [i1]: waveformItemTemplate(),
      [i2]: waveformItemTemplate("PPG", "red", 0.7, 3, 3, false),
      [i3]: waveformItemTemplate("RBBB", "yellow", 0.7, 3, 3, false),
      [i4]: waveformItemTemplate("Bigeminy", "blue", 0.7, 3, 3, false),
      [i5]: waveformItemTemplate("ECG - II", "white", 0.7, 3, 3, false)
    }
  }
}

export function initialVitalSignLayoutAndItems() {
  const i1 = uuid.v4();
  const i2 = uuid.v4();
  const i3 = uuid.v4();
  const i4 = uuid.v4();
  const i5 = uuid.v4();

  return {
    vitalSignLayout: [
      {
        i: i1,
        x: 0,
        y: 0,
        w: 12,
        h: 1,
        minW: 6
      },
      {
        i: i2,
        x: 0,
        y: 1,
        w: 12,
        h: 1,
        minW: 6
      },
      {
        i: i3,
        x: 0,
        y: 2,
        w: 12,
        h: 1,
        minW: 6
      },
      {
        i: i4,
        x: 0,
        y: 3,
        w: 12,
        h: 1,
        minW: 6
      },
      {
        i: i5,
        x: 0,
        y: 4,
        w: 12,
        h: 1,
        minW: 6
      }
    ],
    vitalSignItems: {
      [i1]: {
        vitalSign: 'HR',
        strokeStyle: 'green'
      },
      [i2]: {
        vitalSign: 'ABP',
        strokeStyle: 'red'
      },
      [i3]: {
        vitalSign: 'PAP',
        strokeStyle: 'yellow'
      },
      [i4]: {
        vitalSign: 'SpO2',
        strokeStyle: 'blue'
      },
      [i5]: {
        vitalSign: 'RP',
        strokeStyle: 'white'
      }
    }
  }
}

export function waveformItemTemplate(waveform, strokeStyle, scale, speed, lineWidth, gridOn) {
  return {
    waveform: waveform || 'ECG - II',
    strokeStyle: strokeStyle || 'green',
    scale: scale || 0.7,
    speed: speed || 3,
    lineWidth: lineWidth || 3,
    gridOn: gridOn || false
  }
}

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
      [i1]: {
        waveform: 'ECG - II',
        strokeStyle: 'green',
        scale: 0.7,
        speed: 3,
        lineWidth: 3
      },
      [i2]: {
        waveform: 'PPG',
        strokeStyle: 'red',
        scale: 0.7,
        speed: 3,
        lineWidth: 3
      },
      [i3]: {
        waveform: 'RBBB',
        strokeStyle: 'yellow',
        scale: 0.7,
        speed: 3,
        lineWidth: 3
      },
      [i4]: {
        waveform: 'Bigeminy',
        strokeStyle: 'blue',
        scale: 0.7,
        speed: 3,
        lineWidth: 3
      },
      [i5]: {
        waveform: 'ECG - II',
        strokeStyle: 'white',
        scale: 0.7,
        speed: 3,
        lineWidth: 3
      }
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

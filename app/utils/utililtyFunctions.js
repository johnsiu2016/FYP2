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
  const i6 = uuid.v4();

  return {
    waveformLayout: [
      waveformLayoutTemplate(i1, 0, 0, 12, 1),
      waveformLayoutTemplate(i2, 0, 1, 12, 1),
      waveformLayoutTemplate(i3, 0, 2, 12, 1),
      waveformLayoutTemplate(i4, 0, 3, 12, 1),
      waveformLayoutTemplate(i5, 0, 4, 12, 1),
      waveformLayoutTemplate(i6, 0, 5, 12, 1)
    ],
    waveformItems: {
      [i1]: waveformItemTemplate("MDC_ECG_LEAD_I", "green", 0.7, 3, false),
      [i2]: waveformItemTemplate("MDC_ECG_LEAD_II", "green", 0.7, 3, false),
      [i3]: waveformItemTemplate("MDC_ECG_LEAD_III", "green", 0.7, 3, false),
      [i4]: waveformItemTemplate("MDC_PRESS_BLD_ART_ABP", "red", 0.7, 3, false),
      [i5]: waveformItemTemplate("MDC_PULS_OXIM_PLETH", "yellow", 0.7, 3, false),
      [i6]: waveformItemTemplate("MDC_AWAY_CO2", "blue", 0.7, 3, false),
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
      vitalSignLayoutTemplate(i1, 0, 0, 12, 1, 6),
      vitalSignLayoutTemplate(i2, 0, 1, 12, 1, 6),
      vitalSignLayoutTemplate(i3, 0, 2, 12, 1, 6),
      vitalSignLayoutTemplate(i4, 0, 3, 12, 1, 6),
      vitalSignLayoutTemplate(i5, 0, 4, 12, 1, 6)
    ],
    vitalSignItems: {
      [i1]: vitalSignItemTemplate("MDC_ECG_HEART_RATE", "green"),
      [i2]: vitalSignItemTemplate("MDC_PRESS_BLD_ART_ABP_NUMERIC", "red"),
      [i3]: vitalSignItemTemplate("PAP", "yellow"),
      [i4]: vitalSignItemTemplate("MDC_PULS_OXIM_SAT_O2", "blue"),
      [i5]: vitalSignItemTemplate("MDC_CO2_RESP_RATE", "white")
    }
  }
}

export function waveformLayoutTemplate(i, x, y, w, h) {
  return {
    i: i,
    x: x || 0,
    y: y || 0,
    w: w || 12,
    h: h || 1
  }
}

export function waveformItemTemplate(waveform, strokeStyle, scale, lineWidth, gridOn) {
  return {
    waveform: waveform || "MDC_ECG_LEAD_II",
    strokeStyle: strokeStyle || "green",
    scale: scale || 0.7,
    lineWidth: lineWidth || 3,
    gridOn: gridOn || false
  }
}

export function requestWaveformDataInterval(type, second, cb) {
  const execCalculateECGArray = calculateECGArray(type);
  return setInterval(() => {
    requestSimulationModeWaveformData(execCalculateECGArray).then((waveformData) => {
      cb(waveformData);
    })
  }, second);
}

function requestSimulationModeWaveformData(execCalculateECGArray) {
  return new Promise((resolve) => {
    return resolve(execCalculateECGArray(window._HR || 120));
  });
}

let rawWaveformDataLookUpTable = {
  "MDC_ECG_LEAD_I": [
    0, 0, 0.0000050048828125, 0.0000137939453125, 0.000049560546875, 0.00008740234375, 0.00015966796875,
    0.000262451171875, 0.0003975830078125, 0.0005687255859375, 0.0007802734375, 0.001037353515625,
    0.0013468017578125, 0.00172119140625, 0.0021756591796875, 0.0027232666015625, 0.0033880615234375,
    0.004206787109375, 0.0052380371093750005, 0.006586181640625, 0.008400146484375001, 0.010904296875,
    0.0144892578125, 0.0196798095703125, 0.049684204101562504, 0.0886883544921875, 0.11185363769531251,
    0.134164306640625, 0.137352294921875, 0.1160369873046875, 0.08516308593750001, 0.0539765625,
    0.014997436523437501, -0.015882568359375, -0.0387554931640625, -0.06125732421875, -0.0745780029296875,
    -0.07479357910156251, -0.0725338134765625, -0.0418538818359375, 0.08582861328125001, 0.397717529296875,
    0.8136408691406251, 1.2295617980957032, 0.9944150390625001, 0.2824605712890625, -0.38949267578125,
    -0.597251220703125, -0.425675537109375, -0.1537947998046875, -0.0500914306640625, -0.0111041259765625,
    0.0027451171875, 0.0071739501953125, 0.008443359375, 0.0094327392578125, 0.012530517578125,
    0.0176046142578125, 0.0300162353515625, 0.0433489990234375, 0.056962646484375004,
    0.0704832763671875, 0.0770511474609375, 0.0898175048828125, 0.10311853027343751, 0.117046142578125,
    0.1312630615234375, 0.1529300537109375, 0.167607177734375, 0.1899068603515625, 0.2124422607421875,
    0.235044677734375, 0.2575535888671875, 0.2724073486328125, 0.286978271484375, 0.3007579345703125,
    0.3067425537109375, 0.3106370849609375, 0.303756103515625, 0.2897236328125, 0.25916931152343753,
    0.2200599365234375, 0.1728209228515625, 0.133416259765625, 0.086224853515625, 0.05493408203125,
    0.02409423828125, 0.00922607421875, -0.0043409423828125, -0.0097349853515625, -0.013127685546875,
    -0.01423095703125, -0.013834716796875, -0.012556030273437501, -0.010675048828125, -0.00835888671875,
    -0.0057305908203125, -0.0000562744140625, 0, 0],
  "MDC_ECG_LEAD_II": [
    0, 0, 0.0000050048828125, 0.0000137939453125, 0.000049560546875, 0.00008740234375, 0.00015966796875,
    0.000262451171875, 0.0003975830078125, 0.0005687255859375, 0.0007802734375, 0.001037353515625,
    0.0013468017578125, 0.00172119140625, 0.0021756591796875, 0.0027232666015625, 0.0033880615234375,
    0.004206787109375, 0.0052380371093750005, 0.006586181640625, 0.008400146484375001, 0.010904296875,
    0.0144892578125, 0.0196798095703125, 0.049684204101562504, 0.0886883544921875, 0.11185363769531251,
    0.134164306640625, 0.137352294921875, 0.1160369873046875, 0.08516308593750001, 0.0539765625,
    0.014997436523437501, -0.015882568359375, -0.0387554931640625, -0.06125732421875, -0.0745780029296875,
    -0.07479357910156251, -0.0725338134765625, -0.0418538818359375, 0.08582861328125001, 0.397717529296875,
    0.8136408691406251, 1.2295617980957032, 0.9944150390625001, 0.2824605712890625, -0.38949267578125,
    -0.597251220703125, -0.425675537109375, -0.1537947998046875, -0.0500914306640625, -0.0111041259765625,
    0.0027451171875, 0.0071739501953125, 0.008443359375, 0.0094327392578125, 0.012530517578125,
    0.0176046142578125, 0.0300162353515625, 0.0433489990234375, 0.056962646484375004,
    0.0704832763671875, 0.0770511474609375, 0.0898175048828125, 0.10311853027343751, 0.117046142578125,
    0.1312630615234375, 0.1529300537109375, 0.167607177734375, 0.1899068603515625, 0.2124422607421875,
    0.235044677734375, 0.2575535888671875, 0.2724073486328125, 0.286978271484375, 0.3007579345703125,
    0.3067425537109375, 0.3106370849609375, 0.303756103515625, 0.2897236328125, 0.25916931152343753,
    0.2200599365234375, 0.1728209228515625, 0.133416259765625, 0.086224853515625, 0.05493408203125,
    0.02409423828125, 0.00922607421875, -0.0043409423828125, -0.0097349853515625, -0.013127685546875,
    -0.01423095703125, -0.013834716796875, -0.012556030273437501, -0.010675048828125, -0.00835888671875,
    -0.0057305908203125, -0.0000562744140625, 0, 0
  ],
  "MDC_ECG_LEAD_III": [
    0, 0, 0.0000050048828125, 0.0000137939453125, 0.000049560546875, 0.00008740234375, 0.00015966796875,
    0.000262451171875, 0.0003975830078125, 0.0005687255859375, 0.0007802734375, 0.001037353515625,
    0.0013468017578125, 0.00172119140625, 0.0021756591796875, 0.0027232666015625, 0.0033880615234375,
    0.004206787109375, 0.0052380371093750005, 0.006586181640625, 0.008400146484375001, 0.010904296875,
    0.0144892578125, 0.0196798095703125, 0.049684204101562504, 0.0886883544921875, 0.11185363769531251,
    0.134164306640625, 0.137352294921875, 0.1160369873046875, 0.08516308593750001, 0.0539765625,
    0.014997436523437501, -0.015882568359375, -0.0387554931640625, -0.06125732421875, -0.0745780029296875,
    -0.07479357910156251, -0.0725338134765625, -0.0418538818359375, 0.08582861328125001, 0.397717529296875,
    0.8136408691406251, 1.2295617980957032, 0.9944150390625001, 0.2824605712890625, -0.38949267578125,
    -0.597251220703125, -0.425675537109375, -0.1537947998046875, -0.0500914306640625, -0.0111041259765625,
    0.0027451171875, 0.0071739501953125, 0.008443359375, 0.0094327392578125, 0.012530517578125,
    0.0176046142578125, 0.0300162353515625, 0.0433489990234375, 0.056962646484375004,
    0.0704832763671875, 0.0770511474609375, 0.0898175048828125, 0.10311853027343751, 0.117046142578125,
    0.1312630615234375, 0.1529300537109375, 0.167607177734375, 0.1899068603515625, 0.2124422607421875,
    0.235044677734375, 0.2575535888671875, 0.2724073486328125, 0.286978271484375, 0.3007579345703125,
    0.3067425537109375, 0.3106370849609375, 0.303756103515625, 0.2897236328125, 0.25916931152343753,
    0.2200599365234375, 0.1728209228515625, 0.133416259765625, 0.086224853515625, 0.05493408203125,
    0.02409423828125, 0.00922607421875, -0.0043409423828125, -0.0097349853515625, -0.013127685546875,
    -0.01423095703125, -0.013834716796875, -0.012556030273437501, -0.010675048828125, -0.00835888671875,
    -0.0057305908203125, -0.0000562744140625, 0, 0],
  "MDC_PRESS_BLD_ART_ABP": [
    -0.615617, -0.593225, -0.561621, -0.520447, -0.4697, -0.409714, -0.341109, -0.264733, -0.181634, -0.0930303, -0.000284727,
    0.0951251, 0.19164, 0.287667, 0.381656, 0.472156, 0.557875, 0.637704, 0.710714, 0.776128, 0.833297, 0.881714, 0.921045,
    0.951157, 0.972135, 0.984253, 0.987913, 0.983624, 0.971983, 0.953633, 0.929243, 0.899507, 0.865121, 0.826765, 0.785082,
    0.740661, 0.694015, 0.645587, 0.59582, 0.545196, 0.494246, 0.443533, 0.393608, 0.344981, 0.298127, 0.253494, 0.211507,
    0.172554, 0.136978, 0.105059, 0.0770082, 0.0529552, 0.0329633, 0.0170408, 0.00512365, -0.00293051, -0.00733322, -0.00836638,
    -0.00638339, -0.00180418, 0.00489955, 0.0132056, 0.0225461, 0.0323575, 0.0421177, 0.0513493, 0.0596349, 0.0666362, 0.0720919,
    0.0758241, 0.0777405, 0.0777992, 0.0759569, 0.0721549, 0.0663167, 0.058373, 0.0483321, 0.0363186, 0.0225527, 0.00728563,
    -0.00926222, -0.0269201, -0.0455507, -0.0650429, -0.0853176, -0.106298, -0.127884, -0.149957, -0.172377, -0.194996,
    -0.217691, -0.240364, -0.26293, -0.285325, -0.30749, -0.329363, -0.350911, -0.37213, -0.393034, -0.413638, -0.433932,
    -0.453862, -0.473337, -0.492255, -0.510515, -0.528009, -0.544592, -0.56005, -0.574047, -0.586056, -0.595292, -0.600716, -0.601094
  ],
  "MDC_PULS_OXIM_PLETH": [1252.75,
    1045,
    1175,
    1655,
    2292,
    2853.75,
    3056.75,
    2913.25,
    2553.5,
    2214.5,
    2044.25,
    2073,
    2166.25,
    2136.25,
    1896.75,
    1483.5,
  ],
  "MDC_AWAY_CO2": [-793.33,
  -929.37,
  -1073.03,
  -1221.25,
  -1375.42,
  -1534.93,
  -1697.46,
  -1865.21,
  -2037.77,
  -2213.18,
  -2392.99,
  -2576.45,
  -2761.53,
  -2949.98,
  -3142.27,
  -3335.52,
  -3526.32,
  -3714.22,
  -3900.56,
  -4077.15,
  -4229.41,
  -4356.26,
  -4461.28,
  -4545.9,
  -4614.58
  ]
};
let formatZeroPointWaveform = interpolateArray([0], 120);

let formatWaveformLookUpTable = {};
let normalizedWaveformLookUpTable = {};
let repeatNormalizedWaveformLookUpTable = {};
for (let waveform in rawWaveformDataLookUpTable) {
  let cur = rawWaveformDataLookUpTable[waveform];
  let formatLength = 120 * Math.ceil(cur.length / 120);
  let formatWaveform = interpolateArray(cur, formatLength);
  const max = Math.max(...cur);
  const min = Math.min(...cur);
  const dataHeight = max - min;
  let normalizedWaveform = [];

  formatWaveformLookUpTable[waveform] = formatWaveform;
  for (let i=0, len=formatWaveform.length; i<len; i++) {
    normalizedWaveform.push(1 - ((formatWaveform[i] - min) / dataHeight));
  }
  normalizedWaveformLookUpTable[waveform] = normalizedWaveform;
  repeatNormalizedWaveformLookUpTable[waveform] = normalizedWaveform.concat(normalizedWaveform).concat(normalizedWaveform).concat(normalizedWaveform);
}

export function calculateECGArray(type) {
  const normalizedWaveform = normalizedWaveformLookUpTable[type];
  const repeatNormalizedWaveform = repeatNormalizedWaveformLookUpTable[type];
  const baseDataLength = repeatNormalizedWaveform.length;

  let splitPoint = 0;
  return (HR) => {
    if (HR === 0) {
      return formatZeroPointWaveform;
    }

    const HRDataLength = (HR / 60) * normalizedWaveform.length;
    const numberOfMovingPoint = HRDataLength >= 120 ? HRDataLength - normalizedWaveform.length : HRDataLength;
    const outputDataLength = 120 * Math.ceil(HRDataLength / 120);

    let resultArray = repeatNormalizedWaveform.slice(splitPoint, splitPoint + HRDataLength).concat(repeatNormalizedWaveform.slice(0, Math.max(splitPoint + HRDataLength - baseDataLength, 0)));
    splitPoint = splitPoint + numberOfMovingPoint;
    if (splitPoint >= baseDataLength) splitPoint = splitPoint - baseDataLength;
    let formatResultArray = interpolateArray(resultArray, outputDataLength);

    if (type === "MDC_PRESS_BLD_ART_ABP") {
      const ABPHeight = window._ABPHeight || 150;
      const ABPSystolic = window._ABPSystolic || 150;
      const dc = (150 - ABPSystolic) / 150 ;

      return formatResultArray.map((dataPoint) => {
        return dataPoint * (ABPHeight / 150) + dc;
      });
    }

    return formatResultArray;
  };
}

export function interpolateArray(data, fitCount) {

  let linearInterpolate = function (before, after, atPoint) {
    return before + (after - before) * atPoint;
  };

  let newData = [];
  let springFactor = (data.length - 1) / (fitCount - 1);
  newData[0] = data[0]; // for new allocation
  for (let i = 1; i < fitCount - 1; i++) {
    let tmp = i * springFactor;
    let before = Math.floor(tmp);
    let after = Math.ceil(tmp);
    let atPoint = tmp - before;
    newData[i] = linearInterpolate(data[before], data[after], atPoint);
  }
  newData[fitCount - 1] = data[data.length - 1]; // for new allocation
  return newData;
}

export function vitalSignLayoutTemplate(i, x, y, w, h, minW) {
  return {
    i: i,
    x: x || 0,
    y: y || 0,
    w: w || 12,
    h: h || 1,
    minW: minW || 6
  }
}

import fakeDefaultVitalSignData from './fakeDefaultVitalSignData';

export function vitalSignItemTemplate(vitalSign, strokeStyle) {
  return {
    vitalSign: vitalSign || "MDC_ECG_HEART_RATE",
    strokeStyle: strokeStyle || "green",
    isEditing: false,
    formStorage: fakeDefaultVitalSignData[vitalSign]
  }
}
//
// export function requestVitalSignDataInterval(type, second, cb) {
//   return setInterval(() => {
//     requestSimulationModeVitalSignData(type).then((vitalSignData) => {
//       cb(vitalSignData);
//     })
//   }, second);
// }
//
// import cloneDeep from 'lodash/cloneDeep';
//
// function requestSimulationModeVitalSignData(type) {
//   return new Promise((resolve) => {
//     if (type === "MDC_ECG_HEART_RATE") {
//       if (cloneRawVitalSignDataLookUpTable[type]["data"] === 0) {
//         cloneRawVitalSignDataLookUpTable = cloneDeep(rawVitalSignDataLookUpTable);
//       }
//       cloneRawVitalSignDataLookUpTable[type]["data"] = cloneRawVitalSignDataLookUpTable[type]["data"] - 1;
//       return resolve(cloneRawVitalSignDataLookUpTable[type]);
//     }
//     return resolve(rawVitalSignDataLookUpTable[type]);
//   });
// }
//
// let rawVitalSignDataLookUpTable = {
//   "MDC_ECG_HEART_RATE": {
//     'top': 120,
//     'bottom': 50,
//     'data': 90
//   },
//   "MDC_PULS_OXIM_SAT_O2": {
//     'top': 100,
//     'bottom': 90,
//     'data': 99
//   },
//   'RP': {
//     'top': 45,
//     'bottom': 8,
//     'data': 36
//   },
//   "MDC_PRESS_BLD_ART_ABP_NUMERIC": {
//     'systolic': 122,
//     'diastolic': 82,
//     'mean': 93
//   },
//   'PAP': {
//     'systolic': 32,
//     'diastolic': 18,
//     'mean': 23
//   },
//   'NBP': {
//     'systolic': 125,
//     'diastolic': 84,
//     'mean': 92
//   }
// };
// let cloneRawVitalSignDataLookUpTable = cloneDeep(rawVitalSignDataLookUpTable);
